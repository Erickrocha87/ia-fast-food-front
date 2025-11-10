"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("Clique no microfone para falar 🎙️");

  const handleListen = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("🎧 Ouvindo...");
    };

    recognition.onerror = (e: any) => {
      console.error("Erro no reconhecimento:", e);
      setIsListening(false);
      setStatus("Erro no microfone");
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!isProcessing) setStatus("⏳ Processando...");
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("🗣️ Fala detectada:", transcript);
      onTranscript(transcript);

      setIsProcessing(true);

      try {
        const token = localStorage.getItem("token");
        const chatRes = await fetch("http://localhost:1337/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ message: transcript, tableNumber: "1" }),
        });

        const chatData = await chatRes.json();
        const resposta = chatData.responseMessage ?? "Desculpe, não entendi.";

        console.log("🤖 Resposta IA:", resposta);

        // 🔊 Gera o áudio e toca
        const ttsRes = await fetch("http://localhost:1337/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: resposta }),
        });

        if (!ttsRes.ok) {
          console.error("Erro no TTS:", await ttsRes.text());
          setStatus("⚠️ Erro ao gerar áudio");
          setIsProcessing(false);
          return;
        }

        const audioBlob = await ttsRes.blob();
        console.log("🔊 Tipo de áudio recebido:", audioBlob.type, audioBlob.size);

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.volume = 0.9;
        await audio.play();

        setStatus("✅ Pedido processado!");
      } catch (error) {
        console.error("❌ Erro geral:", error);
        setStatus("Erro ao processar a fala.");
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center gap-2 fixed bottom-6 right-6 z-50">
      <button
        onClick={handleListen}
        disabled={isProcessing}
        className={`rounded-full p-5 shadow-lg transition-all duration-300 ${
          isListening
            ? "bg-red-500 animate-pulse"
            : "bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]"
        } ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <Icon
          icon={
            isListening
              ? "fluent:mic-off-24-filled"
              : "fluent:mic-24-filled"
          }
          className="text-white w-7 h-7"
        />
      </button>
      <p className="text-sm font-medium text-gray-700">{status}</p>
    </div>
  );
};
