import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import crypto from "crypto";

function generateApiKey(): string {
  const bytes = crypto.randomBytes(32);
  return `tj_${bytes.toString("hex")}`;
}

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
      SELECT id, name, key, last_used, created_at FROM api_keys
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = generateApiKey();

  try {
    const [data] = await sql`
      INSERT INTO api_keys (user_id, key, name)
      VALUES (${user.id}, ${key}, ${"MT5 Sync Key"})
      RETURNING *
    `;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let keyId: string;
  try {
    const body = await request.json();
    keyId = body.keyId;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!keyId || typeof keyId !== "string") {
    return NextResponse.json({ error: "keyId is required" }, { status: 400 });
  }

  try {
    await sql`
      DELETE FROM api_keys WHERE id = ${keyId} AND user_id = ${user.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
