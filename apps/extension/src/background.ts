// Squire - Background Service Worker (TypeScript)

// --- Chrome Runtime Types (Basic) ---
// TODO: npm install --save-dev @types/chrome in apps/extension
// declare const chrome: any; // Removed duplicate declaration

console.log("Squire Background Service Worker Loaded (TS Version).");

// --- Constants ---
const GMAIL_API_URL = 'https://www.googleapis.com/gmail/v1/users/me';
const CHECK_INTERVAL_NAME = 'emailCheck';
const CHECK_INTERVAL_MINUTES = 5; // Check every 5 minutes
const LAST_CHECK_KEY = 'lastEmailCheckTimestamp';

// --- Authentication Function ---
/**
 * Prompts the user to authenticate via Google OAuth or gets a cached token.
 * @param interactive If true, prompts the user to login. If false, tries to get a cached token silently.
 * @returns {Promise<string>} The OAuth token.
 * @throws {Error} If authentication fails.
 */
async function authenticate(interactive = false): Promise<string> {
  console.log(`Attempting authentication (interactive: ${interactive})...`);
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token: string | undefined) => {
      if (chrome.runtime.lastError || !token) {
        const errorMsg = chrome.runtime.lastError?.message || 'Unknown error during authentication.';
        console.error("Authentication error:", errorMsg);
        reject(new Error(`Authentication failed: ${errorMsg}`));
      } else {
        console.log("Authentication successful (token retrieved).");
        resolve(token);
      }
    });
  });
}

// --- API Helper Function ---
/**
 * Fetches data from the Gmail API.
 * @param token OAuth token.
 * @param endpoint API endpoint (e.g., '/messages').
 * @param params Query parameters.
 * @returns {Promise<any>} The API response JSON.
 * @throws {Error} If the API call fails.
 */
async function fetchGmailAPI(token: string, endpoint: string, params: Record<string, string | number> = {}): Promise<any> {
  const url = new URL(`${GMAIL_API_URL}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, String(params[key])));

  console.log('Fetching Gmail API:', url.toString());

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.warn(`Gmail API Authorization error (${response.status}). Removing cached token.`);
        // Attempt to remove the potentially invalid cached token
        await new Promise<void>((resolveRemove) => {
            chrome.identity.removeCachedAuthToken({ token }, () => {
                // This might throw an error if the token is already invalid, which we can ignore.
                if (chrome.runtime.lastError) {
                    console.log("Note: Error removing cached token, likely already invalid:", chrome.runtime.lastError.message);
                }
                resolveRemove();
            });
        });
        // Re-throw the error to be handled by the caller, likely prompting interactive auth
        throw new Error(`Gmail API authorization error: ${response.status} ${response.statusText}`);
      }
      // Handle other errors
      throw new Error(`Gmail API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('fetchGmailAPI error:', error);
    throw error; // Re-throw to be caught by the caller
  }
}

// --- Storage Helpers ---
async function getLastCheckTimestamp(): Promise<number | null> {
  const result = await chrome.storage.local.get([LAST_CHECK_KEY]);
  return result[LAST_CHECK_KEY] ? parseInt(result[LAST_CHECK_KEY], 10) : null;
}

async function setLastCheckTimestamp(timestamp: number): Promise<void> {
  await chrome.storage.local.set({ [LAST_CHECK_KEY]: timestamp });
}

// --- Classification Service Call ---
const CLASSIFICATION_API_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000/classify' // Local Python service
    : 'YOUR_DEPLOYED_CLASSIFICATION_URL'; // TODO: Replace with deployed URL

// Define the expected structure from the classification service (matches Python Pydantic model)
type ClassificationLabel = 
    | "spam" | "ai_pitch" | "human_pitch" | "warm_intro" | "internal" | "other";

type SuggestedAction = 
    | "delete" | "archive" | "label_only" | "draft_response" | "review_manually" | "forward_to_altbot";

