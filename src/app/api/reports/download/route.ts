import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkReportDownloadLimit, incrementReportDownload } from "@/lib/limits";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitCheck = await checkReportDownloadLimit(user.id, user.email);

  if (!limitCheck.allowed) {
    return NextResponse.json({
      error: `Report download limit reached (${limitCheck.current}/${limitCheck.limit} this month).`,
      usage: limitCheck,
    }, { status: 429 });
  }

  await incrementReportDownload(user.id, user.email);

  return NextResponse.json({
    allowed: true,
    usage: { current: limitCheck.current + 1, limit: limitCheck.limit },
  });
}
