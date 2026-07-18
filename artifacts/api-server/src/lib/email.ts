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

function emailShell(title: string, bodyHtml: string): string {
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