interface ClassificationResult {
  id: string; // Gmail message ID
  classificationLogId?: string; // ID of the Supabase log entry (added)
  classification: ClassificationLabel;
  real_human_probability_score: number; // 0-100
  summary: string;
  reasoning: string;
  suggested_action: SuggestedAction;
}

/**
 * Calls the backend email classification service.
 * @param userId The authenticated user's Google ID.
 * @param emailData The email data to classify.
 * @returns {Promise<ClassificationResult>} The classification result.
 * @throws {Error} If the classification call fails.
 */
async function callClassificationService(userId: string, emailData: { id: string; sender: string; subject: string; body: string }): Promise<ClassificationResult> {
  console.log(`Calling classification service for User: ${userId}, Email ID: ${emailData.id}`);

  const payload = {
    id: emailData.id,
    user_id: userId,
    sender: emailData.sender,
    subject: emailData.subject,
    body: emailData.body // Send full body for now, service truncates
  };

  try {
    const response = await fetch(CLASSIFICATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add Authentication if the service requires it (e.g., API key, service-to-service auth)
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Classification service error: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Classification service failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const result: ClassificationResult = await response.json();
    console.log(` -> Classification result: ${result.classification}, Action: ${result.suggested_action}`);
    return result;

  } catch (error) {
    console.error('callClassificationService error:', error);
    // Re-throw specific types if needed, otherwise generalize
    if (error instanceof Error) {
        throw new Error(`Failed to call classification service: ${error.message}`);
    } else {
        throw new Error(`Failed to call classification service: Unknown error`);
    }
  }
}

// --- Gmail Action Helpers ---

// Standard Gmail labels (use these IDs directly)
const GMAIL_LABELS = {
  INBOX: 'INBOX',
  TRASH: 'TRASH',
  SPAM: 'SPAM',
  UNREAD: 'UNREAD'
};

// Base name for our custom labels
const SQUIRE_LABEL_BASE = 'Exec Scout';

// Cache for created label IDs
const labelCache: { [key: string]: string } = {};

/**
 * Gets the ID of a Gmail label, creating it if it doesn't exist.
 * Uses a simple in-memory cache.
 * @param token OAuth token.
 * @param labelName The full name of the label (e.g., "Exec Scout/AI Pitch").
 * @returns {Promise<string>} The label ID.
 * @throws {Error} If label cannot be found or created.
 */
async function getOrCreateLabel(token: string, labelName: string): Promise<string> {
    if (labelCache[labelName]) {
        return labelCache[labelName];
    }

    console.log(`Getting or creating label: ${labelName}`);
    try {
        // 1. List existing labels
        const listResponse = await fetchGmailAPI(token, '/labels');
        const existingLabel = listResponse.labels?.find((l: any) => l.name === labelName);

        if (existingLabel) {
            console.log(` -> Found existing label ID: ${existingLabel.id}`);
            labelCache[labelName] = existingLabel.id;
            return existingLabel.id;
        }

        // 2. Create label if not found
        console.log(` -> Label not found, creating...`);
        const createResponse = await fetch( `${GMAIL_API_URL}/labels`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: labelName,
                labelListVisibility: 'labelShow', // Show in label list
                messageListVisibility: 'show' // Show in message list
            })
        });

        if (!createResponse.ok) {
            throw new Error(`Failed to create label: ${createResponse.status} ${createResponse.statusText}`);
        }

        const newLabel = await createResponse.json();
        console.log(` -> Created label ID: ${newLabel.id}`);
        labelCache[labelName] = newLabel.id;
        return newLabel.id;

    } catch (error) {
        console.error(`Error getting or creating label '${labelName}':`, error);
        throw new Error(`Could not get or create label '${labelName}': ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Applies modifications (add/remove labels) to a Gmail message.
 * @param token OAuth token.
 * @param messageId The ID of the message to modify.
 * @param modifications Object with label IDs to add or remove.
 * @returns {Promise<void>}
 * @throws {Error} If the API call fails.
 */
async function applyGmailModifications(
    token: string,
    messageId: string,
    modifications: { addLabelIds?: string[], removeLabelIds?: string[] }
): Promise<void> {
    if (!modifications.addLabelIds?.length && !modifications.removeLabelIds?.length) {
        console.log("No label modifications specified for message:", messageId);
        return;
    }
    console.log(`Applying modifications to message ${messageId}:`, modifications);
    try {
        const response = await fetch(`${GMAIL_API_URL}/messages/${messageId}/modify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modifications)
        });

        if (!response.ok) {
            throw new Error(`Failed to modify message: ${response.status} ${response.statusText}`);
        }
        console.log(` -> Successfully modified message ${messageId}`);
    } catch (error) {
        console.error(`Error modifying message ${messageId}:`, error);
        throw error; // Re-throw
    }
}

