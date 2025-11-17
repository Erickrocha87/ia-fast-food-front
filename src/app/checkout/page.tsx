"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();

  const plano = params.get("plano");
  const tipo = params.get("tipo");

  const [metodo, setMetodo] = useState<"pix" | "card">("pix");

  // Tabela de planos (preços reais)
  const tabelaPlanos: any = {
    basico: {
      nome: "Básico",
      mensal: 99.9,
      anual: 999.9,
      desconto: 198.9,
    },
    profissional: {
      nome: "Profissional",
      mensal: 199.9,
      anual: 1999.9,
      desconto: 398.9,
    },
    premium: {
      nome: "Premium",
      mensal: 349.9,
      anual: 3499.9,
      desconto: 698.9,
    },
  };

  const dadosPlano = tabelaPlanos[plano as keyof typeof tabelaPlanos];
  const preco = tipo === "mensal" ? dadosPlano.mensal : dadosPlano.anual;
  const desconto = tipo === "mensal" ? 0 : dadosPlano.desconto; // anual tem 20%
  const total = preco - desconto;

  const handleConfirmarPagamento = () => {
    alert("Pagamento confirmado!");
    router.push("/home");
  };

  const handleVoltar = () => {
    router.push("/planos");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6ff] to-[#eef2ff] px-6 py-10">
      
      {/* Voltar */}
      <button
        onClick={handleVoltar}
        className="text-purple-600 font-medium mb-6 hover:underline flex items-center gap-2"
      >
        ← Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ==================== COLUNA ESQUERDA ==================== */}
        <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Informações de Pagamento
          </h2>
          <p className="text-gray-500 mb-6">
            Seus dados estão seguros e criptografados
          </p>

          {/* Métodos */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMetodo("card")}
              className={`px-6 py-3 rounded-xl border w-1/2 transition shadow-sm ${
                metodo === "card"
                  ? "border-purple-600 text-purple-600 bg-purple-100"
                  : "border-gray-300 text-gray-600 bg-white"
              }`}
            >
              💳 Cartão de Crédito
            </button>

            <button
              onClick={() => setMetodo("pix")}
              className={`px-6 py-3 rounded-xl border w-1/2 transition shadow-sm ${
                metodo === "pix"
                  ? "border-purple-600 text-purple-600 bg-purple-100"
                  : "border-gray-300 text-gray-600 bg-white"
              }`}
            >
              ⚡ PIX
            </button>
          </div>

          {/* ==================== PIX ==================== */}
          {metodo === "pix" && (
            <div className="text-center mt-8">
              <div className="border-2 border-purple-200 p-10 rounded-2xl bg-purple-50">
                <span className="text-purple-400 text-6xl">⚡</span>
                <p className="mt-4 text-lg font-medium text-purple-500">
                  QR Code PIX
                </p>
              </div>

              <p className="mt-4 text-gray-600">
                Escaneie o código ou copie o código PIX
              </p>

              <button className="mt-4 bg-purple-100 px-6 py-3 rounded-lg text-purple-600 hover:bg-purple-200 transition">
                Copiar Código PIX
              </button>
            </div>
          )}

          {/* ==================== CARTÃO ==================== */}
          {metodo === "card" && (
            <div className="space-y-6 mt-8">
              <div>
                <label className="text-sm text-gray-600">Nome no Cartão</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
                  placeholder="Como está no cartão"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Número do Cartão</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
                  placeholder="0000 0000 0000 0000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Validade</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
                    placeholder="MM/AA"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">CVV</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">CPF/CNPJ</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
          )}
        </div>

        {/* ==================== RESUMO DO PEDIDO ==================== */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 h-fit sticky top-10">
          
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Resumo do Pedido
          </h3>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="text-purple-700 font-semibold text-xl">
              {dadosPlano.nome}
            </p>
            <p className="text-gray-600">
              Plano {tipo === "mensal" ? "Mensal" : "Anual"}
            </p>
          </div>

          <div className="mt-6 text-gray-700">
            <p>Subtotal: <span className="float-right">R$ {preco}</span></p>
            <p className="text-green-600 mt-1">
              Desconto: <span className="float-right">-R$ {desconto}</span>
            </p>

            <hr className="my-4" />

            <p className="text-lg font-semibold">
              Total: <span className="float-right text-purple-700">R$ {total}</span>
            </p>
          </div>

          <div className="mt-6 bg-purple-100 p-3 rounded-xl text-purple-700 text-sm">
            🔒 Pagamento Seguro<br />
            Seus dados são protegidos com criptografia de ponta a ponta.
          </div>

          <button
            onClick={handleConfirmarPagamento}
            className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 rounded-lg shadow hover:opacity-90 transition"
          >
            Confirmar Pagamento
          </button>

        </div>
      </div>
    </div>
  );
}
