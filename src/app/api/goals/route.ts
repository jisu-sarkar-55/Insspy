import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { checkGoalsLimit } from "@/lib/limits";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await sql`
      SELECT * FROM goals WHERE user_id = ${user.id} ORDER BY created_at DESC
    `;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const limitCheck = await checkGoalsLimit(user.id);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `Active goal limit reached (${limitCheck.current}/${limitCheck.limit}). Complete or delete existing goals to create more.`,
        usage: limitCheck,
      }, { status: 429 });
    }

    const allowed = ["title", "type", "target_value", "current_value", "unit", "period", "start_date", "end_date", "status"];
    const insertData: Record<string, unknown> = { user_id: user.id };
    for (const key of allowed) {
      if (key in body) insertData[key] = body[key];
    }

    const data = await sql`
      INSERT INTO goals ${sql(insertData)}
      RETURNING *
    `;
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
