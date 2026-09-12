"use client";

import { useSyncExternalStore, useState } from "react";
import { Lock, LogIn } from "lucide-react";

const STORAGE_KEY = "arcure_admin_session";

const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((l) => l());
};

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

const getSession = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "yes";
  } catch {
    return false;
  }
};

const getServerSession = () => false;

export default function AdminGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = useSyncExternalStore(subscribe, getSession, getServerSession);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        try {
          sessionStorage.setItem(STORAGE_KEY, "yes");
        } catch {
          // ignore storage errors
        }
        notify();
      } else {
        setError("Wrong password. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 text-center mb-1">
              Admin Access
            </h1>
            <p className="text-gray-500 text-sm text-center mb-6">
              Enter the admin password to continue
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !password}
                className="flex items-center justify-center gap-2 w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "Checking..." : "Unlock Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}