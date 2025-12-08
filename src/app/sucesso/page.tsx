"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default function SucessoPage() {
  const router = useRouter();
  const search = useSearchParams();

  const plano = search.get("plano");
  const tipo = search.get("tipo");

  useEffect(() => {
    async function ativarAssinatura() {
      if (!plano || !tipo) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await fetch("http://localhost:1337/subscription/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planSlug: plano,
            tipo,
          }),
        });
      } catch (e) {
        console.error("Erro ao ativar assinatura:", e);
      }
    }

    ativarAssinatura();
  }, [plano, tipo]);

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-[#f5f6ff] via-[#eef2ff] to-[#e7ebff] flex items-center justify-center px-4 relative">

      {/* Glow de fundo */}
      <div className="pointer-events-none absolute -top-40 -left-10 h-72 w-72 rounded-full bg-[#7b4fff]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-10 h-80 w-80 rounded-full bg-[#3b82f6]/25 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm shadow-[0_18px_50px_rgba(80,60,220,0.20)] border border-[#e2e4ff] rounded-3xl p-7 text-center">
          
          {/* Ícone */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7b4fff] to-[#3b82f6] flex items-center justify-center shadow-lg shadow-[#7b4fff]/40 animate-[pulse_2s_ease-in-out_infinite]">
              <Icon
                icon="fluent:checkmark-circle-20-filled"
                className="w-8 h-8 text-white"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento aprovado! 🎉
          </h1>

          <p className="text-sm text-gray-600 mb-4">
            Sua assinatura do plano{" "}
            <span className="font-semibold text-[#4b38ff]">
              {plano ?? "Selecionado"}
            </span>{" "}
            ({tipo ?? "mensal"}) foi registrada.
          </p>

          <p className="text-xs text-gray-500 mb-6">
            Estamos preparando tudo para que o ServeAI cuide dos pedidos enquanto você
            foca no seu restaurante.
          </p>

          <button
            onClick={() => router.push("/admin")}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white shadow-lg shadow-[#7b4fff]/30 hover:brightness-110 transition"
          >
            <Icon icon="fluent:apps-20-filled" className="w-4 h-4" />
            Ir para o painel
          </button>
        </div>

        {/* Rodapé */}
        <p className="mt-4 text-[10px] text-center text-gray-400">
          Em caso de dúvidas sobre sua assinatura, fale com{" "}
          <a
            href="mailto:suporte@serveai.com"
            className="text-[#4b38ff] underline-offset-2 hover:underline"
          >
            suporte@serveai.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
