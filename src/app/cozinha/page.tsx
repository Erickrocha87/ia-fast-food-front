"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function CozinhaPage() {
  const [activeTab, setActiveTab] = useState<"pendentes" | "concluidos">(
    "pendentes"
  );

   const { isReady } = useAuthGuard();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendentes, setPendentes] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [concluidos, setConcluidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregarPendentes() {
    const res = await fetch("http://localhost:1337/orders/kitchen");
    const data = await res.json();
    setPendentes(data);
  }

  async function carregarConcluidos() {
    const res = await fetch("http://localhost:1337/orders/kitchen/completed");
    const data = await res.json();
    setConcluidos(data);
  }

  async function marcarComoPronto(id: number) {
    setLoading(true);
    await fetch(`http://localhost:1337/orders/kitchen/${id}/complete`, {
      method: "PATCH",
    });
    await Promise.all([carregarPendentes(), carregarConcluidos()]);
    setLoading(false);
  }

  useEffect(() => {
    carregarPendentes();
    carregarConcluidos();
  }, []);

  const pedidosExibidos =
    activeTab === "pendentes" ? pendentes : concluidos;

    if (!isReady) {
      return null;
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8ff] via-[#f1f3ff] to-[#e4e7ff] px-6 lg:px-10 xl:px-20 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#7b4fff] mb-1">
              Painel da cozinha
            </p>
            <h1 className="text-3xl font-bold text-gray-800">
              Pedidos em preparo
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Visualize rapidamente os pedidos e marque como prontos assim que saírem.
            </p>
          </div>

          <div className="flex gap-3 text-xs">
            <InfoPill
              label="Pedidos pendentes"
              value={pendentes.length}
              color="from-[#f97316]/10 to-[#fb923c]/20 text-[#c05621]"
            />
            <InfoPill
              label="Pedidos concluídos hoje"
              value={concluidos.length}
              color="from-[#22c55e]/10 to-[#4ade80]/20 text-[#15803d]"
            />
          </div>
        </div>
      </header>

      <div className="flex items-center gap-4 mb-6 border-b border-[#e0e3ff] pb-3">
        {[
          { key: "pendentes", label: "Pendentes" },
          { key: "concluidos", label: "Concluídos" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`relative px-3 pb-2 text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? "text-[#4b38ff]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() =>
              setActiveTab(tab.key as "pendentes" | "concluidos")
            }
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute left-0 right-0 -bottom-[11px] mx-auto h-0.5 w-10 rounded-full bg-gradient-to-r from-[#7b4fff] to-[#3b82f6]" />
            )}
          </button>
        ))}
      </div>

      <ListaPedidos
        pedidos={pedidosExibidos}
        completed={activeTab === "concluidos"}
        emptyMessage={
          activeTab === "pendentes"
            ? "Nenhum pedido pendente no momento."
            : "Nenhum pedido concluído ainda."
        }
        onComplete={marcarComoPronto}
        loading={loading}
      />
    </div>
  );
}

function ListaPedidos({
  pedidos,
  completed = false,
  emptyMessage,
  onComplete,
  loading,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pedidos: any[];
  completed?: boolean;
  emptyMessage: string;
  onComplete?: (id: number) => void;
  loading?: boolean;
}) {
  if (!pedidos || pedidos.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 border border-[#e0e3ff] shadow-[0_18px_60px_rgba(80,60,220,0.06)] rounded-3xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[#e7e8ff] flex justify-between items-center bg-gradient-to-r from-[#f7f5ff] to-[#eef4ff]">
        <span className="text-xs font-semibold text-[#6b46ff] uppercase tracking-wide">
          {completed ? "Pedidos concluídos" : "Pedidos pendentes na cozinha"}
        </span>
        {loading && (
          <span className="text-[11px] text-gray-500">
            Atualizando pedidos...
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-white">
            <tr className="border-b border-[#ececff] text-xs text-gray-500">
              <th className="text-left px-5 py-3 font-medium">Pedido</th>
              <th className="text-left px-5 py-3 font-medium">Mesa</th>
              <th className="text-left px-5 py-3 font-medium">Itens</th>
              <th className="text-right px-5 py-3 font-medium">Total</th>
              <th className="text-center px-5 py-3 font-medium">Status</th>
              {!completed && (
                <th className="text-right px-5 py-3 font-medium">Ação</th>
              )}
            </tr>
          </thead>

          <tbody>
            {pedidos.map((order) => {
              const total = order.orderItems?.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
              );

              const itensLabel =
                order.orderItems
                  ?.map(
                    (item) =>
                      `${item.quantity}x ${
                        item.menuItem?.name ?? "Item sem nome"
                      }`
                  )
                  .join(" · ") ?? "-";

              return (
                <tr
                  key={order.id}
                  className="border-t border-[#f1f2ff] hover:bg-[#f8f7ff]/60 transition"
                >
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="font-semibold text-gray-800">
                      #{order.id}
                    </span>
                  </td>

                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#eef2ff] text-[#4c51bf] text-xs font-medium">
                      Mesa {order.tableNumber ?? "-"}
                    </span>
                  </td>

                  <td className="px-5 py-3 max-w-[360px]">
                    <p className="text-xs text-gray-700 truncate">{itensLabel}</p>
                  </td>

                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <span className="font-semibold text-[#6b46ff]">
                      R$ {total?.toFixed(2) ?? "0,00"}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-center">
                    {completed ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#dcfce7] text-[#15803d] text-[11px] font-semibold">
                        Concluído
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#fef3c7] text-[#92400e] text-[11px] font-semibold">
                        Pendente
                      </span>
                    )}
                  </td>

                  {!completed && (
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => onComplete && onComplete(order.id)}
                        disabled={loading}
                        className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] shadow-md hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition"
                      >
                        Marcar como pronto
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`px-3 py-2 rounded-2xl bg-gradient-to-r ${color} flex flex-col justify-center`}
    >
      <span className="text-[10px] uppercase tracking-wide font-semibold opacity-80">
        {label}
      </span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
