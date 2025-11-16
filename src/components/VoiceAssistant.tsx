"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FaMicrophone, FaSpinner } from "react-icons/fa";

const WS_URL = "ws://localhost:1337/realtime/12";

export function ServeAIRealtimeAssistant() {
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [partialText, setPartialText] = useState("");

  const ws = useRef<WebSocket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioPlayer = useRef<HTMLAudioElement>(null);

  // ========================================================
  // WEBSOCKET
  // ========================================================
  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    ws.current = socket;
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      console.log("WS conectado");
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log("WS fechado");
      setIsConnected(false);
    };

    socket.onmessage = (event) => handleServerMessage(event.data);

    return () => socket.close();
  }, []);

  // ========================================================
  // RECEBENDO DO SERVIDOR
  // ========================================================
  function handleServerMessage(raw: any) {
    if (raw instanceof ArrayBuffer) {
      playAudio(raw);
      return;
    }

    try {
      const msg = JSON.parse(raw);

      if (msg.type === "assistant_text") {
        setPartialText(msg.text);
      }
    } catch {
      console.log("Mensagem não JSON.");
    }
  }

  function playAudio(buffer: ArrayBuffer) {
    const blob = new Blob([buffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    if (audioPlayer.current) {
      audioPlayer.current.src = url;
      audioPlayer.current.play();
    }
  }

  // ========================================================
  // GRAVAR ÁUDIO
  // ========================================================
  const startRecording = async () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    setIsTalking(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // === AUDIO PROCESSING RAW (para medir volume) ===
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 2048;
    source.connect(analyser);

    let speaking = false;

    let lastSpeech = Date.now();

    const detectSpeech = () => {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(data);

      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      speaking = rms > 0.02;

      if (speaking) {
        lastSpeech = Date.now();
      } else {
        if (Date.now() - lastSpeech > 700) {
          // 0.7s de silêncio
          console.log("⛔ AUTO STOP pelo silêncio");
          stopRecording();
          return; // parar o loop
        }
      }

      requestAnimationFrame(detectSpeech);
    };
    detectSpeech();

    // === MEDIA RECORDER (para enviar áudio real ao OpenAI) ===
    const rec = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
      audioBitsPerSecond: 48000,
    });

    rec.ondataavailable = async (e) => {
      if (!speaking) return; // 🔥 IGNORA SILÊNCIO!

      const base64 = await blobToBase64(e.data);

      ws.current?.send(
        JSON.stringify({
          type: "user_audio_chunk",
          audio: base64,
        })
      );
    };

    mediaRecorder.current = rec;

    rec.start(200);
  };

  const stopRecording = () => {
    setIsTalking(false);

    ws.current?.send(
      JSON.stringify({
        type: "user_audio_end",
      })
    );

    mediaRecorder.current?.stop();
  };

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
      reader.readAsDataURL(blob);
    });
  }

  // ========================================================
  // UI
  // ========================================================
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <button
        onClick={() => (isTalking ? stopRecording() : startRecording())}
        disabled={!isConnected}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition text-white
          ${
            isTalking ? "bg-red-500 scale-110" : "bg-blue-500 hover:bg-blue-600"
          }
          ${!isConnected && "bg-gray-500"}
        `}
      >
        {isTalking ? (
          <FaSpinner className="animate-spin text-3xl" />
        ) : (
          <FaMicrophone className="text-3xl" />
        )}
      </button>

      <p className="mt-4 text-gray-700 h-6 text-center">
        {isConnected
          ? isTalking
            ? "Ouvindo..."
            : partialText || "Clique para falar"
          : "Conectando..."}
      </p>

      <audio ref={audioPlayer} hidden />
    </div>
  );
}

export default dynamic(() => Promise.resolve(ServeAIRealtimeAssistant), {
  ssr: false,
});
