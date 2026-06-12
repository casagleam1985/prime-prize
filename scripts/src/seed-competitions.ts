import { db, competitionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const competitions = [
  {
    id: 1,
    title: "Win £5,000 Cash",
    description:
      "Win a life-changing £5,000 cash prize. Paid directly to your bank account within 24 hours of the draw.",
    prizeValue: "5000.00",
    ticketPrice: "0.99",
    maxTickets: 5000,
    ticketsSold: 3120,
    status: "active",
    category: "cash",
    imageUrl: "/api/storage/public-objects/prizes/cash-5000-gbp.jpg",
    drawDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    hasInstantWin: false,
  },
  {
    id: 2,
    title: "BMW 3 Series — Drive Away Today",
    description:
      "Win a stunning BMW 3 Series — one of the most desirable executive saloons on the road. Fully insured and taxed for 12 months.",
    prizeValue: "45000.00",
    ticketPrice: "0.99",
    maxTickets: 10000,
    ticketsSold: 6780,
    status: "active",
    category: "cars",
    imageUrl: "/api/storage/public-objects/prizes/bmw-3-series-2024.jpg",
    drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    hasInstantWin: false,
  },
  {
    id: 3,
    title: "Apple iPhone 16 Pro Max",
    description:
      "Win the latest Apple iPhone 16 Pro Max 256GB in your choice of colour. The most powerful iPhone ever made.",
    prizeValue: "1299.00",
    ticketPrice: "0.99",
    maxTickets: 2000,
    ticketsSold: 1450,
    status: "active",
    category: "tech",
    imageUrl: "/api/storage/public-objects/prizes/iphone-16-pro-max.jpg",
    drawDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    hasInstantWin: true,
  },
  {
    id: 4,
    title: "£1,000 Amazon Gift Card",
    description:
      "A £1,000 Amazon Gift Card — spend it on absolutely anything. Electronics, fashion, homeware, and millions more.",
    prizeValue: "1000.00",
    ticketPrice: "0.99",
    maxTickets: 1500,
    ticketsSold: 890,
    status: "active",
    category: "cash",
    imageUrl: "/api/storage/public-objects/prizes/amazon-gift-card-1000.jpg",
    drawDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    hasInstantWin: false,
  },
  {
    id: 5,
    title: "Luxury Spa Weekend for Two",
    description:
      "An indulgent spa weekend for two at a 5-star resort. Two nights' accommodation, full use of spa facilities, and a couples treatment.",
    prizeValue: "2500.00",
    ticketPrice: "0.99",
    maxTickets: 3000,
    ticketsSold: 2100,
    status: "active",
    category: "lifestyle",
    imageUrl: "/api/storage/public-objects/prizes/luxury-spa-weekend.jpg",
    drawDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    hasInstantWin: false,
  },
  {
    id: 6,
    title: "PlayStation 5 + £200 PSN Credit",
    description:
      "Win a PlayStation 5 Disc Edition console bundled with £200 PlayStation Store credit. Start gaming from day one.",
    prizeValue: "759.00",
    ticketPrice: "0.99",
    maxTickets: 1000,
    ticketsSold: 780,
    status: "active",
    category: "tech",
    imageUrl: "/api/storage/public-objects/prizes/playstation-5-console.jpg",
    drawDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    hasInstantWin: true,
  },
  {
    id: 7,
    title: "Win £10,000 Cash — Monthly Mega Draw",
    description:
      "Our biggest monthly cash draw — £10,000 paid straight to your account. No catches, no restrictions. Pure life-changing cash.",
    prizeValue: "10000.00",
    ticketPrice: "0.99",
    maxTickets: 5000,
    ticketsSold: 1230,
    status: "active",
    category: "cash",
    imageUrl: "/api/storage/public-objects/prizes/cash-10000-gbp.jpg",
    drawDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    hasInstantWin: false,
  },
  {
    id: 8,
    title: "Range Rover Evoque — Nearly New",
    description:
      "Win a nearly-new Range Rover Evoque with under 5,000 miles. Full service history, two keys, and 12 months road tax included.",
    prizeValue: "52000.00",
    ticketPrice: "0.99",
    maxTickets: 12000,
    ticketsSold: 4560,
    status: "active",
    category: "cars",
    imageUrl: "/api/storage/public-objects/prizes/range-rover-evoque.jpg",
    drawDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    hasInstantWin: false,
  },
];

async function seed() {
  console.log("Seeding competitions with self-hosted prize images...");

  for (const comp of competitions) {
    const { id, ...fields } = comp;
    const existing = await db
      .select({ id: competitionsTable.id })
      .from(competitionsTable)
      .where(eq(competitionsTable.id, id));

    if (existing.length > 0) {
      await db
        .update(competitionsTable)
        .set({ imageUrl: fields.imageUrl })
        .where(eq(competitionsTable.id, id));
      console.log(`Updated competition ${id}: ${fields.title}`);
    } else {
      await db.insert(competitionsTable).values({ ...fields, prizeValue: fields.prizeValue, ticketPrice: fields.ticketPrice });
      console.log(`Inserted competition ${id}: ${fields.title}`);
    }
  }

  console.log(`Done. ${competitions.length} competitions processed.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
