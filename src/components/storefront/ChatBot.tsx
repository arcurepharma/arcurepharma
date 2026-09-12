"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  X,
  MessageSquareWarning,
  ShoppingCart,
  Info,
  HelpCircle,
  Package,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: string;
  category: string;
  description: string;
}

interface QuickAction {
  label: string;
  value: string;
}

interface ChatMessage {
  id: number;
  role: "bot" | "user";
  text: string;
  actions?: QuickAction[];
}

type FlowStep =
  | "idle"
  | "complaint_order"
  | "complaint_email"
  | "complaint_subject"
  | "complaint_message";

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Our Products", value: "products" },
  { label: "How to order?", value: "place order" },
  { label: "Delivery info", value: "delivery" },
  { label: "File a Complaint", value: "complaint" },
  { label: "Contact Info", value: "contact" },
];

const DEFAULT_SETTINGS = { delivery_fee: "150", whatsapp_number: "" };

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<FlowStep>("idle");
  const [complaint, setComplaint] = useState({
    orderId: "",
    email: "",
    subject: "",
    message: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (open) {
      Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
      ])
        .then(([prodData, settingsData]) => {
          setProducts(Array.isArray(prodData) ? prodData : []);
          if (settingsData && typeof settingsData === "object") {
            setSettings({
              delivery_fee: settingsData.delivery_fee || "150",
              whatsapp_number: settingsData.whatsapp_number || "",
            });
          }
        })
        .catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const nextId = () => ++idRef.current;

  const pushBot = (text: string, actions?: QuickAction[]) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "bot", text, actions },
    ]);
  };

  const pushUser = (text: string) => {
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
  };

  const botReply = (text: string, actions?: QuickAction[]) => {
    setBusy(true);
    setTimeout(() => {
      pushBot(text, actions);
      setBusy(false);
    }, 650);
  };

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  const formatProducts = (list: Product[]) => {
    if (!list.length) return "No products found for that search. Try another keyword like \"vitamins\" or \"pain\".";
    return (
      "Here's what I found: 👇\n" +
      list
        .slice(0, 6)
        .map((p) => `• ${p.title} — Rs. ${Number(p.price).toFixed(0)} (${p.category})`)
        .join("\n") +
      "\n\nClick any product on the site to see details and order it."
    );
  };

  const handleQuickAction = (value: string) => {
    if (value === "complaint") {
      startComplaint();
      return;
    }
    pushUser(value);
    replyKnowledge(value);
  };

  const startComplaint = () => {
    pushUser("File a Complaint");
    setStep("complaint_order");
    setComplaint({ orderId: "", email: "", subject: "", message: "" });
    botReply(
      "I'm sorry to hear you had an issue. 😔 Let's sort this out.\n\nPlease type your **Order ID** (you can find it on your order confirmation / invoice). If you don't have one, type \"N/A\".",
      []
    );
  };

  const handleIntent = (raw: string) => {
    const text = raw.toLowerCase();
    if (text.match(/\b(hello|hi|hey|salam|assalam|sab|how are you)\b/)) {
      return {
        text: "Hello! 😊 How can I help you today? I can tell you about our products, help you order, explain delivery, or file a complaint.",
        actions: QUICK_ACTIONS,
      };
    }
    if (text.match(/\b(product|medicine|medication|buy|purchase|shop|catalog|meds)\b/)) {
      if (products.length === 0) {
        return {
          text: "Let me load our product catalog for you... Give me a second and ask again. Meanwhile, here's what you can explore:",
          actions: QUICK_ACTIONS,
        };
      }
      return {
        text:
          "Here's our catalog: 👇\n" +
          categories.map((c) => `• ${c}`).join("\n") +
          "\n\nTry asking for a specific category or medicine, e.g. \"Vitamins\" or \"Pain relief\".",
        actions: categories.map((c) => ({ label: c, value: `show ${c}` })),
      };
    }
    if (text.match(/\b(price|cost|rate|charge how much)\b/)) {
      return {
        text: "Prices vary by product. Here's what I can see:\n" +
          formatProducts(products.slice(0, 5)),
        actions: QUICK_ACTIONS,
      };
    }
    if (text.match(/\b(delivery|shipping|ship|home delivery|charge)\b/)) {
      return {
        text: `🚚 We deliver all across Karachi. Delivery is fast — usually the same or next day after your order is confirmed.\n\nDelivery fee is Rs. ${settings.delivery_fee || "150"} per order. Orders are cash on delivery.`,
        actions: QUICK_ACTIONS,
      };
    }
    if (text.match(/\b(payment|pay|cod|cash)\b/)) {
      return {
        text: "💵 We operate on **Cash on Delivery (COD)**. You pay in cash when your order arrives at your doorstep. Simple and safe!",
        actions: QUICK_ACTIONS,
      };
    }
    if (text.match(/\b(order|checkout|how order|place ordr|track|status)\b/)) {
      return {
        text: "🛒 Ordering is easy: \n\n1. Browse our products and click **Buy Now** / add to cart. \n2. Go to **Checkout**, fill your name, phone, address. \n3. Place your order — it's **Cash on Delivery**. \n\nFor order status/tracking, contact us on WhatsApp and share your Order ID.",
        actions: QUICK_ACTIONS,
      };
    }
    if (text.match(/\b(return|refund|exchange|replace)\b/)) {
      return {
        text: "↩️ If a product arrives damaged, unsealed, or incorrect, you can raise a complaint within 48 hours of delivery and we'll replace it. Use the \"File a Complaint\" option below.",
        actions: [
          { label: "File a Complaint", value: "complaint" },
          ...QUICK_ACTIONS,
        ],
      };
    }
    if (text.match(/\b(contact|phone|number|email|whatsapp|address|location|office|karachi)\b/)) {
      return {
        text: "📍 **Arcure Pharma**\nPlot No. E99/B, Site Super Highway, Karachi, Pakistan\n\n📞 Phone: +92 334 116 9999\n✉️ Email: info@arcurepharma.com\n💬 WhatsApp: +92 334 116 9999",
        actions: QUICK_ACTIONS,
      };
    }
    if (text.match(/\b(discount|off|sale|deal|offer|promo)\b/)) {
      return {
        text: "🎉 We run special offers from time to time. Check the homepage banners for current deals. For bulk or pharmacy orders, message us on WhatsApp for the best price!",
        actions: QUICK_ACTIONS,
      };
    }
    if (text.match(/\b(generic|brand)\b/)) {
      return {
        text: `We stock a wide range of trusted medicated brands. For specific availability, try asking with the medicine name (e.g. "Paracetamol").`,
        actions: QUICK_ACTIONS,
      };
    }
    if (text.match(/\b(about|who|arcure|your company)\b/)) {
      return {
        text: "🏥 **Arcure Pharma** is your trusted online pharmacy based in Karachi. We deliver quality medicated products to your doorstep with care. Our website is built to make buying medicines online fast and easy.",
        actions: QUICK_ACTIONS,
      };
    }
    if (text.match(/\b(complaint|complain|report|issue|problem|grievance)\b/)) {
      return {
        text: "I'd be happy to log that for you. Let's file a complaint together.",
        actions: [{ label: "File a Complaint", value: "complaint" }],
      };
    }
    if (text.match(/\b(thank|thanks|shukriya)\b/)) {
      return {
        text: "You're welcome! 😊 Is there anything else I can help you with?",
        actions: QUICK_ACTIONS,
      };
    }
    if (text.match(/\b(bye|goodbye|khuda hafiz|alllahafiz)\b/)) {
      return {
        text: "Goodbye! Take care of your health. 🩺 If you need anything, I'm always here.",
        actions: QUICK_ACTIONS,
      };
    }
    const catMatch = categories.find((c) =>
      text.includes(c.toLowerCase().split(" ")[0])
    );
    if (catMatch) {
      const list = products.filter((p) => p.category === catMatch);
      return { text: formatProducts(list), actions: QUICK_ACTIONS };
    }
    const productMatch = products.filter(
      (p) =>
        p.title.toLowerCase().includes(text.trim()) ||
        text.includes(p.title.toLowerCase().split(" ")[0])
    );
    if (text.trim().length > 1 && productMatch.length) {
      return { text: formatProducts(productMatch), actions: QUICK_ACTIONS };
    }
    return {
      text: `I didn't quite catch that. 😅 Here are some things I can help with:`,
      actions: QUICK_ACTIONS,
    };
  };

  const replyKnowledge = (value: string) => {
    const res = handleIntent(value);
    botReply(res.text, res.actions);
  };

  const submitComplaint = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaint),
      });
      if (res.ok) {
        pushBot(
          "✅ Complaint submitted successfully!\n\nOne of our support team members will contact you within 24 hours.\n\nWhile you wait, is there anything else I can help with?",
          QUICK_ACTIONS
        );
      } else {
        const data = await res.json();
        pushBot(
          data.error
            ? `⚠️ ${data.error}`
            : "⚠️ Sorry, I couldn't submit the complaint. Please try again.",
          QUICK_ACTIONS
        );
        setStep("idle");
      }
    } catch {
      pushBot(
        "⚠️ Something went wrong while submitting. Please check your connection and try again.",
        QUICK_ACTIONS
      );
      setStep("idle");
    }
    setBusy(false);
  };

  const handleSend = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setInput("");

    if (step === "idle") {
      pushUser(text);
      replyKnowledge(text);
      return;
    }

    pushUser(text);

    if (step === "complaint_order") {
      setComplaint((c) => ({ ...c, orderId: text }));
      setStep("complaint_email");
      botReply(
        "Thanks! Please share the **email address** you used when placing this order. 📧"
      );
      return;
    }

    if (step === "complaint_email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(text)) {
        botReply(
          "That doesn't look like a valid email. Please enter a valid email address, e.g. you@example.com"
        );
        return;
      }
      setComplaint((c) => ({ ...c, email: text }));
      setStep("complaint_subject");
      botReply(
        "Got it! 👍 Now, please give a short **subject** for your complaint (e.g. \"Damaged product\", \"Late delivery\")."
      );
      return;
    }

    if (step === "complaint_subject") {
      setComplaint((c) => ({ ...c, subject: text }));
      setStep("complaint_message");
      botReply(
        "Perfect. Finally, please **describe your issue** in a few words. The more detail, the faster we can resolve it."
      );
      return;
    }

    if (step === "complaint_message") {
      setComplaint((c) => ({ ...c, message: text }));
      setStep("idle");
      submitComplaint();
      return;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend(input);
    }
  };

  const showActionsOnly = step === "idle";

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[350px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-teal-600 p-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <p className="font-semibold text-sm">Arcure Assistant</p>
              <p className="text-xs text-white/80">Online — knows the whole store</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
          >
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line rounded-2xl ${
                    msg.role === "bot"
                      ? "bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm self-start"
                      : "bg-teal-600 text-white rounded-tr-sm self-end"
                  }`}
                >
                  {renderText(msg.text)}
                </div>
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 self-start">
                    {msg.actions.map((a) => (
                      <button
                        key={a.value + a.label}
                        onClick={() => handleQuickAction(a.value)}
                        className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-200 hover:bg-teal-100 transition-colors"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="self-start bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm px-4 py-3 inline-flex gap-1">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 shrink-0">
            {showActionsOnly && (
              <div className="flex flex-wrap gap-2 mb-3">
                <QuickChip icon={<Info className="w-3 h-3" />} label="Products" on={QUICK_ACTIONS[0].value} fn={handleQuickAction} />
                <QuickChip icon={<ShoppingCart className="w-3 h-3" />} label="How to order" on={QUICK_ACTIONS[1].value} fn={handleQuickAction} />
                <QuickChip icon={<Package className="w-3 h-3" />} label="Delivery" on={QUICK_ACTIONS[2].value} fn={handleQuickAction} />
                <QuickChip icon={<MessageSquareWarning className="w-3 h-3" />} label="Complaint" on={QUICK_ACTIONS[3].value} fn={handleQuickAction} />
                <QuickChip icon={<HelpCircle className="w-3 h-3" />} label="Contact" on={QUICK_ACTIONS[4].value} fn={handleQuickAction} />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  step === "idle"
                    ? "Ask me anything..."
                    : step === "complaint_order"
                      ? "Enter your Order ID"
                      : step === "complaint_email"
                        ? "Enter your email"
                        : step === "complaint_subject"
                          ? "Enter complaint subject"
                          : "Describe your issue..."
                }
                className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={busy || !input.trim()}
                className="w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => {
          if (!open && messages.length === 0) {
            pushBot(
              "Salam! 👋 Welcome to Arcure Pharma — your trusted online pharmacy. I know the whole store, so feel free to ask me about our products, pricing, delivery, or how to order.",
              QUICK_ACTIONS
            );
          }
          setOpen(!open);
        }}
        className="relative w-14 h-14 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center shadow-xl shadow-teal-600/40 transition-all hover:scale-110 active:scale-95"
        aria-label="Chat assistant"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Bot className="w-7 h-7 text-white" />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
}

function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function QuickChip({
  icon,
  label,
  on,
  fn,
}: {
  icon: React.ReactNode;
  label: string;
  on: string;
  fn: (v: string) => void;
}) {
  return (
    <button
      onClick={() => fn(on)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-200 hover:bg-teal-100 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}