import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const subscriptions = await sql`
      SELECT s.*, 
        row_to_json(p.*) as plan
      FROM subscriptions s
      JOIN pricing_plans p ON p.id = s.plan_id
      WHERE s.user_id = ${user.id} AND s.status IN ('active', 'trialing')
      ORDER BY s.created_at DESC
      LIMIT 1
    `;
    return NextResponse.json(subscriptions[0] || null);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
