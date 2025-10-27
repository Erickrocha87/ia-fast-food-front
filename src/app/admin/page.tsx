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
        Bem-vindo, <span className="text-blue-700">Variável de nome</span>!
      </h1>
      <p className="text-gray-600 mb-8">Desempenho do Restaurante</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Clock className="text-orange-500" size={22} />}
          title="Ordens Ativas"
          value={`${stats.liveOrders} Active`}
          subtitle={`Tempo médio de preparo: ${stats.avgPrep} min`}
        />
        <StatCard
          icon={<DollarSign className="text-green-600" size={22} />}
          title="Lucro de Hoje"
          value={`$${stats.revenue.toLocaleString()}`}
          subtitle="Lucro médio por pedido: R$ 7,50"
        />
        <StatCard
          icon={<Users className="text-blue-600" size={22} />}
          title="Novos Clientes"
          value={stats.newCustomers}
          subtitle="Hoje"
        />
      </div>

    </section>
  );
}
