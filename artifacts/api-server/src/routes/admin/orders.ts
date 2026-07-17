import { Router, Request, Response } from "express";
import { db, ordersTable, orderItemsTable } from "@workspace/db";
import type { Order } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin } from "../../middleware/requireAuth";

const router = Router();
const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

/** GET /api/admin/orders */
router.get("/orders", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query as Record<string, string>;

    let orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));

    if (status && status !== "all") {
      orders = orders.filter((o: Order) => o.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter((o: Order) =>
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        String(o.id).includes(q)
      );
    }

    res.json({ orders, total: orders.length });
  } catch (err) {
    console.error("[admin/orders]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET /api/admin/orders/:id */
router.get("/orders/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid order ID" }); return; }

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }

    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
    res.json({ order, items });
  } catch (err) {
    console.error("[admin/orders/:id]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** PUT /api/admin/orders/:id/status */
router.put("/orders/:id/status", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid order ID" }); return; }

    const { status } = req.body as { status: string };
    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
      return;
    }

    const updated = await db
      .update(ordersTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning();

    if (!updated.length) { res.status(404).json({ error: "Order not found" }); return; }
    res.json({ order: updated[0] });
  } catch (err) {
    console.error("[admin/orders/:id/status]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
