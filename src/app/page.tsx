"use client";

import { useState } from "react";
import Head from "next/head";
import { Icon } from "@iconify/react"; // 👈 importação do Iconify

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Head>
        <title>ServeAI - Login</title>
        <meta
          name="description"
          content="Login ou cadastro no sistema ServeAI - Pedidos Inteligentes"
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#f5f6ff] to-[#eef2ff] flex items-center justify-center font-sans">
        <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden">
          {/* ======= LADO ESQUERDO ======= */}
          <div className="w-full md:w-1/2 bg-[#f8f9ff] p-10 flex flex-col justify-center">
            {/* LOGO */}
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] p-3 rounded-2xl shadow-md flex items-center justify-center">
                <Icon
                  icon="fluent-emoji-flat:robot"
                  className="w-7 h-7 text-white"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  AI Restaurant
                </h1>
                <p className="text-sm text-[#6d4aff] font-medium">
                  Pedidos Inteligentes
                </p>
              </div>
            </div>

            {/* IMAGEM */}
            <div className="rounded-2xl overflow-hidden shadow-md mb-8">
              <img
                src="/tablet-ai.jpg"
                alt="Tablet IA"
                className="w-full h-56 object-cover"
              />
            </div>

            {/* TEXTO */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Revolucione seu atendimento
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              Use IA para anotar pedidos por voz ou tela de forma rápida e
              divertida!
            </p>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-5">
              {/* Pedido por voz */}
              <div className="bg-white border border-[#ececff] shadow-sm rounded-2xl p-5 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-md duration-300">
                <div className="bg-[#8b5cf6] text-white p-3 rounded-xl mb-3 shadow-md flex items-center justify-center">
                  <Icon
                    icon="fluent-emoji-flat:microphone"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-sm font-semibold text-[#7c3aed]">
                  Pedidos por Voz
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  IA que entende seus clientes
                </p>
              </div>

              {/* Interface intuitiva */}
              <div className="bg-white border border-[#e3e8ff] shadow-sm rounded-2xl p-5 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-md duration-300">
                <div className="bg-[#3b82f6] text-white p-3 rounded-xl mb-3 shadow-md flex items-center justify-center">
                  <Icon
                    icon="fluent-emoji-flat:laptop"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-sm font-semibold text-[#2563eb]">
                  Interface Intuitiva
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Simples e eficiente
                </p>
              </div>
            </div>
          </div>

          {/* ======= LADO DIREITO ======= */}
          <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
            <h2 className="text-center text-lg font-semibold text-gray-700 mb-1">
              Bem-vindo! 👋
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Entre ou crie sua conta para começar
            </p>

            {/* Toggle Entrar / Cadastrar */}
            <div className="flex justify-center mb-8 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-1/2 py-2 rounded-full text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white shadow-md"
                    : "text-gray-500"
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`w-1/2 py-2 rounded-full text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-gradient-to-r from-[#f0abfc] to-[#c084fc] text-white shadow-md"
                    : "text-gray-500"
                }`}
              >
                Cadastrar
              </button>
            </div>

            {/* Formulário */}
            <form className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Senha</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="text-sm text-gray-600">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white rounded-lg py-2 font-medium hover:opacity-90 transition"
              >
                {isLogin ? "Entrar 🚀" : "Cadastrar ✨"}
              </button>
            </form>

            {isLogin && (
              <p className="text-right text-sm text-[#5a6cff] mt-4 cursor-pointer hover:underline">
                Esqueceu sua senha?
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
