import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminGate from "@/components/admin/AdminGate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AdminGate>
  );
}