"use client";
import { useState } from "react";
import Link from "next/link";
import { DollarSign, Users, Clock, Home, List, Utensils, FileText, Settings } from "lucide-react";

export default function HomeDashboard() {
  const adminName = "Admin Name";

  const [stats] = useState({
    liveOrders: 5,
    avgPrep: 12,
    revenue: 1250,
    newCustomers: 15,
  });

  return (
    <main className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-500 text-white flex flex-col rounded-r-2xl shadow-lg">
        <div className="p-6 text-center border-b border-blue-400">
          <div className="text-3xl font-bold tracking-tight">ServeAI</div>
          <p className="text-xs opacity-80 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-3">
          <SidebarItem icon={<Home size={18} />} text="Dashboard" active />
          <SidebarItem icon={<List size={18} />} text="Dashboards" />
          <SidebarItem icon={<Utensils size={18} />} text="Menu Management" />
          <SidebarItem icon={<Users size={18} />} text="Customers" />
          <SidebarItem icon={<FileText size={18} />} text="Reports" />
          <SidebarItem icon={<Settings size={18} />} text="Settings" />
        </nav>

        <p className="text-xs text-center opacity-70 pb-4">Powered by ServeAI</p>
      </aside>

      {/* Main content */}
      <section className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-1">
          Welcome, <span className="text-blue-700">{adminName}</span>!
        </h1>
        <p className="text-gray-600 mb-8">Restaurant Management Hub</p>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={<Clock className="text-orange-500" size={22} />}
            title="Live Orders"
            value={`${stats.liveOrders} Active`}
            subtitle={`Avg. Prep: ${stats.avgPrep} min`}
            color="orange"
          />
          <StatCard
            icon={<DollarSign className="text-green-600" size={22} />}
            title="Today's Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            subtitle={`Avg. Prep Time: ${stats.avgPrep} min`}
            color="green"
          />
          <StatCard
            icon={<Users className="text-blue-600" size={22} />}
            title="New Customers"
            value={stats.newCustomers}
            subtitle="Today"
            color="blue"
          />
        </div>

        {/* Quick actions */}
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow">
            + Add New Item
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold shadow">
            View Reports
          </button>
        </div>
      </section>
    </main>
  );
}

function SidebarItem({ icon, text, active = false }: { icon: any; text: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
        active
          ? "bg-white text-blue-700 font-semibold"
          : "hover:bg-blue-600 hover:bg-opacity-50"
      }`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
