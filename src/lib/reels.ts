import fs from "fs/promises";
import path from "path";
import { db, isDbConfigured } from "@/db";
import { reels } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export interface ReelRecord {
  id: string;
  videoUrl: string;
  title: string;
  creator: string;
  handle: string;
  product: string;
  order: number;
  isActive: number;
  createdAt?: string | Date;
}

export const DEFAULT_REELS: ReelRecord[] = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    videoUrl: "/videos/reels/arcure-influancer.mp4",
    title: "Arcure Expert Care Routine",
    creator: "Arcure Expert Care",
    handle: "@arcurepharma",
    product: "ARCUDERM CS Serum",
    order: 1,
    isActive: 1,
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    videoUrl: "/videos/reels/arcure-influancer.1.mp4",
    title: "Dermatological Facial Wash",
    creator: "Dermatological Routine",
    handle: "@arcurepharma",
    product: "ARCU GLEAM Face Wash",
    order: 2,
    isActive: 1,
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    videoUrl: "/videos/reels/arcure-influancer.2.mp4",
    title: "Radiance & Healthy Glow",
    creator: "Radiance & Glow",
    handle: "@arcurepharma",
    product: "Skin Care Essentials",
    order: 3,
    isActive: 1,
  },
  {
    id: "30000000-0000-4000-8000-000000000004",
    videoUrl: "/videos/reels/arcure-influancer.3.mp4",
    title: "Daily Bone & Energy Support",
    creator: "Daily Health Journey",
    handle: "@arcurepharma",
    product: "ARCU-CAL K2 & Mida-D",
    order: 4,
    isActive: 1,
  },
];

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_REELS_FILE = path.join(LOCAL_DATA_DIR, "reels.json");

async function ensureLocalFile(): Promise<ReelRecord[]> {
  try {
    await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
    try {
      const data = await fs.readFile(LOCAL_REELS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // File does not exist, write defaults
    }
    await fs.writeFile(LOCAL_REELS_FILE, JSON.stringify(DEFAULT_REELS, null, 2), "utf-8");
    return DEFAULT_REELS;
  } catch (err) {
    console.error("Local reels file error:", err);
    return DEFAULT_REELS;
  }
}

async function saveLocalFile(items: ReelRecord[]): Promise<void> {
  try {
    await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
    await fs.writeFile(LOCAL_REELS_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local reels file:", err);
  }
}

/**
 * Get all reels (for admin panel)
 */
export async function getAllReels(): Promise<ReelRecord[]> {
  if (isDbConfigured) {
    try {
      const rows = await db
        .select()
        .from(reels)
        .orderBy(asc(reels.order), desc(reels.createdAt));
      if (rows && rows.length > 0) {
        return rows as ReelRecord[];
      }
    } catch (err) {
      console.warn("DB reels fetch error, falling back to local store:", err);
    }
  }
  return ensureLocalFile();
}

/**
 * Get active reels only (for storefront website)
 */
export async function getActiveReels(): Promise<ReelRecord[]> {
  const all = await getAllReels();
  const active = all.filter((r) => r.isActive === 1);
  return active.length > 0 ? active : DEFAULT_REELS;
}

/**
 * Get single reel by ID
 */
export async function getReelById(id: string): Promise<ReelRecord | null> {
  if (isDbConfigured) {
    try {
      const rows = await db
        .select()
        .from(reels)
        .where(eq(reels.id, id))
        .limit(1);
      if (rows && rows.length > 0) {
        return rows[0] as ReelRecord;
      }
    } catch {
      // Fallback
    }
  }
  const all = await ensureLocalFile();
  return all.find((r) => r.id === id) || null;
}

/**
 * Create a new reel
 */
export async function createReel(data: {
  videoUrl: string;
  title?: string;
  creator?: string;
  handle?: string;
  product?: string;
  order?: number;
  isActive?: number;
}): Promise<ReelRecord> {
  const newReel: ReelRecord = {
    id: uuidv4(),
    videoUrl: data.videoUrl,
    title: data.title || "",
    creator: data.creator || "Arcure Creator",
    handle: data.handle || "@arcurepharma",
    product: data.product || "Arcure Product",
    order: Number(data.order) || 0,
    isActive: data.isActive !== undefined ? Number(data.isActive) : 1,
    createdAt: new Date().toISOString(),
  };

  if (isDbConfigured) {
    try {
      const inserted = await db
        .insert(reels)
        .values({
          id: newReel.id,
          videoUrl: newReel.videoUrl,
          title: newReel.title,
          creator: newReel.creator,
          handle: newReel.handle,
          product: newReel.product,
          order: newReel.order,
          isActive: newReel.isActive,
        })
        .returning();
      if (inserted && inserted[0]) {
        return inserted[0] as ReelRecord;
      }
    } catch (err) {
      console.warn("DB reels insert error, saving locally:", err);
    }
  }

  const all = await ensureLocalFile();
  all.push(newReel);
  await saveLocalFile(all);
  return newReel;
}

/**
 * Update an existing reel
 */
export async function updateReel(
  id: string,
  data: Partial<ReelRecord>
): Promise<ReelRecord | null> {
  if (isDbConfigured) {
    try {
      const updated = await db
        .update(reels)
        .set({
          ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
          ...(data.title !== undefined && { title: data.title }),
          ...(data.creator !== undefined && { creator: data.creator }),
          ...(data.handle !== undefined && { handle: data.handle }),
          ...(data.product !== undefined && { product: data.product }),
          ...(data.order !== undefined && { order: Number(data.order) }),
          ...(data.isActive !== undefined && { isActive: Number(data.isActive) }),
        })
        .where(eq(reels.id, id))
        .returning();
      if (updated && updated[0]) {
        return updated[0] as ReelRecord;
      }
    } catch (err) {
      console.warn("DB reels update error, updating locally:", err);
    }
  }

  const all = await ensureLocalFile();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return null;

  all[index] = {
    ...all[index],
    ...data,
    ...(data.order !== undefined && { order: Number(data.order) }),
    ...(data.isActive !== undefined && { isActive: Number(data.isActive) }),
  };
  await saveLocalFile(all);
  return all[index];
}

/**
 * Delete a reel
 */
export async function deleteReel(id: string): Promise<boolean> {
  if (isDbConfigured) {
    try {
      await db.delete(reels).where(eq(reels.id, id));
    } catch (err) {
      console.warn("DB reels delete error:", err);
    }
  }

  const all = await ensureLocalFile();
  const filtered = all.filter((r) => r.id !== id);
  await saveLocalFile(filtered);
  return true;
}
