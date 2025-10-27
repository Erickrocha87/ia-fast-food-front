"use client";
import React, { useState } from "react";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useVoiceCommands } from "../hooks/useVoiceCommands";

const categoriasMenu = ["Entradas", "Pratos Principais", "Bebidas", "Sobremesas"];

const itensMenuData = [
    {
        id: 1,
        categoria: "Pratos Principais",
        nome: "Pizza Margherita Clássica",
        descricao: "Tomates frescos, mussarela, manjericão",
        preco: 18.5,
    },
    {
        id: 2,
        categoria: "Pratos Principais",
        nome: "Hambúrguer Gourmet",
        descricao: "Carne wagyu, maionese trufada, cheddar",
        preco: 16.0,
    },
    {
        id: 3,
        categoria: "Entradas",
        nome: "Tacos Apimentados",
        descricao: "Carnitas de porco, pico de gallo, molho picante",
        preco: 12.0,
    },
    {
        id: 4,
        categoria: "Bebidas",
        nome: "Limonada Fresca",
        descricao: "Feita na hora, super refrescante",
        preco: 7.0,
    },
];

const CustomerOrderMenu = () => {
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Pratos Principais");
    const [itensCarrinho, setItensCarrinho] = useState<any[]>([]);
    const [ultimoComando, setUltimoComando] = useState("");

    // ============================
    // 📦 Funções do carrinho
    // ============================

    const adicionarAoCarrinho = (itemAdicionar: any) => {
        setItensCarrinho((prev) => {
            const existente = prev.find((i) => i.id === itemAdicionar.id);
            if (existente) {
                return prev.map((i) =>
                    i.id === itemAdicionar.id ? { ...i, quantidade: i.quantidade + 1 } : i
                );
            } else {
                return [...prev, { ...itemAdicionar, quantidade: 1 }];
            }
        });
    };

    const removerDoCarrinho = (id: number) => {
        setItensCarrinho((prev) => prev.filter((item) => item.id !== id));
    };

    const aumentarQuantidade = (id: number) => {
        setItensCarrinho((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
            )
        );
    };

    const diminuirQuantidade = (id: number) => {
        setItensCarrinho((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
                )
                .filter((item) => item.quantidade > 0)
        );
    };

    const calcularSubtotal = () =>
        itensCarrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);

    const subtotal = calcularSubtotal();
    const taxa = subtotal * 0.08;
    const total = subtotal + taxa;

    const confirmarPedido = () => {
        alert(
            `Pedido realizado com sucesso!\n\nTotal: R$ ${total.toFixed(
                2
            )}\nItens: ${JSON.stringify(itensCarrinho, null, 2)}`
        );
        setItensCarrinho([]);
    };

    // ============================
    // 🎤 Integração com voz
    // ============================

    useVoiceCommands(ultimoComando, {
        adicionar: (nomeItem: string) => {
            const item = itensMenuData.find((i) =>
                i.nome.toLowerCase().includes(nomeItem.toLowerCase())
            );
            if (item) adicionarAoCarrinho(item);
        },
        remover: (nomeItem: string) => {
            const item = itensMenuData.find((i) =>
                i.nome.toLowerCase().includes(nomeItem.toLowerCase())
            );
            if (item) removerDoCarrinho(item.id);
        },
        finalizar: confirmarPedido,
    });


    // ============================
    // 🖼️ Renderização
    // ============================

    const itensFiltrados = itensMenuData.filter(
        (item) => item.categoria === categoriaSelecionada
    );

    return (
        <div className="flex justify-center items-start min-h-screen bg-white">
            <div className="bg-white w-full max-w-7xl min-h-screen p-10 mx-auto">
                {/* Cabeçalho */}
                <div className="flex flex-col items-center mb-10">
                    <img
                        src="robozinho.png"
                        alt="Mascote ServeAI"
                        className="w-24 h-24 object-contain mb-3"
                    />
                    <h1 className="text-3xl font-bold text-blue-800 mb-1">
                        Cardápio & Pedido
                    </h1>
                    <p className="text-blue-600">
                        Sua jornada gastronômica começa aqui!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Menu */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold text-blue-700 mb-4">
                            Categorias do Cardápio
                        </h2>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {categoriasMenu.map((categoria) => (
                                <button
                                    key={categoria}
                                    onClick={() => setCategoriaSelecionada(categoria)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${categoriaSelecionada === categoria
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        }`}
                                >
                                    {categoria}
                                </button>
                            ))}
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            {itensFiltrados.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col justify-between bg-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-800">{item.nome}</h3>
                                        <p className="text-sm text-blue-600">{item.descricao}</p>
                                        <p className="text-blue-700 font-bold mt-2">
                                            R$ {item.preco.toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <button
                                            onClick={() => adicionarAoCarrinho(item)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carrinho */}
                    <div className="bg-blue-50 p-6 rounded-2xl shadow-md">
                        <h2 className="text-xl font-semibold text-blue-700 mb-4">
                            Seu Carrinho
                        </h2>

                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {itensCarrinho.length === 0 ? (
                                <p className="text-blue-500">Seu carrinho está vazio.</p>
                            ) : (
                                itensCarrinho.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div>
                                            <span className="font-medium text-blue-800">{item.nome}</span>
                                            <p className="text-blue-500">
                                                R$ {item.preco.toFixed(2)} × {item.quantidade}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => diminuirQuantidade(item.id)}
                                                className="bg-white border border-blue-300 text-blue-700 px-2 rounded hover:bg-blue-100"
                                            >
                                                −
                                            </button>
                                            <span>{item.quantidade}</span>
                                            <button
                                                onClick={() => aumentarQuantidade(item.id)}
                                                className="bg-blue-600 text-white px-2 rounded hover:bg-blue-700"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removerDoCarrinho(item.id)}
                                                className="text-red-500 text-xs hover:text-red-700"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border-t border-blue-300 my-4"></div>

                        <div className="space-y-2 text-sm text-blue-700">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>R$ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxa (8%):</span>
                                <span>R$ {taxa.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-blue-800">
                                <span>Total:</span>
                                <span>R$ {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={confirmarPedido}
                            disabled={itensCarrinho.length === 0}
                            className={`mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${itensCarrinho.length === 0
                                ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                        >
                            🛒 Finalizar Pedido
                        </button>
                    </div>
                </div>

                {/* Assistente de Voz */}
                <div className="fixed bottom-6 right-6 z-50">
                    <VoiceAssistant onTranscript={setUltimoComando} />
                </div>

                <p className="text-center text-sm text-blue-500 mt-8">
                    Desenvolvido por <span className="text-blue-700 font-semibold">ServeAI</span>
                </p>
            </div>
        </div>
    );
};

export default CustomerOrderMenu;
