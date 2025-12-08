"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PlanosHome() {
  const router = useRouter();
  const [tipo] = useState<"mensal" | "anual">("mensal");

  const planos = [
    {
      id: "basico",
      nome: "Plano Início",
      precoMensal: 129.9,
      precoAnual: 1299.9,
      economia: "Economize R$ 259,00 no anual",
      recursos: [
        "1 ponto de atendimento",
        "Cardápio digital básico",
        "Painel simples de pedidos",
      ],
      popular: false,
    },
    {
      id: "profissional",
      nome: "Plano Profissional",
      precoMensal: 249.9,
      precoAnual: 2499.9,
      economia: "Economize R$ 499,00 no anual",
      recursos: [
        "Até 3 pontos de atendimento",
        "Cardápio digital completo",
        "Dashboard de desempenho",
      ],
      popular: true,
    },
    {
      id: "premium",
      nome: "Plano Rede",
      precoMensal: 499.9,
      precoAnual: 4999.9,
      economia: "Economize R$ 999,00 no anual",
      recursos: [
        "Unidades ilimitadas",
        "Integração com sistemas externos",
        "Suporte prioritário",
      ],
      popular: false,
    },
  ];

  const escolherPlano = (id: string) => {
    router.push(`/register?fromPlan=1&plano=${id}`);
  };

  return (
    <section
      id="planos"
      className="w-full py-16 bg-gradient-to-br from-[#f8f9ff] to-[#eef2ff]"
    >
      <div className="w-full px-6 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {planos.map((plano) => {
          const preco =
            tipo === "mensal" ? plano.precoMensal : plano.precoAnual;
          const periodo = tipo === "mensal" ? "mês" : "ano";

          return (
            <div
              key={plano.id}
              className="relative rounded-3xl border border-[#e4e6ff] bg-white shadow-md flex flex-col justify-between"
            >
              <div className="px-8 pt-8 pb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {plano.nome}
                </h4>

                <p className="text-2xl font-extrabold text-[#a020f0]">
                  R$ {preco.toFixed(1)}/{periodo}
                </p>
                <p className="text-sm text-green-500 mt-1">{plano.economia}</p>

                <ul className="mt-6 space-y-2 text-sm text-gray-700">
                  {plano.recursos.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-[2px] text-purple-500">✔</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full bg-[#ede1ff] px-8 py-4">
                <button
                  onClick={() => escolherPlano(plano.id)}
                  className="w-full bg-transparent text-[#7b4fff] font-semibold text-sm py-2 rounded-xl hover:bg-[#e0cffc] transition"
                >
                  Escolher plano
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
