"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { eventBus } from "@/lib/eventBus";

type StatusLabel = "Clique para falar" | "Conectando" | "Escutando";

interface ServeAIRealtimeVoiceProps {
  tableNumber?: string;
}

// (Opcional) estimativa de tokens – segue igual
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

  // itens pendentes da parse_items_from_speech
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingItemsRef = useRef<any[]>([]);

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
  // 2) SYSTEM PROMPT (REFORÇADO Anti-alucinação)
  // ============================================================
  function buildSystemPrompt() {
    // opcional: reduzir só para campos relevantes
    const safeMenu = menu.map((m) => ({
      id: m.id,
      name: m.name,
      price: m.price,
      description: m.description,
    }));

    return `
Você é o ATENDENTE VIRTUAL de um restaurante REAL.
Fale SEMPRE em português do Brasil, de forma educada, CURTA e objetiva.

=====================================================================
REGRAS ABSOLUTAS (NÃO QUEBRAR EM HIPÓTESE ALGUMA)
=====================================================================
1. NUNCA invente itens, preços, promoções, combos ou tamanhos.
2. Só considere como válidos os itens cujo "name" está na lista de cardápio abaixo.
   - Se o cliente pedir algo que NÃO esteja no cardápio → responda:
     "Não encontrei esse item no nosso cardápio, poderia escolher outro?"
3. Não chute quantidades. Se não estiver claro, pergunte:
   "Quantas unidades desse item você deseja?"
4. NÃO execute tools com base em frases vagas, por exemplo:
   - "beleza", "ok", "tranquilo", "qualquer coisa eu chamo",
     "tudo bem", "pode ser", "tá bom".
   Nessas situações, apenas responda cordialmente, sem chamar tools.
5. Se o cliente apenas cumprimentar ("boa tarde", "oi", "olá", etc.),
   responda normalmente sem tools.
6. SE NÃO TIVER CERTEZA, PERGUNTE. NUNCA assuma nada sozinho.

=====================================================================
USO DAS TOOLS (INTENÇÕES)
=====================================================================

1) list_menu_items
   Use quando o cliente pedir para ver opções, por exemplo:
   - “me mostra o cardápio”
   - “quais são as pizzas?”
   - “quais são as bebidas?”
   - “mostrar cardápio geral”
   • Se pedir cardápio geral → query "".
   • Se citar categoria → use o nome da categoria em query.

2) parse_items_from_speech
   Use quando o cliente pedir MÚLTIPLOS itens em uma mesma fala, por exemplo:
   - "quero um hambúrguer e uma pizza"
   - "me traz duas cokes e uma batata"
   Procedimento obrigatório:
   a) Chame parse_items_from_speech com o texto do cliente.
   b) Aguarde o resultado.
   c) CONFIRME com o cliente tudo o que foi detectado:
      "Detectei 1x hambúrguer e 1x pizza. Está correto?"
   d) SOMENTE SE o cliente confirmar (sim, ok, isso mesmo),
      chame add_to_order item por item.
   e) Se o cliente disser "não", "nao" ou corrigir, siga a correção.

3) add_to_order
   Use SOMENTE quando:
   - houver item do cardápio citado PELO NOME (existente no cardápio),
   - houver verbo claro de ação: “quero”, “coloca”, “adiciona”,
     “pode trazer”, “manda”, “traz pra mim”.
   Nunca chame add_to_order baseado apenas em "beleza", "pode ser", etc.

4) remove_from_order
   Use SOMENTE quando:
   - o cliente citar um item já pedido
   - e usar verbos de remover: “tirar”, “remover”, “sem”, “cancelar esse item”.

5) get_order_summary
   Use quando o cliente perguntar sobre o pedido ou total:
   - “qual o total?”
   - “quanto deu?”
   - “me diz o total”
   - “como está o meu pedido?”

6) finalize_order
   Use QUANDO o cliente claramente encerrar o pedido, por exemplo:
   - "pode fechar o pedido"
   - "pode enviar pra cozinha"
   - "pode mandar pra cozinha"
   - "é isso, obrigado"
   AO usar finalize_order para a mesa atual:
   - Considere que o pedido foi enviado para a cozinha.
   - Não adicione nem remova mais itens automaticamente sem o cliente pedir.

=====================================================================
PROTOCOLO OBRIGATÓRIO ANTES/DEPOIS DE TOOLS
=====================================================================
1. Antes de chamar qualquer tool, faça UMA frase curta explicando:
   - "Claro, vou adicionar para você."
   - "Perfeito, vou remover esse item."
   - "Um instante, vou verificar o total."
   - "Vou te mostrar as opções."

2. Depois de receber o resultado da tool:
   - Use fielmente o texto e valores retornados (sem alterar números).
   - Termine com: “Deseja mais alguma coisa?”,
     EXCETO quando usar finalize_order, onde você pode encerrar com:
     "Seu pedido foi enviado para a cozinha. Obrigado!"

=====================================================================
CARDÁPIO OFICIAL (NÃO INVENTAR NADA FORA DISSO)
Use APENAS o campo "name" como nome do item ao falar com o cliente.
=====================================================================
${JSON.stringify(safeMenu, null, 2)}
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

      // injeta instruções reforçadas
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
          instructions:
            "Cumprimente o cliente e se coloque à disposição para anotar o pedido.",
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

    pendingItemsRef.current = [];
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

    // 5.1 Transcript final
    if (ev.type === "response.audio_transcript.done" && ev.transcript) {
      const transcript: string = ev.transcript;
      console.log("📝 Transcript final:", transcript);

      // se temos itens pendentes, usa esse transcript como confirmação
      if (pendingItemsRef.current.length > 0) {
        const t = transcript.toLowerCase();

        const isYes =
          t.includes("sim") ||
          t.includes("pode") ||
          t.includes("claro") ||
          t.includes("isso mesmo") ||
          t.includes("tá certo") ||
          t.includes("ta certo") ||
          t.includes("ok");

        const isNo =
          t.includes("não") ||
          t.includes("nao") ||
          t.includes("corrigir") ||
          t.includes("mudar");

        if (isYes) {
          const items = [...pendingItemsRef.current];
          pendingItemsRef.current = [];

          for (const item of items) {
            const args = {
              tableNumber,
              menuItemId: item.menuItemId,
              quantity: item.quantity ?? 1,
            };

            try {
              const toolResponse = await fetch(
                "http://localhost:1337/tool-call",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: "add_to_order", args }),
                }
              ).then((r) => r.json());

              eventBus.emit("pedido:add", {
                id: args.menuItemId,
                name: item.name,
                quantity: args.quantity,
              });

              console.log("✅ add_to_order múltiplo:", toolResponse);
            } catch (err) {
              console.error("Erro ao adicionar item múltiplo:", err);
            }
          }

          send({
            type: "response.create",
            response: {
              modalities: ["audio", "text"],
              instructions:
                "Perfeito, adicionei todos os itens ao seu pedido. Deseja mais alguma coisa?",
            },
          });
        } else if (isNo) {
          pendingItemsRef.current = [];

          send({
            type: "response.create",
            response: {
              modalities: ["audio", "text"],
              instructions:
                "Tudo bem, não adicionei esses itens. Pode me dizer novamente o que você deseja?",
            },
          });
        }

        // segue fluxo normal de salvar transcript
      }

      // salva resumo no backend (summary)
      fetch("http://localhost:1337/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber, text: transcript }),
      }).catch(() => {});
    }

    // 5.2 Uso de tokens
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

    // 5.3 Tools
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

      // parse_items_from_speech → guardar itens e pedir confirmação
      if (toolName === "parse_items_from_speech") {
        const items = toolResponse?.result?.items ?? [];
        console.log("🧩 ITENS PARSEADOS PELA TOOL:", items);

        pendingItemsRef.current = items;

        if (items.length === 0) {
          send({
            type: "response.create",
            response: {
              modalities: ["audio", "text"],
              instructions:
                "Não consegui identificar itens do cardápio na sua frase. Pode repetir dizendo o nome dos itens exatamente como estão no cardápio?",
            },
          });
          return;
        }

        const lista = items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map(
            (m: any) => `${m.quantity ?? 1}x ${m.name ?? "item do cardápio"}`
          )
          .join(", ");

        send({
          type: "response.create",
          response: {
            modalities: ["audio", "text"],
            instructions: `Detectei os seguintes itens: ${lista}. Posso adicionar todos ao seu pedido?`,
          },
        });

        return;
      }

      // finalize_order → limpar carrinho no front
      if (toolName === "finalize_order") {
        pendingItemsRef.current = [];
        eventBus.emit("pedido:clear", null);
      }

      // add_to_order / remove_from_order → atualizar carrinho
      if (toolName === "add_to_order") {
        eventBus.emit("pedido:add", {
          id: args.menuItemId,
          quantity: args.quantity ?? 1,
        });

        console.log("🛒 EMIT pedido:add (multi):", {
          id: args.menuItemId,
          quantity: args.quantity,
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
            toolName === "finalize_order"
              ? "Use a mensagem da ferramenta para informar que o pedido foi enviado para a cozinha, agradeça e se despeça de forma educada."
              : "Use o resultado enviado e responda ao cliente educadamente.",
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
        Status: <b>{status}</b> 
      </div>
    </div>
  );
}
