import { NextRequest, NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

const DEFAULT_SETTINGS: Record<string, string> = {
  delivery_fee: "150",
  slider_duration: "5",
  whatsapp_number: "923305115999",
  official_email: "info@arcurepharma.com",
  official_phone: "+923305115999",
  website_url: "https://www.arcurepharma.com/",
};

function sanitizeWhatsApp(raw?: string | null): string {
  if (!raw) return "923305115999";
  const clean = String(raw).replace(/\D/g, "");
  // Block known typo or invalid placeholder numbers
  if (
    clean === "933162647620" ||
    clean === "923162647620" ||
    clean === "923001234567" ||
    clean.length < 10
  ) {
    return "923305115999";
  }
  // Convert 03... to 923...
  if (clean.startsWith("03") && clean.length === 11) {
    return "92" + clean.slice(1);
  }
  return clean;
}

function readLocalSettings(): Record<string, string> {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // fallback
  }
  return { ...DEFAULT_SETTINGS };
}

function writeLocalSetting(key: string, value: string) {
  try {
    const current = readLocalSettings();
    current[key] = value;
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local settings:", err);
  }
}

export async function GET() {
  const localMap = readLocalSettings();

  if (isDbConfigured) {
    try {
      const allSettings = await db.select().from(settings);
      allSettings.forEach((s) => {
        localMap[s.key] = s.value;
      });
    } catch (err) {
      console.warn("DB settings fetch error, using local settings:", err);
    }
  }

  // Ensure WhatsApp number is always clean and valid
  localMap.whatsapp_number = sanitizeWhatsApp(localMap.whatsapp_number);
  if (!localMap.official_email) localMap.official_email = "info@arcurepharma.com";
  if (!localMap.official_phone) localMap.official_phone = "+923305115999";
  if (!localMap.website_url) localMap.website_url = "https://www.arcurepharma.com/";

  return NextResponse.json(localMap, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    if (key === "whatsapp_number") {
      value = sanitizeWhatsApp(String(value));
    }

    const strValue = String(value);

    // Save locally
    writeLocalSetting(key, strValue);

    // Save to DB if configured
    if (isDbConfigured) {
      try {
        const existing = await db
          .select()
          .from(settings)
          .where(eq(settings.key, key))
          .limit(1);

        if (existing.length) {
          await db
            .update(settings)
            .set({ value: strValue })
            .where(eq(settings.key, key));
        } else {
          await db.insert(settings).values({ key, value: strValue });
        }
      } catch (err) {
        console.warn("DB setting update error:", err);
      }
    }

    return NextResponse.json({ key, value: strValue });
  } catch {
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