/**
 * Moves a Gmail message to the Trash.
 * @param token OAuth token.
 * @param messageId The ID of the message to trash.
 * @returns {Promise<void>}
 * @throws {Error} If the API call fails.
 */
async function trashGmailMessage(token: string, messageId: string): Promise<void> {
    console.log(`Moving message ${messageId} to Trash...`);
    try {
        const response = await fetch(`${GMAIL_API_URL}/messages/${messageId}/trash`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to trash message: ${response.status} ${response.statusText}`);
        }
        console.log(` -> Successfully moved message ${messageId} to Trash.`);
    } catch (error) {
        console.error(`Error trashing message ${messageId}:`, error);
        throw error; // Re-throw
    }
}

// --- Email Body Pre-processing Helper ---

/**
 * Cleans email body text by removing common quoted replies and signatures.
 * @param body The raw email body string (plain text).
 * @returns {string} The cleaned email body.
 */
function preprocessEmailBody(body: string): string {
    let cleanedBody = body;

    // 1. Remove common reply headers (e.g., "On [Date], [Name] <email> wrote:")
    // More specific regex to avoid removing legitimate lines
    cleanedBody = cleanedBody.replace(/^On\s+(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}\s+at\s+\d{1,2}:\d{2}\s+(AM|PM),\s+.*?<.*?>(.|\n)*$/gm, '');
    // Simpler regex for lines starting with > (common quote indicator)
    cleanedBody = cleanedBody.replace(/^>.*$\n?/gm, '');
    // Remove lines starting with "From:", "Sent:", "To:", "Subject:" often found in forwarded headers
    cleanedBody = cleanedBody.replace(/^(From:|Sent:|To:|Subject:)\s+.*$\n?/gmi, '');

    // 2. Remove common signature separators and lines below them
    // Looks for lines like "-- " or "__________" possibly preceded/followed by whitespace
    const signatureSeparatorMatch = cleanedBody.match(/^\s*(--|__________)/m);
    if (signatureSeparatorMatch && signatureSeparatorMatch.index !== undefined) {
        cleanedBody = cleanedBody.substring(0, signatureSeparatorMatch.index).trim();
    }

    // 3. Remove typical signature phrases (best effort)
    // Note: This is harder and might remove legitimate content. Use cautiously.
    // Examples: "Best regards", "Sincerely", "Thanks", phone numbers, titles following a name
    // Consider making this logic less aggressive or configurable later.
    // cleanedBody = cleanedBody.replace(/^(Best regards|Sincerely|Thanks|Cheers|Regards)[,\s\n].*$/gmi, '');

    // 4. Trim whitespace and multiple blank lines
    cleanedBody = cleanedBody.replace(/\n{3,}/g, '\n\n'); // Replace 3+ newlines with 2
    cleanedBody = cleanedBody.trim();

    console.log(` -> Preprocessed body length: ${cleanedBody.length} (Original: ${body.length})`);
    // Return original body if cleaning somehow resulted in empty string
    return cleanedBody.length > 0 ? cleanedBody : body; 
}

// --- Core Logic: Fetch Unread Emails ---
async function fetchUnreadEmails(): Promise<void> {
  console.log('Starting fetchUnreadEmails routine...');
  let token: string;
  try {
    token = await authenticate(false); // Try silent auth first for background tasks
  } catch (error) {
    console.error('Silent authentication failed for background fetch. Waiting for user interaction.', error);
    // Do not proceed without a token. User needs to click icon or popup button.
    return;
  }

  try {
    const lastCheck = await getLastCheckTimestamp();
    const now = Date.now();
    // Basic query: Unread, in inbox, not promotions/social, optionally after last check time
    // Using seconds for Gmail API 'after' query
    const queryParts = ['in:inbox', 'is:unread', '-category:(promotions OR social)'];
    if (lastCheck) {
      const lastCheckSeconds = Math.floor(lastCheck / 1000);
      queryParts.push(`after:${lastCheckSeconds}`);
    }
    const query = queryParts.join(' ');

    console.log('Gmail Query:', query);

    const listParams = { q: query, maxResults: 10 }; // Limit results per check to avoid overwhelming API/processing
    const listResponse = await fetchGmailAPI(token, '/messages', listParams);

    if (listResponse.messages && listResponse.messages.length > 0) {
      console.log(`Found ${listResponse.messages.length} new messages.`);

      for (const messageHeader of listResponse.messages) {
        try {
          // Fetch full message details
          const messageDetails = await fetchGmailAPI(token, `/messages/${messageHeader.id}`, { format: 'full' });
          console.log('Processing message:', messageDetails.id);

          // --- Basic Pre-processing --- >
          const headers = messageDetails.payload.headers;
          const findHeader = (name: string): string | undefined => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value;

          const sender = findHeader('from') || 'Unknown Sender';
          const subject = findHeader('subject') || 'No Subject';
          const messageId = findHeader('message-id') || messageDetails.id; // Use Gmail ID as fallback
          const threadId = messageDetails.threadId;
          const receivedDate = new Date(parseInt(messageDetails.internalDate, 10));

          // Extract Body (Prioritize text/plain, fallback to snippet)
          let body = '';
          if (messageDetails.payload.mimeType === 'text/plain' && messageDetails.payload.body?.data) {
            body = atob(messageDetails.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          } else if (messageDetails.payload.parts) {
            // Find the first text/plain part in multipart messages
            const textPart = messageDetails.payload.parts.find((part: any) => part.mimeType === 'text/plain');
            if (textPart && textPart.body?.data) {
              body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            }
            // TODO: Potentially add text/html processing here if text/plain isn't found or is insufficient
            // Be cautious about parsing HTML safely.
          }
          // Final fallback to snippet if body is still empty
          body = body || messageDetails.snippet || '';

          // Pre-process the extracted body
          const preprocessedBody = preprocessEmailBody(body);

          // TODO: Add more robust pre-processing: 
          // - Signature removal
          // - Quoted text removal
          // - Basic HTML tag stripping (if processing text/html)
          console.log(` -> Email From: ${sender}, Subject: ${subject}, Received: ${receivedDate.toISOString()}`);
          // --- < End Basic Pre-processing ---

          // Get User ID for classification service
          const userId = await new Promise<string | undefined>((resolve, reject) => {
              chrome.identity.getProfileUserInfo((userInfo: chrome.identity.UserInfo | undefined) => {
                  if (chrome.runtime.lastError) {
                      reject(new Error(chrome.runtime.lastError.message));
                  } else {
                      resolve(userInfo?.id);
                  }
              });
          });

          if (!userId) {
              console.error("Could not get user ID after authentication. Skipping classification.");
              continue; // Skip this email
          }

          // Prepare data for classification
          const emailDataForClassification = {
            id: messageDetails.id, // Gmail's message ID
            sender: sender,
            subject: subject,
            body: preprocessedBody // Send preprocessed body
          };

          // Call the actual classification service
          const classificationResult = await callClassificationService(userId, emailDataForClassification);

          // --- Apply Action based on Classification --- >
          let actionTakenDescription = `Classified as ${classificationResult.classification}, suggested: ${classificationResult.suggested_action}.`;

          // Base URL for calling edge functions
          // TODO: Move to constants or env vars if available
          const edgeFunctionBaseUrl = `https://yxwaqmbdgritbubuwbus.supabase.co/functions/v1`; 

          try {
              switch (classificationResult.suggested_action) {
                  case 'delete':
                      await trashGmailMessage(token, messageDetails.id);
                      actionTakenDescription += ' Action: Trashed.';
                      break;

                  case 'archive':
                      await applyGmailModifications(token, messageDetails.id, {
                          removeLabelIds: [GMAIL_LABELS.INBOX]
                      });
                      actionTakenDescription += ' Action: Archived (Removed INBOX).';
                      break;

                  case 'label_only':
                  case 'review_manually':
                  case 'draft_response':
                  case 'forward_to_altbot': // Labeling is the primary action for these for now
                      const targetLabelName = `${SQUIRE_LABEL_BASE}/${classificationResult.classification}`;
                      const labelId = await getOrCreateLabel(token, targetLabelName);
                      const modifications: { addLabelIds: string[], removeLabelIds?: string[] } = { addLabelIds: [labelId] };

                      // Decide whether to also remove INBOX based on action/classification
                      // Keep in inbox for review/draft, archive others?
                      if (classificationResult.suggested_action === 'label_only' || classificationResult.suggested_action === 'forward_to_altbot') {
                          modifications.removeLabelIds = [GMAIL_LABELS.INBOX];
                          actionTakenDescription += ` Action: Labeled '${targetLabelName}' and Archived.`;
                      } else { // review_manually, draft_response
                          actionTakenDescription += ` Action: Labeled '${targetLabelName}'. Kept in Inbox.`;
                      }

                      await applyGmailModifications(token, messageDetails.id, modifications);

                      // --- Specific Handling for Draft Request ---
                      if (classificationResult.suggested_action === 'draft_response') {
                          if (classificationResult.classificationLogId) {
                              console.log(`Triggering draft request creation for classification log: ${classificationResult.classificationLogId}`);
                              try {
                                  const draftPayload = {
                                      userId: userId,
                                      gmailMessageId: messageDetails.id, 
                                      classificationId: classificationResult.classificationLogId,
                                      llmSummary: classificationResult.summary
                                  };
                                  const draftResponse = await fetch(`${edgeFunctionBaseUrl}/create_draft_request`, {
                                      method: 'POST',
                                      headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': `Bearer ${token}` // Pass the Google OAuth token for user context in RLS
                                      },
                                      body: JSON.stringify(draftPayload)
                                  });
                                  if (!draftResponse.ok) {
                                      const errorBody = await draftResponse.text();
                                      throw new Error(`Failed to create draft request: ${draftResponse.status} - ${errorBody}`);
                                  }
                                  const draftResult = await draftResponse.json();
                                  actionTakenDescription += ` Saved draft request (ID: ${draftResult.id}).`;
                                  console.log("Successfully created draft request entry.", draftResult);
                              } catch (draftError) {
                                  console.error("Error creating draft request entry:", draftError);
                                  actionTakenDescription += ` Failed to save draft request.`;
                                  // Decide if this error should halt anything or just be logged
                              }
                          } else {
                              console.warn("Cannot create draft request: Classification log ID is missing.");
                              actionTakenDescription += ` Could not save draft request (missing log ID).`;
                          }
                      }
                      // TODO: Add specific handling for 'forward_to_altbot' (e.g., call webhook)
                      break;

                  default:
                      console.warn(`Unknown suggested action: ${classificationResult.suggested_action}`);
                      actionTakenDescription += ' Action: No action taken (unknown suggestion).';
              }
              console.log(actionTakenDescription);

          } catch (actionError) {
              console.error(`Error applying action (${classificationResult.suggested_action}) for message ${messageDetails.id}:`, actionError);
              // Log the error but continue processing other emails
          }
          // --- < End Apply Action ---

        } catch (msgError) {
          console.error(`Error processing message ${messageHeader.id}:`, msgError);
          // Decide if we should skip this message or retry
        }
      }
    } else {
      console.log('No new messages found matching the query.');
    }

    // Update last check timestamp *after* the loop finishes (successfully or not for all messages)
    await setLastCheckTimestamp(now);
    console.log('Updated last check timestamp to:', new Date(now).toISOString());

  } catch (error) {
    console.error('Error during fetchUnreadEmails routine:', error);
    // If it was an auth error, the next attempt will fail silently until user re-auths
  }
}

