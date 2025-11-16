"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Botao";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
      router.push("/home");
  };

  return (
    <>
      <Head>
        <title>ServeAI - Login</title>
        <meta
          name="description"
          content="Login para o sistema AI OrderAssist da ServeAI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
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
                <TextInput type="text"
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

              <Button
                type="submit" 
                label="ENTRAR"
                onClick={handleLogin} 
                disabled={!email || !password}
              />
              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-500 hover:text-blue-700 hover:underline">
                  Esqueceu sua senha?
                </a>
              </div>

              <div className="flex items-center mb-5">
                <div className="flex-grow h-px bg-gradient-to-r from-blue-200 via-gray-300 to-green-200" />
                <span className="mx-4 text-gray-400 font-semibold">ou</span>
                <div className="flex-grow h-px bg-gradient-to-r from-green-200 via-gray-300 to-blue-200" />
              </div>

              <Button
                type="button"
                label="CADASTRAR"
                onClick={() => router.push("/cadastro")}
              />
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;