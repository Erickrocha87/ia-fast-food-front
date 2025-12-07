"use client";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { PlanosHome } from "@/components/PlanosHome";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>ServeAI - Pedidos Inteligentes para Restaurantes</title>
        <meta
          name="description"
          content="ServeAI - IA para restaurantes que realiza pedidos por voz ou tela de forma rápida e divertida."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#f5f6ff] to-[#eef2ff] text-gray-800 flex flex-col">

        <header className="w-full">
          <div className="w-full px-6 lg:px-24 py-5 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <Image
                  src="/serveai-logo.png"
                  alt="ServeAI Logo"
                  width={96}
                  height={96} 
                  className="object-contain"
                />
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500">
              <a href="#como-funciona" className="hover:text-[#7b4fff]">
                Como funciona
              </a>
              <a href="#beneficios" className="hover:text-[#7b4fff]">
                Benefícios
              </a>
              <a href="#planos" className="hover:text-[#7b4fff]">
                Planos
              </a>
              <a href="#faq" className="hover:text-[#7b4fff]">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white rounded-full px-4 py-2 shadow-md hover:opacity-90"
              >
                Login
              </Link>
            </div>
          </div>
        </header>

        <section className="w-full">
          <div
            className="
            w-full
            px-6 lg:px-24
            pt-6 md:pt-12
            pb-12
            flex flex-col items-center justify-center
            text-center
            min-h-[60vh]
            max-w-4xl mx-auto
            "
          >
         
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-[#e3e8ff] rounded-full px-3 py-1 text-xs text-[#6d4aff] font-medium mb-4 shadow-sm">
                <span className="text-lg">✨</span>
                IA para atendimento em restaurantes
              </div>

              <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
                Deixa que a{" "}
                <span className="bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] bg-clip-text text-transparent">
                  IA anota os pedidos
                </span>{" "}
                enquanto você cuida do seu restaurante.
              </h2>

              <p className="text-sm md:text-base text-gray-600 mb-6">
                ServeAI transforma seu atendimento em algo rápido, divertido e
                organizado. Seus clientes fazem pedidos por voz ou pela tela, e
                a cozinha recebe tudo prontinho, sem confusão.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
                <span className="bg-white border border-[#e3e8ff] rounded-full px-3 py-1">
                  🧠 Assistente com IA em português
                </span>
                <span className="bg-white border border-[#e3e8ff] rounded-full px-3 py-1">
                  🛎️ Ideal para bares, lanchonetes e pizzarias
                </span>
                <span className="bg-white border border-[#e3e8ff] rounded-full px-3 py-1">
                  📊 Pedidos organizados em tempo real
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="como-funciona"
          className="w-full bg-white border-y border-[#e3e8ff]"
        >
          <div className="w-full px-6 lg:px-24 py-10 md:py-14">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                Como o ServeAI funciona na prática?
              </h3>
              <p className="text-sm text-gray-600">
                Em poucos passos, seu restaurante já pode receber pedidos com
                IA.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#f8f9ff] border border-[#e3e8ff] rounded-2xl p-5 text-center">
                <div className="mb-3 flex justify-center">
                  <div className="bg-[#7b4fff] text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-md">
                    1
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Crie sua conta
                </h4>
                <p className="text-xs text-gray-600">
                  Cadastre seu restaurante, configure cardápio e áreas de
                  atendimento (mesas, balcão, delivery).
                </p>
              </div>

              <div className="bg-[#f8f9ff] border border-[#e3e8ff] rounded-2xl p-5 text-center">
                <div className="mb-3 flex justify-center">
                  <div className="bg-[#3b82f6] text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-md">
                    2
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Ative o atendimento com IA
                </h4>
                <p className="text-xs text-gray-600">
                  Use tablet, totem ou seu próprio celular para deixar a IA
                  pronta para ouvir seus clientes.
                </p>
              </div>

              <div className="bg-[#f8f9ff] border border-[#e3e8ff] rounded-2xl p-5 text-center">
                <div className="mb-3 flex justify-center">
                  <div className="bg-[#6366f1] text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-md">
                    3
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Receba pedidos organizados
                </h4>
                <p className="text-xs text-gray-600">
                  Cada pedido cai em tempo real na cozinha, com itens,
                  observações e mesa identificada.
                </p>
              </div>
            </div>
          </div>
        </section>

  
        <section id="beneficios" className="w-full">
          <div className="w-full px-6 lg:px-24 py-10 md:py-14">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-[#e3e8ff] rounded-2xl p-5 shadow-sm">
                <div className="bg-[#8b5cf6] text-white p-3 rounded-xl mb-3 inline-flex">
                  <Icon
                    icon="fluent-emoji-flat:microphone"
                    className="w-7 h-7"
                  />
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">
                  Pedidos por voz
                </h4>
                <p className="text-xs text-gray-600">
                  A IA entende o que o cliente fala e transforma isso em pedidos
                  prontos para a cozinha.
                </p>
              </div>

              <div className="bg-white border border-[#e3e8ff] rounded-2xl p-5 shadow-sm">
                <div className="bg-[#3b82f6] text-white p-3 rounded-xl mb-3 inline-flex">
                  <Icon icon="fluent-emoji-flat:laptop" className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">
                  Interface intuitiva
                </h4>
                <p className="text-xs text-gray-600">
                  Qualquer funcionário consegue usar em minutos, sem
                  treinamentos complexos.
                </p>
              </div>

              <div className="bg-white border border-[#e3e8ff] rounded-2xl p-5 shadow-sm">
                <div className="bg-[#f97316] text-white p-3 rounded-xl mb-3 inline-flex">
                  <Icon
                    icon="fluent-emoji-flat:chart-increasing"
                    className="w-7 h-7"
                  />
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">
                  Mais giro de mesa
                </h4>
                <p className="text-xs text-gray-600">
                  Atendimento mais rápido, menos erros e mais clientes atendidos
                  por noite.
                </p>
              </div>
            </div>
          </div>
        </section>

        <PlanosHome />

        <section id="faq" className="w-full">
          <div className="w-full px-6 lg:px-24 py-10 md:py-14">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Dúvidas frequentes
            </h3>

            <div className="space-y-4 text-sm">
              <details className="bg-white border border-[#e3e8ff] rounded-2xl p-4">
                <summary className="cursor-pointer font-medium text-gray-800">
                  Preciso de equipamentos especiais para usar o ServeAI?
                </summary>
                <p className="mt-2 text-gray-600 text-sm">
                  Não. Você pode usar tablets, computadores ou até o seu próprio
                  celular, desde que tenham acesso à internet e navegador
                  moderno.
                </p>
              </details>

              <details className="bg-white border border-[#e3e8ff] rounded-2xl p-4">
                <summary className="cursor-pointer font-medium text-gray-800">
                  A IA entende sotaques e barulho de ambiente?
                </summary>
                <p className="mt-2 text-gray-600 text-sm">
                  Sim, a IA é treinada para entender português em diferentes
                  sotaques. Em ambientes muito barulhentos, você pode combinar
                  pedidos por voz com a tela toque.
                </p>
              </details>
            </div>
          </div>
        </section>

        <footer className="w-full border-t border-[#e3e8ff] bg-white">
          <div className="w-full px-6 lg:px-24 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>
              © {new Date().getFullYear()} ServeAI - Todos os direitos
              reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#7b4fff]">
                Termos de uso
              </a>
              <a href="#" className="hover:text-[#7b4fff]">
                Política de privacidade
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