// --- Service Worker Lifecycle & Event Listeners ---

// Trigger authentication when the extension icon is clicked
chrome.action.onClicked.addListener(async (tab: any) => {
  console.log("Extension icon clicked - initiating interactive authentication.");
  try {
    const token = await authenticate(true); // Force interactive login on click
    console.log("Token obtained via click:", token ? token.substring(0, 10) + "..." : "undefined");
    // Optional: Immediately trigger an email check after successful manual login
    console.log("Triggering email check after successful manual authentication...");
    await fetchUnreadEmails();
  } catch (error) {
    console.error("Failed to authenticate on click:", error);
    // TODO: Maybe show a notification or update popup UI to indicate failure
  }
});

// On Install/Update Logic
chrome.runtime.onInstalled.addListener(async (details: any) => {
  console.log("Squire extension installed/updated.", details.reason);

  // 1. Attempt Silent Authentication
  if (details.reason === 'install' || details.reason === 'update') {
    try {
      console.log("Attempting silent authentication on install/update...");
      await authenticate(false); // Try silent auth, we just care if it succeeds/fails here
      console.log("Silent token check completed on install/update.");
    } catch (error) {
      console.warn("Silent authentication failed on install/update (likely requires user interaction).");
    }
  }

  // 2. Set up Alarm for Periodic Checks
  // Clear previous alarm if exists, then create new one
  console.log(`Setting up alarm '${CHECK_INTERVAL_NAME}' to run every ${CHECK_INTERVAL_MINUTES} minutes.`);
  await chrome.alarms.clear(CHECK_INTERVAL_NAME);
  chrome.alarms.create(CHECK_INTERVAL_NAME, {
    // delayInMinutes: 1, // Start first check shortly after install/update
    periodInMinutes: CHECK_INTERVAL_MINUTES
  });

  // 3. Optional: Set initial last check time only on first install
  if (details.reason === 'install') {
      await setLastCheckTimestamp(Date.now());
      console.log('Set initial last check timestamp to prevent fetching very old emails.')
  }

  // 4. Optional: Trigger an initial check if auth worked silently?
  // Consider if this is desired or if we should wait for the first alarm.
  // try {
  //   await authenticate(false); // Check again if we have token
  //   console.log("Auth valid after setup, triggering initial email check...");
  //   await fetchUnreadEmails();
  // } catch { /* Silent fail is ok here */ }
});

