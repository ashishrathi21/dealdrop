import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeProduct } from "@/lib/firecrawl";
import { sendPriceDropAlert } from "@/lib/email";

export async function POST(request) {
  console.log("🚀 CRON ROUTE HIT");
throw new Error("TEST");
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");

    if (productsError) throw productsError;

    console.log(`Found ${products.length} products to check`);

    const results = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertsSent: 0,
    };

    for (const product of products) {
      try {
        const productData = await scrapeProduct(product.url);

        if (!productData.currentPrice) {
          results.failed++;
          continue;
        }

        const newPrice = parseFloat(productData.currentPrice);
        const oldPrice = parseFloat(product.current_price);

        await supabase
          .from("products")
          .update({
            current_price: newPrice,
            currency: productData.currencyCode || product.currency,
            name: productData.productName || product.name,
            image_url: productData.productImageUrl || product.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (oldPrice !== newPrice) {
          await supabase.from("price_history").insert({
            product_id: product.id,
            price: newPrice,
            currency: productData.currencyCode || product.currency,
          });

          results.priceChanges++;

          /* ===================== TEMP EMAIL TEST START ===================== */
/* Remove this block after testing */

console.log("🧪 Testing email...");

const {
  data: { user },
} = await supabase.auth.admin.getUserById(product.user_id);

console.log("User:", user);
console.log("Email:", user?.email);

if (user?.email) {
  const emailResult = await sendPriceDropAlert(
    user.email,
    product,
    oldPrice,
    newPrice
  );

  console.log("Email Result:", emailResult);

  if (emailResult.success) {
    console.log("✅ Email sent successfully");
    results.alertsSent++;
  } else {
    console.log("❌ Email failed", emailResult);
  }
} else {
  console.log("❌ User email not found");
}

/* ====================== TEMP EMAIL TEST END ====================== */
        }

        results.updated++;
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Price check completed",
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Price check endpoint is working. Use POST to trigger.",
  });
} 

// curl.exe -X POST https://trackdealdrop.vercel.app/api/cron/check_price -H "Authorization: Bearer 9248a2b4068016d61c0dabbda4776fb4b3351b258f78abb61823cfad595b1752"