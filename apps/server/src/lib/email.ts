import { Resend } from "resend";
import type { Order, OrderItem } from "@workspace/db";

const { RESEND_API_KEY, EMAIL_FROM, FRONTEND_URL } = process.env;

if (!RESEND_API_KEY) {
  console.warn("[email] RESEND_API_KEY not set. Order emails will be skipped.");
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const FROM = EMAIL_FROM || "8848LABS <orders@8848labs.com>";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "In Production",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function currency(amount: string | number): string {
  return `$${Number(amount).toFixed(2)}`;
}

function orderItemsHtml(items: OrderItem[]): string {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;color:#3d3d3a;">${item.productName}${item.material ? ` (${item.material})` : ""}</td>
          <td style="padding:8px 0;color:#73726c;text-align:center;">x${item.quantity}</td>
          <td style="padding:8px 0;color:#3d3d3a;text-align:right;">${currency(Number(item.price) * item.quantity)}</td>
        </tr>`
    )
    .join("");
}

export function emailShell(title: string, bodyHtml: string): string {
  return `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#F5F0E8;">
      <h1 style="font-size:22px;font-weight:400;color:#1A1714;margin:0 0 24px;">${title}</h1>
      ${bodyHtml}
      <p style="font-size:12px;color:#888780;margin-top:32px;">8848LABS &middot; Kathmandu, Nepal</p>
    </div>
  `;
}

/** Sends an order confirmation email right after checkout. Never throws — logs and no-ops on failure. */
export async function sendOrderConfirmationEmail(order: Order, items: OrderItem[]): Promise<void> {
  if (!resend) return;

  try {
    const trackingUrl = `${FRONTEND_URL || ""}/orders/${order.id}`;

    await resend.emails.send({
      from: FROM,
      to: order.customerEmail,
      subject: `Order #${order.id} confirmed — 8848LABS`,
      html: emailShell(
        "Thanks for your order!",
        `
        <p style="color:#3d3d3a;font-size:15px;line-height:1.6;">
          Hi ${order.customerName}, we've received your order <strong>#${order.id}</strong> and will begin preparing it shortly.
        </p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;border-top:1px solid #D3D1C7;">
          ${orderItemsHtml(items)}
          <tr><td colspan="2" style="padding-top:12px;font-weight:bold;color:#1A1714;">Total</td>
              <td style="padding-top:12px;text-align:right;font-weight:bold;color:#1A1714;">${currency(order.total)}</td></tr>
        </table>
        <p style="color:#3d3d3a;font-size:15px;">Payment: Cash on Delivery — pay when your order arrives.</p>
        <a href="${trackingUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#1A1714;color:#F5F0E8;text-decoration:none;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">Track your order</a>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send order confirmation", err);
  }
}

/** Sends an email whenever an admin changes an order's status. Never throws. */
export async function sendOrderStatusUpdateEmail(order: Order): Promise<void> {
  if (!resend) return;

  try {
    const trackingUrl = `${FRONTEND_URL || ""}/orders/${order.id}`;
    const label = STATUS_LABEL[order.status] ?? order.status;

    await resend.emails.send({
      from: FROM,
      to: order.customerEmail,
      subject: `Order #${order.id} update: ${label} — 8848LABS`,
      html: emailShell(
        `Your order is now: ${label}`,
        `
        <p style="color:#3d3d3a;font-size:15px;line-height:1.6;">
          Hi ${order.customerName}, here's the latest on order <strong>#${order.id}</strong>.
        </p>
        <a href="${trackingUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#1A1714;color:#F5F0E8;text-decoration:none;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">View order details</a>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send status update", err);
  }
}

/** Sends the "click to verify your email" link right after signup. Never throws. */
export async function sendVerificationEmail(email: string, name: string, rawToken: string): Promise<void> {
  if (!resend) return;

  try {
    const verifyUrl = `${FRONTEND_URL || ""}/verify-email?token=${rawToken}`;

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Verify your email — 8848LABS",
      html: emailShell(
        "Confirm your email",
        `
        <p style="color:#3d3d3a;font-size:15px;line-height:1.6;">
          Hi ${name}, thanks for creating an account. Click below to verify your email and activate your account.
        </p>
        <a href="${verifyUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#1A1714;color:#F5F0E8;text-decoration:none;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">Verify Email</a>
        <p style="color:#888780;font-size:13px;margin-top:20px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send verification email", err);
  }
}

/** Sends a password reset link. Never throws. */
export async function sendPasswordResetEmail(email: string, name: string, rawToken: string): Promise<void> {
  if (!resend) return;

  try {
    const resetUrl = `${FRONTEND_URL || ""}/reset-password?token=${rawToken}`;

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Reset your password — 8848LABS",
      html: emailShell(
        "Reset your password",
        `
        <p style="color:#3d3d3a;font-size:15px;line-height:1.6;">
          Hi ${name}, we received a request to reset your password. Click below to choose a new one.
        </p>
        <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#1A1714;color:#F5F0E8;text-decoration:none;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">Reset Password</a>
        <p style="color:#888780;font-size:13px;margin-top:20px;">This link expires in 1 hour and can only be used once. If you didn't request this, you can safely ignore this email — your password won't change unless you click the link above and set a new one.</p>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send password reset email", err);
  }
}

/** Confirms a password change. Sent so the account owner notices immediately if this wasn't them. */
export async function sendPasswordChangedEmail(email: string, name: string): Promise<void> {
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Your password was changed — 8848LABS",
      html: emailShell(
        "Password changed",
        `
        <p style="color:#3d3d3a;font-size:15px;line-height:1.6;">
          Hi ${name}, this confirms your password was just changed. If this was you, no action is needed.
        </p>
        <p style="color:#888780;font-size:13px;margin-top:12px;">If you didn't make this change, please contact us immediately.</p>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send password-changed notice", err);
  }
}

/**
 * Sent instead of an error when someone tries to sign up with an email that
 * already has an account. This is the enumeration-safe alternative to
 * responding "email already in use" — the HTTP response is identical either
 * way, but the real account owner still finds out and can reset their
 * password if the signup attempt wasn't them.
 */
export async function sendAccountAlreadyExistsEmail(email: string, name: string): Promise<void> {
  if (!resend) return;

  try {
    const loginUrl = `${FRONTEND_URL || ""}/login`;
    const forgotUrl = `${FRONTEND_URL || ""}/forgot-password`;

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Sign-up attempt on your account — 8848LABS",
      html: emailShell(
        "Someone tried to sign up with your email",
        `
        <p style="color:#3d3d3a;font-size:15px;line-height:1.6;">
          Hi ${name}, someone just tried to create a new account using this email address, which already has an account with us.
        </p>
        <p style="color:#3d3d3a;font-size:15px;line-height:1.6;">
          If this was you, you can <a href="${loginUrl}" style="color:#B8956A;">sign in here</a>, or
          <a href="${forgotUrl}" style="color:#B8956A;">reset your password</a> if you've forgotten it.
        </p>
        <p style="color:#888780;font-size:13px;margin-top:12px;">If this wasn't you, no action is needed — your account is safe.</p>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send account-exists notice", err);
  }
}