// Listener for the Alarm
chrome.alarms.onAlarm.addListener(async (alarm: any) => {
  if (alarm.name === CHECK_INTERVAL_NAME) {
    console.log(`Alarm '${CHECK_INTERVAL_NAME}' triggered at ${new Date().toISOString()}`);
    await fetchUnreadEmails();
  }
});

// Listener for messages from other parts of the extension (e.g., popup)
chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: (response?: any) => void): boolean => {
  console.log("Message received in background:", message);

  if (message.action === "checkEmailsNow") {
    console.log('Manual email check triggered via message.');
    // Use authenticate(true) to ensure user is logged in if triggered manually?
    authenticate(true)
      .then(() => fetchUnreadEmails())
      .then(() => sendResponse({ status: "Check initiated successfully." }))
      .catch(error => {
          console.error("Manual check failed:", error);
          sendResponse({ status: "Check failed", error: error.message });
      });
    return true; // Indicates asynchronous response handling

  } else if (message.action === "authenticateUser") {
    console.log('Authentication requested via message.');
    authenticate(true)
      .then(token => sendResponse({ success: true, token: token ? token.substring(0, 10) + "..." : "undefined" }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates asynchronous response handling
  }

  // Handle other potential messages...

  return false; // No async response needed for synchronous messages or unknown actions
});

// Remove the large commented-out block of old code
/*
...
*/ 