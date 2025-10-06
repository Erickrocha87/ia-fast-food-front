"use client";

import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FaMicrophone, FaSpinner } from "react-icons/fa";

export const VoiceAssistant = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening && transcript) {
      sendTranscriptToBackend(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, transcript]);

  //envia texto pro backend
  const sendTranscriptToBackend = async (text: string) => {
    setIsProcessing(true);
    try {
      const chatResponse = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!chatResponse.ok) {
        throw new Error(`Erro na rota /chat: ${chatResponse.statusText}`);
      }

      const chatData = await chatResponse.json();
  
      //envia a resposta do chat pro TTS
      const ttsResponse = await fetch("http://localhost:3000/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chatData.responseMessage }),
      });

      if (!ttsResponse.ok) {
        throw new Error(`Erro na rota /api/tts: ${ttsResponse.statusText}`);
      }

      const audioBlob = await ttsResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      //reproduz o áudio recebido
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Erro ao se comunicar com o backend:", error);
    } finally {
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
          ? "ouvindo"
          : isProcessing
          ? "processando"
          : transcript
          ? `eu disse: ${transcript}`
          : "Clique no microfone para falar"}
      </p>
      <audio ref={audioRef} onEnded={() => setIsProcessing(false)} hidden />
    </div>
  );
};
