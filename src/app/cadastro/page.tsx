"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QuickToast from "@/components/ToastQuick";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
   const [showToast, setShowToast] = useState(false);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      router.push("/home");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <div className="flex justify-center mb-2">
          <Image
            src="/serveai-logo.png"
            alt="ServeAI Logo"
            width={160}
            height={160}
            className="rounded-full bg-transparent"
            priority
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Crie sua conta
          </h2>
          <p className="text-gray-600 mb-6">
            Preencha os dados abaixo para criar sua conta.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="text"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Senha
            </label>
            <input
              type="password"
              id="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="restaurantName" className="sr-only">
              Nome do Restaurante
            </label>
            <input
              type="text"
              id="email"
              placeholder="Nome do Restaurante"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="restaurantType" className="sr-only">
              Tipo de Restaurante
            </label>
            <input
              type="text"
              id="restaurantType"
              placeholder="Tipo de Restaurante"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-lg shadow hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
          >
            CADASTRAR-SE
          </button>

          <button
            type="button"
            className="w-full mt-1 text-gray-500 text-sm underline hover:text-gray-700 transition cursor-pointer"
            onClick={() => router.push("/")}
          >
            Faça login
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-6">Powered by ServeAI</p>
      </div>
        {showToast && ( <QuickToast message="Cadastro feito com sucesso" type="success" onClose={() => setShowToast(false)} duration={3000} /> )}
    </div>
  );
};

export default LoginCard;
