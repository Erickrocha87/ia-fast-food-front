"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanosPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<"mensal" | "anual">("mensal");

  const planos = [
    {
      id: "basico",
      nome: "Básico",
      precoMensal: 129.9,
      precoAnual: 1299.9,
      economia: "Economize R$ 259,00 no anual",
      tokensMensais: 500_000,
      tablets: 5,
      recursos: [
        "Até 5 tablets",
        "500 mil tokens/mês",
        "IA básica (voz padrão)",
        "Cardápio digital simples",
        "Relatórios mensais",
        "Suporte por email",
      ],
      popular: false,
    },
    {
      id: "profissional",
      nome: "Profissional",
      precoMensal: 249.9,
      precoAnual: 2499.9,
      economia: "Economize R$ 499,00 no anual",
      tokensMensais: 1_800_000,
      tablets: 15,
      recursos: [
        "Até 15 tablets",
        "1.8 milhão de tokens/mês",
        "IA avançada com entendimento contextual",
        "Cardápio digital + fotos",
        "Relatórios semanais detalhados",
        "Suporte prioritário 24/7",
        "+2 recursos especiais",
      ],
      popular: true,
    },
    {
      id: "premium",
      nome: "Premium",
      precoMensal: 499.9,
      precoAnual: 4999.9,
      economia: "Economize R$ 999,00 no anual",
      tokensMensais: 5_000_000,
      tablets: "Ilimitados",
      recursos: [
        "Tablets ilimitados",
        "5 milhões de tokens/mês",
        "IA premium com personalização e fine-tuning leve",
        "Cardápio multimídia completo",
        "Analytics em tempo real",
        "Suporte VIP dedicado",
        "+4 recursos especiais",
      ],
      popular: false,
    },
  ];

  const escolherPlano = (plano: string) => {
    router.push(`/checkout?plano=${plano}&tipo=${tipo}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#eef2ff] px-6 py-10">
      
      <button
        onClick={handleLogout}
        className="text-purple-600 font-medium mb-6 hover:underline flex items-center gap-2"
      >
        ← Voltar
      </button>

      <h1 className="text-3xl font-semibold text-gray-800 mb-3">
        Selecione o melhor plano para o seu restaurante
      </h1>



      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {planos.map((plano) => (
          <div
            key={plano.id}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition flex flex-col h-full"
          >
            {plano.popular && (
              <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full mb-3 inline-block">
                Popular
              </span>
            )}

            <h3 className="text-xl font-semibold text-gray-800">
              {plano.nome}
            </h3>

            <p className="text-purple-600 font-bold text-2xl mt-3">
              R$ {tipo === "mensal" ? plano.precoMensal : plano.precoAnual}/
              {tipo === "mensal" ? "mês" : "ano"}
            </p>

            <p className="text-green-500 text-sm">{plano.economia}</p>

            {/* Lista de recursos */}
            <ul className="mt-6 space-y-2 text-gray-700 flex-1">
              {plano.recursos.map((r, i) => (
                <li key={i} className="flex gap-2 items-center">
                  <span className="text-purple-500">✔</span>
                  {r}
                </li>
              ))}
            </ul>

            {/* BOTÃO ESCOLHER */}
            <button
              onClick={() => escolherPlano(plano.id)}
              className="w-full mt-auto bg-purple-200 text-purple-700 py-3 rounded-lg font-semibold hover:bg-purple-300 transition"
            >
              Escolher
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
