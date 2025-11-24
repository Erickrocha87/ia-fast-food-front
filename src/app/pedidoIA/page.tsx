"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import ServeAIMicrophone from "@/components/ServeAiMicrophone";
import { eventBus } from "@/lib/eventBus";

export default function PedidoIA() {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [menu, setMenu] = useState<any[]>([]);
    const [loadingMenu, setLoadingMenu] = useState(true);

    // ==========================
    // BUSCAR CARDÁPIO
    // ==========================
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await fetch("http://localhost:1337/menu");
                const data = await res.json();
                setMenu(data);
            } catch (err) {
                console.error("Erro ao carregar cardápio:", err);
            } finally {
                setLoadingMenu(false);
            }
        };
        fetchMenu();
    }, []);

    useEffect(() => {
        const limparPedidos = () => {
            console.log("🧹 Limpando pedidos após a IA parar...");
            setPedidos([]);
        };

        eventBus.on("ia:stop", limparPedidos);

        return () => {
            // Se o seu EventBus tivesse off, colocaria aqui — mas não tem.
            // Então não precisa remover.
        };
    }, []);

    // ==========================
    // RECEBER PEDIDOS DA IA
    // ==========================
    useEffect(() => {
        eventBus.on("pedido:add", (data) => {
            setPedidos((prev) => {
                const existente = prev.find((p) => p.id === data.id);
                if (existente) {
                    return prev.map((p) =>
                        p.id === data.id
                            ? { ...p, quantidade: p.quantidade + (data.quantity ?? 1) }
                            : p
                    );
                }

                const item = menu.find((m) => m.id === data.id);
                if (!item) return prev;

                return [...prev, { ...item, quantidade: data.quantity ?? 1 }];
            });
        });

        eventBus.on("pedido:remove", (data) => {
            setPedidos((prev) =>
                prev
                    .map((p) =>
                        p.id === data.id ? { ...p, quantidade: p.quantidade - 1 } : p
                    )
                    .filter((p) => p.quantidade > 0)
            );
        });
    }, [menu]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f3f2ff] to-[#ebe9ff] p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-xl font-semibold text-[#4b3fff]">
                            ServeAI – Atendimento Inteligente
                        </h1>
                        <p className="text-gray-500">Mesa 05 - Garçom Virtual</p>
                    </div>

                    {/* Removido: Configurações e Sair */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Assistente */}
                    <div className="bg-white border border-[#dcd8ff] rounded-3xl p-10 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#4b3fff] mb-6 flex items-center gap-2">
                            <Icon icon="fluent:bot-24-filled" className="w-5 h-5 text-[#7b4fff]" />
                            Assistente Virtual
                        </h2>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-56 h-56 bg-gradient-to-br from-[#9f7aea] to-[#3b82f6] rounded-3xl flex items-center justify-center shadow-xl">
                                <Icon icon="fluent:bot-24-filled" className="text-white w-28 h-28" />
                            </div>

                            <p className="mt-6 text-gray-600 text-sm">👂 Pronto para ouvir</p>
                            <p className="text-gray-400 text-xs mb-6">Clique no botão abaixo para começar</p>

                            <div className="w-full max-w-sm">
                                <ServeAIMicrophone />
                            </div>
                        </div>
                    </div>

                    {/* Pedidos anotados */}
                    <div className="bg-white border border-[#dcd8ff] rounded-3xl p-10 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#4b3fff] mb-6 flex items-center gap-2">
                            <Icon icon="fluent:cart-24-regular" className="w-5 h-5 text-[#7b4fff]" />
                            Pedidos Anotados
                        </h2>

                        {pedidos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <Icon icon="fluent:cart-24-regular" className="w-16 h-16 text-[#d4ccff]" />
                                <p className="text-[#7b4fff] font-medium mt-4">Nenhum pedido ainda</p>
                                <p className="text-gray-500 text-sm">Use o reconhecimento de voz para fazer seu pedido</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                                {pedidos.map((p) => (
                                    <div
                                        key={p.id}
                                        className="p-4 border border-[#eceaff] bg-[#fafaff] rounded-xl shadow-sm"
                                    >
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium text-[#4b38ff]">{p.name}</p>
                                            <span className="text-sm text-gray-500">
                                                {p.quantidade} × R$ {p.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* ===========================
              CARDÁPIO COMPLETO
        =========================== */}
                <div className="mt-10 bg-white border border-[#dcd8ff] rounded-3xl p-10 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#4b3fff] mb-6 flex items-center gap-2">
                        <Icon icon="fluent:food-24-regular" className="w-6 h-6 text-[#7b4fff]" />
                        Cardápio Completo
                    </h2>

                    {loadingMenu ? (
                        <p className="text-gray-500">Carregando cardápio...</p>
                    ) : menu.length === 0 ? (
                        <p className="text-gray-400">Nenhum item disponível.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {menu.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-[#e5e1ff] rounded-2xl p-5 bg-[#fafaff] hover:shadow-md transition"
                                >
                                    <h3 className="text-base font-semibold text-[#4b38ff]">{item.name}</h3>
                                    {item.description && (
                                        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                                    )}
                                    <p className="mt-2 font-semibold text-[#6d4aff]">
                                        R$ {item.price.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
