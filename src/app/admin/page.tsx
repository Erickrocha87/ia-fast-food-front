"use client";
import { DollarSign, Users, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function AdminDashboard() {
  const stats = {
    liveOrders: 5,
    avgPrep: 12,
    revenue: 1250,
    newCustomers: 15,
  };

  return (
    <section>
      <h1 className="text-3xl font-bold mb-1">
        Bem-vindo, <span className="text-blue-700">Admin Name</span>!
      </h1>
      <p className="text-gray-600 mb-8">Desempenho do Restaurante</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Clock className="text-orange-500" size={22} />}
          title="Live Orders"
          value={`${stats.liveOrders} Active`}
          subtitle={`Avg. Prep: ${stats.avgPrep} min`}
        />
        <StatCard
          icon={<DollarSign className="text-green-600" size={22} />}
          title="Today's Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          subtitle="Avg. Prep Time: 12 min"
        />
        <StatCard
          icon={<Users className="text-blue-600" size={22} />}
          title="New Customers"
          value={stats.newCustomers}
          subtitle="Today"
        />
      </div>

      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow">
          + Adicionar novo item
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold shadow">
          Ver relatórios
        </button>
      </div>
    </section>
  );
}
