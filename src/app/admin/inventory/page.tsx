"use client";

import { useState } from "react";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Edit,
  Plus,
  Search,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  category: string;
  stockQuantity: number;
  lowStockThreshold: number;
  imageUrl: string;
  price: number;
  lastRestocked: string;
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(
    null
  );

  // Mock inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      productName: "ARCUDERM CS Serum",
      sku: "ACS-001",
      category: "Skincare",
      stockQuantity: 45,
      lowStockThreshold: 20,
      imageUrl: "/jenpharm/hero-desktop.jpg",
      price: 2999,
      lastRestocked: "2026-09-01",
    },
    {
      id: "2",
      productName: "ARCU-CAL K2",
      sku: "ACK-002",
      category: "Supplements",
      stockQuantity: 8,
      lowStockThreshold: 15,
      imageUrl: "/jenpharm/quiz-banner.jpg",
      price: 1999,
      lastRestocked: "2026-08-28",
    },
    {
      id: "3",
      productName: "ARCU GLEAM Face Wash",
      sku: "AGF-003",
      category: "Skincare",
      stockQuantity: 32,
      lowStockThreshold: 10,
      imageUrl: "/jenpharm/newsletter.jpg",
      price: 1499,
      lastRestocked: "2026-09-05",
    },
    {
      id: "4",
      productName: "Mida-D Vitamin D3",
      sku: "MDV-004",
      category: "Vitamins",
      stockQuantity: 3,
      lowStockThreshold: 10,
      imageUrl: "/jenpharm/hero-desktop.jpg",
      price: 1799,
      lastRestocked: "2026-08-20",
    },
  ]);

  const filteredInventory = inventory.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = inventory.filter(
    (item) => item.stockQuantity <= item.lowStockThreshold
  );

  const handleUpdateStock = (item: InventoryItem) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  const handleBulkUpdate = (productId: string, newQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, stockQuantity: newQuantity, lastRestocked: new Date().toISOString().split("T")[0] }
          : item
      )
    );
    setShowModal(false);
    setSelectedProduct(null);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.stockQuantity === 0) {
      return { label: "Out of Stock", color: "text-red-600 bg-red-100" };
    } else if (item.stockQuantity <= item.lowStockThreshold) {
      return { label: "Low Stock", color: "text-orange-600 bg-orange-100" };
    } else {
      return { label: "In Stock", color: "text-green-600 bg-green-100" };
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inventory Management
        </h1>
        <p className="text-gray-500">
          Monitor and manage your product stock levels
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">
              Total Products
            </span>
            <Package className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">
              Low Stock Alerts
            </span>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {lowStockItems.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">
              Out of Stock
            </span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {inventory.filter((i) => i.stockQuantity === 0).length}
          </p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Low Stock Warning
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                {lowStockItems.length} product{lowStockItems.length !== 1 ? "s" : ""} need restocking
              </p>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-300 text-orange-700 text-xs font-semibold rounded-lg"
                  >
                    {item.productName} ({item.stockQuantity} left)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Last Restocked
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Rs. {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">
                        {item.stockQuantity}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        / {item.lowStockThreshold}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(item.lastRestocked).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleUpdateStock(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Stock Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Update Stock Level
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {selectedProduct.productName}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newQuantity = parseInt(formData.get("quantity") as string);
                handleBulkUpdate(selectedProduct.id, newQuantity);
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Stock Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="0"
                  defaultValue={selectedProduct.stockQuantity}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
