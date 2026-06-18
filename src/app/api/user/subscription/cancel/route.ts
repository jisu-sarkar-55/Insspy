import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const now = new Date().toISOString();
    await sql`
      UPDATE subscriptions 
      SET status = 'canceled', canceled_at = ${now}, updated_at = ${now}
      WHERE user_id = ${user.id} AND status IN ('active', 'trialing')
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
