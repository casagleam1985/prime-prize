import { Storage } from "@google-cloud/storage";
import { db, competitionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const storageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  } as never,
  projectId: "",
});

const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
if (!BUCKET_ID) throw new Error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set");

const prizeImages: Array<{ id: number; filename: string; sourceUrl: string }> = [
  {
    id: 1,
    filename: "cash-5000-gbp.jpg",
    sourceUrl: "https://i.pinimg.com/originals/97/c3/b2/97c3b220feaa2ae63cf49e7e60cd96f2.jpg",
  },
  {
    id: 2,
    filename: "bmw-3-series-2024.jpg",
    sourceUrl: "https://bmwofspringfield.bhaimg.com/website/bmw/2024-3-series-exterior.jpg",
  },
  {
    id: 3,
    filename: "iphone-16-pro-max.jpg",
    sourceUrl: "https://images-na.ssl-images-amazon.com/images/I/51Vs7ZwpSpL.jpg",
  },
  {
    id: 4,
    filename: "amazon-gift-card-1000.jpg",
    sourceUrl:
      "https://thumbs.dreamstime.com/b/amazon-gift-card-london-uk-march-th-close-up-pictured-wooden-surface-143767188.jpg",
  },
  {
    id: 5,
    filename: "luxury-spa-weekend.jpg",
    sourceUrl:
      "https://hips.hearstapps.com/hmg-prod/images/botanic-sanctuary-antwerp-1659-botanic-health-spa-swimming-pool-c-hugo-thomassen-52343073769-o-696fe42974f87.jpg?crop=0.600xw:1.00xh;0.197xw,0",
  },
  {
    id: 6,
    filename: "playstation-5-console.jpg",
    sourceUrl:
      "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA==",
  },
  {
    id: 7,
    filename: "cash-10000-gbp.jpg",
    sourceUrl: "https://thumbs.dreamstime.com/b/money-background-16005100.jpg",
  },
  {
    id: 8,
    filename: "range-rover-evoque.jpg",
    sourceUrl:
      "https://images.ctfassets.net/3xid768u5joa/6t3Wkz4PF8wJvhF2pcSFRG/a80f0a5400c67a30062c55c08907d782/evoque-Seoul-Pearl-Silver-metallic.jpg",
  },
  {
    id: 0,
    filename: "fallback-prize.jpg",
    sourceUrl:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?fm=jpg&q=80&w=1200",
  },
];

async function uploadImage(filename: string, sourceUrl: string): Promise<string> {
  console.log(`  Downloading ${sourceUrl.slice(0, 70)}...`);
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${sourceUrl}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "image/jpeg";

  const objectPath = `public/prizes/${filename}`;
  const bucket = storageClient.bucket(BUCKET_ID!);
  const file = bucket.file(objectPath);

  await file.save(buffer, {
    metadata: { contentType },
    resumable: false,
  });

  const servingPath = `/api/storage/public-objects/prizes/${filename}`;
  console.log(`  ✓ Uploaded → ${servingPath}`);
  return servingPath;
}

async function main() {
  console.log(`Uploading prize images to bucket: ${BUCKET_ID}\n`);

  const uploadedPaths: Record<number, string> = {};

  for (const img of prizeImages) {
    try {
      const servingPath = await uploadImage(img.filename, img.sourceUrl);
      uploadedPaths[img.id] = servingPath;
    } catch (err) {
      console.error(`  ✗ Failed for id=${img.id}: ${err}`);
    }
  }

  console.log("\nUpdating database...");
  for (const [idStr, path] of Object.entries(uploadedPaths)) {
    const id = Number(idStr);
    if (id === 0) continue;
    await db
      .update(competitionsTable)
      .set({ imageUrl: path })
      .where(eq(competitionsTable.id, id));
    console.log(`  Updated competition ${id} → ${path}`);
  }

  console.log("\nDone! Fallback image path:", uploadedPaths[0] ?? "(failed)");
  process.exit(0);
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
