"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PagamentoFalha() {
  const params = useSearchParams();

  const plano = params.get("plano") ?? "basico";
  const tipo = params.get("tipo") ?? "mensal";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f1f7] to-[#fafafa] px-6">

      <div className="bg-white shadow-2xl rounded-3xl p-12 border border-gray-200 max-w-lg text-center animate-fadeIn">

        <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl text-red-500">⚠️</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Pagamento não concluído
        </h1>

        <p className="text-gray-600 text-lg">
          Algo deu errado ao processar seu pagamento.  
          Você pode tentar novamente ou escolher outro método.
        </p>

        <div className="mt-10 space-y-4">
          <Link
            href={`/checkout?plano=${plano}&tipo=${tipo}`}
            className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 
                       text-white py-3 rounded-xl shadow-lg hover:opacity-90 
                       transition font-semibold"
          >
            Tentar Novamente
          </Link>

          <Link
            href="/planos"
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl 
                       hover:bg-gray-200 transition font-medium"
          >
            Voltar aos Planos
          </Link>
        </div>

      </div>

    </div>
  );
}
