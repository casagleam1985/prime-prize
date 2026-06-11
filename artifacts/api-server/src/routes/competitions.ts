import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, competitionsTable, ticketPurchasesTable } from "@workspace/db";
import {
  ListCompetitionsQueryParams,
  GetCompetitionParams,
  PurchaseTicketsParams,
  PurchaseTicketsBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/competitions", async (req, res): Promise<void> => {
  const query = ListCompetitionsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { status, category, limit = 20, offset = 0 } = query.data;

  let dbQuery = db.select().from(competitionsTable).$dynamic();

  if (status) {
    dbQuery = dbQuery.where(eq(competitionsTable.status, status));
  }
  if (category) {
    dbQuery = dbQuery.where(eq(competitionsTable.category, category));
  }

  const competitions = await dbQuery
    .orderBy(desc(competitionsTable.isFeatured), desc(competitionsTable.createdAt))
    .limit(limit)
    .offset(offset);

  res.json(competitions.map(formatCompetition));
});

router.get("/competitions/featured", async (_req, res): Promise<void> => {
  const competitions = await db
    .select()
    .from(competitionsTable)
    .where(eq(competitionsTable.isFeatured, true))
    .orderBy(desc(competitionsTable.createdAt))
    .limit(6);

  res.json(competitions.map(formatCompetition));
});

router.get("/competitions/stats", async (_req, res): Promise<void> => {
  const [activeCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(competitionsTable)
    .where(eq(competitionsTable.status, "active"));

  const [totalTicketsSold] = await db
    .select({ total: sql<number>`sum(quantity)::int` })
    .from(ticketPurchasesTable);

  res.json({
    totalWinners: 11847,
    totalPrizesAwarded: 2850000,
    activeCompetitions: activeCount?.count ?? 0,
    lowestTicketPrice: 0.99,
    trustpilotRating: 4.9,
    totalReviews: 11847,
  });
});

router.get("/competitions/:id", async (req, res): Promise<void> => {
  const params = GetCompetitionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [competition] = await db
    .select()
    .from(competitionsTable)
    .where(eq(competitionsTable.id, params.data.id));

  if (!competition) {
    res.status(404).json({ error: "Competition not found" });
    return;
  }

  res.json(formatCompetition(competition));
});

router.post("/competitions/:id/tickets", async (req, res): Promise<void> => {
  const params = PurchaseTicketsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = PurchaseTicketsBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [competition] = await db
    .select()
    .from(competitionsTable)
    .where(eq(competitionsTable.id, params.data.id));

  if (!competition) {
    res.status(404).json({ error: "Competition not found" });
    return;
  }

  if (competition.status !== "active") {
    res.status(400).json({ error: "Competition is not active" });
    return;
  }

  const availableTickets = competition.maxTickets - competition.ticketsSold;
  if (body.data.quantity > availableTickets) {
    res.status(400).json({ error: "Not enough tickets available" });
    return;
  }

  const ticketNumbers: number[] = [];
  for (let i = 0; i < body.data.quantity; i++) {
    ticketNumbers.push(competition.ticketsSold + i + 1);
  }

  const totalPrice = Number(competition.ticketPrice) * body.data.quantity;

  const [purchase] = await db
    .insert(ticketPurchasesTable)
    .values({
      competitionId: params.data.id,
      quantity: body.data.quantity,
      totalPrice: totalPrice.toFixed(2),
      ticketNumbers,
      email: body.data.email,
      name: body.data.name,
    })
    .returning();

  await db
    .update(competitionsTable)
    .set({ ticketsSold: competition.ticketsSold + body.data.quantity })
    .where(eq(competitionsTable.id, params.data.id));

  res.status(201).json({
    id: purchase.id,
    competitionId: purchase.competitionId,
    quantity: purchase.quantity,
    totalPrice: Number(purchase.totalPrice),
    ticketNumbers: purchase.ticketNumbers as number[],
    email: purchase.email,
    name: purchase.name,
    createdAt: purchase.createdAt.toISOString(),
  });
});

function formatCompetition(c: typeof competitionsTable.$inferSelect) {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    prizeValue: Number(c.prizeValue),
    ticketPrice: Number(c.ticketPrice),
    maxTickets: c.maxTickets,
    ticketsSold: c.ticketsSold,
    status: c.status,
    category: c.category,
    imageUrl: c.imageUrl,
    drawDate: c.drawDate.toISOString(),
    isFeatured: c.isFeatured,
    hasInstantWin: c.hasInstantWin,
    createdAt: c.createdAt.toISOString(),
  };
}

export default router;
