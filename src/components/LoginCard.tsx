"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
      router.push("/planos");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/serveai-logo.png"
            alt="ServeAI Logo"
            width={160}
            height={160}
            className="rounded-full bg-transparent"
            priority
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Olá! Bem-vindo ao ServeAI!
        </h2>

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

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-lg shadow hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
          >
            ENTRAR
          </button>

          <div className="flex items-center mb-5">
            <div className="flex-grow h-px bg-gradient-to-r from-blue-200 via-gray-300 to-green-200" />
            <span className="mx-4 text-gray-400 font-semibold">ou</span>
            <div className="flex-grow h-px bg-gradient-to-r from-green-200 via-gray-300 to-blue-200" />
          </div>

          <button
            type="button"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-lg shadow hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
            onClick={() => router.push("/cadastro")}
          >
            CADASTRAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;
