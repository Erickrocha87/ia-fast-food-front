"use client";
import { Card } from "@/components/Card";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

//desabilitando o SSR
const VoiceAssistant = dynamic(
  () => import("@/components/VoiceAssistant").then((mod) => mod.VoiceAssistant),
  { ssr: false }
);

const restaurantName = "Restaurante X";

export default function HomeDashboard() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
      <Image
        src="/serveai-logo.png"
        alt="ServeAI Logo"
        width={100}
        height={100}
        className="mb-6"
        priority
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Bem-vindo, {restaurantName}!
      </h1>
      <p className="text-base text-gray-600 mb-8">Dashboard</p>

      <div className="w-full max-w-md p-6 mb-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-600">
          Assistente de Voz AI
        </h2>
        <VoiceAssistant />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-10">
        <Card
          linkName="Novo Pedido"
          label="Inicie um novo pedido para o cliente de forma rápida e eficiente."
          buttonString="Iniciar Pedido"
        />

        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:-translate-y-1 transition-transform">
          <span className="text-4xl mb-3 text-red-500">🕒</span>
          <h3 className="text-xl font-bold mb-2 text-red-700">
            Pedidos ao Vivo
          </h3>
          <p className="text-gray-700 mb-4 text-center">
            3 pedidos ativos
            <br />
            Tempo médio: 15 min
          </p>
          <Link href="/live-orders">
            <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-300 text-white rounded font-bold shadow hover:from-blue-600 hover:to-blue-400 transition">
              Ver Pedidos
            </button>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:-translate-y-1 transition-transform">
          <span className="text-4xl mb-3 text-blue-500">📝</span>
          <h3 className="text-xl font-bold mb-2 text-blue-700">
            Gerenciar Cardápio
          </h3>
          <p className="text-gray-700 mb-4 text-center">
            Atualize itens, preços e descrições do cardápio do restaurante.
          </p>
          <Link href="/menu-management">
            <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-300 text-white rounded font-bold shadow hover:from-blue-600 hover:to-blue-400 transition">
              Editar Cardápio
            </button>
          </Link>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-auto pt-8">Powered by ServeAI</p>
    </main>
  );
}
