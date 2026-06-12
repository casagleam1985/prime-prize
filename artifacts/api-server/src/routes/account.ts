import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { db, ticketPurchasesTable, competitionsTable } from "@workspace/db";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { userId: string }).userId = userId;
  next();
}

router.get("/account/tickets", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as Request & { userId: string }).userId;

  const purchases = await db
    .select({
      id: ticketPurchasesTable.id,
      competitionId: ticketPurchasesTable.competitionId,
      quantity: ticketPurchasesTable.quantity,
      totalPrice: ticketPurchasesTable.totalPrice,
      ticketNumbers: ticketPurchasesTable.ticketNumbers,
      createdAt: ticketPurchasesTable.createdAt,
      competitionTitle: competitionsTable.title,
      competitionStatus: competitionsTable.status,
      competitionImageUrl: competitionsTable.imageUrl,
      drawDate: competitionsTable.drawDate,
    })
    .from(ticketPurchasesTable)
    .innerJoin(competitionsTable, eq(ticketPurchasesTable.competitionId, competitionsTable.id))
    .where(eq(ticketPurchasesTable.userId, userId))
    .orderBy(ticketPurchasesTable.createdAt);

  res.json(
    purchases.map((p) => ({
      id: p.id,
      competitionId: p.competitionId,
      competitionTitle: p.competitionTitle,
      competitionStatus: p.competitionStatus,
      competitionImageUrl: p.competitionImageUrl,
      drawDate: p.drawDate.toISOString(),
      quantity: p.quantity,
      totalPrice: Number(p.totalPrice),
      ticketNumbers: p.ticketNumbers as number[],
      createdAt: p.createdAt.toISOString(),
    })),
  );
});

export default router;
