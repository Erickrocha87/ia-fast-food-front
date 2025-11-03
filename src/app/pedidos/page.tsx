"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useVoiceCommands } from "../hooks/useVoiceCommands";

const categoriasMenu = ["Todos", "Entradas", "Pratos Principais", "Bebidas", "Sobremesas"];

const itensMenuData = [
  {
    id: 1,
    categoria: "Pratos Principais",
    nome: "Pizza Margherita",
    descricao: "Molho, mussarela e manjericão",
    preco: 45.9,
  },
  {
    id: 2,
    categoria: "Pratos Principais",
    nome: "Pizza Calabresa",
    descricao: "Molho, mussarela e calabresa",
    preco: 48.9,
  },
  {
    id: 3,
    categoria: "Bebidas",
    nome: "Refrigerante Lata",
    descricao: "Coca-Cola, Guaraná ou Fanta",
    preco: 8.0,
  },
  {
    id: 4,
    categoria: "Lanches",
    nome: "Hambúrguer Artesanal",
    descricao: "180g de carne, queijo e molho especial",
    preco: 32.9,
  },
];

export default function CustomerOrderMenu() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [itensCarrinho, setItensCarrinho] = useState<any[]>([]);
  const [ultimoComando, setUltimoComando] = useState("");

  // ======= Carrinho =======
  const adicionarAoCarrinho = (itemAdicionar: any) => {
    setItensCarrinho((prev) => {
      const existente = prev.find((i) => i.id === itemAdicionar.id);
      if (existente) {
        return prev.map((i) =>
          i.id === itemAdicionar.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      } else {
        return [...prev, { ...itemAdicionar, quantidade: 1 }];
      }
    });
  };

  const removerDoCarrinho = (id: number) => {
    setItensCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const aumentarQuantidade = (id: number) => {
    setItensCarrinho((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const diminuirQuantidade = (id: number) => {
    setItensCarrinho((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const subtotal = itensCarrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );
  const total = subtotal;

  const confirmarPedido = () => {
    alert(`Pedido realizado com sucesso!\nTotal: R$ ${total.toFixed(2)}`);
    setItensCarrinho([]);
  };

  // ======= Voz =======
  useVoiceCommands(ultimoComando, {
    adicionar: (nomeItem: string) => {
      const item = itensMenuData.find((i) =>
        i.nome.toLowerCase().includes(nomeItem.toLowerCase())
      );
      if (item) adicionarAoCarrinho(item);
    },
    remover: (nomeItem: string) => {
      const item = itensMenuData.find((i) =>
        i.nome.toLowerCase().includes(nomeItem.toLowerCase())
      );
      if (item) removerDoCarrinho(item.id);
    },
    finalizar: confirmarPedido,
  });

  // ======= Filtro =======
  const itensFiltrados =
    categoriaSelecionada === "Todos"
      ? itensMenuData
      : itensMenuData.filter((item) => item.categoria === categoriaSelecionada);

  // ======= Layout =======
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f8ff] to-[#eef1ff] text-gray-800 flex flex-col items-center py-10">
      {/* Cabeçalho */}
      <header className="text-center mb-8">
        <div className="flex flex-col items-center mb-4">
          <Icon icon="fluent:food-24-filled" className="w-12 h-12 text-[#6b46ff]" />
          <h1 className="text-3xl font-bold text-[#4b38ff] mt-2">
            Cardápio & Pedido
          </h1>
          <p className="text-sm text-[#6b46ff]">
            Sua jornada gastronômica começa aqui!
          </p>
        </div>
      </header>

      {/* Container */}
      <main className="w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Menu */}
        <section className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-[#4c33ff] mb-3">
            Categorias do Cardápio
          </h2>

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

          <div className="grid sm:grid-cols-2 gap-5">
            {itensFiltrados.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#e6e4ff] rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-semibold text-[#4338ca]">
                    {item.nome}
                  </h3>
                  <p className="text-sm text-gray-500">{item.descricao}</p>
                  <p className="font-semibold text-[#4b38ff] mt-2">
                    R$ {item.preco.toFixed(2)}
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
        </section>

        {/* Coluna Carrinho */}
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
                    <p className="font-medium text-[#4c33ff]">{item.nome}</p>
                    <span className="text-xs text-gray-500">
                      R$ {item.preco.toFixed(2)} × {item.quantidade}
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

          {/* Total */}
          <div className="border-t border-[#eeeaff] my-4"></div>
          <div className="space-y-1 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#4b38ff] text-base">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Botão */}
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

      {/* Assistente de Voz */}
      <div className="fixed bottom-6 right-6 z-50">
        <VoiceAssistant onTranscript={setUltimoComando} />
      </div>

      {/* Rodapé */}
      <footer className="text-sm text-[#6b46ff] mt-10">
        Desenvolvido por <span className="font-semibold">ServeAI</span>
      </footer>
    </div>
  );
}
