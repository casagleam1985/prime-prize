import { pgTable, text, serial, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const drawResultsTable = pgTable("draw_results", {
  id: serial("id").primaryKey(),
  competitionId: integer("competition_id").notNull(),
  competitionTitle: text("competition_title").notNull(),
  winnerName: text("winner_name").notNull(),
  winnerTicket: integer("winner_ticket").notNull(),
  prize: text("prize").notNull(),
  prizeValue: numeric("prize_value", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  drawnAt: timestamp("drawn_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDrawResultSchema = createInsertSchema(drawResultsTable).omit({ id: true });
export type InsertDrawResult = z.infer<typeof insertDrawResultSchema>;
export type DrawResult = typeof drawResultsTable.$inferSelect;

export const winnersTable = pgTable("winners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  prize: text("prize").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  imageUrl: text("image_url"),
  testimonial: text("testimonial"),
});

export const insertWinnerSchema = createInsertSchema(winnersTable).omit({ id: true });
export type InsertWinner = z.infer<typeof insertWinnerSchema>;
export type Winner = typeof winnersTable.$inferSelect;
