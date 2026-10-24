import { OW_MOTORS_INQUIRY_EMAIL } from "@/data/contact";

type ContactInquiry = {
  fullName: string;
  phone?: string;
  email: string;
  subject: string;
  message: string;
};

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export async function sendContactInquiryEmail(inquiry: ContactInquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("[OW Motors inquiry email unavailable]", { reason: "missing-email-configuration" });
    return false;
  }

  const phone = inquiry.phone || "Not provided";
  const plainText = [
    `New website inquiry: ${inquiry.subject}`,
    "",
    `Name: ${inquiry.fullName}`,
    `Email: ${inquiry.email}`,
    `Phone: ${phone}`,
    "",
    inquiry.message,
  ].join("\n");
  const html = `<h1>New website inquiry</h1><p><strong>Subject:</strong> ${escapeHtml(inquiry.subject)}</p><p><strong>Name:</strong> ${escapeHtml(inquiry.fullName)}<br><strong>Email:</strong> ${escapeHtml(inquiry.email)}<br><strong>Phone:</strong> ${escapeHtml(phone)}</p><p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [OW_MOTORS_INQUIRY_EMAIL],
        reply_to: inquiry.email,
        subject: `Website inquiry: ${inquiry.subject}`,
        text: plainText,
        html,
      }),
    });
    if (!response.ok) {
      console.error("[OW Motors inquiry email failed]", { status: response.status });
      return false;
    }
    return true;
  } catch {
    console.error("[OW Motors inquiry email failed]", { reason: "request-failed" });
    return false;
  }
}
