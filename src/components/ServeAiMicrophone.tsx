"use client";

import React, { useRef, useState, useCallback } from "react";
import { Icon } from "@iconify/react";

// [CORREÇÃO] Apontar para o seu backend na porta 1337
const BACKEND_URL = "http://localhost:1337";

export default function ServeAIMicrophone() {
  // --- Estado do React ---
  const [status, setStatus] = useState("idle"); // idle, preparing, listening
  const [transcript, setTranscript] = useState("(fala do cliente → texto)");

  // --- Refs (para valores que não disparam renderização) ---
  const pc = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  const micStream = useRef<MediaStream | null>(null);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const transcriptBuffer = useRef(""); // Buffer para transcrição

  // --- 1) Utilitários ---
  const send = (event: any) => {
    if (dataChannel.current?.readyState === "open") {
      dataChannel.current.send(JSON.stringify(event));
    }
  };

  // --- 2) Tools (Implementação) ---
  // Deixei uma tool de exemplo, pois o código de 'tool_call' é necessário
  const tools = {
    get_order_summary: () => {
      console.log("[TOOL] get_order_summary chamada");
      return { items: [], total: 0 };
    },
  };

  // --- 2b) Tools (Definição/Schema) ---
  const getSystemInstructions = () => {
    return "Você é um assistente de voz. Fale em português do Brasil.";
  };

  const toolDefs = [
    {
      type: "function",
      name: "get_order_summary",
      description: "Return a summary of the order with total",
      parameters: { type: "object", properties: {} },
    },
  ];

  // --- 4) Realtime WebRTC: start/stop ---
  const start = async () => {
    setStatus("preparing…");

    // 1) Pega token efêmero do NOSSO backend
    // [CORREÇÃO] Usando a URL completa do backend
    const token = await fetch(`${BACKEND_URL}/session`).then((r) => r.json());
    if (token.error) {
      alert(`Erro ao pegar token: ${token.error}`);
      setStatus("idle");
      return;
    }

    // 2) Cria conexão WebRTC
    const peerConnection = new RTCPeerConnection();
    pc.current = peerConnection;

    const dc = peerConnection.createDataChannel("oai-events");
    dataChannel.current = dc;
    dc.onopen = () => {
      setStatus("listening");
      console.log("IA está escutando o áudio!");
      // Atualiza sessão com instruções e tools
      send({
        type: "session.update",
        session: {
          instructions: getSystemInstructions(),
          tools: toolDefs,
        },
      });
      send({ type: "input_audio_buffer.commit" });
      send({
        type: "response.create",
        response: {
          instructions: "Converse em português do Brasil sempre.",
          modalities: ["audio"],
        },
      });
    };
    dc.onmessage = onEventFromModel;

    // Áudio remoto (voz do modelo)
    if (!audioPlayer.current) {
      audioPlayer.current = new Audio();
      audioPlayer.current.autoplay = true;
    }
    peerConnection.ontrack = (e) => {
      if (audioPlayer.current) {
        audioPlayer.current.srcObject = e.streams[0];
      }
    };

    // Microfone local
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStream.current = stream;
    stream.getTracks().forEach((t) => peerConnection.addTrack(t, stream));

    // 3) Troca SDP com OpenAI
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const sdpResponse = await fetch(
      "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
      {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${token.client_secret.value}`,
          "Content-Type": "application/sdp",
        },
      }
    );
    const answer = { type: "answer", sdp: await sdpResponse.text() };
    await peerConnection.setRemoteDescription(
      answer as RTCSessionDescriptionInit
    );
  };

  const stop = () => {
    try {
      dataChannel.current?.close();
    } catch (e) {}
    try {
      pc.current?.close();
    } catch (e) {}
    micStream.current?.getTracks().forEach((t) => t.stop());
    setStatus("idle");
  };

  // --- 5) Event loop Realtime ---
  const onEventFromModel = (msg: MessageEvent) => {
    let ev;
    try {
      ev = JSON.parse(msg.data);
    } catch {
      return;
    }

    // Transcrição
    if (ev.type === "response.audio_transcript.delta" && ev.delta) {
      transcriptBuffer.current += ev.delta;
      setTranscript(transcriptBuffer.current);
    }
    if (ev.type === "response.audio_transcript.done" && ev.transcript) {
      setTranscript(ev.transcript);
      transcriptBuffer.current = "";
    }

    // Tool calling
    if (
      ev.type === "response.output_item.done" &&
      ev.item?.type === "function_call"
    ) {
      let args = ev.item.arguments;
      if (typeof args === "string") {
        try {
          args = JSON.parse(args);
        } catch {
          args = {};
        }
      }

      console.log("[IA] Chamou", ev.item.name, args);
      const name = ev.item.name as keyof typeof tools;
      const impl = tools[name];
      let toolResult = { ok: false, error: "unknown tool" };

      try {
        toolResult = impl ? (impl as Function)(args || {}) : toolResult;
      } catch (e: any) {
        toolResult = { ok: false, error: e.message };
      }

      // Retorna a saída da tool
      send({
        type: "tool_output.create",
        tool_output: {
          tool_call_id: ev.item.id,
          content: [{ type: "output_text", text: JSON.stringify(toolResult) }],
        },
      });

      // Diga ao modelo para continuar (em áudio)
      send({ type: "response.create", response: { modalities: ["audio"] } });
    }
  };

  // --- 6) UI (JSX) ---
  const isRecording = status === "listening" || status === "preparing";

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">WebRTC Audio</h1>
        <div className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
          {status}
        </div>
      </div>

      <button
        onClick={isRecording ? stop : start}
        className={`px-4 py-2 rounded-lg text-white font-bold flex items-center justify-center gap-2 ${
          isRecording
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <Icon icon="fluent:mic-24-filled" />
        {isRecording ? "Parar Gravação" : "Iniciar Gravação"}
      </button>

      <div className="border border-gray-300 rounded-xl p-4 min-h-[100px]">
        <h3 className="font-bold text-lg mb-2">Transcrição</h3>
        <div className="text-gray-700 whitespace-pre-wrap">{transcript}</div>
      </div>
    </div>
  );
}
