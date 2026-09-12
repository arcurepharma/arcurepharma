"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    productsChange: 0,
  });
  const [dateRange, setDateRange] = useState("7days");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    setTimeout(() => {
      setStats({
        totalRevenue: 1250000,
        totalOrders: 348,
        totalCustomers: 1247,
        totalProducts: 24,
        revenueChange: 12.5,
        ordersChange: 8.2,
        customersChange: 15.3,
        productsChange: 4.0,
      });
      setLoading(false);
    }, 1000);
  }, [dateRange]);

  // Revenue trend data
  const revenueData = [
    { date: "Mon", revenue: 45000, orders: 12 },
    { date: "Tue", revenue: 52000, orders: 15 },
    { date: "Wed", revenue: 48000, orders: 14 },
    { date: "Thu", revenue: 61000, orders: 18 },
    { date: "Fri", revenue: 55000, orders: 16 },
    { date: "Sat", revenue: 73000, orders: 21 },
    { date: "Sun", revenue: 68000, orders: 19 },
  ];

  // Category distribution
  const categoryData = [
    { name: "Skincare", value: 45, color: "#0d9488" },
    { name: "Supplements", value: 30, color: "#3b82f6" },
    { name: "Vitamins", value: 15, color: "#f59e0b" },
    { name: "Others", value: 10, color: "#8b5cf6" },
  ];

  // Top products
  const topProducts = [
    { name: "ARCUDERM CS Serum", sales: 89, revenue: 267000 },
    { name: "ARCU-CAL K2", sales: 76, revenue: 152000 },
    { name: "ARCU GLEAM Face Wash", sales: 68, revenue: 136000 },
    { name: "Mida-D Vitamin D3", sales: 54, revenue: 108000 },
  ];

  const statCards = [
    {
      title: "Total Revenue",
      value: `Rs. ${(stats.totalRevenue / 1000).toFixed(0)}K`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: "teal",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      change: stats.customersChange,
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      change: stats.productsChange,
      icon: Package,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 mt-4">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-500">
            Overview of your store performance and metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isPositive
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUp className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Revenue Trend
              </h3>
              <p className="text-sm text-gray-500">Daily revenue over time</p>
            </div>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ fill: "#0d9488", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Category Sales
              </h3>
              <p className="text-sm text-gray-500">Distribution by category</p>
            </div>
            <Eye className="w-5 h-5 text-teal-600" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-gray-700">{cat.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Orders Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Top Selling Products
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.sales} units sold
                    </p>
                  </div>
                </div>
                <p className="font-bold text-teal-700">
                  Rs. {(product.revenue / 1000).toFixed(0)}K
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Orders Overview
              </h3>
              <p className="text-sm text-gray-500">Daily orders</p>
            </div>
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
