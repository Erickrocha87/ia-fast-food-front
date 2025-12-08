"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const categoriasMenu = ["Todos", "Pizzas", "Lanches", "Bebidas", "Sobremesas"];

export default function CustomerOrderMenu() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const { isReady } = useAuthGuard();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [itensCarrinho, setItensCarrinho] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [itensMenu, setItensMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:1337/menu", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Erro ao carregar cardápio");
        }
        const data = await res.json();
        setItensMenu(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setErro(err.message);
        toast.error(err.message || "Erro ao carregar cardápio.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adicionarAoCarrinho = (itemAdicionar: any) => {
    setItensCarrinho((prev) => {
      const existente = prev.find((i) => i.id === itemAdicionar.id);
      if (existente) {
        return prev.map((i) =>
          i.id === itemAdicionar.id
            ? { ...i, quantidade: (i.quantidade || 1) + 1 }
            : i
        );
      }
      return [...prev, { ...itemAdicionar, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (id: number) =>
    setItensCarrinho((prev) => prev.filter((item) => item.id !== id));

  const aumentarQuantidade = (id: number) =>
    setItensCarrinho((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );

  const diminuirQuantidade = (id: number) =>
    setItensCarrinho((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );

  const subtotal = itensCarrinho.reduce(
    (total, item) => total + (item.price ?? item.preco ?? 0) * item.quantidade,
    0
  );

  const confirmarPedido = async () => {
    if (itensCarrinho.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuário não autenticado.");
        return;
      }

      const tableNumber = "BALCAO";
      const resOrder = await fetch("http://localhost:1337/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tableNumber }),
      });

      const dataOrder = await resOrder.json();

      if (!resOrder.ok || !dataOrder.success || !dataOrder.order) {
        throw new Error(
          dataOrder.error || dataOrder.message || "Erro ao criar pedido."
        );
      }

      const orderId = dataOrder.order.id;

      for (const item of itensCarrinho) {
        const payload = {
          orderId,
          menuItemId: item.id,
          quantity: item.quantidade,
        };

        const resItem = await fetch(
          "http://localhost:1337/orders/item/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const dataItem = await resItem.json();

        if (!resItem.ok || !dataItem.success) {
          throw new Error(
            dataItem.error ||
              dataItem.message ||
              "Erro ao adicionar item ao pedido."
          );
        }
      }

      toast.success(`Pedido enviado! Total: R$ ${subtotal.toFixed(2)}`);
      setItensCarrinho([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erro ao finalizar pedido:", err);
      toast.error(err.message || "Erro ao finalizar pedido.");
    }
  };

  const itensFiltrados = itensMenu.filter((item) => {
    const matchCategoria =
      categoriaSelecionada === "Todos" ||
      item.categoria === categoriaSelecionada;
    const matchBusca = (item.name || item.nome || "")
      .toLowerCase()
      .includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f5f6ff] via-[#f0f1ff] to-[#e7ebff] flex flex-col items-stretch py-10 px-4 md:px-8 relative">
      <Toaster position="top-right" />

      <Link
        href="/escolher"
        className="fixed top-6 left-6 flex items-center gap-2 bg-white/85 backdrop-blur-md border border-[#e3ddff] shadow-md rounded-2xl px-4 py-2 hover:bg-white transition z-50"
      >
        <Icon
          icon="fluent:arrow-left-20-filled"
          className="w-5 h-5 text-[#6b46ff]"
        />
        <span className="text-sm font-medium text-[#6b46ff]">Voltar</span>
      </Link>

      <div className="w-full mt-16 flex flex-col lg:flex-row gap-10 px-2 md:px-4 xl:px-10">
        <div className="flex-1">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] p-3 rounded-2xl text-white shadow-md">
                <Icon icon="fluent:food-24-filled" className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-medium text-[#6b46ff]">
                  Fazer Pedido
                </h1>
                <p className="text-xs text-gray-500">Escolha seus itens</p>
              </div>
            </div>
          </header>

          <div className="flex items-center bg-white rounded-2xl shadow-sm border border-[#e1defc] px-4 py-3 mb-6 w-full">
            <Icon
              icon="fluent:search-20-regular"
              className="text-[#6b46ff] w-5 h-5"
            />
            <input
              type="text"
              placeholder="Buscar no cardápio..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="flex-1 ml-3 outline-none text-sm bg-transparent text-gray-700"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-7">
            {categoriasMenu.map((c) => (
              <button
                key={c}
                onClick={() => setCategoriaSelecionada(c)}
                className={`px-4 py-2 rounded-full text-sm ${
                  categoriaSelecionada === c
                    ? "bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white shadow"
                    : "bg-white border border-[#dcd8ff] text-[#6b46ff] hover:bg-[#f2efff]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {erro && (
            <p className="text-red-500 text-sm mb-4">
              Erro ao carregar cardápio: {erro}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
            {loading ? (
              <div className="col-span-full text-gray-500 text-sm">
                Carregando cardápio...
              </div>
            ) : itensFiltrados.length === 0 ? (
              <div className="col-span-full text-gray-500 text-sm">
                Nenhum item encontrado.
              </div>
            ) : (
              itensFiltrados.map((item) => (
                <div
                  key={item.id}
                  className="
                    bg-white border border-[#e1defc] rounded-3xl p-7
                    shadow-sm hover:shadow-xl transition
                    flex flex-col justify-between
                  "
                >
                  <div>
                    <h3 className="text-xl font-semibold text-[#4338ca] mb-1">
                      {item.name || item.nome}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.description || item.descricao || "Sem descrição"}
                    </p>
                    <p className="font-semibold text-[#4b38ff] mt-4 text-lg">
                      R$ {(item.price ?? item.preco ?? 0).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => adicionarAoCarrinho(item)}
                    className="
                      mt-6 bg-gradient-to-r from-[#7b4fff] to-[#3b82f6]
                      text-white py-3 rounded-xl text-sm
                      shadow-md hover:opacity-90 transition
                      flex items-center justify-center gap-2
                    "
                  >
                    <Icon
                      icon="fluent:add-circle-24-filled"
                      className="w-5 h-5"
                    />
                    Adicionar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
          <div
            className="
              bg-white/90 backdrop-blur-xl
              border border-[#e7e3ff]
              shadow-[0_0_40px_-10px_rgba(123,92,255,0.25)]
              flex flex-col
              rounded-3xl
              max-h-[80vh]
              sticky lg:top-8
            "
          >
            <div className="p-6 flex items-center justify-between border-b border-[#eeeaff]">
              <h2 className="text-2xl font-semibold text-[#4b38ff]">
                Seu Carrinho
              </h2>
              {itensCarrinho.length > 0 && (
                <span className="text-xs bg-[#edeaff] text-[#4c33ff] px-3 py-1 rounded-full">
                  {itensCarrinho.length} item
                  {itensCarrinho.length > 1 && "s"}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {itensCarrinho.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
                  <Icon
                    icon="fluent:cart-20-regular"
                    className="w-10 h-10 opacity-50 mb-2"
                  />
                  Carrinho vazio
                </div>
              ) : (
                itensCarrinho.map((item) => (
                  <div
                    key={item.id}
                    className="
                      bg-gradient-to-br from-[#faf9ff] to-[#f3f1ff]
                      border border-[#e8e3ff]
                      shadow-sm
                      rounded-2xl
                      p-4
                      flex justify-between items-center
                      hover:shadow-md transition
                    "
                  >
                    <div className="max-w-[55%]">
                      <p className="font-semibold text-[#4b38ff] text-sm truncate">
                        {item.name || item.nome}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        R$ {(item.price ?? item.preco ?? 0).toFixed(2)} ×{" "}
                        {item.quantidade}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => diminuirQuantidade(item.id)}
                        className="
                          w-7 h-7 flex items-center justify-center
                          rounded-full border border-[#d7d3ff]
                          text-[#4b38ff]
                          hover:bg-[#ece9ff] transition
                        "
                      >
                        −
                      </button>

                      <span className="w-5 text-center font-medium">
                        {item.quantidade}
                      </span>

                      <button
                        onClick={() => aumentarQuantidade(item.id)}
                        className="
                          w-7 h-7 flex items-center justify-center
                          rounded-full
                          bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]
                          text-white hover:opacity-90 transition
                        "
                      >
                        +
                      </button>

                      <button
                        onClick={() => removerDoCarrinho(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm ml-1"
                      >
                        <Icon icon="fluent:delete-20-filled" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-[#eeeaff] space-y-3 bg-white/70 backdrop-blur-lg rounded-b-3xl">
              <div className="flex justify-between text-gray-700 font-medium">
                <span>Total</span>
                <span className="text-[#4b38ff] font-semibold text-xl">
                  R$ {subtotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={confirmarPedido}
                disabled={itensCarrinho.length === 0}
                className="
                  w-full py-4 rounded-xl
                  flex items-center justify-center gap-2
                  font-medium text-white
                  shadow-lg shadow-[#7b4fff]/20
                  transition
                  bg-gradient-to-r from-[#7b4fff] to-[#3b82f6]
                  disabled:bg-[#e0dbff] disabled:text-[#a6a0cc] disabled:shadow-none
                  hover:opacity-90
                "
              >
                <Icon icon="fluent:send-28-filled" className="w-5 h-5" />
                Finalizar Pedido
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
