"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useVoiceCommands } from "@/app/hooks/useVoiceCommands";
import ServeAIMicrophone from "@/components/ServeAiMicrophone";

const categoriasMenu = ["Todos", "Pizzas", "Lanches", "Bebidas", "Sobremesas"];

export default function CustomerOrderMenu() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [itensCarrinho, setItensCarrinho] = useState<any[]>([]);
  const [ultimoComando, setUltimoComando] = useState("");
  const [busca, setBusca] = useState("");
  const [itensMenu, setItensMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Buscar cardápio
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
      } catch (err: any) {
        console.error("Erro ao buscar menu:", err);
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Carrinho + funções
  const adicionarAoCarrinho = (itemAdicionar: any) => {
    setItensCarrinho((prev) => {
      const existente = prev.find((i) => i.id === itemAdicionar.id);
      if (existente) {
        return prev.map((i) =>
          i.id === itemAdicionar.id
            ? { ...i, quantidade: (i.quantidade || 1) + 1 }
            : i
        );
      } else {
        return [...prev, { ...itemAdicionar, quantidade: 1 }];
      }
    });
  };

  const removerDoCarrinho = (id: number) =>
    setItensCarrinho((prev) => prev.filter((item) => item.id !== id));

  const aumentarQuantidade = (id: number) =>
    setItensCarrinho((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );

  const diminuirQuantidade = (id: number) =>
    setItensCarrinho((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );

  const subtotal = itensCarrinho.reduce(
    (total, item) => total + (item.price ?? item.preco ?? 0) * item.quantidade,
    0
  );

  const confirmarPedido = () => {
    alert(`✅ Pedido realizado com sucesso!\nTotal: R$ ${subtotal.toFixed(2)}`);
    setItensCarrinho([]);
  };

  // IA Voz
  useVoiceCommands(ultimoComando, {
    adicionar: (nomeItem: string) => {
      const item = itensMenu.find((i) =>
        (i.name || i.nome || "").toLowerCase().includes(nomeItem.toLowerCase())
      );
      if (item) {
        adicionarAoCarrinho(item);
      } else {
        console.warn("Item não encontrado para adicionar:", nomeItem);
      }
    },
    remover: (nomeItem: string) => {
      const item = itensMenu.find((i) =>
        (i.name || i.nome || "").toLowerCase().includes(nomeItem.toLowerCase())
      );
      if (item) {
        removerDoCarrinho(item.id);
      } else {
        console.warn("Item não encontrado para remover:", nomeItem);
      }
    },
    finalizar: confirmarPedido,
  });

  // Filtros
  const itensFiltrados = itensMenu.filter((item) => {
    const matchCategoria =
      categoriaSelecionada === "Todos" ||
      item.categoria === categoriaSelecionada;
    const matchBusca = (item.name || item.nome || "")
      .toLowerCase()
      .includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f8ff] to-[#eef1ff] text-gray-800 flex flex-col items-center py-8">
      {/* Cabeçalho */}
      <header className="w-full max-w-7xl flex flex-wrap justify-between items-center px-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] p-3 rounded-2xl text-white shadow-md">
            <Icon icon="fluent:food-24-filled" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-medium text-[#6b46ff]">Fazer Pedido</h1>
            <p className="text-xs text-gray-500">Mesa atual</p>
          </div>
        </div>
      </header>

      {/* Busca */}
      <div className="w-full max-w-7xl px-6 mb-6">
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-[#e6e4ff] px-4 py-2">
          <Icon icon="fluent:search-20-regular" className="text-[#6b46ff] w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar no cardápio..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 ml-3 outline-none text-sm bg-transparent text-gray-700"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <main className="w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          {/* Categorias */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categoriasMenu.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaSelecionada(categoria)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoriaSelecionada === categoria
                    ? "bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white shadow-md"
                    : "bg-white border border-[#dcd8ff] text-[#6b46ff] hover:bg-[#f1edff]"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>

          {/* Itens */}
          {loading ? (
            <p className="text-gray-500">Carregando cardápio...</p>
          ) : erro ? (
            <p className="text-red-500">Erro: {erro}</p>
          ) : itensFiltrados.length === 0 ? (
            <p className="text-gray-500">Nenhum item encontrado.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {itensFiltrados.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#e6e4ff] rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-semibold text-[#4338ca]">
                      {item.name || item.nome || "Sem nome"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.description || item.descricao || "Sem descrição"}
                    </p>
                    <p className="font-semibold text-[#4b38ff] mt-2">
                      R$ {(item.price ?? item.preco ?? 0).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => adicionarAoCarrinho(item)}
                    className="mt-4 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white px-4 py-2 rounded-xl text-sm font-medium shadow hover:opacity-90 transition"
                  >
                    <Icon
                      icon="fluent:add-circle-24-filled"
                      className="inline w-4 h-4 mr-1"
                    />
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Carrinho */}
        <aside className="bg-white border border-[#e6e4ff] rounded-2xl p-6 shadow-md h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#4b38ff]">Carrinho</h2>
            {itensCarrinho.length > 0 && (
              <span className="text-xs bg-[#edeaff] text-[#4c33ff] px-2 py-0.5 rounded-full">
                {itensCarrinho.length} item{itensCarrinho.length > 1 && "s"}
              </span>
            )}
          </div>

          {itensCarrinho.length === 0 ? (
            <p className="text-sm text-gray-500">Seu carrinho está vazio.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {itensCarrinho.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-[#fafaff] border border-[#f0edff] rounded-xl px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-[#4c33ff]">
                      {item.name || item.nome || "Item"}
                    </p>
                    <span className="text-xs text-gray-500">
                      R$ {(item.price ?? item.preco ?? 0).toFixed(2)} × {item.quantidade}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => diminuirQuantidade(item.id)}
                      className="border border-[#d1d1ff] text-[#4b38ff] w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#edeaff]"
                    >
                      −
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      onClick={() => aumentarQuantidade(item.id)}
                      className="bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white w-6 h-6 rounded-full flex items-center justify-center hover:opacity-90"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removerDoCarrinho(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      <Icon icon="fluent:delete-20-filled" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-[#eeeaff] my-4"></div>
          <div className="space-y-1 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#4b38ff] text-base">
              <span>Total:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={confirmarPedido}
            disabled={itensCarrinho.length === 0}
            className={`mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition ${
              itensCarrinho.length === 0
                ? "bg-[#edeaff] text-[#b7aafc] cursor-not-allowed"
                : "bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white shadow hover:opacity-90"
            }`}
          >
            <Icon icon="fluent:send-24-regular" />
            Enviar Pedido
          </button>
        </aside>
      </main>

      <footer className="text-sm text-[#6b46ff] mt-10">
        Desenvolvido por <span className="font-semibold">ServeAI</span>
      </footer>
    </div>
  );
}
