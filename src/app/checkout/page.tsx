"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();

  const plano = params.get("plano") ?? "basico";
  const tipo = params.get("tipo") ?? "mensal";

  const [metodo, setMetodo] = useState<"pix" | "card">("pix");
  const [pixQr, setPixQr] = useState("");
  const [pixCopiaCola, setPixCopiaCola] = useState("");
  const [loading, setLoading] = useState(false);

  // 📌 Preços
  const tabela: any = {
    basico: { nome: "Básico", mensal: 99.9, anual: 999.9, desconto: 198.9 },
    profissional: {
      nome: "Profissional",
      mensal: 199.9,
      anual: 1999.9,
      desconto: 398.9,
    },
    premium: { nome: "Premium", mensal: 349.9, anual: 3499.9, desconto: 698.9 },
  };

  const dados = tabela[plano as keyof typeof tabela];
  const preco = tipo === "mensal" ? dados.mensal : dados.anual;
  const desconto = tipo === "mensal" ? 0 : dados.desconto;
  const total = preco - desconto;

  // ==============================================================
  // 💳 Checkout (Nova Forma)
  // ==============================================================
  async function pagarComCartao() {
    setLoading(true);

    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano: dados.nome, total, tipo }),
      }
    ).then((res) => res.json());

    if (r.url) {
      window.location.href = r.url; // 👈 Agora funciona!
    } else {
      alert("Erro ao iniciar checkout.");
    }

    setLoading(false);
  }

  // ==============================================================
  // ⚡ PIX
  // ==============================================================
  async function pagarComPix() {
    setLoading(true);

    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/pix`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plano: dados.nome, total }),
    }).then((res) => res.json());

    if (!r.pix) {
      alert("Erro ao gerar PIX.");
    } else {
      setPixQr(r.pix.qr_code_base64);
      setPixCopiaCola(r.pix.qr_code);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9ff] to-[#f6f4ff] px-6 py-10">
      {/* VOLTAR */}
      <button
        onClick={() => router.push("/planos")}
        className="text-purple-600 font-medium mb-6 hover:underline flex items-center gap-2"
      >
        ← Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* PAINEL */}
        <div className="md:col-span-2 bg-white rounded-3xl p-10 shadow-xl border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Finalizar Assinatura
          </h1>
          <p className="text-gray-600 mb-10">Escolha a forma de pagamento</p>

          {/* MÉTODOS */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMetodo("card")}
              className={`p-5 rounded-xl border shadow-sm text-lg font-medium transition ${
                metodo === "card"
                  ? "border-purple-600 bg-purple-100 text-purple-700"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              💳 Cartão
            </button>

            <button
              onClick={() => setMetodo("pix")}
              className={`p-5 rounded-xl border shadow-sm text-lg font-medium transition ${
                metodo === "pix"
                  ? "border-purple-600 bg-purple-100 text-purple-700"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              ⚡ PIX
            </button>
          </div>

          {/* PIX */}
          {metodo === "pix" && (
            <div className="mt-10 text-center">
              {!pixQr && (
                <button
                  onClick={pagarComPix}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-8 py-4 shadow-lg transition font-semibold disabled:opacity-50"
                >
                  {loading ? "Gerando QR Code..." : "Gerar QR Code PIX"}
                </button>
              )}

              {pixQr && (
                <div className="mt-6">
                  <img
                    src={`data:image/png;base64,${pixQr}`}
                    className="mx-auto w-56 h-56 shadow-xl rounded-xl"
                  />

                  <button
                    onClick={() => navigator.clipboard.writeText(pixCopiaCola)}
                    className="mt-6 bg-purple-100 px-6 py-3 rounded-lg text-purple-700 hover:bg-purple-200 transition"
                  >
                    Copiar Código PIX
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CARTÃO */}
          {metodo === "card" && (
            <div className="mt-10 text-center">
              <button
                onClick={pagarComCartao}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-8 py-4 shadow-lg transition font-semibold disabled:opacity-50"
              >
                {loading ? "Carregando..." : "Pagar com Cartão"}
              </button>
            </div>
          )}
        </div>

        {/* RESUMO */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 h-fit sticky top-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Resumo do Plano
          </h3>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 mb-6">
            <p className="text-purple-700 font-semibold text-2xl">
              {dados.nome}
            </p>
            <p className="text-gray-600 text-sm">
              {tipo === "mensal" ? "Assinatura Mensal" : "Assinatura Anual"}
            </p>
          </div>

          <div className="text-gray-700 text-sm space-y-2">
            <p className="flex justify-between">
              Subtotal: <span>R$ {preco.toFixed(2)}</span>
            </p>

            {desconto > 0 && (
              <p className="flex justify-between text-green-600">
                Desconto: <span>- R$ {desconto.toFixed(2)}</span>
              </p>
            )}

            <hr className="my-4" />

            <p className="text-xl font-semibold flex justify-between">
              Total:{" "}
              <span className="text-purple-700">R$ {total.toFixed(2)}</span>
            </p>
          </div>

          <div className="mt-6 bg-purple-100 p-4 rounded-xl text-purple-700 text-sm">
            🔒 Pagamento 100% Seguro
            <br />
            Usamos criptografia avançada para proteger seus dados.
          </div>
        </div>
      </div>
    </div>
  );
}
