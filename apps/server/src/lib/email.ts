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

/** Formats values in Nepalese Rupees (NPR) */
function currency(amount: string | number): string {
  const val = Number(amount) || 0;
  return `Rs. ${val.toLocaleString("ne-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function orderItemsHtml(items: OrderItem[]): string {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #EAE6DF; color: #2C2A29; font-size: 14px;">
            <strong style="color: #1A1714;">${item.productName}</strong>
            ${item.material ? `<br/><span style="font-size: 12px; color: #787571;">Material: ${item.material}</span>` : ""}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #EAE6DF; color: #787571; font-size: 14px; text-align: center;">
            x${item.quantity}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #EAE6DF; color: #1A1714; font-size: 14px; text-align: right; font-weight: 600;">
            ${currency(Number(item.price) * item.quantity)}
          </td>
        </tr>`
    )
    .join("");
}

export function emailShell(title: string, bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #F2EFE9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F2EFE9; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 520px; background: #FFFFFF; border-radius: 8px; border: 1px solid #E2DDD5; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                
                <!-- Header Logo Bar -->
                <tr>
                  <td style="background: #1A1714; padding: 24px; text-align: center;">
                    <span style="color: #F5F0E8; font-family: Georgia, serif; font-size: 20px; letter-spacing: 0.15em; font-weight: 600; text-transform: uppercase;">
                      8848LABS
                    </span>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 32px 28px;">
                    <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #1A1714; margin: 0 0 20px; line-height: 1.3;">
                      ${title}
                    </h1>
                    ${bodyHtml}
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #FAF8F5; padding: 20px 28px; border-top: 1px solid #EAE6DF; text-align: center;">
                    <p style="font-size: 12px; color: #8C8A84; margin: 0; line-height: 1.5;">
                      <strong>8848LABS</strong> &middot; Kathmandu, Nepal<br/>
                      Crafted precision products for everyday life.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/** Sends an order confirmation email right after checkout. */
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
        <p style="color: #4A4845; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
          Hi <strong>${order.customerName}</strong>, we've received order <span style="color: #1A1714; font-weight: 600;">#${order.id}</span> and are getting it ready for production.
        </p>

        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0 16px;">
          <thead>
            <tr style="border-bottom: 2px solid #1A1714;">
              <th style="text-align: left; padding-bottom: 8px; font-size: 12px; font-weight: 700; color: #1A1714; text-transform: uppercase; letter-spacing: 0.05em;">Item</th>
              <th style="text-align: center; padding-bottom: 8px; font-size: 12px; font-weight: 700; color: #1A1714; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
              <th style="text-align: right; padding-bottom: 8px; font-size: 12px; font-weight: 700; color: #1A1714; text-transform: uppercase; letter-spacing: 0.05em;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml(items)}
          </tbody>
        </table>

        <table role="presentation" style="width: 100%; margin-bottom: 24px;">
          <tr>
            <td style="font-size: 15px; font-weight: 700; color: #1A1714;">Total Amount</td>
            <td style="text-align: right; font-size: 18px; font-weight: 700; color: #1A1714;">${currency(order.total)}</td>
          </tr>
        </table>

        <div style="background-color: #FAF8F5; border-left: 3px solid #1A1714; padding: 12px 16px; margin-bottom: 28px; border-radius: 0 4px 4px 0;">
          <p style="margin: 0; color: #4A4845; font-size: 13px;">
            <strong>Payment Method:</strong> Cash on Delivery (COD)<br/>
            Please prepare <strong>${currency(order.total)}</strong> upon delivery.
          </p>
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="${trackingUrl}" style="display: inline-block; padding: 14px 28px; background-color: #1A1714; color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 4px;">
            Track Your Order
          </a>
        </div>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send order confirmation", err);
  }
}

/** Sends an email whenever an admin changes an order's status. */
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
        `Order Update: ${label}`,
        `
        <p style="color: #4A4845; font-size: 15px; line-height: 1.6; margin-0 0 20px;">
          Hi <strong>${order.customerName}</strong>, your order <span style="color: #1A1714; font-weight: 600;">#${order.id}</span> has moved to the next step.
        </p>

        <div style="background-color: #FAF8F5; border: 1px solid #EAE6DF; padding: 16px; border-radius: 6px; text-align: center; margin: 24px 0;">
          <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #787571; display: block; margin-bottom: 4px;">Current Status</span>
          <strong style="font-size: 18px; color: #1A1714; font-family: Georgia, serif;">${label}</strong>
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="${trackingUrl}" style="display: inline-block; padding: 14px 28px; background-color: #1A1714; color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 4px;">
            View Order Details
          </a>
        </div>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send status update", err);
  }
}

/** Sends the email verification link. */
export async function sendVerificationEmail(email: string, name: string, rawToken: string): Promise<void> {
  if (!resend) return;

  try {
    const verifyUrl = `${FRONTEND_URL || ""}/verify-email?token=${rawToken}`;

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Verify your email — 8848LABS",
      html: emailShell(
        "Confirm your email address",
        `
        <p style="color: #4A4845; font-size: 15px; line-height: 1.6;">
          Hi <strong>${name}</strong>, thanks for registering with 8848LABS. Please verify your email to complete your setup.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="display: inline-block; padding: 14px 28px; background-color: #1A1714; color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 4px;">
            Verify Email
          </a>
        </div>

        <p style="color: #8C8A84; font-size: 13px; line-height: 1.5; margin-top: 24px; border-top: 1px solid #EAE6DF; padding-top: 16px;">
          This link expires in 24 hours. If you did not create an account, you can safely ignore this email.
        </p>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send verification email", err);
  }
}

/** Sends a password reset link. */
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
        <p style="color: #4A4845; font-size: 15px; line-height: 1.6;">
          Hi <strong>${name}</strong>, we received a request to reset your password. Click below to proceed.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background-color: #1A1714; color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 4px;">
            Reset Password
          </a>
        </div>

        <p style="color: #8C8A84; font-size: 13px; line-height: 1.5; margin-top: 24px; border-top: 1px solid #EAE6DF; padding-top: 16px;">
          This link expires in 1 hour. If you didn't request a password reset, no action is needed.
        </p>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send password reset email", err);
  }
}

/** Confirms a password change. */
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
        <p style="color: #4A4845; font-size: 15px; line-height: 1.6;">
          Hi <strong>${name}</strong>, your account password was successfully updated.
        </p>
        <p style="color: #8C8A84; font-size: 13px; margin-top: 16px;">
          If you did not make this change, please contact our support team immediately.
        </p>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send password-changed notice", err);
  }
}

/** Sent when a user registers with an existing account email. */
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
        "Account notice",
        `
        <p style="color: #4A4845; font-size: 15px; line-height: 1.6;">
          Hi <strong>${name}</strong>, someone attempted to create an account with this email address, which is already registered with us.
        </p>
        <p style="color: #4A4845; font-size: 15px; line-height: 1.6;">
          You can <a href="${loginUrl}" style="color: #1A1714; font-weight: 600;">sign in here</a> or <a href="${forgotUrl}" style="color: #1A1714; font-weight: 600;">reset your password</a> if you've forgotten it.
        </p>
        <p style="color: #8C8A84; font-size: 13px; margin-top: 20px;">
          If this wasn't you, your account remains secure and no action is required.
        </p>
        `
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send account-exists notice", err);
  }
}