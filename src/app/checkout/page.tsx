"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";

type TipoCobranca = "mensal" | "anual";

const PLANOS = [
  {
    id: "basico",
    nome: "Básico",
    precoMensal: 129.9,
    precoAnual: 1299.9,
    economia: "Economize R$ 259,00 no anual",
    tokensMensais: 500_000,
    tablets: 5,
  },
  {
    id: "profissional",
    nome: "Profissional",
    precoMensal: 249.9,
    precoAnual: 2499.9,
    economia: "Economize R$ 499,00 no anual",
    tokensMensais: 1_800_000,
    tablets: 15,
  },
  {
    id: "premium",
    nome: "Premium",
    precoMensal: 499.9,
    precoAnual: 4999.9,
    economia: "Economize R$ 999,00 no anual",
    tokensMensais: 5_000_000,
    tablets: "Ilimitados" as const,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const planoId = searchParams.get("plano") || "basico";
  const tipoParam = (searchParams.get("tipo") as TipoCobranca) || "mensal";

  const { plano, preco, tipo } = useMemo(() => {
    const found = PLANOS.find((p) => p.id === planoId) || PLANOS[0];
    const tipo: TipoCobranca = tipoParam === "anual" ? "anual" : "mensal";
    const preco = tipo === "mensal" ? found.precoMensal : found.precoAnual;
    return { plano: found, preco, tipo };
  }, [planoId, tipoParam]);

  const handlePagar = async () => {
    try {
      setLoading(true);
      setErro(null);

      const res = await fetch("http://localhost:1337/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plano: plano.id,
          total: preco,
          tipo,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.message || "Erro ao iniciar pagamento");
      }

      window.location.href = data.url;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      setErro(e.message || "Não foi possível continuar o checkout.");
    } finally {
      setLoading(false);
    }
  };

  const precoFormatado = preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  const cobrancaLabel = tipo === "mensal" ? "por mês" : "por ano";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6ff] via-[#f0f1ff] to-[#e7ebff] text-gray-900 flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-10 h-72 w-72 rounded-full bg-[#7b4fff]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[#3b82f6]/25 blur-3xl" />

      <header className="w-full relative z-10">
        <div className="w-full px-6 lg:px-12 xl:px-20 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/serveai-logo.png"
              alt="ServeAI"
              width={40}
              height={40}
              className="rounded-2xl"
            />
            <div>
              <p className="text-sm font-semibold text-[#4b38ff]">ServeAI</p>
              <p className="text-[11px] text-gray-500">
                Checkout seguro do seu plano
              </p>
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-xs font-medium px-4 py-2 rounded-full border border-[#d7d3ff] bg-white/70 hover:bg-white transition"
          >
            <Icon icon="fluent:arrow-left-16-regular" className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-1 w-full relative z-10">
        <div className="w-full px-6 lg:px-12 xl:px-20 pb-12">

          <section className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-[#e3e8ff] rounded-full px-3 py-1 text-[11px] text-[#6d4aff] font-medium shadow-sm mb-3">
              <span className="text-lg">🧾</span>
              Revise seu plano e finalize o pagamento
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight mb-2">
              Checkout do plano{" "}
              <span className="bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] bg-clip-text text-transparent">
                {plano.nome}
              </span>
            </h1>

            <p className="text-sm md:text-base text-gray-600 max-w-2xl">
              Em poucos segundos você será redirecionado para o pagamento seguro
              e o ServeAI já estará pronto para atender seu restaurante.
            </p>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            <div className="h-full bg-white/95 rounded-3xl border border-[#e2e4ff] shadow-[0_18px_60px_rgba(80,60,220,0.08)] p-6 md:p-7 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#7b4fff] mb-1">
                    Resumo do plano
                  </p>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    {plano.nome}{" "}
                    <span className="text-xs text-gray-400 font-normal">
                      (
                      {tipo === "mensal" ? "Cobrança mensal" : "Cobrança anual"}
                      )
                    </span>
                  </h2>
                </div>

                <div className="hidden md:inline-flex items-center gap-2 text-[11px] bg-[#f4f3ff] text-[#4b38ff] px-3 py-1.5 rounded-full">
                  <Icon
                    icon="fluent:shield-checkmark-16-regular"
                    className="w-4 h-4"
                  />
                  Stripe protegido
                </div>
              </div>

              <div className="flex items-end gap-4 mt-2">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-500">R$</span>
                    <span className="text-4xl md:text-5xl font-bold text-[#4b38ff] tracking-tight">
                      {preco.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{cobrancaLabel}</p>
                </div>

                {tipo === "anual" && (
                  <div className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[#ecfdf3] text-[#15803d] font-medium">
                    <Icon
                      icon="fluent:arrow-growth-20-filled"
                      className="w-4 h-4"
                    />
                    {plano.economia}
                  </div>
                )}
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d6d3ff] to-transparent my-3" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">Tokens mensais</span>
                  <span className="font-semibold text-[#4b38ff]">
                    {plano.tokensMensais.toLocaleString("pt-BR")} tokens
                  </span>
                  <p className="text-[11px] text-gray-500">
                    Suficiente para centenas de pedidos com IA por mês.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-[11px] text-gray-500">
                    Use em tablets, totens ou celulares dos garçons.
                  </p>
                </div>
              </div>

              <div className="mt-1">
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  Recorrência e cancelamento
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  A cobrança é recorrente (
                  {tipo === "mensal" ? "todo mês" : "anualmente"}). Você pode
                  mudar de plano a qualquer momento pelo painel, sem
                  multa nem burocracia.
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Para cancelamento basta entrar em contato com o suporte: <a className="text-[#4b38ff]" href="mailto:suporte@serveai.com">suporte@serveai.com</a>
                </p>
              </div>

              <div className="mt-auto" />
            </div>

            <div className="h-full bg-white/95 rounded-3xl border border-[#e2e4ff] shadow-[0_18px_60px_rgba(80,60,220,0.16)] p-6 md:p-7 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#7b4fff] mb-1">
                    Dados do pagamento
                  </p>
                  <p className="text-xs text-gray-500">
                    Você será redirecionado para o ambiente seguro Stripe.
                  </p>
                </div>

              </div>

              <div className="bg-[#f8f7ff] border border-[#e2e4ff] rounded-2xl p-4 text-xs text-gray-600 flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon
                    icon="fluent:lock-closed-16-regular"
                    className="w-4 h-4 text-[#4b38ff]"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">
                    Pagamento 100% seguro
                  </p>
                  <p>
                    Os dados do seu cartão são processados pela Stripe. O
                    ServeAI não armazena informações sensíveis de pagamento.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm mt-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plano selecionado</span>
                  <span className="font-medium text-gray-800">
                    {plano.nome} ({tipo === "mensal" ? "Mensal" : "Anual"})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total</span>
                  <span className="font-semibold text-[#4b38ff] text-xl">
                    {precoFormatado}
                  </span>
                </div>
              </div>

              {erro && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {erro}
                </p>
              )}

              <button
                onClick={handlePagar}
                disabled={loading}
                className="
                  mt-2 w-full py-3.5 rounded-2xl text-sm font-semibold
                  flex items-center justify-center gap-2
                  bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white
                  shadow-lg shadow-[#7b4fff]/30
                  disabled:opacity-70 disabled:cursor-not-allowed
                  hover:brightness-110 transition
                "
              >
                {loading ? (
                  <>
                    <Icon
                      icon="eos-icons:three-dots-loading"
                      className="w-5 h-5"
                    />
                    Processando...
                  </>
                ) : (
                  <>
                    <Icon icon="fluent:card-ui-20-filled" className="w-5 h-5" />
                    Pagar com cartão
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/planos")}
                className="w-full py-3 rounded-2xl text-xs font-medium mt-1 text-gray-600 bg-white border border-[#e3e8ff] hover:bg-[#f8f9ff] transition"
              >
                Voltar para a escolha de planos
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-1 leading-snug">
                Ao continuar, você concorda com os Termos de uso e a Política de
                privacidade do ServeAI.
              </p>

              <div className="mt-auto" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
