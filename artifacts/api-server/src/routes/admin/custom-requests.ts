import { Router, Request, Response } from "express";
import { db, customOrdersTable } from "@workspace/db";
import type { CustomOrder } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../../middleware/requireAuth";

const router = Router();
const VALID_STATUSES = ["pending", "under_review", "quotation_sent", "approved", "in_production", "completed", "cancelled"];

/** GET /api/admin/custom-requests */
router.get("/custom-requests", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query as Record<string, string>;
    let requests = await db.select().from(customOrdersTable).orderBy(desc(customOrdersTable.createdAt));

    if (status && status !== "all") {
      requests = requests.filter((r: CustomOrder) => r.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      requests = requests.filter((r: CustomOrder) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q)
      );
    }
    res.json({ requests, total: requests.length });
  } catch (err) {
    console.error("[admin/custom-requests]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET /api/admin/custom-requests/:id */
router.get("/custom-requests/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    const [request] = await db.select().from(customOrdersTable).where(eq(customOrdersTable.id, id)).limit(1);
    if (!request) { res.status(404).json({ error: "Request not found" }); return; }
    res.json({ request });
  } catch (err) {
    console.error("[admin/custom-requests/:id]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** PUT /api/admin/custom-requests/:id */
router.put("/custom-requests/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    const { status, internalNotes, quotationPrice } = req.body as {
      status?: string;
      internalNotes?: string;
      quotationPrice?: string;
    };

    if (status && !VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: "Invalid status" }); return;
    }

    const patch: Record<string, string | undefined> = {};
    if (status !== undefined) patch["status"] = status;
    if (internalNotes !== undefined) patch["internalNotes"] = internalNotes;
    if (quotationPrice !== undefined) patch["quotationPrice"] = quotationPrice;

    if (!Object.keys(patch).length) { res.status(400).json({ error: "No fields to update" }); return; }

    const updated = await db.update(customOrdersTable).set(patch).where(eq(customOrdersTable.id, id)).returning();
    if (!updated.length) { res.status(404).json({ error: "Request not found" }); return; }
    res.json({ request: updated[0] });
  } catch (err) {
    console.error("[admin/custom-requests PUT]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
