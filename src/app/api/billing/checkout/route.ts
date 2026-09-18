import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan = "pro_monthly" } = body;

    const isLifetime = plan === "pro_pass";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder")) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: isLifetime ? "ResumeCraft 30-Day Pro Pass" : "ResumeCraft Pro Monthly",
                description: "Unlimited ATS PDF downloads, AI bullet rewrites & JD tailoring",
              },
              unit_amount: isLifetime ? 900 : 1900,
              recurring: isLifetime ? undefined : { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: isLifetime ? "payment" : "subscription",
        success_url: `${appUrl}/dashboard?upgrade=success`,
        cancel_url: `${appUrl}/dashboard?upgrade=canceled`,
      });

      return NextResponse.json({ url: session.url });
    }

    // In test/mock mode without live key, return simulated success
    return NextResponse.json({
      url: `${appUrl}/dashboard?upgrade=simulated`,
      message: "Stripe test mode simulated",
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate checkout" },
      { status: 500 }
    );
  }
}
