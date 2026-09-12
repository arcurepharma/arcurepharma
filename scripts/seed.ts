import { db } from "../src/db";
import { settings, categories, reviews, products } from "../src/db/schema";

async function main() {
  console.log("Seeding default settings...");

  await db
    .insert(settings)
    .values({ key: "delivery_fee", value: "150" })
    .onConflictDoUpdate({ target: settings.key, set: { value: "150" } });

  await db
    .insert(settings)
    .values({ key: "slider_duration", value: "5" })
    .onConflictDoUpdate({ target: settings.key, set: { value: "5" } });

  await db
    .insert(settings)
    .values({ key: "whatsapp_number", value: "923001234567" })
    .onConflictDoNothing();

  const defaultSettings = await db.select().from(settings);
  console.log("Default settings:", defaultSettings);

  const defaultCategories = [
    "General",
    "Pain Relief",
    "Vitamins",
    "Antibiotics",
    "Skincare",
    "Baby Care",
    "First Aid",
    "Cough & Cold",
    "Diabetes Care",
    "Digestive Health",
  ];

  for (const name of defaultCategories) {
    await db
      .insert(categories)
      .values({ name })
      .onConflictDoNothing();
  }
  console.log(`Seeded ${defaultCategories.length} default categories`);

  console.log("Seeding default reviews...");

  const defaultReviews = [
    {
      id: "00000000-0000-4000-8000-000000000001",
      name: "Dr. Fatima Khan",
      role: "Hospital Administrator",
      rating: 5,
      text: "Arcure Pharma has been our trusted supplier for over 3 years. Their quality and reliability are unmatched.",
      order: 1,
    },
    {
      id: "00000000-0000-4000-8000-000000000002",
      name: "Ahmed Raza",
      role: "Loyal Customer",
      rating: 5,
      text: "Fast delivery, genuine products and excellent customer service. I would not shop anywhere else.",
      order: 2,
    },
    {
      id: "00000000-0000-4000-8000-000000000003",
      name: "Sara Malik",
      role: "Pharmacy Owner",
      rating: 4,
      text: "Professional team with a wide range of products. Their prices are competitive and delivery is always on time.",
      order: 3,
    },
    {
      id: "00000000-0000-4000-8000-000000000004",
      name: "Muhammad Usman",
      role: "Clinic Manager",
      rating: 5,
      text: "We order monthly stock for our clinic and every single order arrives perfectly packed with complete documentation.",
      order: 4,
    },
    {
      id: "00000000-0000-4000-8000-000000000005",
      name: "Ayesha Siddiqui",
      role: "Regular Customer",
      rating: 5,
      text: "Their medicines are always genuine with proper expiry dates. The WhatsApp ordering is super convenient.",
      order: 5,
    },
    {
      id: "00000000-0000-4000-8000-000000000006",
      name: "Bilal Hussain",
      role: "Retail Pharmacist",
      rating: 4,
      text: "Great wholesale rates and honest dealing. The team keeps you updated about stock availability regularly.",
      order: 6,
    },
    {
      id: "00000000-0000-4000-8000-000000000007",
      name: "Hira Shah",
      role: "First-time Customer",
      rating: 5,
      text: "Ordered late at night and received my medicines the very next morning. Amazing service and friendly staff!",
      order: 7,
    },
    {
      id: "00000000-0000-4000-8000-000000000008",
      name: "Kamran Ali",
      role: "Distributor Partner",
      rating: 5,
      text: "Working with Arcure Pharma for two years now. Honest pricing, consistent supply and a team that actually listens.",
      order: 8,
    },
    {
      id: "00000000-0000-4000-8000-000000000009",
      name: "Zainab Tariq",
      role: "Mother of Two",
      rating: 5,
      text: "Ordered baby care essentials and vitamins. Everything arrived well-packed, genuine and exactly on schedule. Highly recommended!",
      order: 9,
    },
    {
      id: "00000000-0000-4000-8000-00000000000a",
      name: "Danish Iqbal",
      role: "Hospital Procurement",
      rating: 4,
      text: "Their bulk ordering process is smooth and paperwork is always complete A dependable partner for institutional supplies.",
      order: 10,
    },
    {
      id: "00000000-0000-4000-8000-00000000000b",
      name: "Huma",
      role: "Verified Customer - 6 weeks",
      rating: 5,
      text: "MandelAC Serum helped calm my active acne significantly. Breakouts reduced, inflammation went down, and my skin feels clearer and healthier within just a few weeks!",
      order: 11,
    },
    {
      id: "00000000-0000-4000-8000-00000000000c",
      name: "Zoha",
      role: "Verified Customer - 4 weeks",
      rating: 5,
      text: "Maxdif Moisturizer keeps my skin so hydrated all day. Tone looks brighter, more even, and my dull patches have really improved with regular use!",
      order: 12,
    },
    {
      id: "00000000-0000-4000-8000-00000000000d",
      name: "Mubeen",
      role: "Verified Customer - 3 months",
      rating: 5,
      text: "If used as advised, this actually works! I've been using it for 3 months and noticed an inch of multiple hair growth where my hair was receding. My hair is much fuller now!",
      order: 13,
    },
    {
      id: "00000000-0000-4000-8000-00000000000e",
      name: "Shahid",
      role: "Verified Customer - 4 weeks",
      rating: 5,
      text: "Since adding Maxdif Cream to my routine, my hyperpigmentation has noticeably reduced. Skin feels smoother, brighter, and so much more even toned now!",
      order: 14,
    },
  ];

  for (const review of defaultReviews) {
    await db.insert(reviews).values(review).onConflictDoNothing();
  }
  console.log(`Seeded ${defaultReviews.length} default reviews`);

  console.log("Seeding default products...");

  const defaultProducts = [
    {
      id: "10000000-0000-4000-8000-000000000001",
      title: "ARCUDERM CS Serum",
      price: "2999",
      description: "Restorative care for glowing, healthy skin. Salicylic Acid + Vitamin C + Hyaluronic Acid - Dermatologist formulated.",
      category: "Skincare",
      imageUrl: "/arcure/arcuderm-serum.png",
      images: ["/arcure/Arcu_Gleam_Seerom.jpeg", "/arcure/arcuderm-serum.png"],
      benefits: ["Protects & Strengthens", "Brightens & Revives", "Hydrates & Repairs", "Clearer & Smoother"],
      ingredients: "Salicylic Acid, Vitamin C, Hyaluronic Acid",
      howToUse: "Apply 2-3 drops on clean face. Use morning and evening for best results.",
      sku: "ACS-001",
      isPrescriptionRequired: 0,
      isActive: 1,
    },
    {
      id: "10000000-0000-4000-8000-000000000002",
      title: "ARCU GLEAM Face Wash",
      price: "1499",
      description: "Deep clean, oil control, hydration boost. For clear, fresh & healthy skin. Suitable for acne-prone skin.",
      category: "Skincare",
      imageUrl: "/arcure/arcu-gleam.jpeg",
      images: ["/arcure/arcu-gleam.jpeg", "/arcure/Arcu_Gleam_Seerom2.jpeg"],
      benefits: ["Deep Cleanses", "Oil Control", "Hydration Boost", "Natural Glow"],
      ingredients: "Salicylic Acid, Niacinamide, Hyaluronic Acid",
      howToUse: "Apply small amount to wet face. Massage gently and rinse thoroughly. Use twice daily.",
      sku: "AGF-003",
      isPrescriptionRequired: 0,
      isActive: 1,
    },
    {
      id: "10000000-0000-4000-8000-000000000003",
      title: "ARCU-CAL K2",
      price: "1999",
      description: "Complete Bone & Joint Support for an active, energetic life. Calcium + Vitamin D3 + Magnesium + Zinc.",
      category: "Supplements",
      imageUrl: "/arcure/arcu-cal-k2.png",
      images: ["/arcure/arcu-cal-k2.png", "/arcure/Arcu_Gleam_Seerom3.jpeg"],
      benefits: ["Strong Bones", "Better Absorption", "Joint Support", "Immunity & Energy"],
      ingredients: "Calcium, Vitamin D3, Magnesium, Zinc",
      howToUse: "Take 1 tablet daily with meal or as directed by healthcare professional.",
      sku: "ACK-002",
      isPrescriptionRequired: 0,
      isActive: 1,
    },
    {
      id: "10000000-0000-4000-8000-000000000004",
      title: "Mida-D Vitamin D3",
      price: "1799",
      description: "High Strength Vitamin D3 200,000 IU for daily wellness. Supports strong bones, immunity & overall well-being.",
      category: "Vitamins",
      imageUrl: "/arcure/mida-d.png",
      images: ["/arcure/mida-d.png"],
      benefits: ["Vitamin D3 200,000 IU", "Immune Support", "Omega Fish Oil", "More Energy"],
      ingredients: "Vitamin D3 200,000 IU, Omega Fish Oil",
      howToUse: "Take 1 softgel capsule as directed by your healthcare provider.",
      sku: "MDV-004",
      isPrescriptionRequired: 0,
      isActive: 1,
    },
  ];

  for (const product of defaultProducts) {
    await db.insert(products).values(product).onConflictDoNothing();
  }
  console.log(`Seeded ${defaultProducts.length} default products`);

  console.log("Done. Set DATABASE_URL in .env.local first.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
