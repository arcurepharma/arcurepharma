"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  // Initialize session
  useEffect(() => {
    const storedSession = localStorage.getItem("whatsapp_session");
    if (storedSession) {
      setSessionId(storedSession);
      loadChatHistory(storedSession);
    } else {
      const newSession = uuidv4();
      setSessionId(newSession);
      localStorage.setItem("whatsapp_session", newSession);
      loadInitialMessage();
    }
  }, []);

  const loadInitialMessage = () => {
    const greeting: Message = {
      role: "bot",
      content: `👋 Welcome to Arcure Pharma Support!

I'm here to help you with:
1️⃣ Product Information
2️⃣ Order Tracking
3️⃣ Payment Options
4️⃣ General Questions

How can I assist you today?`,
      timestamp: new Date().toISOString(),
    };
    setMessages([greeting]);
  };

  const loadChatHistory = async (id: string) => {
    try {
      const response = await fetch(`/api/whatsapp/chat?sessionId=${id}`);
      const data = await response.json();
      if (data.messages.length > 0) {
        setMessages(data.messages);
        setUserPhone(data.sessionInfo?.userPhone || "");
      } else {
        loadInitialMessage();
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      loadInitialMessage();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    // Add user message
    const userMsg: Message = {
      role: "user",
      content: userInput,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/whatsapp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userMessage: userInput,
          userName: localStorage.getItem("user_name") || "Guest",
          userEmail: localStorage.getItem("user_email") || "",
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMsg: Message = {
          role: "bot",
          content: data.response,
          timestamp: data.timestamp,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShiftToWhatsApp = async () => {
    if (!userPhone) {
      setShowPhoneInput(true);
      return;
    }

    try {
      // Send conversation link via WhatsApp
      const message = `Hi! I'm from Arcure Pharma Support. Your chat session ID is: ${sessionId}. Continue your conversation with us via WhatsApp. Type 'help' for options.`;

      await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: userPhone,
          message,
          sessionId,
        }),
      });

      // Mark conversation as transferred
      await fetch("/api/whatsapp/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          action: "shiftToWhatsApp",
        }),
      });

      alert("✅ Conversation shifted to WhatsApp!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error shifting to WhatsApp:", error);
      alert("Failed to shift to WhatsApp. Please try again.");
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userPhone) {
      handleShiftToWhatsApp();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-pulse min-h-[56px] min-w-[56px]"
        aria-label="Open WhatsApp Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-8 sm:h-8" />
        ) : (
          <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up max-h-[75vh] sm:max-h-96">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-3 sm:px-6 py-3 sm:py-4 flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg truncate">Arcure Pharma Support</h3>
                <p className="text-teal-100 text-xs sm:text-sm">Usually replies instantly</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors flex-shrink-0 min-h-[44px] min-w-[44px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
                    msg.role === "user"
                      ? "bg-teal-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === "user"
                        ? "text-teal-100"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg rounded-bl-none border border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Phone Input Section */}
          {showPhoneInput && (
            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border-t border-blue-200 flex-shrink-0">
              <form onSubmit={handlePhoneSubmit} className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                  Enter your WhatsApp number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="03001234567"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[44px]"
                  />
                  <button
                    type="submit"
                    disabled={!userPhone}
                    className="px-3 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors min-h-[44px] min-w-[44px]"
                  >
                    OK
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 sm:p-4 bg-white flex-shrink-0 space-y-2">
            <div className="flex gap-2 flex-col sm:flex-row">
              <button
                onClick={handleShiftToWhatsApp}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors min-h-[44px] flex-1"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={() => setShowPhoneInput(!showPhoneInput)}
                className="flex-1 px-3 sm:px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold text-xs sm:text-sm transition-colors min-h-[44px]"
              >
                {showPhoneInput ? "Cancel" : "Phone"}
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Message..."
                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[44px]"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !userInput.trim()}
                className="px-3 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
