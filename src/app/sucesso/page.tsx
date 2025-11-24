"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function PagamentoSucesso() {
  useEffect(() => {
    // efeito sutil de confete
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ece9ff] to-[#f6f4ff] px-6">

      <div className="bg-white shadow-2xl rounded-3xl p-12 border border-gray-100 max-w-lg text-center animate-fadeIn">

        {/* Ícone */}
        <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">🎉</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Pagamento Confirmado!
        </h1>

        <p className="text-gray-600 text-lg">
          Sua assinatura foi ativada com sucesso.  
          Obrigado por confiar na nossa plataforma!
        </p>

        <div className="mt-10 space-y-4">
          <Link
            href="/admin"
            className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl shadow-lg hover:opacity-90 transition font-semibold"
          >
            Ir para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
