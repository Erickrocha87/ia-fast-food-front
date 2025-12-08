"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default function PlanosPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<"mensal" | "anual">("mensal");
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);

  // 🔥 1) Buscar assinatura ativa ao carregar página
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    fetch("http://localhost:1337/me/subscription", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setHasSubscription(data.active === true);
      })
      .catch(() => setHasSubscription(false));
  }, []);

  // 🔥 2) Lógica de escolha de plano
  const escolherPlano = (plano: string) => {
    if (hasSubscription) {
      return router.push("/dashboard");
    }

    router.push(`/checkout?plano=${plano}&tipo=${tipo}`);
  };

  // 🔥 3) Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Enquanto verifica assinatura → evita flicker visual
  if (hasSubscription === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-600">
        Carregando planos...
      </div>
    );
  }

  const planos = [
    {
      id: "basico",
      nome: "Básico",
      precoMensal: 129.9,
      precoAnual: 1299.9,
      economia: "Economize R$ 259,00 no anual",
      tokensMensais: 500_000,
      recursos: [
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
      recursos: [
        "1.8 milhão de tokens/mês",
        "IA avançada com entendimento contextual",
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
      recursos: [
        "5 milhões de tokens/mês",
        "IA premium com personalização",
        "Analytics em tempo real",
        "Suporte VIP dedicado",
        "+4 recursos especiais",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6ff] via-[#f0f1ff] to-[#e7ebff] text-gray-900 flex flex-col relative overflow-hidden">

      {/* Efeitos visuais */}
      <div className="pointer-events-none absolute -top-32 -left-10 h-72 w-72 rounded-full bg-[#7b4fff]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-10 h-80 w-80 rounded-full bg-[#3b82f6]/25 blur-3xl" />

      {/* HEADER */}
      <header className="w-full relative z-10 border-b border-white/60/40">
        <div className="max-w-6xl mx-auto px-6 lg:px-2 xl:px-0 py-6 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <Image
              src="/serveai-logo.png"
              alt="ServeAI"
              width={48}
              height={48}
              className="rounded-2xl"
            />
            <div>
              <p className="text-sm font-semibold text-[#4b38ff]">ServeAI</p>
              <p className="text-[11px] text-gray-500">
                Pedidos inteligentes para restaurantes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* VOLTAR */}
            <button
              onClick={() => router.push("/dashboard")}
              className="hidden sm:inline-flex items-center gap-2 text-xs px-3 py-2 rounded-full border border-[#d7d3ff] bg-white/60 hover:bg-white transition"
            >
              <Icon icon="fluent:arrow-left-16-regular" className="w-4 h-4" />
              <span>Voltar ao painel</span>
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white shadow-md hover:opacity-90 transition"
            >
              <Icon icon="fluent:person-arrow-left-16-regular" className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 w-full relative z-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-2 xl:px-0 py-10">

          {/* TÍTULO */}
          <section className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-[#e3e8ff] rounded-full px-3 py-1 text-[11px] text-[#6d4aff] font-medium shadow-sm mb-4">
              <span className="text-lg">💡</span>
              Planos pensados para o tamanho do seu restaurante
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight mb-3">
              Escolha o plano ideal e{" "}
              <span className="bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] bg-clip-text text-transparent">
                deixe a IA cuidar dos pedidos
              </span>
              .
            </h1>

            <p className="text-sm md:text-base text-gray-600 mb-6 max-w-2xl">
              Comece com o básico para uma experiência completa de atendimento.
            </p>
          </section>

          {/* CARDS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-6 items-stretch pt-10">
            {planos.map((plano) => {
              const preco = tipo === "mensal" ? plano.precoMensal : plano.precoAnual;
              const tokensFormatados = plano.tokensMensais.toLocaleString("pt-BR");

              return (
                <div
                  key={plano.id}
                  className={`relative flex flex-col h-full rounded-3xl border bg-white/90 shadow-sm transition
                    ${
                      plano.popular
                        ? "border-transparent shadow-[0_18px_50px_rgba(80,60,220,0.20)] scale-[1.02] md:-mt-4 md:mb-4 bg-gradient-to-b from-[#7b4fff]/15 via-white to-white"
                        : "border-[#e2e4ff] hover:shadow-md"
                    }
                  `}
                >
                  {/* Badge Popular */}
                  {plano.popular && (
                    <div className="absolute -top-3 left-6">
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white text-[11px] px-3 py-1 rounded-full shadow-md">
                        <Icon icon="fluent:star-12-filled" className="w-3.5 h-3.5" />
                        Mais escolhido
                      </span>
                    </div>
                  )}

                  <div className="p-6 pb-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      {plano.nome}
                    </h3>

                    <div className="mt-4 mb-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">R$</span>
                        <span className="text-3xl font-bold text-[#4b38ff] tracking-tight">
                          {preco.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          /{tipo === "mensal" ? "mês" : "ano"}
                        </span>
                      </div>

                      {tipo === "anual" && (
                        <p className="text-[11px] text-green-600 font-medium mt-1">
                          {plano.economia}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                      {tokensFormatados} tokens por mês
                    </p>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d6d3ff] to-transparent mb-4" />

                    <ul className="mt-1 space-y-2 text-sm text-gray-700 flex-1">
                      {plano.recursos.map((r, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <Icon icon="fluent:checkmark-circle-16-filled" className="w-4 h-4 text-[#7b4fff]" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="px-6 pb-6 pt-1">
                    <button
                      onClick={() => escolherPlano(plano.id)}
                      className={`w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition
                        ${
                          plano.popular
                            ? "bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white shadow-lg hover:brightness-110"
                            : "bg-[#f3f0ff] text-[#6b46ff] hover:bg-[#e7e3ff]"
                        }
                      `}
                    >
                      <span>Escolher plano</span>
                      <Icon icon="fluent:arrow-right-16-filled" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </section>

          {/* CTA */}
          <section className="mt-10">
            <div className="rounded-3xl bg-gradient-to-r from-[#7b4fff] via-[#6366f1] to-[#3b82f6] text-white px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h2 className="text-lg md:text-xl font-semibold mb-1">
                  Ainda em dúvida sobre qual plano escolher?
                </h2>
                <p className="text-xs md:text-sm text-white/80 max-w-md">
                  Comece com qualquer plano, teste com seu time e faça upgrade depois.
                </p>
              </div>
              <button
                onClick={() => escolherPlano("profissional")}
                className="inline-flex items-center gap-2 bg-white text-[#4b38ff] px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-md hover:bg-[#f5f3ff] transition"
              >
                <Icon icon="fluent:flash-16-filled" className="w-4 h-4 text-[#f97316]" />
                Começar pelo plano Profissional
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
