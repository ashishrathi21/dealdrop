import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeProduct } from "@/lib/firecrawl";
import { sendPriceDropAlert } from "@/lib/email";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ================= TEMP RESEND TEST START =================
    // Remove this entire block after testing

    const emailResult = await sendPriceDropAlert(
      "YOUR_EMAIL@gmail.com", // <-- Apna email yaha likh
      {
        name: "DealDrop Test Product",
        image_url: "https://via.placeholder.com/300",
        url: "https://example.com/product",
        currency: "₹",
      },
      25000,
      19999
    );

    console.log("📧 Email Result:", emailResult);

    return NextResponse.json(emailResult);

    // ================= TEMP RESEND TEST END =================

  } catch (error) {
    console.error("Cron job error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Price check endpoint is working. Use POST to trigger.",
  });
} 

// curl.exe -X POST https://trackdealdrop.vercel.app/api/cron/check_price -H "Authorization: Bearer 9248a2b4068016d61c0dabbda4776fb4b3351b258f78abb61823cfad595b1752"