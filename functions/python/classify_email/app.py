import os
import httpx # Use httpx for async requests
import json # Import json for parsing OpenAI response
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from supabase import create_client, Client # Import Supabase client
from datetime import datetime, timezone # For timestamps
import openai # Import OpenAI library
from typing import Literal, Optional

# --- Initialize Supabase Client ---
supabase_url: str = os.environ.get("SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client | None = None
if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("Supabase client initialized successfully.")
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")
        # Decide if this should be fatal - for now, it will just prevent logging
elif os.getenv("OPENAI_API_KEY"): # Only warn if we might actually need DB later
    print("Warning: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY not set. Database logging disabled.")

app = FastAPI()

# --- Configure OpenAI Client ---
# Use environment variable for API key
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("Warning: OPENAI_API_KEY not set. Real classification disabled.")
    client = None # Explicitly set client to None
else:
    try:
        client = openai.OpenAI(api_key=openai_api_key)
        print("OpenAI client initialized successfully.")
    except Exception as e:
        print(f"Error initializing OpenAI client: {e}")
        client = None

# --- Pydantic Models ---
class EmailData(BaseModel):
    id: str
    user_id: str # Added to identify the user
    sender: str
    subject: str
    body: str # Or potentially pre-processed text

# Define possible classification labels
ClassificationLabel = Literal[
    "spam", "ai_pitch", "human_pitch", "warm_intro", "internal", "other"
]

# Define possible suggested actions
SuggestedAction = Literal[
    "delete", "archive", "label_only", "draft_response", "review_manually", "forward_to_altbot"
]

class ClassificationResultResponse(BaseModel): # Renamed for clarity
    id: str # Gmail message ID
    classificationLogId: Optional[str] = None # ID of the log entry in Supabase
    classification: ClassificationLabel
    # Renamed and changed type as per PRD
    real_human_probability_score: int = Field(..., ge=0, le=100)
    summary: str # Added summary
    reasoning: str # Optional explanation from LLM
    suggested_action: SuggestedAction # Added suggested action

# --- OpenAI Function Calling Definition ---
# Revised structure for LLM output
classification_tool = {
    "type": "function",
    "function": {
        "name": "classify_email_details",
        "description": "Classify an email based on its sender, subject, and body content, assessing its nature, human origin probability, and suggesting a next action.",
        "parameters": {
            "type": "object",
            "properties": {
                "classification": {
                    "type": "string",
                    "description": "The primary category of the email.",
                    "enum": ["spam", "ai_pitch", "human_pitch", "warm_intro", "internal", "other"]
                },
                "real_human_probability_score": {
                    "type": "integer",
                    "description": "An integer score (0-100) indicating the likelihood the email was written by a human, not AI or a template."
                },
                "summary": {
                    "type": "string",
                    "description": "A concise one-sentence summary of the email's core message or purpose."
                },
                 "reasoning": {
                    "type": "string",
                    "description": "Brief rationale for the classification and probability score."
                },
                "suggested_action": {
                    "type": "string",
                    "description": "The recommended next step for handling this email.",
                    "enum": ["delete", "archive", "label_only", "draft_response", "review_manually", "forward_to_altbot"]
                }
            },
            # Updated required fields
            "required": ["classification", "real_human_probability_score", "summary", "reasoning", "suggested_action"]
        }
    }
}

# --- Helper: Log to Supabase ---
# Updated to match revised ClassificationResult and Supabase schema expectations
async def log_classification_to_supabase(email_data: EmailData, result: ClassificationResultResponse, action_taken: str) -> Optional[str]: # Return type added
    if not supabase:
        print("Supabase client not available. Skipping database log.")
        return None

    log_entry = {
        "gmail_message_id": email_data.id,
        "user_id": email_data.user_id, # Use user_id from request
        "received_at": datetime.now(timezone.utc).isoformat(), # Ideally, get this from email metadata later
        "classification": result.classification,
        "confidence_score": result.real_human_probability_score, # Use the integer score
        "llm_reasoning": result.reasoning,
        "llm_summary": result.summary,
        "suggested_action": result.suggested_action,
        "action_taken": action_taken # The action performed by the system (might differ from suggestion)
        # processed_at is handled by default value in DB
    }

    # Assuming table name is 'email_classifications' based on checklist/PRD
    target_table = 'email_classifications'
    print(f"Logging to Supabase table '{target_table}': {log_entry}")

    inserted_id: Optional[str] = None
    try:
        # Use postgrest_client syntax directly if needed, or stick to supabase-py
        # Ensure `select()` is used to get the inserted data back
        response = await supabase.table(target_table).insert(log_entry).select('id').single().execute()

        # Improved logging based on potential execute() responses
        if response.data and isinstance(response.data, dict) and response.data.get('id'):
            inserted_id = response.data['id']
            print(f"Successfully logged classification, received ID: {inserted_id}")
        # Handle older supabase-py versions or different response structures if necessary
        # elif response.data and isinstance(response.data, list) and response.data[0].get('id'): 
        #     inserted_id = response.data[0]['id']
        #     print(f"Successfully logged classification (list response), received ID: {inserted_id}")
        else:
            # Logged, but didn't get ID back clearly
            print(f"Logged classification, but ID not found in response: {response.data}")

    except Exception as e:
        print(f"Error logging classification to Supabase table '{target_table}': {e}")
        # Decide if this should raise an error or just log

    return inserted_id # Return the ID (or None)

# --- Main Classification Endpoint ---
@app.post("/classify", response_model=ClassificationResultResponse)
async def classify_email(email: EmailData):
    print(f"Received email for classification: User={email.user_id}, ID={email.id}, Subject='{email.subject}'")

    if not client:
        # Return a default/error response if OpenAI client isn't available
        print("OpenAI client not available. Returning error.")
        raise HTTPException(status_code=503, detail="OpenAI client not configured or failed to initialize.")

    try:
        print("Attempting OpenAI classification...")

        # Prepare messages for the ChatCompletion API
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an expert email classification system. Analyze the provided email details "
                    "(sender, subject, body excerpt) and classify it using the 'classify_email_details' tool. "
                    "Your primary goals are to determine the email's category, estimate the probability it was written "
                    "by a human (0-100), provide a concise summary, explain your reasoning, and suggest the most "
                    "appropriate next action (e.g., delete, archive, draft_response)."
                )
            },
            {
                "role": "user",
                "content": f"Please classify this email:\nSender: {email.sender}\nSubject: {email.subject}\nBody Excerpt (first 2000 chars):\n{email.body[:2000]}" # Increased context slightly
            }
        ]

        # --- Actual OpenAI API Call ---
        response = await client.chat.completions.create(
            model="gpt-4o-mini", # Use a cost-effective but capable model
            messages=messages,
            tools=[classification_tool],
            tool_choice={"type": "function", "function": {"name": "classify_email_details"}},
            temperature=0.1, # Low temperature for deterministic classification
            max_tokens=250, # Limit response size
        )
        # --- End OpenAI API Call ---

        message = response.choices[0].message
        tool_calls = message.tool_calls

        if not tool_calls or not tool_calls[0].function.name == "classify_email_details":
            print("Error: OpenAI did not return the expected 'classify_email_details' tool call.")
            raise HTTPException(status_code=500, detail="OpenAI classification failed: Invalid tool call response.")

        function_args_str = tool_calls[0].function.arguments
        try:
            function_args = json.loads(function_args_str)
            print("OpenAI Raw Result:", function_args)

            # Validate and create the Pydantic model
            # Temporarily store in a variable before assigning final ID
            classification_result_base = ClassificationResultResponse(
                id=email.id,
                classification=function_args.get("classification", "other"),
                real_human_probability_score=int(function_args.get("real_human_probability_score", 0)),
                summary=function_args.get("summary", "N/A"),
                reasoning=function_args.get("reasoning", "No reasoning provided."),
                suggested_action=function_args.get("suggested_action", "review_manually")
            )

        except json.JSONDecodeError:
            print(f"Error: Failed to parse JSON arguments from OpenAI: {function_args_str}")
            raise HTTPException(status_code=500, detail="OpenAI classification failed: Invalid JSON in tool call.")
        except Exception as pydantic_error: # Catch potential Pydantic validation errors
             print(f"Error: Failed to validate OpenAI arguments: {pydantic_error}")
             print(f"Received args: {function_args_str}")
             raise HTTPException(status_code=500, detail=f"OpenAI classification failed: Invalid arguments structure ({pydantic_error}).")

        print(f"Classification successful: {classification_result_base.classification} (Score: {classification_result_base.real_human_probability_score}), Action Suggested: {classification_result_base.suggested_action}")

        # --- Determine Action Taken (Simplified Logic) ---
        # This is where rules would go based on classification_result
        # For now, we just log the suggested action as the one 'taken'
        action_taken = classification_result_base.suggested_action
        print(f"Action determined: {action_taken}")

        # Log the result to Supabase and get the log entry ID
        classification_log_id = await log_classification_to_supabase(
            email_data=email,
            result=classification_result_base, # Log the base result
            action=action_taken
        )

        # Add the log ID to the response object
        final_result = classification_result_base.model_copy(update={"classificationLogId": classification_log_id})

        # Return the structured result
        return final_result

    except openai.APIError as e:
        print(f"OpenAI API Error: {e}")
        raise HTTPException(status_code=502, detail=f"OpenAI API error: {e}")
    except httpx.RequestError as e:
         print(f"HTTPX Request Error calling OpenAI: {e}")
         raise HTTPException(status_code=504, detail=f"Network error contacting OpenAI: {e}")
    except Exception as e:
        # Catch-all for other unexpected errors during classification
        print(f"Unexpected error during classification: {type(e).__name__} - {e}")
        # Optionally log the stack trace here
        raise HTTPException(status_code=500, detail=f"Internal server error during classification: {type(e).__name__}")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# For local development:
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000) 