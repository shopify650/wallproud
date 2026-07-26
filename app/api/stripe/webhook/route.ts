import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  // Basic payload parsing for Stripe webhooks
  let event: any;
  try {
    event = JSON.parse(body);
  } catch (err) {
    console.error("Stripe webhook JSON parse error:", err);
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "invoice.paid": {
        const session = event.data?.object || {};
        const customerEmail = session.customer_email || session.customer_details?.email;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        // Try to identify plan from metadata or line items
        const planMetaData = session.metadata?.plan || "pro";
        const planName = planMetaData === "agency" ? "agency" : "pro";

        if (customerEmail) {
          const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("email", customerEmail)
            .single();

          if (user) {
            await supabase
              .from("users")
              .update({
                plan: planName,
                stripe_customer_id: typeof customerId === "string" ? customerId : null,
                stripe_subscription_id: typeof subscriptionId === "string" ? subscriptionId : null,
              })
              .eq("id", user.id);
          }
        }
        break;
      }

      case "customer.subscription.deleted":
      case "invoice.payment_failed": {
        const session = event.data?.object || {};
        const customerId = session.customer;

        if (customerId) {
          await supabase
            .from("users")
            .update({
              plan: "free",
              stripe_customer_id: null,
              stripe_subscription_id: null,
            })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
