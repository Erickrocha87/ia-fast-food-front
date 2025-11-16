"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Botao";
import { TextInput } from "@/components/TextInput";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantType, setRestaurantType] = useState("");
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
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
            <TextInput
              type="text"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Senha
            </label>
            <TextInput
              type="password"
              id="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="restaurantName" className="sr-only">
              Nome do Restaurante
            </label>
            <TextInput
              type="text"
              id="restaurantName"
              placeholder="Nome do Restaurante"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="restaurantType" className="sr-only">
              Tipo de Restaurante
            </label>
           <TextInput
              type="text"
              id="restaurantType"
              placeholder="Tipo de Restaurante"
              value={restaurantType}
              onChange={(e) => setRestaurantType(e.target.value)}
              required
            />
          </div>

          <Button
            label="Cadastrar-se"
            type="submit"
            onClick={() => router.push("/")}
          />

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

export default RegisterPage;
