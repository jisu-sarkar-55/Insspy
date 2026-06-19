import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { checkPlaybooksLimit } from "@/lib/limits";

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
      SELECT * FROM setup_playbooks WHERE user_id = ${user.id} ORDER BY created_at DESC
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
    const limitCheck = await checkPlaybooksLimit(user.id);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `Setup playbook limit reached (${limitCheck.current}/${limitCheck.limit}). Delete existing playbooks to create more.`,
        usage: limitCheck,
      }, { status: 429 });
    }

    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }

  try {
    const data = await sql`
      INSERT INTO setup_playbooks ${sql({ ...body, user_id: user.id })}
      RETURNING *
    `;
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
