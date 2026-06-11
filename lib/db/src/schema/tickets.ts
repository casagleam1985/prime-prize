import { pgTable, text, serial, timestamp, numeric, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ticketPurchasesTable = pgTable("ticket_purchases", {
  id: serial("id").primaryKey(),
  competitionId: integer("competition_id").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  ticketNumbers: jsonb("ticket_numbers").notNull().$type<number[]>(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTicketPurchaseSchema = createInsertSchema(ticketPurchasesTable).omit({ id: true, createdAt: true });
export type InsertTicketPurchase = z.infer<typeof insertTicketPurchaseSchema>;
export type TicketPurchase = typeof ticketPurchasesTable.$inferSelect;
