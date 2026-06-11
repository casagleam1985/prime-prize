import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, drawResultsTable, winnersTable } from "@workspace/db";
import { ListDrawResultsQueryParams, ListWinnersQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/draws", async (req, res): Promise<void> => {
  const query = ListDrawResultsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { limit = 10 } = query.data;

  const draws = await db
    .select()
    .from(drawResultsTable)
    .orderBy(desc(drawResultsTable.drawnAt))
    .limit(limit);

  res.json(
    draws.map((d) => ({
      id: d.id,
      competitionId: d.competitionId,
      competitionTitle: d.competitionTitle,
      winnerName: d.winnerName,
      winnerTicket: d.winnerTicket,
      prize: d.prize,
      prizeValue: d.prizeValue ? Number(d.prizeValue) : null,
      imageUrl: d.imageUrl ?? null,
      drawnAt: d.drawnAt.toISOString(),
    }))
  );
});

router.get("/winners", async (req, res): Promise<void> => {
  const query = ListWinnersQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { limit = 10 } = query.data;

  const winners = await db
    .select()
    .from(winnersTable)
    .orderBy(desc(winnersTable.date))
    .limit(limit);

  res.json(
    winners.map((w) => ({
      id: w.id,
      name: w.name,
      prize: w.prize,
      amount: Number(w.amount),
      date: w.date.toISOString(),
      imageUrl: w.imageUrl ?? null,
      testimonial: w.testimonial ?? null,
    }))
  );
});

export default router;
