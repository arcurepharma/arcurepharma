"use client";

import { useState } from "react";
import { Download, Calendar, Filter, Search, DollarSign, TrendingUp } from "lucide-react";

interface SalesReport {
  date: string;
  orderId: string;
  customer: string;
  products: number;
  amount: number;
  status: string;
  paymentMethod: string;
}

export default function SalesReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  const salesData: SalesReport[] = [
    {
      date: "2026-09-11",
      orderId: "ORD-001",
      customer: "Ahmed Khan",
      products: 3,
      amount: 4500,
      status: "Delivered",
      paymentMethod: "COD",
    },
    {
      date: "2026-09-10",
      orderId: "ORD-002",
      customer: "Sara Ali",
      products: 2,
      amount: 3200,
      status: "Shipped",
      paymentMethod: "JazzCash",
    },
    {
      date: "2026-09-10",
      orderId: "ORD-003",
      customer: "Hassan Raza",
      products: 1,
      amount: 2999,
      status: "Processing",
      paymentMethod: "Card",
    },
    {
      date: "2026-09-09",
      orderId: "ORD-004",
      customer: "Fatima Noor",
      products: 4,
      amount: 5800,
      status: "Delivered",
      paymentMethod: "EasyPaisa",
    },
    {
      date: "2026-09-09",
      orderId: "ORD-005",
      customer: "Ali Imran",
      products: 2,
      amount: 3500,
      status: "Cancelled",
      paymentMethod: "COD",
    },
  ];

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Order ID",
      "Customer",
      "Products",
      "Amount",
      "Status",
      "Payment Method",
    ];

    const csvData = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          row.date,
          row.orderId,
          `"${row.customer}"`,
          row.products,
          row.amount,
          row.status,
          row.paymentMethod,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter data
  const filteredData = salesData.filter((item) => {
    const matchesSearch =
      item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const totalOrders = filteredData.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Delivered", label: "Delivered" },
    { value: "Shipped", label: "Shipped" },
    { value: "Processing", label: "Processing" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const statusColors: Record<string, string> = {
    Delivered: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
    Pending: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Reports</h1>
        <p className="text-gray-500">
          Detailed sales data with filtering and export options
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">
              Total Revenue
            </span>
            <DollarSign className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            Rs. {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">
              Total Orders
            </span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">
              Avg Order Value
            </span>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            Rs. {Math.round(avgOrderValue).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="grid md:grid-cols-5 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Order ID or Customer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Export Button */}
          <div className="flex items-end">
            <button
              onClick={exportToCSV}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all active:scale-95"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-teal-700">
                      {row.orderId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {row.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {row.products}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Rs. {row.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {row.paymentMethod}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        statusColors[row.status]
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
