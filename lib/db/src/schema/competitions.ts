import { pgTable, text, serial, timestamp, numeric, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const competitionsTable = pgTable("competitions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  prizeValue: numeric("prize_value", { precision: 10, scale: 2 }).notNull(),
  ticketPrice: numeric("ticket_price", { precision: 10, scale: 2 }).notNull(),
  maxTickets: integer("max_tickets").notNull(),
  ticketsSold: integer("tickets_sold").notNull().default(0),
  status: text("status").notNull().default("active"),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  drawDate: timestamp("draw_date", { withTimezone: true }).notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  hasInstantWin: boolean("has_instant_win").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCompetitionSchema = createInsertSchema(competitionsTable).omit({ id: true, createdAt: true });
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;
export type Competition = typeof competitionsTable.$inferSelect;
