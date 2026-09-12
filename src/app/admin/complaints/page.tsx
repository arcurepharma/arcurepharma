"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronDown, MessageSquareWarning } from "lucide-react";
import toast from "react-hot-toast";

interface Complaint {
  id: string;
  name: string;
  email: string;
  orderId: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/complaints")
      .then((r) => r.json())
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
        toast.success(`Complaint marked as "${status}"`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this complaint permanently?")) return;
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
      if (res.ok) {
        setComplaints((prev) => prev.filter((c) => c.id !== id));
        toast.success("Complaint deleted");
      }
    } catch {
      toast.error("Failed to delete complaint");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openCount = complaints.filter((c) => c.status === "Open").length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-500 text-sm mt-1">
            Complaints &amp; reports submitted from the chat assistant
          </p>
        </div>
        {openCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {openCount} open
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <MessageSquareWarning className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No complaints yet. Customers can submit them via the chat assistant.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Order ID
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Message
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 align-top">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="font-medium">
                        {complaint.name || "Anonymous"}
                      </div>
                      <div className="text-xs text-gray-400">{complaint.email}</div>
                      {complaint.subject && (
                        <div className="text-xs text-teal-600 mt-1 font-medium">
                          {complaint.subject}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {complaint.orderId || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      {complaint.message}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            handleStatusChange(complaint.id, e.target.value)
                          }
                          className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusStyle(
                            complaint.status
                          )}`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(complaint.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(complaint.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}