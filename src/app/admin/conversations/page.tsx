"use client";

import { useEffect, useState } from "react";
import { Phone, MessageSquare, User, Mail, Clock, Send } from "lucide-react";
import Link from "next/link";

interface Conversation {
  id: string;
  sessionId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  messageCount: number;
  status: string;
  conversationType: string;
  shiftedToWhatsApp: number;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [filter, setFilter] = useState("Active");

  useEffect(() => {
    loadConversations();
  }, [filter]);

  const loadConversations = async () => {
    try {
      const response = await fetch(`/api/whatsapp/conversations?status=${filter}`);
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/whatsapp/chat?sessionId=${sessionId}`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
        setSelectedSession(sessionId);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedSession) return;

    try {
      const conv = conversations.find((c) => c.sessionId === selectedSession);
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: conv?.userPhone,
          message: replyMessage,
          sessionId: selectedSession,
        }),
      });

      if (response.ok) {
        setReplyMessage("");
        loadMessages(selectedSession);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send message");
    }
  };

  const handleShiftToWhatsApp = async (sessionId: string) => {
    try {
      const response = await fetch("/api/whatsapp/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          action: "shiftToWhatsApp",
        }),
      });

      if (response.ok) {
        alert("✅ Conversation shifted to WhatsApp");
        loadConversations();
      }
    } catch (error) {
      console.error("Error shifting to WhatsApp:", error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">WhatsApp Conversations</h1>
        <p className="text-gray-600">View and manage customer chat sessions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {["Active", "Completed", "Transferred", "all"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === status
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="col-span-1 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
            <h2 className="font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversations ({conversations.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadMessages(conv.sessionId)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                    selectedSession === conv.sessionId
                      ? "border-l-teal-600 bg-teal-50"
                      : "border-l-transparent"
                  }`}
                >
                  <p className="font-semibold text-gray-900 truncate">
                    {conv.userName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {conv.messageCount} msgs
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      conv.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {conv.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages View */}
        <div className="col-span-2 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
          {selectedSession ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">
                      {conversations.find((c) => c.sessionId === selectedSession)
                        ?.userName}
                    </h3>
                    <p className="text-sm text-teal-100">
                      {conversations.find((c) => c.sessionId === selectedSession)
                        ?.userEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {conversations.find((c) => c.sessionId === selectedSession)
                        ?.userPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-72">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-teal-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.role === "user"
                            ? "text-teal-100"
                            : "text-gray-400"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="p-4 border-t border-gray-200 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleShiftToWhatsApp(
                        conversations.find((c) => c.sessionId === selectedSession)
                          ?.sessionId || ""
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Shift to WhatsApp
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendReply();
                    }}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
