"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Utensils, Users, FileText, Settings } from "lucide-react";

export function SidebarAdmin() {
  const pathname = usePathname();

  const items = [
    { name: "Dashboard", href: "/admin", icon: <Home size={18} /> },
    { name: "Dashboards", href: "/admin/dashboards", icon: <List size={18} /> },
    { name: "Menu Management", href: "/admin/menu-management", icon: <Utensils size={18} /> },
    { name: "Customers", href: "/admin/customers", icon: <Users size={18} /> },
    { name: "Reports", href: "/admin/reports", icon: <FileText size={18} /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-500 text-white flex flex-col rounded-r-2xl shadow-lg">
      <div className="p-6 text-center border-b border-blue-400">
        <div className="text-3xl font-bold tracking-tight">ServeAI</div>
        <p className="text-xs opacity-80 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-3">
        {items.map((item) => (
          <Link href={item.href} key={item.name}>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                pathname === item.href
                  ? "bg-white text-blue-700 font-semibold"
                  : "hover:bg-blue-600 hover:bg-opacity-50"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>

      <p className="text-xs text-center opacity-70 pb-4">Powered by ServeAI</p>
    </aside>
  );
}
