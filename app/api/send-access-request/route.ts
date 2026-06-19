// app/api/send-access-request/route.ts
import { auth } from "@/app/auth"; // ← your root auth.ts
import { NextRequest, NextResponse } from "next/server";

function makeRawEmail({
  to, from, subject, body,
}: { to: string; from: string; subject: string; body: string }) {
  const msg = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\n");
  return Buffer.from(msg).toString("base64url");
}

export async function POST(req: NextRequest) {
  const session = await auth(); // ← v5 style, no authOptions needed

  if (!session?.googleAccessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teacherEmail, teacherName, notebookTitle, message, accessType } = await req.json();

  const subject = `Access Request: "${notebookTitle}"`;
  const body = [
    `Hi ${teacherName},`,
    ``,
    `I would like to request ${accessType} access to your notebook "${notebookTitle}".`,
    message ? `\nMessage:\n${message}\n` : "",
    `— ${session.user?.name} (${session.user?.email})`,
  ].join("\n");

  const raw = makeRawEmail({
    to: teacherEmail,
    from: session.user?.email!,
    subject,
    body,
  });

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.googleAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Gmail API error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}