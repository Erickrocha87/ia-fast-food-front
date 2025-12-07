"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SucessoPage() {
  const router = useRouter();
  const search = useSearchParams();

  const plano = search.get("plano"); 
  const tipo = search.get("tipo");

  useEffect(() => {
    async function ativarAssinatura() {
      if (!plano || !tipo) return;
      const userId = 1; 

      await fetch("http://localhost:1337/subscription/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          planSlug: plano,
          tipo,
        }),
      });
    }

    ativarAssinatura();
  }, [plano, tipo]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Pagamento aprovado! 🎉</h1>
        <p className="text-gray-600">
          Sua assinatura do plano <b>{plano}</b> ({tipo}) foi registrada.
        </p>
      </div>
    </div>
  );
}
