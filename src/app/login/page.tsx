"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Botao";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const result = await login({ email, password });

      if (result.hasSubscription) {
        // já tem plano → vai direto pro painel
        router.push("/admin");
      } else {
        // não tem plano → 1º acesso "prático" → vai pra escolher plano
        router.push("/planos");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      // aqui se quiser colocar um toast de erro depois
    }
  };

  return (
    <div className="w-full h-screen flex overflow-hidden bg-[#f5f6ff]">
      {/* LADO ESQUERDO */}
      <div className="hidden md:flex w-1/2 h-full bg-gradient-to-br from-[#7b4fff] via-[#a855f7] to-[#3b82f6] items-center justify-center text-white relative">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#ffffff33,transparent_70%),radial-gradient(circle_at_80%_80%,#ffffff22,transparent_60%)]" />

        <div className="relative text-center px-10">
          <h2 className="text-3xl font-semibold mb-3">
            Primeira vez por aqui?
          </h2>
          <p className="text-white/80 mb-6">
            Crie sua conta e comece a usar o atendimento inteligente do ServeAI.
          </p>

          <button
            onClick={() => router.push("/register")}
            className="px-6 py-2 border border-white/70 rounded-full hover:bg-white hover:text-[#7b4fff] transition text-sm font-medium"
          >
            Criar conta
          </button>
        </div>
      </div>

      {/* LADO DIREITO / FORM */}
      <div className="w-full md:w-1/2 h-full bg-white flex flex-col">
        <div className="px-10 pt-10 flex items-center gap-4">
          <div className="flex items-center justify-center">
            <Image
              src="/serveai-logo.png"
              alt="ServeAI Logo"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>

          <div className="leading-tight">
            <p className="text-3xl font-bold text-gray-800">ServeAI</p>
            <p className="text-lg text-[#6d4aff] font-medium">
              Pedidos Inteligentes
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Entrar na conta
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Acesse seu restaurante e acompanhe seus pedidos.
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="voce@seudominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7b4fff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7b4fff]"
              />
            </div>

            <Button label="Entrar" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
