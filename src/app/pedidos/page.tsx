// components/CustomerOrderMenu.js
"use client";
import React, { useState } from "react";
import Image from "next/image";

const categoriasMenu = ["Entradas", "Pratos Principais", "Bebidas", "Sobremesas"];

const itensMenuData = [
  {
    id: 1,
    categoria: "Pratos Principais",
    nome: "Pizza Margherita Clássica",
    descricao: "Tomates frescos, mussarela, manjericão",
    preco: 18.5,
    imagem: "/images/pizza.png",
  },
  {
    id: 2,
    categoria: "Pratos Principais",
    nome: "Hambúrguer Gourmet",
    descricao: "Carne wagyu, maionese trufada, cheddar",
    preco: 16.0,
    imagem: "/images/burger.png",
  },
  {
    id: 3,
    categoria: "Entradas",
    nome: "Tacos Apimentados",
    descricao: "Carnitas de porco, pico de gallo, molho picante",
    preco: 12.0,
    imagem: "/images/tacos.png",
  },
  {
    id: 4,
    categoria: "Bebidas",
    nome: "Limonada Fresca",
    descricao: "Feita na hora, super refrescante",
    preco: 7.0,
    imagem: "/images/lemonade.png",
  },
];

const CustomerOrderMenu = () => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Pratos Principais");
  const [itensCarrinho, setItensCarrinho] = useState([
    { id: 1, nome: "Pizza Margherita", preco: 18.5, quantidade: 1 },
    { id: 4, nome: "Limonada Fresca", preco: 7.0, quantidade: 2 },
  ]);

  const itensFiltrados = itensMenuData.filter(
    (item) => item.categoria === categoriaSelecionada
  );

  const adicionarAoCarrinho = (itemAdicionar) => {
    setItensCarrinho((prev) => {
      const existente = prev.find((item) => item.id === itemAdicionar.id);
      if (existente) {
        return prev.map((item) =>
          item.id === itemAdicionar.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        return [...prev, { ...itemAdicionar, quantidade: 1 }];
      }
    });
  };

  const calcularSubtotal = () =>
    itensCarrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);

  const subtotal = calcularSubtotal();
  const taxa = subtotal * 0.08;
  const total = subtotal + taxa;

  const confirmarPedido = () => {
    alert(
      `Pedido realizado com sucesso!\n\nTotal: R$ ${total.toFixed(
        2
      )}\nItens: ${JSON.stringify(itensCarrinho, null, 2)}`
    );
    setItensCarrinho([]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white w-full max-w-7xl min-h-screen p-10 rounded-none shadow-none">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-10">
          <Image
            src="/serveai-logo.png"
            alt="Logo ServeAI"
            width={80}
            height={80}
            className="mb-3"
            priority
          />
          <h1 className="text-3xl font-bold text-blue-800 mb-1">
            Cardápio & Pedido
          </h1>
          <p className="text-blue-600">
            Sua jornada gastronômica começa aqui!
          </p>
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Categorias do Cardápio
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {categoriasMenu.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => setCategoriaSelecionada(categoria)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    categoriaSelecionada === categoria
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {itensFiltrados.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="relative w-24 h-20 flex-shrink-0">
                    <Image
                      src={item.imagem}
                      alt={item.nome}
                      fill
                      sizes="100%"
                      className="object-contain rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-blue-800">
                      {item.nome}
                    </h3>
                    <p className="text-sm text-blue-600">{item.descricao}</p>
                    <p className="text-blue-700 font-bold mt-1">
                      R$ {item.preco.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => adicionarAoCarrinho(item)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700 transition"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Carrinho */}
          <div className="bg-blue-50 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Seu Carrinho
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {itensCarrinho.length === 0 ? (
                <p className="text-blue-500">Seu carrinho está vazio.</p>
              ) : (
                itensCarrinho.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <span className="font-medium text-blue-800">{item.nome}</span>{" "}
                      <span className="text-blue-500">x{item.quantidade}</span>
                    </div>
                    <span className="font-semibold text-blue-800">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-blue-300 my-4"></div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-blue-700">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-700">
                <span>Taxa (8%):</span>
                <span>R$ {taxa.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-blue-800">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={confirmarPedido}
              disabled={itensCarrinho.length === 0}
              className={`mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${
                itensCarrinho.length === 0
                  ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              🛒 Finalizar Pedido
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-blue-500 mt-8">
          Desenvolvido por{" "}
          <span className="text-blue-700 font-semibold">ServeAI</span>
        </p>
      </div>
    </div>
  );
};

export default CustomerOrderMenu;
