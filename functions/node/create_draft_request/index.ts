import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log("Create Draft Request Edge Function booting up...");

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY'); // Use anon key for client-side access

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  // Optionally throw an error to prevent the function from starting incorrectly
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    global: { headers: { Authorization: `Bearer ${supabaseAnonKey}` } } // Pass key for RLS bypass if needed, BUT USE SERVICE ROLE FOR SERVER-SIDE
    // IMPORTANT: For inserts from a trusted server-side function, consider using the SERVICE_ROLE_KEY
    // to bypass RLS if necessary, or ensure RLS policies allow the insert based on the user's JWT.
    // For this example, we assume RLS policy allows user to insert for themselves using their JWT.
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
        'Access-Control-Allow-Origin': '*' , // Be more specific in production!
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
     } });
  }

  try {
    const { userId, gmailMessageId, classificationId, llmSummary } = await req.json();

    // --- Basic Input Validation ---
    if (!userId || !gmailMessageId || !classificationId || !llmSummary) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }

    console.log(`Received draft request for user ${userId}, message ${gmailMessageId}`);

    // --- Insert into Supabase ---
    const { data, error } = await supabase
      .from('draft_requests')
      .insert([
        {
          user_id: userId,
          gmail_message_id: gmailMessageId,
          classification_id: classificationId,
          llm_summary: llmSummary,
          status: 'pending_review' // Initial status
        },
      ])
      .select() // Return the inserted data
      .single(); // Expecting a single row back

    if (error) {
      console.error('Supabase insert error:', error);
      // Check for unique constraint violation (duplicate gmail_message_id)
      if (error.code === '23505') { // Postgres unique violation code
         return new Response(JSON.stringify({ error: 'Draft request already exists for this message.' }), {
            status: 409, // Conflict
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
         });
      }
      // Other Supabase errors
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    console.log('Successfully created draft request:', data);

    return new Response(JSON.stringify(data), {
      status: 201, // Created
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (err) {
    console.error('Request handling error:', err);
    return new Response(String(err?.message ?? err), {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}); 