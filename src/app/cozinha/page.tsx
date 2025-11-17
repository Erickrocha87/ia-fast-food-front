"use client";

import { useEffect, useState } from "react";

export default function CozinhaPage() {
  const [activeTab, setActiveTab] = useState("pendentes");

  const [pendentes, setPendentes] = useState([]);
  const [concluidos, setConcluidos] = useState([]);

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
    await fetch(`http://localhost:1337/orders/kitchen/${id}/complete`, {
      method: "PATCH",
    });

    carregarPendentes();
    carregarConcluidos();
  }

  useEffect(() => {
    carregarPendentes();
    carregarConcluidos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f8ff] to-[#eef0ff] p-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Pedidos na Cozinha
      </h1>
      <p className="text-gray-500 mb-8">
        Acompanhe o preparo dos pedidos em tempo real
      </p>

      {/* ABAS */}
      <div className="flex items-center gap-4 mb-10">
        {[
          { key: "pendentes", label: "Pendentes" },
          { key: "concluidos", label: "Concluídos" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`px-6 py-2 rounded-full text-sm font-semibold shadow transition-all
              ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LISTAS */}
      {activeTab === "pendentes" && (
        <ListaPedidos
          pedidos={pendentes}
          onComplete={marcarComoPronto}
          emptyMessage="Nenhum pedido pendente no momento"
        />
      )}

      {activeTab === "concluidos" && (
        <ListaPedidos
          pedidos={concluidos}
          completed
          emptyMessage="Nenhum pedido concluído ainda"
        />
      )}
    </div>
  );
}

/* ====================== COMPONENTE DE LISTAGEM ======================== */

function ListaPedidos({ pedidos, completed = false, emptyMessage, onComplete }) {
  return (
    <div>
      {pedidos.length === 0 && (
        <p className="text-center text-gray-500 mt-20">{emptyMessage}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pedidos.map((order) => {
          // 🧮 Calcula o total SOMANDO os itens
          const total = order.orderItems.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          );

          return (
            <div
              key={order.id}
              className="bg-white border border-purple-200 shadow-md rounded-3xl p-6 hover:shadow-lg transition"
            >
              {/* HEADER DO CARD */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Pedido #{order.id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Mesa:{" "}
                    <span className="font-semibold">{order.tableNumber}</span>
                  </p>
                </div>

                {!completed && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    Pendente
                  </span>
                )}

                {completed && (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Concluído
                  </span>
                )}
              </div>

              {/* TOTAL DO PEDIDO */}
              <p className="text-lg font-semibold text-purple-600 mb-4">
                Total: R$ {total.toFixed(2)}
              </p>

              {/* ITENS */}
              <ul className="space-y-2 mb-6">
                {order.orderItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between text-gray-700"
                  >
                    <span>
                      {item.quantity}x {item.menuItem?.name}
                    </span>
                    <span className="font-semibold">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* BOTÃO */}
              {!completed && (
                <button
                  onClick={() => onComplete(order.id)}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow hover:opacity-90 transition"
                >
                  Marcar como pronto
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
