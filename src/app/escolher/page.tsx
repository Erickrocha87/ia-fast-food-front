"use client";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function EscolherAtendimento() {
  const { isReady } = useAuthGuard();

  if (!isReady) {
    return null;
  }

  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#f3f2ff] to-[#e8eaff] flex items-center justify-center">
      <div className="w-full max-w-6xl h-full flex flex-col items-center justify-center px-6">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-[#4b3fff]">
            Como deseja ser atendido?
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Escolha o tipo de atendimento para iniciar seu pedido
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
          <Link
            href="/pedidoIA"
            className="
              group rounded-3xl bg-white border border-[#ddd9ff]
              p-12 shadow-md hover:shadow-xl transition-all text-center
              flex flex-col items-center gap-6 hover:border-[#c7c3ff]
            "
          >
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#9f7aea] to-[#3b82f6] flex items-center justify-center shadow-xl group-hover:scale-110 transition-all">
              <Icon
                icon="fluent:bot-24-filled"
                className="text-white w-16 h-16"
              />
            </div>

            <h2 className="text-2xl font-semibold text-[#4b3fff]">
              Atendimento por IA
            </h2>
            <p className="text-gray-500 text-base max-w-sm">
              Peça usando comandos de voz com nossa assistente inteligente.
            </p>
          </Link>

          <Link
            href="/pedidos"
            className="
              group rounded-3xl bg-white border border-[#ddd9ff]
              p-12 shadow-md hover:shadow-xl transition-all text-center
              flex flex-col items-center gap-6 hover:border-[#c7c3ff]
            "
          >
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#7b4fff] to-[#3b82f6] flex items-center justify-center shadow-xl group-hover:scale-110 transition-all">
              <Icon
                icon="fluent:cart-24-filled"
                className="text-white w-16 h-16"
              />
            </div>

            <h2 className="text-2xl font-semibold text-[#4b3fff]">
              Fazer Pedido Manualmente
            </h2>
            <p className="text-gray-500 text-base max-w-sm">
              Navegue pelo cardápio e selecione seus itens favoritos.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
