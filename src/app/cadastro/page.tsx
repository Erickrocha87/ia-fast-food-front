"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Botao";

const LoginCard = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantType, setRestaurantType] = useState("");

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    try {

      // 👉 Aqui você vai chamar o backend futuramente:
      // await api.post("/auth/register", {
      //   email,
      //   password,
      //   restaurantName,
      //   restaurantType,
      // });

      // 👉 Depois que o usuário se cadastra, ele deve logar:
      router.push("/"); // voltar para a tela de login

    } catch (error) {
      console.log("Erro ao cadastrar:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        
        {/* LOGO */}
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

        {/* TÍTULO */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Crie sua conta
        </h2>
        <p className="text-gray-600 mb-6">
          Preencha os dados abaixo para criar sua conta.
        </p>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          {/* Senha */}
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          {/* Nome do Restaurante */}
          <input
            type="text"
            placeholder="Nome do Restaurante"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          {/* Tipo de Restaurante */}
          <input
            type="text"
            placeholder="Tipo de Restaurante"
            value={restaurantType}
            onChange={(e) => setRestaurantType(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          {/* Botão Cadastrar */}
          <Button label="Cadastrar-se" type="submit" />

          {/* Botão Login */}
          <Button
            label="Login"
            type="button"
            onClick={() => router.push("/")}
          />
        </form>
      </div>
    </div>
  );
};

export default LoginCard;
