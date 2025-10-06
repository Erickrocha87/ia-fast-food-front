"use client";
import { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

export default function CardapioPedido() {
  const [carrinho, setCarrinho] = useState([]);

  const pratos = [
    {
      id: 1,
      nome: "Pizza Margherita Clássica",
      descricao: "Tomates frescos, mussarela, manjericão",
      preco: 18.5,
      imagem:
        "https://images.unsplash.com/photo-1601924582971-df6b0c81e8ee?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      nome: "Hambúrguer Gourmet",
      descricao: "Carne wagyu, maionese trufada, cheddar",
      preco: 16.0,
      imagem:
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const adicionarAoCarrinho = (prato) => {
    const itemExistente = carrinho.find((item) => item.id === prato.id);
    if (itemExistente) {
      setCarrinho(
        carrinho.map((item) =>
          item.id === prato.id ? { ...item, qtd: item.qtd + 1 } : item
        )
      );
    } else {
      setCarrinho([...carrinho, { ...prato, qtd: 1 }]);
    }
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  };

  const alterarQuantidade = (id, delta) => {
    setCarrinho(
      carrinho
        .map((item) =>
          item.id === id ? { ...item, qtd: Math.max(1, item.qtd + delta) } : item
        )
        .filter((item) => item.qtd > 0)
    );
  };

  const subtotal = carrinho.reduce(
    (acc, item) => acc + item.preco * item.qtd,
    0
  );
  const taxa = subtotal * 0.08;
  const total = subtotal + taxa;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-10 px-4">
      {/* Logo no topo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-700">ServeAI</h1>
        <p className="text-gray-500 text-sm">Soluções inteligentes para restaurantes</p>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-700">Cardápio & Pedido</h2>
        <p className="text-gray-600">Sua jornada gastronômica começa aqui!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Cardápio */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            Pratos Principais
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {pratos.map((prato) => (
              <div
                key={prato.id}
                className="bg-blue-50 rounded-2xl p-4 shadow-sm border border-blue-100"
              >
                <img
                  src={prato.imagem}
                  alt={prato.nome}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <h4 className="text-lg font-semibold text-blue-800">
                  {prato.nome}
                </h4>
                <p className="text-sm text-gray-600">{prato.descricao}</p>
                <p className="font-bold text-blue-700 mt-2">
                  R$ {prato.preco.toFixed(2)}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => adicionarAoCarrinho(prato)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition"
                  >
                    Adicionar
                  </button>

                  <button
                    onClick={() => removerDoCarrinho(prato.id)}
                    className="text-red-500 hover:text-red-600 flex items-center text-sm gap-1 transition"
                  >
                    <Trash2 size={16} /> Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrinho */}
        <div className="bg-blue-100/60 p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            Seu Carrinho
          </h3>

          {carrinho.length === 0 ? (
            <p className="text-gray-600 text-sm">
              Seu carrinho está vazio.
            </p>
          ) : (
            <div className="space-y-4">
              {carrinho.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.nome}</h4>
                    <p className="text-sm text-gray-500">
                      R$ {item.preco.toFixed(2)} x {item.qtd}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alterarQuantidade(item.id, -1)}
                      className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-600 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold">{item.qtd}</span>
                    <button
                      onClick={() => alterarQuantidade(item.id, +1)}
                      className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-600 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <hr className="my-3 border-blue-200" />

              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  Subtotal:{" "}
                  <span className="float-right">
                    R$ {subtotal.toFixed(2)}
                  </span>
                </p>
                <p>
                  Taxa (8%):{" "}
                  <span className="float-right">R$ {taxa.toFixed(2)}</span>
                </p>
                <p className="font-bold text-blue-700 text-base">
                  Total:{" "}
                  <span className="float-right">
                    R$ {total.toFixed(2)}
                  </span>
                </p>
              </div>

              <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl mt-4 hover:bg-blue-700 flex items-center justify-center gap-2 transition">
                <ShoppingCart size={18} /> Finalizar Pedido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
