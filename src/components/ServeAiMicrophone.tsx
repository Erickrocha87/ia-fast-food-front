"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { eventBus } from "@/lib/eventBus";

type StatusLabel = "Clique para falar" | "Conectando" | "Escutando";

interface ServeAIRealtimeVoiceProps {
  tableNumber?: string;
}

// ============================================================
// (OPCIONAL) ESTIMATIVA DE TOKENS PELO TEXTO – FALBACK
// ============================================================
function estimateTokensFromText(text: string): number {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const words = trimmed.split(/\s+/).length;
  return Math.max(1, Math.round(words * 1.3 * 2));
}

export default function ServeAIRealtimeVoice({
  tableNumber = "12",
}: ServeAIRealtimeVoiceProps) {
  const pc = useRef<RTCPeerConnection | null>(null);
  const dc = useRef<RTCDataChannel | null>(null);
  const mic = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<StatusLabel>("Clique para falar");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [menu, setMenu] = useState<any[]>([]);

  // ============================================================
  // 1) CARREGAR CARDÁPIO UMA VEZ
  // ============================================================
  useEffect(() => {
    fetch("http://localhost:1337/menu")
      .then((r) => r.json())
      .then((data) => {
        setMenu(data);
        console.log("🍔 MENU CARREGADO:", data);
      })
      .catch((err) => console.error("Erro menu:", err));
  }, []);

  // ============================================================
  // 2) SYSTEM PROMPT FINAL
  // ============================================================
  function buildSystemPrompt() {
    return `
Você é o ATENDENTE VIRTUAL do restaurante.
Fale SEMPRE em português do Brasil, de forma educada, curta e objetiva.

=====================================================================
REGRAS ABSOLUTAS (NÃO QUEBRAR)
=====================================================================
1. Não invente itens, preços, promoções ou quantidades.
2. NÃO execute tools sem intenção CLARA do cliente.
3. NÃO execute tools baseadas em frases vagas como:
   - "beleza"
   - "ok"
   - "tranquilo"
   - "qualquer coisa eu chamo"
   - "tudo bem"
   - "pode ser"
   - "tá bom"
   Essas frases NÃO indicam intenção → responda cordialmente sem executar tool.
4. Se o cliente cumprimentar ("boa tarde", "oi", etc.), responda normalmente.
5. Só acione ferramentas quando:
   - houver um item do cardápio mencionado
   - houver um verbo de ação claro ("quero", "adicionar", "coloca", "remove")

=====================================================================
DETECÇÃO DE INTENÇÕES
=====================================================================

1) list_menu_items → Use quando cliente pedir:
   - “me mostra o cardápio”
   - “quais são as pizzas?”
   - “quais são as bebidas?”
   - “mostrar cardápio geral”
   • Se pedir cardápio geral → query ""
   • Se citar categoria → query com a categoria

2) add_to_order → Use SOMENTE quando:
   - houver item do cardápio citado PELO NOME
   - houver verbo claro: “coloca”, “adiciona”, “quero”, “pode trazer”

3) remove_from_order → Use SOMENTE quando:
   - o cliente citar item + verbo “remover”, “tirar”, “sem”

4) get_order_summary → Use quando perguntar:
   - “qual o total?”
   - “quanto deu?”
   - “me diz o total”

=====================================================================
PROTOCOLO OBRIGATÓRIO
=====================================================================
1. Antes de tool → Fale UMA frase curta:
   - "Claro, vou adicionar."
   - "Perfeito, vou remover."
   - "Um instante, vou verificar."
   - "Vou te mostrar."

2. Após tool:
   - Use exatamente o texto retornado pela ferramenta.
   - Nunca altere valores.
   - Termine com: “Deseja mais alguma coisa?”

=====================================================================
CARDÁPIO OFICIAL (NÃO INVENTAR NADA)
=====================================================================
${JSON.stringify(menu, null, 2)}
`;
  }

  // ============================================================
  // 3) INICIAR VOZ / WEBRTC
  // ============================================================
  async function startVoice() {
    if (status !== "Clique para falar") {
      stopVoice();
      return;
    }

    setStatus("Conectando");

    const session = await fetch("http://localhost:1337/session").then((r) =>
      r.json()
    );

    pc.current = new RTCPeerConnection();
    dc.current = pc.current.createDataChannel("oai-events");

    dc.current.onopen = () => {
      setStatus("Escutando");
      console.log("🟢 Canal WebRTC aberto!");

      send({
        type: "session.update",
        session: {
          instructions: buildSystemPrompt(),
        },
      });

      send({
        type: "response.create",
        response: {
          modalities: ["audio", "text"],
          instructions: "Atenda o cliente normalmente.",
        },
      });
    };

    dc.current.onmessage = handleEvent;

    const audio = new Audio();
    audio.autoplay = true;
    pc.current.ontrack = (event) => {
      audio.srcObject = event.streams[0];
    };

    mic.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    mic.current
      .getTracks()
      .forEach((t) => pc.current!.addTrack(t, mic.current!));

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);

    const r = await fetch(
      "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
      {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${session.client_secret.value}`,
          "Content-Type": "application/sdp",
        },
      }
    );

    const answerSdp = await r.text();

    await pc.current.setRemoteDescription({
      type: "answer",
      sdp: answerSdp,
    });
  }

  function stopVoice() {
    setStatus("Clique para falar");
    try {
      dc.current?.close();
      pc.current?.close();
      mic.current?.getTracks().forEach((t) => t.stop());
    } catch {}

    eventBus.emit("ia:stop", null);
  }

  // ============================================================
  // 4) Envio
  // ============================================================
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function send(obj: any) {
    if (dc.current?.readyState === "open") {
      dc.current.send(JSON.stringify(obj));
    }
  }

  // ============================================================
  // 5) EVENTOS DA IA (FINAL)
  // ============================================================
  async function handleEvent(msg: MessageEvent) {
    console.log("💬 MSG BRUTA DO DATACHANNEL:", msg.data);

    if (typeof msg.data !== "string") {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ev: any;
    try {
      ev = JSON.parse(msg.data);
    } catch (err) {
      console.error("❌ Erro ao fazer JSON.parse em msg.data:", err, msg.data);
      return;
    }

    console.log("📩 EVENTO IA (parseado):", ev);

    // ========================================================
    // 5.1 TRANSCRIPT FINAL (response.audio_transcript.done)
    // ========================================================
    if (ev.type === "response.audio_transcript.done" && ev.transcript) {
      const transcript: string = ev.transcript;
      console.log("📝 Transcript final:", transcript);

      // salva resumo no backend (não mexe em tokens aqui)
      fetch("http://localhost:1337/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber, text: transcript }),
      }).catch(() => {});
    }

    // ========================================================
    // 5.2 TOKEN USAGE REAL (response.done → response.usage)
    // ========================================================
    if (ev.type === "response.done" && ev.response?.usage) {
      const usage = ev.response.usage;
      const usageTokens =
        usage.total_tokens ??
        (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0);

      console.log("📊 USO REAL DE TOKENS DO MODELO:", usage);

      if (usageTokens && usageTokens > 0) {
        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("token")
            : null;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        fetch("http://localhost:1337/usage/tokens", {
          method: "POST",
          headers,
          body: JSON.stringify({ tokens: usageTokens }),
        }).catch((err) => {
          console.error("Erro ao registrar uso de tokens:", err);
        });
      }
    }

    // ========================================================
    // 5.3 CHAMADA DE TOOL
    // ========================================================
    if (ev.type === "response.function_call_arguments.done") {
      const toolName = ev.name;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let args: any = {};

      try {
        args = ev.arguments ? JSON.parse(ev.arguments) : {};
      } catch {}

      args.tableNumber = tableNumber;

      console.log("🛠 Chamando tool backend:", toolName, args);

      const toolResponse = await fetch("http://localhost:1337/tool-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: toolName, args }),
      }).then((r) => r.json());

      if (toolName === "add_to_order") {
        eventBus.emit("pedido:add", {
          id: args.menuItemId,
          quantity: args.quantity ?? 1,
        });
      }

      if (toolName === "remove_from_order") {
        eventBus.emit("pedido:remove", {
          id: args.menuItemId,
        });
      }

      const toolText =
        toolResponse?.result?.message ||
        toolResponse?.message ||
        JSON.stringify(toolResponse?.result || toolResponse);

      send({
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: ev.call_id,
          output: toolText,
        },
      });

      send({
        type: "response.create",
        response: {
          modalities: ["audio", "text"],
          instructions:
            "Use o resultado enviado e responda ao cliente educadamente.",
        },
      });
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button
        onClick={status === "Clique para falar" ? startVoice : stopVoice}
        className={`flex items-center gap-2 bg-gradient-to-r 
          ${
            status === "Clique para falar"
              ? "from-[#8b5cf6] to-[#3b82f6]"
              : "from-red-500 to-red-700"
          }
          text-white px-4 py-2 rounded-xl text-sm shadow hover:opacity-90 transition`}
      >
        {status === "Clique para falar" ? (
          <>
            <Icon icon="fluent:mic-24-filled" className="w-4 h-4" />
            Falar
          </>
        ) : (
          <>
            <Icon icon="fluent:mic-off-24-filled" className="w-4 h-4" />
            Parar
          </>
        )}
      </button>

      <div className="text-sm text-gray-600">
        Status: <b>{status}</b> • Mesa {tableNumber}
      </div>
    </div>
  );
}
