import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DARAJA_CONSUMER_KEY = Deno.env.get("MPESA_CONSUMER_KEY") ?? "";
const DARAJA_CONSUMER_SECRET = Deno.env.get("MPESA_CONSUMER_SECRET") ?? "";
const DARAJA_PASSKEY = Deno.env.get("MPESA_PASSKEY") ?? "";
const DARAJA_SHORTCODE = Deno.env.get("MPESA_SHORTCODE") ?? "174379";
const DARAJA_ENV = Deno.env.get("MPESA_ENV") ?? "sandbox";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const BASE_URL =
  DARAJA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

async function getAccessToken(): Promise<string> {
  const auth = btoa(`${DARAJA_CONSUMER_KEY}:${DARAJA_CONSUMER_SECRET}`);
  const resp = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = await resp.json();
  if (!data.access_token) throw new Error("Failed to get M-Pesa access token");
  return data.access_token;
}

function generateTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function generatePassword(timestamp: string): string {
  return btoa(`${DARAJA_SHORTCODE}${DARAJA_PASSKEY}${timestamp}`);
}

function formatPhone(phone: string): string {
  let p = phone.replace(/\s+/g, "").replace(/^\+/, "");
  if (p.startsWith("0")) p = "254" + p.substring(1);
  if (p.startsWith("7") || p.startsWith("1")) p = "254" + p;
  if (!p.startsWith("254")) throw new Error("Invalid Kenyan phone number");
  if (p.length !== 12) throw new Error("Phone number must be 12 digits (254...)");
  return p;
}

interface BookingInsert {
  room_id: number;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  payment_method: string;
  mpesa_number: string;
  total_amount: number;
  booking_reference: string;
  user_id?: string | null;
  notes?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const {
      phone,
      amount,
      bookingData,
      action,
      checkoutRequestId,
    } = body as {
      phone?: string;
      amount?: number;
      bookingData?: BookingInsert;
      action?: "stk_push" | "stk_query" | "create_booking";
      checkoutRequestId?: string;
    };

    // STK Push: initiate payment
    if (action === "stk_push") {
      if (!phone || !amount) {
        return new Response(JSON.stringify({ error: "Phone and amount are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const formattedPhone = formatPhone(phone);
      const timestamp = generateTimestamp();
      const password = generatePassword(timestamp);
      const accessToken = await getAccessToken();

      const stkResp = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: DARAJA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: DARAJA_SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: `${SUPABASE_URL}/functions/v1/mpesa-stk`,
          AccountReference: "EquatorPastoralResort",
          TransactionDesc: "Room Booking Payment",
        }),
      });

      const stkData = await stkResp.json();

      if (stkData.ResponseCode === "0") {
        return new Response(
          JSON.stringify({
            success: true,
            checkoutRequestId: stkData.CheckoutRequestID,
            merchantRequestId: stkData.MerchantRequestID,
            message: "STK push initiated. Enter PIN on your phone.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: stkData.errorMessage || stkData.ResponseDescription || "STK push failed",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // STK Query: check payment status
    if (action === "stk_query") {
      if (!checkoutRequestId) {
        return new Response(JSON.stringify({ error: "CheckoutRequestID is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const timestamp = generateTimestamp();
      const password = generatePassword(timestamp);
      const accessToken = await getAccessToken();

      const queryResp = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: DARAJA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        }),
      });

      const queryData = await queryResp.json();

      return new Response(
        JSON.stringify({
          success: true,
          resultCode: queryData.ResultCode,
          resultDesc: queryData.ResultDesc,
          paid: queryData.ResultCode === "0",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Booking: insert booking after successful payment
    if (action === "create_booking") {
      if (!bookingData) {
        return new Response(JSON.stringify({ error: "Booking data is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const supabaseResp = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          ...bookingData,
          payment_status: "paid",
          confirmation_status: "pending",
        }),
      });

      const inserted = await supabaseResp.json();

      if (!supabaseResp.ok) {
        return new Response(
          JSON.stringify({ error: "Failed to create booking", details: inserted }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, booking: inserted }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Callback from M-Pesa (async notification)
    if (req.headers.get("content-type")?.includes("json") && !action) {
      const callbackData = await req.json();
      console.log("M-Pesa Callback:", JSON.stringify(callbackData));

      const stkCallback = callbackData.Body?.stkCallback;
      if (stkCallback) {
        const resultCode = stkCallback.ResultCode;
        const checkoutReqId = stkCallback.CheckoutRequestID;

        if (resultCode === 0) {
          const item = stkCallback.CallbackMetadata?.Item;
          const mpesaReceipt = item?.find((i: Record<string, unknown>) => i.Name === "MpesaReceiptNumber")?.Value;
          const phone = item?.find((i: Record<string, unknown>) => i.Name === "PhoneNumber")?.Value;

          console.log(`Payment confirmed: Receipt=${mpesaReceipt}, Phone=${phone}, CheckoutReqID=${checkoutReqId}`);
        } else {
          console.log(`Payment failed: ${stkCallback.ResultDesc}`);
        }
      }

      return new Response(null, { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("M-Pesa STK error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
