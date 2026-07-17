import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, journalPostsTable } from "@workspace/db";
import {
  ListJournalPostsResponse,
  GetJournalPostParams,
  GetJournalPostResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/journal", async (_req, res): Promise<void> => {
  const posts = await db.select().from(journalPostsTable).orderBy(journalPostsTable.publishedAt);
  const mapped = posts.map((p) => ({ ...p, publishedAt: p.publishedAt.toISOString() }));
  res.json(ListJournalPostsResponse.parse(mapped));
});

router.get("/journal/:slug", async (req, res): Promise<void> => {
  const params = GetJournalPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(journalPostsTable)
    .where(eq(journalPostsTable.slug, params.data.slug));

  if (!post) {
    res.status(404).json({ error: "Journal post not found" });
    return;
  }

  res.json(GetJournalPostResponse.parse({ ...post, publishedAt: post.publishedAt.toISOString() }));
});

export default router;
