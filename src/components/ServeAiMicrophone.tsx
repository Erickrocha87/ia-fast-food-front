"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";


export default function ServeAIRealtimeVoice({ tableNumber = "12" }) {
  const pc = useRef<RTCPeerConnection | null>(null);
  const dc = useRef<RTCDataChannel | null>(null);
  const mic = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<"Clique para falar" | "Conectando" | "Escutando">(
    "Clique para falar"
  );

  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:1337/menu")
      .then((r) => r.json())
      .then((data) => {
        setMenu(data);
        console.log("🍔 MENU CARREGADO:", data);
      })
      .catch((err) => console.error("Erro menu:", err));
  }, []);

  function buildSystemPrompt() {
    return `
Você é o ATENDENTE VIRTUAL do restaurante. 
Fale sempre em português do Brasil. Seja educado, rápido e objetivo.

⚠️ Limites rígidos:
- Você só fala sobre pedidos, cardápio, mesa e restaurante.
- Se perguntarem qualquer coisa fora disso, responda:
  "Sou o atendente virtual do restaurante e só posso ajudar com cardápio e pedidos."

⚡ Prioridade máxima: Você NUNCA pode inventar itens, valores ou ofertas.
⚡ Você só pode usar itens do cardápio abaixo:
${JSON.stringify(menu, null, 2)}

===================================================
REGRAS DE AÇÃO (SIGA EXATAMENTE NESTA ORDEM)
===================================================

1) Identifique a intenção do cliente:
   - adicionar item → use add_to_order
   - remover item → use remove_from_order
   - ver total/resumo → use get_order_summary
   - ver opções → use list_menu_items
   - mais de um item pedido → trate UM por vez

2) Antes de chamar qualquer tool, fale UMA frase curta:
   - "Claro, vou adicionar."
   - "Perfeito, removendo."
   - "Um instante, vou verificar."
   - "Vou te mostrar."

3) Depois dessa frase, chame EXATAMENTE 1 tool_call.
   Nunca chame 2 tools no mesmo turno.

4) Quando receber o resultado da tool_call, responda SEMPRE:
   - confirme a ação realizada
   - descreva o que foi resolvido
   - ofereça ajuda extra

5) Quando um pedido inclui 2 itens na mesma frase:
   - adicione o primeiro item normalmente
   - depois PERGUNTE:
     "Você também quer que eu adicione <ITEM 2>?"
   - só adicione o segundo item se o cliente confirmar

6) Nunca sugira itens. Nunca complete pedidos automaticamente.

7) Se não tiver certeza de qual item o cliente quer:
   PERGUNTE antes de executar qualquer tool.

8) Nunca diga “vou verificar” sem responder depois do tool_output.

===================================================
EXEMPLOS CURTOS (SEMPRE SIGA ESTE ESTILO)
===================================================

Cliente: "Quero um brownie."
Você:
  "Claro, vou adicionar."
  [tool add_to_order]
  "Prontinho, adicionei 1 brownie. Posso ajudar em algo mais?"

Cliente: "Quero um hambúrguer e um refrigerante."
Você:
  "Claro, vou adicionar o hambúrguer."
  [tool para o hambúrguer]
  "Adicionei o hambúrguer. Você também quer 1 refrigerante?"

Cliente: "Qual o total?"
Você:
  "Um instante, vou verificar."
  [tool get_order_summary]
  "O total é R$ X. Deseja algo mais?"
    `;
  }

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
      console.log("🟢 Canal WebRTC aberto!");
      setStatus("Escutando");

      send({
        type: "session.update",
        session: {
          instructions: buildSystemPrompt(),
          tools: [
            {
              type: "function",
              name: "add_to_order",
              description: "Adiciona item ao pedido",
              parameters: {
                type: "object",
                properties: {
                  tableNumber: { type: "string" },
                  menuItemId: { type: "number" },
                  quantity: { type: "number" },
                },
                required: ["tableNumber", "menuItemId"],
              },
            },
            {
              type: "function",
              name: "remove_from_order",
              description: "Remove item do pedido",
              parameters: {
                type: "object",
                properties: {
                  tableNumber: { type: "string" },
                  menuItemId: { type: "number" },
                  quantity: { type: "number" },
                },
                required: ["tableNumber", "menuItemId"],
              },
            },
            {
              type: "function",
              name: "get_order_summary",
              description: "Resumo do pedido",
              parameters: {
                type: "object",
                properties: {
                  tableNumber: { type: "string" },
                },
                required: ["tableNumber"],
              },
            },
            {
              type: "function",
              name: "list_menu_items",
              description: "Lista itens do cardápio",
              parameters: {
                type: "object",
                properties: { query: { type: "string" } },
              },
            },
          ],
        },
      });

      send({
        type: "response.create",
        response: {
          modalities: ["audio"],
          continue_after_tool: true,
        },
      });
    };

    dc.current.onmessage = (msg) => onEvent(msg);

    const audio = new Audio();
    audio.autoplay = true;
    pc.current.ontrack = (ev) => {
      audio.srcObject = ev.streams[0];
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
  }

  function send(obj: any) {
    if (dc.current?.readyState === "open") {
      dc.current.send(JSON.stringify(obj));
    }
  }

  async function onEvent(msg: MessageEvent) {
    let ev;
    try {
      ev = JSON.parse(msg.data);
    } catch {
      return;
    }

    console.log("📩 EVENTO IA:", ev);

    if (
      ev.type === "response.output_item.done" &&
      ev.item?.type === "output_text"
    ) {
      console.log("🗣 IA DISSE:", ev.item.text);
    }

    if (
      ev.type === "response.output_item.done" &&
      ev.item?.type === "function_call"
    ) {
      const toolName = ev.item.name;
      let args = ev.item.arguments;

      if (typeof args === "string") {
        try {
          args = JSON.parse(args);
        } catch {}
      }

      args.tableNumber = tableNumber;

      console.log("🛠 Executando tool:", toolName, args);

      const toolResponse = await fetch("http://localhost:1337/tool-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: toolName, args }),
      }).then((r) => r.json());

      const toolText =
        toolResponse?.message ||
        toolResponse?.result?.message ||
        JSON.stringify(toolResponse?.result || toolResponse);

      send({
        type: "tool_output.create",
        tool_output: {
          tool_call_id: ev.item.id,
          content: [{ type: "output_text", text: toolText }],
        },
      });

      send({
        type: "response.create",
        response: {
          modalities: ["audio"],
          continue_after_tool: true,
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
    text-white px-4 py-2 rounded-xl text-sm shadow hover:opacity-90 transition
  `}
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
        Status: <b>{status}</b>
      </div>
    </div>
  );
}
