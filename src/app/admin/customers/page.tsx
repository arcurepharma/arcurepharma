"use client";

import { useState } from "react";
import { Search, Users, Mail, Phone, ShoppingBag, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: "Active" | "Inactive";
  joinedDate: string;
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock customer data
  const customers: Customer[] = [
    {
      id: "1",
      name: "Ahmed Khan",
      email: "ahmed.khan@email.com",
      phone: "+92 300 1234567",
      totalOrders: 12,
      totalSpent: 45000,
      lastOrder: "2026-09-10",
      status: "Active",
      joinedDate: "2026-01-15",
    },
    {
      id: "2",
      name: "Sara Ali",
      email: "sara.ali@email.com",
      phone: "+92 321 9876543",
      totalOrders: 8,
      totalSpent: 28000,
      lastOrder: "2026-09-08",
      status: "Active",
      joinedDate: "2026-03-20",
    },
    {
      id: "3",
      name: "Hassan Raza",
      email: "hassan.raza@email.com",
      phone: "+92 333 5551234",
      totalOrders: 5,
      totalSpent: 15000,
      lastOrder: "2026-08-25",
      status: "Inactive",
      joinedDate: "2026-05-10",
    },
    {
      id: "4",
      name: "Fatima Noor",
      email: "fatima.noor@email.com",
      phone: "+92 345 7778888",
      totalOrders: 15,
      totalSpent: 62000,
      lastOrder: "2026-09-11",
      status: "Active",
      joinedDate: "2025-12-05",
    },
  ];

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "Active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Management
        </h1>
        <p className="text-gray-500">
          View and manage your customer relationships
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">
              Total Customers
            </span>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
          <p className="text-sm text-green-600 mt-2">
            {activeCustomers} active
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">
              Total Revenue
            </span>
            <ShoppingBag className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            Rs. {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">
              Avg Order Value
            </span>
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            Rs. {Math.round(totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0)).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {customer.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Since {new Date(customer.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-teal-700">
                    Rs. {customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(customer.lastOrder).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={`mailto:${customer.email}`}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Details
            </h3>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <p className="text-gray-900">{selectedCustomer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedCustomer.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedCustomer.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedCustomer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <p className="text-gray-900">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Orders
                  </label>
                  <p className="text-gray-900 text-2xl font-bold">
                    {selectedCustomer.totalOrders}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Spent
                  </label>
                  <p className="text-teal-700 text-2xl font-bold">
                    Rs. {selectedCustomer.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Order
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedCustomer.lastOrder).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Since
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedCustomer.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Close
                </button>
                <Link
                  href={`/admin/orders?customer=${selectedCustomer.id}`}
                  className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all text-center"
                >
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
