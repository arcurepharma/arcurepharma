export type Language = "en" | "ur";

export const translations = {
  en: {
    // Navigation
    home: "Home",
    products: "Products",
    about: "About",
    contact: "Contact",
    cart: "Cart",
    account: "Account",
    
    // Common
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    viewDetails: "View Details",
    learnMore: "Learn More",
    
    // Product
    price: "Price",
    category: "Category",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    description: "Description",
    benefits: "Benefits",
    ingredients: "Ingredients",
    howToUse: "How to Use",
    
    // Checkout
    checkout: "Checkout",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    placeOrder: "Place Order",
    
    // Trust badges
    genuineProducts: "100% Genuine",
    fastDelivery: "Fast Delivery",
    securePayment: "Secure Payment",
    moneyBack: "Money Back Guarantee",
  },
  ur: {
    // Navigation
    home: "ہوم",
    products: "مصنوعات",
    about: "ہمارے بارے میں",
    contact: "رابطہ",
    cart: "کارٹ",
    account: "اکاؤنٹ",
    
    // Common
    search: "تلاش کریں",
    filter: "فلٹر",
    sort: "ترتیب دیں",
    addToCart: "کارٹ میں شامل کریں",
    buyNow: "ابھی خریدیں",
    viewDetails: "تفصیلات دیکھیں",
    learnMore: "مزید جانیں",
    
    // Product
    price: "قیمت",
    category: "زمرہ",
    inStock: "دستیاب ہے",
    outOfStock: "دستیاب نہیں",
    description: "تفصیل",
    benefits: "فوائد",
    ingredients: "اجزاء",
    howToUse: "استعمال کا طریقہ",
    
    // Checkout
    checkout: "چیک آؤٹ",
    subtotal: "ذیلی کل",
    shipping: "ترسیل",
    total: "کل رقم",
    placeOrder: "آرڈر کریں",
    
    // Trust badges
    genuineProducts: "100% اصلی",
    fastDelivery: "تیز ترسیل",
    securePayment: "محفوظ ادائیگی",
    moneyBack: "رقم کی واپسی کی ضمانت",
  },
};

export function translate(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || translations.en[key];
}
