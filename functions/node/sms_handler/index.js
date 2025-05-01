const twilio = require('twilio');
const express = require('express'); // Using Express for simple HTTP endpoint
const bodyParser = require('body-parser');

// IMPORTANT: Load credentials securely from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error("Error: Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) must be set in environment variables.");
    // In a real deployment, you might want to exit or prevent the server from starting
    // process.exit(1);
}

const client = twilio(accountSid, authToken);
const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3000;

// --- Placeholder Send SMS Function ---
async function sendSmsDigest(toPhoneNumber, messageBody) {
    if (!client) {
        console.error("Twilio client not initialized. Cannot send SMS.");
        throw new Error("Twilio client not initialized.");
    }
    if (!toPhoneNumber) {
         console.error("Recipient phone number (toPhoneNumber) is required.");
        throw new Error("Recipient phone number required.");
    }

    console.log(`Attempting to send SMS to ${toPhoneNumber}`);
    try {
        const message = await client.messages.create({
            body: messageBody,
            from: twilioPhoneNumber,
            to: toPhoneNumber // Must be a verified number or purchase Twilio number
        });
        console.log(`SMS sent successfully! SID: ${message.sid}`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error("Failed to send SMS:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// --- HTTP Endpoint for Sending Digest ---
// Example: POST /send-digest with body { "to": "+1234567890", "summary": "3 new, 5 spam" }
app.post('/send-digest', async (req, res) => {
    const { to, summary } = req.body;

    if (!to || !summary) {
        return res.status(400).json({ error: 'Missing required fields: to, summary' });
    }

    // Construct the message body based on PRD
    // Example format: "3 worth replying · 17 spam · 8 AI. Reply 1-3 to act."
    // This will need actual counts later.
    const messageBody = `${summary}. Reply 1-3 to act.`; // Placeholder summary

    try {
        const result = await sendSmsDigest(to, messageBody);
        res.status(200).json({ message: "SMS digest sent successfully", sid: result.sid });
    } catch (error) {
        res.status(500).json({ error: `Failed to send SMS: ${error.message}` });
    }
});

// --- Health Check Endpoint ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`SMS Handler listening on port ${PORT}`);
    if (!client) {
         console.warn("Warning: Twilio client not initialized due to missing credentials. SMS functionality will fail.");
    }
});

// Export the app if needed for serverless environments (e.g., Google Cloud Functions)
// module.exports = { app }; 