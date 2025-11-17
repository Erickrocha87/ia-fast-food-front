"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanosPage() {
    const router = useRouter();
    const [tipo, setTipo] = useState<"mensal" | "anual">("mensal");

    const planos = [
        {
            id: "basico",
            nome: "Básico",
            precoMensal: 99.9,
            precoAnual: 999.9,
            economia: "Economize R$ 198.90",
            recursos: [
                "Até 3 tablets",
                "Reconhecimento de voz básico",
                "Cardápio digital",
                "Relatórios mensais",
                "Suporte por email",
            ],
            popular: false,
        },
        {
            id: "profissional",
            nome: "Profissional",
            precoMensal: 199.9,
            precoAnual: 1999.9,
            economia: "Economize R$ 398.90",
            recursos: [
                "Até 10 tablets",
                "IA avançada de reconhecimento",
                "Cardápio digital + fotos",
                "Relatórios semanais detalhados",
                "Suporte prioritário 24/7",
                "+2 recursos",
            ],
            popular: true,
        },
        {
            id: "premium",
            nome: "Premium",
            precoMensal: 349.9,
            precoAnual: 3499.9,
            economia: "Economize R$ 698.90",
            recursos: [
                "Tablets ilimitados",
                "IA premium com personalização",
                "Cardápio multimídia completo",
                "Analytics em tempo real",
                "Suporte VIP dedicado",
                "+4 recursos",
            ],
            popular: false,
        },
    ];

    const escolherPlano = (plano: string) => {
        router.push(`/checkout?plano=${plano}&tipo=${tipo}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#eef2ff] px-6 py-10">

            {/* Botão voltar */}
            <button
                onClick={handleLogout}
                className="text-purple-600 font-medium mb-6 hover:underline flex items-center gap-2"
            >
                ← Voltar
            </button>

            <h1 className="text-3xl font-semibold text-gray-800 mb-3">
                Selecione o melhor plano para o seu restaurante
            </h1>

            {/* BOTÕES MENSAL / ANUAL */}
            <div className="flex items-center gap-4 mt-6">
                <button
                    onClick={() => setTipo("mensal")}
                    className={`px-6 py-2 rounded-lg border transition ${tipo === "mensal"
                            ? "bg-purple-600 text-white shadow-md"
                            : "bg-white text-purple-600 border-purple-300"
                        }`}
                >
                    Mensal
                </button>

                <button
                    onClick={() => setTipo("anual")}
                    className={`px-6 py-2 rounded-lg border transition ${tipo === "anual"
                            ? "bg-purple-600 text-white shadow-md"
                            : "bg-white text-purple-600 border-purple-300"
                        }`}
                >
                    Anual (20% OFF)
                </button>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                {planos.map((plano) => (
                    <div
                        key={plano.id}
                        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition flex flex-col h-full"
                    >
                        {plano.popular && (
                            <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full mb-3 inline-block">
                                Popular
                            </span>
                        )}

                        <h3 className="text-xl font-semibold text-gray-800">{plano.nome}</h3>

                        <p className="text-purple-600 font-bold text-2xl mt-3">
                            R$ {tipo === "mensal" ? plano.precoMensal : plano.precoAnual}/
                            {tipo === "mensal" ? "mês" : "ano"}
                        </p>

                        <p className="text-green-500 text-sm">{plano.economia}</p>

                        {/* Lista de recursos */}
                        <ul className="mt-6 space-y-2 text-gray-700 flex-1">
                            {plano.recursos.map((r, i) => (
                                <li key={i} className="flex gap-2 items-center">
                                    <span className="text-purple-500">✔</span>
                                    {r}
                                </li>
                            ))}
                        </ul>

                        {/* BOTÃO ESCOLHER */}
                        <button
                            onClick={() => escolherPlano(plano.id)}
                            className="w-full mt-auto bg-purple-200 text-purple-700 py-3 rounded-lg font-semibold hover:bg-purple-300 transition"
                        >
                            Escolher
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}
