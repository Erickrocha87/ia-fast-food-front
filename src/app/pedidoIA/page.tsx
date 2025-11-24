"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import ServeAIMicrophone from "@/components/ServeAiMicrophone";
import { eventBus } from "@/lib/eventBus";

const categoriasMenu = ["Todos", "Pizzas", "Lanches", "Bebidas", "Sobremesas"];

export default function PedidoIA() {
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
    const [itensMenu, setItensMenu] = useState<any[]>([]);
    const [itensCarrinho, setItensCarrinho] = useState<any[]>([]);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    // ====================================================================================
    // 🔥 1) RECEBER PEDIDOS DA IA (agora sincronizado com o cardápio real)
    // ====================================================================================
    useEffect(() => {
        const handleAdd = (itemIA) => {
            const menuItem = itensMenu.find((m) => m.id === itemIA.id);
            if (!menuItem) return;

            adicionarAoCarrinho({
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantidade: itemIA.quantidade ?? 1,
            });
        };

        const handleRemove = (itemIA) => {
            setItensCarrinho((prev) =>
                prev
                    .map((item) =>
                        item.id === Number(itemIA.id)
                            ? { ...item, quantidade: item.quantidade - (itemIA.quantidade ?? 1) }
                            : item
                    )
                    .filter((item) => item.quantidade > 0)
            );
        };

        const handleClear = () => setItensCarrinho([]);

        eventBus.on("pedido:add", handleAdd);
        eventBus.on("pedido:remove", handleRemove);
        eventBus.on("pedido:clear", handleClear);

        return () => {
            eventBus.off("pedido:add", handleAdd);
            eventBus.off("pedido:remove", handleRemove);
            eventBus.off("pedido:clear", handleClear);
        };
    }, [itensMenu]); 

    // ====================================================================================
    // 📌 2) CARREGAR CARDÁPIO DO BACKEND
    // ====================================================================================
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:1337/menu", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Erro ao carregar cardápio");
                }

                const data = await res.json();
                setItensMenu(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error("Erro ao buscar menu:", err);
                setErro(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    // ====================================================================================
    // 🛒 3) FUNÇÕES DO CARRINHO
    // ====================================================================================
    const sanitizeItem = (item: any) => {
        return {
            id: Number(item.id),
            name: item.name || item.nome || "Item",
            price: Number(item.price ?? item.preco ?? 0),
            quantidade: Number(item.quantidade ?? 1),
        };
    };

    // ADICIONAR
    const adicionarAoCarrinho = (itemAdicionar: any) => {
        const item = sanitizeItem(itemAdicionar);

        setItensCarrinho((prev) => {
            const existente = prev.find((i) => i.id === item.id);

            if (existente) {
                return prev.map((i) =>
                    i.id === item.id
                        ? { ...i, quantidade: i.quantidade + item.quantidade }
                        : i
                );
            }

            return [...prev, item];
        });
    };

    // REMOVER
    const removerDoCarrinho = (id: number) =>
        setItensCarrinho((prev) => prev.filter((item) => item.id !== id));

    // AUMENTAR QUANTIDADE
    const aumentarQuantidade = (id: number) =>
        setItensCarrinho((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            )
        );

    // DIMINUIR QUANTIDADE
    const diminuirQuantidade = (id: number) =>
        setItensCarrinho((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? { ...item, quantidade: item.quantidade - 1 }
                        : item
                )
                .filter((item) => item.quantidade > 0)
        );

    // TOTAL 100% SEGURO
    const total = itensCarrinho.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantidade),
        0
    );
    // ====================================================================================
    // 🔍 4) FILTRO DE BUSCA
    // ====================================================================================
    const itensFiltrados = itensMenu.filter((item) => {
        const matchCategoria =
            categoriaSelecionada === "Todos" ||
            item.categoria === categoriaSelecionada;

        const matchBusca = (item.name || "")
            .toLowerCase()
            .includes(busca.toLowerCase());

        return matchCategoria && matchBusca;
    });

    // ====================================================================================
    // 🖥️  INTERFACE
    // ====================================================================================
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f3f2ff] to-[#ebe9ff] p-6">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-xl font-semibold text-[#4b3fff]">
                            Atendimento Inteligente – ServeAI
                        </h1>
                        <p className="text-gray-500">Mesa Atual</p>
                    </div>
                </div>

                <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ================================================================================= */}
                    {/* ASSISTENTE + CARDÁPIO */}
                    {/* ================================================================================= */}
                    <section className="lg:col-span-2">

                        {/* ASSISTENTE */}
                        <div className="bg-white border border-[#dcd8ff] rounded-3xl p-10 shadow-sm mb-8">
                            <h2 className="text-lg font-semibold text-[#4b3fff] mb-6 flex items-center gap-2">
                                <Icon icon="fluent:bot-24-filled" className="w-5 h-5 text-[#7b4fff]" />
                                Assistente Virtual
                            </h2>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-56 h-56 bg-gradient-to-br from-[#9f7aea] to-[#3b82f6] rounded-3xl flex items-center justify-center shadow-xl">
                                    <Icon icon="fluent:bot-24-filled" className="text-white w-28 h-28" />
                                </div>

                                <p className="mt-6 text-gray-600 text-sm">👂 Pronto para ouvir</p>
                                <p className="text-gray-400 text-xs mb-6">
                                    Clique no botão abaixo para começar
                                </p>

                                <ServeAIMicrophone />
                            </div>
                        </div>

                        {/* BUSCA */}
                        <div className="w-full mb-6">
                            <div className="flex items-center bg-white rounded-xl shadow-sm border border-[#e6e4ff] px-4 py-2">
                                <Icon icon="fluent:search-20-regular" className="text-[#6b46ff] w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar no cardápio..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="flex-1 ml-3 outline-none text-sm bg-transparent text-gray-700"
                                />
                            </div>
                        </div>


                        {/* LISTA DE ITENS */}
                        {loading ? (
                            <p className="text-gray-500">Carregando cardápio...</p>
                        ) : erro ? (
                            <p className="text-red-500">Erro: {erro}</p>
                        ) : itensFiltrados.length === 0 ? (
                            <p className="text-gray-500">Nenhum item encontrado.</p>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-5">
                                {itensFiltrados.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white border border-[#e6e4ff] rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                                    >
                                        <div>
                                            <h3 className="text-base font-semibold text-[#4338ca]">
                                                {item.name}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                {item.description}
                                            </p>

                                            <p className="font-semibold text-[#4b38ff] mt-2">
                                                R$ {item.price.toFixed(2)}
                                            </p>
                                        </div>

                                        
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ================================================================================= */}
                    {/* CARRINHO */}
                    {/* ================================================================================= */}
                    <aside className="bg-white border border-[#e6e4ff] rounded-3xl p-6 shadow-md h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-[#4b38ff]">Carrinho</h2>

                            {itensCarrinho.length > 0 && (
                                <span className="text-xs bg-[#edeaff] text-[#4c33ff] px-2 py-0.5 rounded-full">
                                    {itensCarrinho.length} item{itensCarrinho.length > 1 && "s"}
                                </span>
                            )}
                        </div>

                        {itensCarrinho.length === 0 ? (
                            <p className="text-sm text-gray-500">Nenhum item no carrinho.</p>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {itensCarrinho.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center bg-[#fafaff] border border-[#f0edff] rounded-xl px-3 py-2"
                                    >
                                        <div>
                                            <p className="font-medium text-[#4c33ff]">{item.name}</p>
                                            <span className="text-xs text-gray-500">
                                                R$ {(item.price ?? 0).toFixed(2)} × {item.quantidade}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => diminuirQuantidade(item.id)}
                                                className="border border-[#d1d1ff] text-[#4b38ff] w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#edeaff]"
                                            >
                                                −
                                            </button>

                                            <span>{item.quantidade}</span>

                                            <button
                                                onClick={() => aumentarQuantidade(item.id)}
                                                className="bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white w-6 h-6 rounded-full flex items-center justify-center hover:opacity-90"
                                            >
                                                +
                                            </button>

                                            <button
                                                onClick={() => removerDoCarrinho(item.id)}
                                                className="text-red-500 hover:text-red-700 text-xs"
                                            >
                                                <Icon icon="fluent:delete-20-filled" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-[#eeeaff] my-4"></div>

                        <div className="space-y-1 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span>Total:</span>
                                <span className="font-semibold text-[#4b38ff]">
                                    R$ {total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}
