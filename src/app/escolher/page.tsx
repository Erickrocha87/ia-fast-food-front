"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function EscolherAtendimento() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f3ff] to-[#eef0ff] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-10 border border-[#e4e1ff]">
        
        {/* Título */}
        <h1 className="text-2xl font-bold text-[#4b3fff] mb-2">
          Como deseja ser atendido?
        </h1>
        <p className="text-gray-500 mb-10">
          Escolha o tipo de atendimento para iniciar seu pedido
        </p>

        {/* Opções */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Opção IA */}
          <Link
            href="/pedidoIA"
            className="group bg-gradient-to-b from-[#f7f4ff] to-[#ecebff] border border-[#dcd8ff] rounded-2xl p-8 shadow-sm hover:shadow-lg transition flex flex-col items-center text-center gap-4"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#3b82f6] flex items-center justify-center shadow-lg">
              <Icon icon="fluent:bot-24-filled" className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-[#4b3fff]">
              Atendimento por IA
            </h2>
            <p className="text-sm text-gray-500">
              Peça usando comandos de voz com nossa assistente inteligente.
            </p>
          </Link>

          {/* Opção Manual */}
          <Link
            href="/pedidos"
            className="group bg-gradient-to-b from-[#f7f4ff] to-[#ecebff] border border-[#dcd8ff] rounded-2xl p-8 shadow-sm hover:shadow-lg transition flex flex-col items-center text-center gap-4"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#7b4fff] to-[#3b82f6] flex items-center justify-center shadow-lg">
              <Icon icon="fluent:cart-24-filled" className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-[#4b3fff]">
              Fazer Pedido Manualmente
            </h2>
            <p className="text-sm text-gray-500">
              Navegue pelo cardápio e selecione seus itens favoritos.
            </p>
          </Link>

        </div>
      </div>
    </div>
  );
}
