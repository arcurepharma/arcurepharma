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
// hello
    fastDelivery: "Fast Delivery",
    securePayment: "Secure Payment",
    moneyBack: "Money Back Guarantee",
  },
  ur: {
    // Navigation
    home: "ÛÙˆÙ…",
    products: "Ù…ØµÙ†ÙˆØ¹Ø§Øª",
    about: "ÛÙ…Ø§Ø±Û’ Ø¨Ø§Ø±Û’ Ù…ÛŒÚº",
    contact: "Ø±Ø§Ø¨Ø·Û",
    cart: "Ú©Ø§Ø±Ù¹",
    account: "Ø§Ú©Ø§Ø¤Ù†Ù¹",
    
    // Common
    search: "ØªÙ„Ø§Ø´ Ú©Ø±ÛŒÚº",
    filter: "ÙÙ„Ù¹Ø±",
    sort: "ØªØ±ØªÛŒØ¨ Ø¯ÛŒÚº",
    addToCart: "Ú©Ø§Ø±Ù¹ Ù…ÛŒÚº Ø´Ø§Ù…Ù„ Ú©Ø±ÛŒÚº",
    buyNow: "Ø§Ø¨Ú¾ÛŒ Ø®Ø±ÛŒØ¯ÛŒÚº",
    viewDetails: "ØªÙØµÛŒÙ„Ø§Øª Ø¯ÛŒÚ©Ú¾ÛŒÚº",
    learnMore: "Ù…Ø²ÛŒØ¯ Ø¬Ø§Ù†ÛŒÚº",
    
    // Product
    price: "Ù‚ÛŒÙ…Øª",
    category: "Ø²Ù…Ø±Û",
    inStock: "Ø¯Ø³ØªÛŒØ§Ø¨ ÛÛ’",
    outOfStock: "Ø¯Ø³ØªÛŒØ§Ø¨ Ù†ÛÛŒÚº",
    description: "ØªÙØµÛŒÙ„",
    benefits: "ÙÙˆØ§Ø¦Ø¯",
    ingredients: "Ø§Ø¬Ø²Ø§Ø¡",
    howToUse: "Ø§Ø³ØªØ¹Ù…Ø§Ù„ Ú©Ø§ Ø·Ø±ÛŒÙ‚Û",
    
    // Checkout
    checkout: "Ú†ÛŒÚ© Ø¢Ø¤Ù¹",
    subtotal: "Ø°ÛŒÙ„ÛŒ Ú©Ù„",
    shipping: "ØªØ±Ø³ÛŒÙ„",
    total: "Ú©Ù„ Ø±Ù‚Ù…",
    placeOrder: "Ø¢Ø±ÚˆØ± Ú©Ø±ÛŒÚº",
    
    // Trust badges
    fastDelivery: "ØªÛŒØ² ØªØ±Ø³ÛŒÙ„",
    securePayment: "Ù…Ø­ÙÙˆØ¸ Ø§Ø¯Ø§Ø¦ÛŒÚ¯ÛŒ",
    moneyBack: "Ø±Ù‚Ù… Ú©ÛŒ ÙˆØ§Ù¾Ø³ÛŒ Ú©ÛŒ Ø¶Ù…Ø§Ù†Øª",
  },
};

export function translate(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || translations.en[key];
}



