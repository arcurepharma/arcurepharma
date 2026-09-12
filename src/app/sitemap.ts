import { db } from "@/db";
import { products } from "@/db/schema";
import type { MetadataRoute } from "next";

const BASE_URL = "https://arcurepharma.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productRows: {
    id: string;
    createdAt: Date | null;
  }[] = [];

  try {
    productRows = await db.select().from(products);
  } catch {
    productRows = [];
  }

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/checkout`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/account`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = productRows.map((p) => ({
    url: `${BASE_URL}/product/${p.id}`,
    lastModified: p.createdAt ?? now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
