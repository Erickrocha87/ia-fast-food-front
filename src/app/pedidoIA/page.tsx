"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import ServeAIMicrophone from "@/components/ServeAiMicrophone";
import { eventBus } from "@/lib/eventBus";
import Link from "next/link";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function PedidoIA() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [itensMenu, setItensMenu] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [itensCarrinho, setItensCarrinho] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const { isReady } = useAuthGuard();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:1337/menu", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();
        setItensMenu(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const add = (itemIA: any) => {
      const menuItem = itensMenu.find((m) => m.id === itemIA.id);
      if (!menuItem) return;
      
      const quantidade =
        typeof itemIA.quantity === "number"
          ? itemIA.quantity
          : typeof itemIA.quantidade === "number"
          ? itemIA.quantidade
          : 1;

      adicionarCarrinho({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantidade,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remove = (itemIA: any) => {
      const quantidade =
        typeof itemIA.quantity === "number"
          ? itemIA.quantity
          : typeof itemIA.quantidade === "number"
          ? itemIA.quantidade
          : 1;

      removerQuantidade(itemIA.id, quantidade);
    };

    const clear = () => setItensCarrinho([]);

    eventBus.on("pedido:add", add);
    eventBus.on("pedido:remove", remove);
    eventBus.on("pedido:clear", clear);

    return () => {
      eventBus.off("pedido:add", add);
      eventBus.off("pedido:remove", remove);
      eventBus.off("pedido:clear", clear);
    };
  }, [itensMenu]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function adicionarCarrinho(item: any) {
    setItensCarrinho((prev) => {
      const existe = prev.find((i) => i.id === item.id);

      if (existe) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantidade: i.quantidade + item.quantidade }
            : i
        );
      }

      return [...prev, item];
    });
  }

  function removerQuantidade(id: number, qtd = 1) {
    setItensCarrinho((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantidade: i.quantidade - qtd } : i
        )
        .filter((i) => i.quantidade > 0)
    );
  }

  function removerDoCarrinho(id: number) {
    setItensCarrinho((prev) => prev.filter((i) => i.id !== id));
  }

  const total = itensCarrinho.reduce(
    (acc, item) => acc + Number(item.price) * item.quantidade,
    0
  );

  const itensFiltrados = itensMenu.filter((i) =>
    (i.name || "").toLowerCase().includes(busca.toLowerCase())
  );

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f5f6ff] to-[#eef2ff] p-10 flex justify-center">
      <Link
        href="/escolher"
        className="
        fixed top-6 left-6
        flex items-center gap-2
        bg-white/80 backdrop-blur-md
        border border-[#e8e4ff]
        shadow-md
        rounded-2xl
        px-4 py-2
        hover:bg-white
        transition
        z-50
      "
      >
        <Icon
          icon="fluent:arrow-left-20-filled"
          className="w-5 h-5 text-[#6b46ff]"
        />
        <span className="text-sm font-medium text-[#6b46ff]">Voltar</span>
      </Link>

      <div className="w-full max-w-[1500px] grid grid-cols-1 lg:grid-cols-[1fr_1fr_420px] gap-10">
        <div className="col-span-1 lg:col-span-2 space-y-10">
          <div className="bg-white border border-[#e3e8ff] rounded-3xl shadow-md p-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Icon icon="fluent:bot-24-filled" className="text-[#7b4fff]" />
              Assistente Inteligente
            </h2>

            <div className="flex flex-col items-center text-center">
              <div className="w-56 h-40 rounded-3xl bg-gradient-to-br from-[#9f7aea] to-[#3b82f6] flex items-center justify-center shadow-lg">
                <Icon
                  icon="fluent:bot-24-filled"
                  className="w-20 h-20 text-white"
                />
              </div>

              <p className="text-gray-600 text-sm mt-5">
                Pronto para ouvir seu pedido
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Toque no botão abaixo para falar
              </p>

              <ServeAIMicrophone />
            </div>
          </div>

          <div className="bg-white border border-[#e3e8ff] rounded-2xl p-4 flex items-center shadow-sm">
            <Icon icon="fluent:search-20-regular" className="text-[#7b4fff]" />
            <input
              placeholder="Buscar no cardápio..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="ml-3 flex-1 outline-none bg-transparent text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-gray-500">Carregando...</p>
            ) : itensFiltrados.length === 0 ? (
              <p className="text-gray-500">Nenhum item encontrado.</p>
            ) : (
              itensFiltrados.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#e3e8ff] rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>

                  <p className="font-semibold text-[#7b4fff] mt-2">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e3e8ff] rounded-3xl shadow-md p-8 h-fit sticky top-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Carrinho</h2>

          {itensCarrinho.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum item ainda.</p>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {itensCarrinho.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#eee] rounded-xl p-3 flex justify-between items-center bg-[#fafaff]"
                >
                  <div>
                    <p className="font-medium text-sm text-[#4b38ff]">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      R$ {item.price.toFixed(2)} × {item.quantidade}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removerQuantidade(item.id)}
                      className="w-6 h-6 rounded-full border border-[#ddd] flex items-center justify-center"
                    >
                      –
                    </button>

                    <span>{item.quantidade}</span>

                    <button
                      onClick={() =>
                        adicionarCarrinho({ ...item, quantidade: 1 })
                      }
                      className="w-6 h-6 rounded-full bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white flex items-center justify-center"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removerDoCarrinho(item.id)}
                      className="text-red-500 text-sm"
                    >
                      <Icon icon="fluent:delete-20-filled" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t my-4"></div>

          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total:</span>
            <span className="text-[#7b4fff]">R$ {total.toFixed(2)}</span>
          </div>

          <button className="w-full mt-4 bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white py-3 rounded-xl shadow-md hover:opacity-90 transition">
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
