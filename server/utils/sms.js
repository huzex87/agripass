const axios = require("axios");

// Lightweight SMS sender for farmer notifications (voucher codes, approvals).
// Gated on TERMII_API_KEY: with no key configured this is a safe no-op, so the
// platform runs fine in dev/demo without an SMS account. Never throws — SMS is
// best-effort and must never block or fail the underlying request.
//
// Termii is the default provider (popular in Nigeria). Swapping providers is a
// matter of changing the request below.
const normalizePhone = (phone) => {
  if (!phone) return null;
  let p = String(phone).replace(/[^\d+]/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (p.startsWith("0")) p = "234" + p.slice(1); // local NG format -> intl
  if (p.startsWith("234")) return p;
  return p; // assume already international
};

const sendSMS = async (phone, message) => {
  const apiKey = process.env.TERMII_API_KEY;
  if (!apiKey) {
    // No provider configured — silently skip so dev/demo isn't blocked.
    return { skipped: true };
  }

  const to = normalizePhone(phone);
  if (!to) return { skipped: true, reason: "no phone" };

  try {
    await axios.post(
      "https://api.ng.termii.com/api/sms/send",
      {
        to,
        from: process.env.TERMII_SENDER_ID || "AgriPass",
        sms: message,
        type: "plain",
        channel: "generic",
        api_key: apiKey,
      },
      { timeout: 10000 }
    );
    return { sent: true };
  } catch (err) {
    // Log and swallow — never surface SMS failures to the caller.
    console.error("[SMS] send failed:", err.response?.data?.message || err.message);
    return { sent: false };
  }
};

// Fire-and-forget helper: schedules the SMS without awaiting, so the HTTP
// response isn't delayed by the provider round-trip.
const notify = (phone, message) => {
  sendSMS(phone, message).catch(() => {});
};

module.exports = { sendSMS, notify, normalizePhone };
