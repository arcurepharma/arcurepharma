"use client";

import { useState } from "react";
import { FileText, Check, X, Eye, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";

interface Prescription {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  prescriptionUrl: string;
  productNames: string[];
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "1",
      customerName: "Ahmed Khan",
      customerEmail: "ahmed@email.com",
      customerPhone: "+92 300 1234567",
      prescriptionUrl: "/jenpharm/hero-desktop.jpg",
      productNames: ["ARCUDERM CS Serum", "Antibiotic Cream"],
      status: "Pending",
      submittedAt: "2026-09-11 10:30 AM",
    },
    {
      id: "2",
      customerName: "Sara Ali",
      customerEmail: "sara@email.com",
      customerPhone: "+92 321 9876543",
      prescriptionUrl: "/jenpharm/quiz-banner.jpg",
      productNames: ["Vitamin D3 Supplement"],
      status: "Approved",
      submittedAt: "2026-09-10 03:15 PM",
      reviewedAt: "2026-09-10 04:00 PM",
      reviewedBy: "Dr. Hassan",
      reviewNotes: "Prescription verified. Approved for purchase.",
    },
  ]);

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const handleReview = (prescriptionId: string, status: "Approved" | "Rejected") => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === prescriptionId
          ? {
              ...p,
              status,
              reviewedAt: new Date().toLocaleString(),
              reviewedBy: "Admin",
              reviewNotes: reviewNotes || `Prescription ${status.toLowerCase()}`,
            }
          : p
      )
    );
    setSelectedPrescription(null);
    setReviewNotes("");
  };

  const pendingCount = prescriptions.filter((p) => p.status === "Pending").length;
  const approvedCount = prescriptions.filter((p) => p.status === "Approved").length;
  const rejectedCount = prescriptions.filter((p) => p.status === "Rejected").length;

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Prescription Verification
        </h1>
        <p className="text-gray-500">
          Review and verify customer prescriptions for prescription-required products
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Pending Review</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Approved</span>
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{approvedCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Rejected</span>
            <X className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{rejectedCount}</p>
        </div>
      </div>

      {/* Alert for pending */}
      {pendingCount > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {pendingCount} Prescription{pendingCount !== 1 ? "s" : ""} Awaiting Review
              </h3>
              <p className="text-sm text-gray-700">
                Please review pending prescriptions to enable customers to complete their purchases.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prescriptions Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {prescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {prescription.customerName}
                      </p>
                      <p className="text-xs text-gray-500">{prescription.customerEmail}</p>
                      <p className="text-xs text-gray-500">{prescription.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {prescription.productNames.map((name, i) => (
                        <p key={i} className="text-sm text-gray-700">
                          • {name}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {prescription.submittedAt}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        statusColors[prescription.status]
                      }`}
                    >
                      {prescription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedPrescription(prescription)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            onClick={() => setSelectedPrescription(null)}
          />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">
                Review Prescription
              </h3>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <p className="text-gray-900">{selectedPrescription.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedPrescription.customerEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900">{selectedPrescription.customerPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Submitted
                  </label>
                  <p className="text-gray-900">{selectedPrescription.submittedAt}</p>
                </div>
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requested Products
                </label>
                <div className="space-y-2">
                  {selectedPrescription.productNames.map((name, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescription Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prescription Image
                </label>
                <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-300">
                  <Image
                    src={selectedPrescription.prescriptionUrl}
                    alt="Prescription"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Review Notes */}
              {selectedPrescription.status === "Pending" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Review Notes (Optional)
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes about this prescription..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>
              )}

              {/* Previous Review Info */}
              {selectedPrescription.status !== "Pending" && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Review Details</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`font-semibold ${
                          selectedPrescription.status === "Approved"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {selectedPrescription.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Reviewed By:</span>{" "}
                      {selectedPrescription.reviewedBy}
                    </p>
                    <p>
                      <span className="font-medium">Reviewed At:</span>{" "}
                      {selectedPrescription.reviewedAt}
                    </p>
                    {selectedPrescription.reviewNotes && (
                      <p>
                        <span className="font-medium">Notes:</span>{" "}
                        {selectedPrescription.reviewNotes}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedPrescription.status === "Pending" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleReview(selectedPrescription.id, "Rejected")}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleReview(selectedPrescription.id, "Approved")}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all"
                  >
                    <Check className="w-5 h-5" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
