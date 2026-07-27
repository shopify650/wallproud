import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Simple admin endpoint to manually set a user's plan
// Usage: POST /api/admin/set-plan  { "email": "user@example.com", "plan": "pro", "secret": "ADMIN_SECRET" }
export async function POST(req: NextRequest) {
  const { email, plan, secret } = await req.json();

  // Basic secret check — set ADMIN_SECRET in your .env.local / Vercel env vars
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const validPlans = ["free", "starter", "pro", "agency"];
  if (!validPlans.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .update({ plan })
    .eq("email", email)
    .select("id, email, plan")
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "User not found or update failed", details: error?.message }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
}
