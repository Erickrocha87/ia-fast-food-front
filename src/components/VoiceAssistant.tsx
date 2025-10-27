"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FaMicrophone, FaSpinner } from "react-icons/fa";

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTranscript }) => {
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // ✅ Só roda no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 🚀 Quando o usuário para de falar
  useEffect(() => {
    if (!listening && transcript) {
      handleCommand(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, transcript]);

  const speak = (msg: string) => {
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.lang = "pt-BR";
      utterance.onend = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  const handleCommand = async (text: string) => {
    setIsProcessing(true);
    onTranscript(text);

    try {
      // envia para o backend /chat (pra gerar resposta inteligente)
      const chatResponse = await fetch("http://localhost:1337/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!chatResponse.ok) throw new Error("Erro no backend /chat");

      const chatData = await chatResponse.json();
      const resposta = chatData.responseMessage || "Entendido!";

      // 🔊 Fala e espera terminar
      await speak(resposta);
    } catch (error) {
      console.error("Erro ao processar comando:", error);
      await speak("Desculpe, houve um problema ao processar sua fala.");
    } finally {
      setIsProcessing(false);
      resetTranscript();
    }
  };

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: false,
        language: "pt-BR",
      });
    }
  };

  // Evita render SSR
  if (!isClient) return null;

  if (!browserSupportsSpeechRecognition) {
    return <span>Seu navegador não suporta reconhecimento de voz.</span>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={handleMicClick}
        disabled={isProcessing}
        className={`w-20 h-20 cursor-pointer rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out
          ${listening ? "bg-red-500 scale-110" : "bg-blue-500"}
          ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
      >
        {isProcessing ? (
          <FaSpinner className="text-white text-3xl animate-spin" />
        ) : (
          <FaMicrophone className="text-white text-3xl" />
        )}
      </button>
      <p className="mt-4 text-gray-600 h-6">
        {listening
          ? "Ouvindo..."
          : isProcessing
          ? "Processando..."
          : transcript
          ? `Você disse: ${transcript}`
          : "Clique no microfone para falar"}
      </p>
      <audio ref={audioRef} hidden />
    </div>
  );
};

// ✅ Corrige SSR import
export default dynamic(() => Promise.resolve(VoiceAssistant), { ssr: false });
