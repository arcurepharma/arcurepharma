export interface ProductData {
  id: string;
  title: string;
  price: string;
  description: string;
  category: string;
  imageUrl: string;
  images: string[];
  benefits: string[];
  ingredients: string;
  formula?: string;
  howToUse: string;
  sku: string;
  isPrescriptionRequired: number;
  isActive: number;
  views?: number;
}

export const DEFAULT_PRODUCTS: ProductData[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    title: "ARCUDERM CS Serum",
    price: "2999",
    description:
      "Restorative care for glowing, healthy skin. Salicylic Acid + Vitamin C + Hyaluronic Acid — Dermatologist formulated for acne defense, deep hydration and radiance.",
    category: "Skin Care",
    imageUrl: "/arcure/arcuderm-serum.png",
    images: ["/arcure/arcuderm-serum.png", "/arcure/Arcu_Gleam_Seerom.jpeg"],
    benefits: [
      "Protects & Strengthens",
      "Brightens & Revives",
      "Hydrates & Repairs",
      "Clearer & Smoother Skin",
    ],
    ingredients: "Salicylic Acid, Vitamin C, Hyaluronic Acid, Niacinamide",
    formula: "Salicylic Acid, Vitamin C, Hyaluronic Acid, Niacinamide",
    howToUse:
      "Apply 2-3 drops on clean, damp face. Gently pat until absorbed. Use morning and evening for optimal results.",
    sku: "ACS-001",
    isPrescriptionRequired: 0,
    isActive: 1,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    title: "ARCU GLEAM Face Wash",
    price: "1499",
    description:
      "Deep clean, oil control, and hydration boost. Gentle purifying cleanser formulated for acne-prone, oily and sensitive skin.",
    category: "Skin Care",
    imageUrl: "/arcure/arcu-gleam.jpeg",
    images: ["/arcure/arcu-gleam.jpeg", "/arcure/Arcu_Gleam_Seerom2.jpeg"],
    benefits: [
      "Deep Cleanses Pores",
      "Controls Excess Sebum",
      "Hydration Boost",
      "Restores Natural Glow",
    ],
    ingredients: "Salicylic Acid, Niacinamide, Hyaluronic Acid, Tea Tree Extract",
    formula: "Salicylic Acid, Niacinamide, Hyaluronic Acid, Tea Tree Extract",
    howToUse:
      "Apply small amount to wet face. Gently massage in circular motions for 60 seconds and rinse thoroughly.",
    sku: "AGF-003",
    isPrescriptionRequired: 0,
    isActive: 1,
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    title: "ARCU-CAL K2",
    price: "1999",
    description:
      "Complete Bone, Joint & Vascular Support. Premium bio-available Calcium combined with Vitamin K2 (MK-7), Vitamin D3, Magnesium, and Zinc.",
    category: "Supplements",
    imageUrl: "/arcure/arcu-cal-k2.png",
    images: ["/arcure/arcu-cal-k2.png", "/arcure/Arcu_Gleam_Seerom3.jpeg"],
    benefits: [
      "Optimal Bone Density",
      "Enhanced Calcium Absorption",
      "Joint Mobility Support",
      "Immune & Cardiovascular Health",
    ],
    ingredients: "Calcium Citrate, Vitamin K2 (MK-7), Vitamin D3, Magnesium, Zinc",
    formula: "Calcium Citrate, Vitamin K2 (MK-7), Vitamin D3, Magnesium, Zinc",
    howToUse:
      "Take 1 tablet daily with a main meal or as advised by your physician.",
    sku: "ACK-002",
    isPrescriptionRequired: 0,
    isActive: 1,
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    title: "Mida-D Vitamin D3",
    price: "1799",
    description:
      "High Potency Vitamin D3 200,000 IU for immune defense, bone strength, vitality, and mood support with essential fatty acids.",
    category: "Supplements",
    imageUrl: "/arcure/mida-d.png",
    images: ["/arcure/mida-d.png"],
    benefits: [
      "High Strength Vitamin D3",
      "Robust Immune Defense",
      "Omega Fish Oil Carrier",
      "Boosts Daily Energy & Mood",
    ],
    ingredients: "Cholecalciferol (Vitamin D3) 200,000 IU, Omega-3 Fish Oil",
    formula: "Cholecalciferol (Vitamin D3) 200,000 IU, Omega-3 Fish Oil",
    howToUse:
      "Take 1 softgel capsule as recommended by your physician or healthcare professional.",
    sku: "MDV-004",
    isPrescriptionRequired: 0,
    isActive: 1,
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    title: "Radiance Duo Bundle (ARCUDERM + ARCU GLEAM)",
    price: "3999",
    description:
      "The complete daily dermatological ritual: ARCU GLEAM Face Wash for deep purification + ARCUDERM CS Serum for intense restoration and brightening. Save Rs. 499!",
    category: "Deals & Bundles",
    imageUrl: "/arcure/hero-caramel-banner.png",
    images: [
      "/arcure/hero-caramel-banner.png",
      "/arcure/arcuderm-serum.png",
      "/arcure/arcu-gleam.jpeg",
    ],
    benefits: [
      "Complete 2-Step Daily Ritual",
      "Purifies & Brightens Together",
      "Special Bundle Savings",
      "Includes Free Nationwide Delivery",
    ],
    ingredients: "Salicylic Acid, Vitamin C, Niacinamide, Hyaluronic Acid",
    formula: "Salicylic Acid, Vitamin C, Niacinamide, Hyaluronic Acid",
    howToUse:
      "Step 1: Cleanse with ARCU GLEAM. Step 2: Apply 3 drops of ARCUDERM CS Serum onto dry skin.",
    sku: "BND-005",
    isPrescriptionRequired: 0,
    isActive: 1,
  },
];
