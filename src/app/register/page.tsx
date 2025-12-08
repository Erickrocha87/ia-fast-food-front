"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/Botao";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromPlan = searchParams.get("fromPlan");
  const plano = searchParams.get("plano");

  // 👇 Evita toast duplicado apenas neste mount (Strict Mode)
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (fromPlan === "1" && !toastShownRef.current) {
      toast.success("Se cadastre antes de escolher um plano");
      toastShownRef.current = true;
    }
  }, [fromPlan, plano]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantType, setRestaurantType] = useState("");
  const { register } = useRegister();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await register({
        email,
        password,
        restaurantName,
        restaurantType,
      });

      router.push("/login");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error("Erro ao registrar. Verifique os dados.");
    }
  };

  return (
    <div className="w-full h-screen flex overflow-hidden bg-[#f5f6ff]">
      {/* TOASTER */}
      <Toaster position="top-right" />

      {/* LADO ESQUERDO */}
      <div className="hidden md:flex w-1/2 h-full bg-gradient-to-br from-[#7b4fff] via-[#a855f7] to-[#3b82f6] items-center justify-center text-white relative">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#ffffff33,transparent_70%),radial-gradient(circle_at_80%_80%,#ffffff22,transparent_60%)]" />

        <div className="relative text-center px-10">
          <h2 className="text-3xl font-semibold mb-3">Já possui conta?</h2>
          <p className="text-white/80 mb-6">
            Clique no botão abaixo para acessar o painel do ServeAI.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 border border-white/70 rounded-full hover:bg-white hover:text-[#7b4fff] transition text-sm font-medium"
          >
            Fazer login
          </button>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="w-full md:w-1/2 h-full bg-white flex flex-col">
        <div className="px-10 pt-10 flex items-center gap-4">
          <Image
            src="/serveai-logo.png"
            alt="ServeAI Logo"
            width={96}
            height={96}
            className="object-contain"
          />

          <div className="leading-tight">
            <p className="text-3xl font-bold text-gray-800">ServeAI</p>
            <p className="text-lg text-[#6d4aff] font-medium">
              Pedidos Inteligentes
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Criar uma nova conta
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Preencha os campos abaixo para cadastrar seu restaurante.
          </p>

          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do restaurante
              </label>
              <input
                type="text"
                placeholder="Ex: Pizzaria do João"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7b4fff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de restaurante
              </label>
              <input
                type="text"
                placeholder="Hamburgueria, Pizzaria, Sushi..."
                value={restaurantType}
                onChange={(e) => setRestaurantType(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7b4fff]"
              />
            </div>

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
                placeholder="Crie uma senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7b4fff]"
              />
            </div>

            <Button label="Cadastrar" type="submit" />

            <p className="text-xs text-gray-500">
              Ao clicar em Cadastrar você concorda com nossos{" "}
              <span className="underline cursor-pointer">Termos de Uso</span> e{" "}
              <span className="underline cursor-pointer">
                Política de Privacidade
              </span>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
