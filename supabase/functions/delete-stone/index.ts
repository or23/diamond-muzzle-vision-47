import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get URL parameters
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const stockNumber = pathParts[pathParts.length - 1];
    
    // Get user_id from query params or request body
    let userId: number | null = null;
    
    // Try to get from query params first
    const userIdParam = url.searchParams.get('user_id');
    if (userIdParam) {
      userId = parseInt(userIdParam);
    }
    
    // If not in query params, try to get from request body
    if (!userId && req.headers.get('content-type')?.includes('application/json')) {
      try {
        const body = await req.json();
        if (body.user_id) {
          userId = parseInt(body.user_id.toString());
        }
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
    }

    // Validate parameters
    if (!stockNumber) {
      return new Response(
        JSON.stringify({ error: 'Stock number is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Deleting diamond with stock number: ${stockNumber} for user: ${userId}`);

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to use the RPC function first
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'delete_diamond',
      {
        p_stock_number: stockNumber,
        p_user_id: userId
      }
    );

    // If RPC function doesn't exist or fails, fall back to direct delete
    if (rpcError && rpcError.message.includes('function "delete_diamond" does not exist')) {
      console.log('Falling back to direct delete');
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('stock_number', stockNumber)
        .eq('user_id', userId);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(error.message);
      }
    } else if (rpcError) {
      throw rpcError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Diamond ${stockNumber} deleted successfully` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in delete-stone function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});