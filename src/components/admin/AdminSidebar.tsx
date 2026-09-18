"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Tags,
  MessageSquareWarning,
  Star,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/sliders", label: "Sliders", icon: ImageIcon },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openComplaints, setOpenComplaints] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/complaints")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOpenComplaints(
            data.filter((c: { status: string }) => c.status === "Open").length
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside
      className={`bg-gray-900 text-white min-h-screen transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center gap-3 border-b border-gray-800">
        {collapsed ? (
          <Image
            src="/logo-arcure.png"
            alt="Arcure Pharma"
            width={90}
            height={45}
            className="h-11 w-auto object-contain mx-auto"
          />
        ) : (
          <Image
            src="/logo-arcure.png"
            alt="Arcure Pharma"
            width={170}
            height={45}
            className="h-11 w-auto object-contain"
          />
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                } ${collapsed ? "justify-center" : ""} ${
                  item.href === "/admin/complaints" ? "relative" : ""
                }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.href === "/admin/complaints" && openComplaints > 0 && (
                <span
                  className={`ml-auto inline-flex items-center justify-center min-w-5 min-h-5 px-1.5 text-[10px] font-bold bg-red-500 text-white rounded-full ${
                    collapsed ? "absolute top-1.5 right-1.5" : ""
                  }`}
                >
                  {openComplaints}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl text-sm transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
