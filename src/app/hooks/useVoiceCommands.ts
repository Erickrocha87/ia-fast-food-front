import { useEffect } from "react";

export function useVoiceCommands(transcript: string, actions: any) {
    useEffect(() => {
        if (!transcript) return;

        const lower = transcript.toLowerCase();

        // 🔊 Função pra falar imediatamente
        const speak = async (msg: string) => {
            try {
                // Cancela fala anterior, se houver
                if (speechSynthesis.speaking) speechSynthesis.cancel();

                // 🔊 Faz requisição pro backend OpenAI (voz neural feminina)
                const ttsResponse = await fetch("http://localhost:1337/api/tts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: msg,
                    }),
                });

                if (!ttsResponse.ok) {
                    throw new Error("Erro ao gerar áudio no servidor TTS");
                }

                // 🔉 Converte o blob em áudio e toca
                const audioBlob = await ttsResponse.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            } catch (error) {
                console.error("Erro ao falar:", error);

                // fallback pra voz local caso a API falhe
                const utter = new SpeechSynthesisUtterance(msg);
                utter.lang = "pt-BR";
                utter.rate = 1;
                utter.pitch = 1.1;
                speechSynthesis.speak(utter);
            }
        };


        const itens = [
            { nome: "pizza margherita", key: "pizza" },
            { nome: "hambúrguer gourmet", key: "hamburguer" },
            { nome: "tacos apimentados", key: "tacos" },
            { nome: "limonada fresca", key: "limonada" },
        ];

        // Adicionar múltiplos
        if (lower.includes("adicionar") || lower.includes("quero") || lower.includes("coloca")) {
            const encontrados = itens.filter((i) => lower.includes(i.key));
            if (encontrados.length > 0) {
                encontrados.forEach((i) => actions.adicionar(i.nome));
                const msg = `Adicionei ${encontrados.map(i => i.nome).join(" e ")} ao seu pedido.`;
                speak(msg);
            } else {
                speak("Não encontrei nenhum item correspondente no cardápio.");
            }
        }

        // Remover múltiplos
        if (lower.includes("remover") || lower.includes("tirar")) {
            const encontrados = itens.filter((i) => lower.includes(i.key));
            if (encontrados.length > 0) {
                encontrados.forEach((i) => actions.remover(i.nome));
                const msg = `Removi ${encontrados.map(i => i.nome).join(" e ")} do seu pedido.`;
                speak(msg);
            } else {
                speak("Nenhum item para remover foi encontrado.");
            }
        }

        // Finalizar pedido
        if (lower.includes("finalizar") || lower.includes("concluir") || lower.includes("fechar pedido")) {
            speak("Ok, finalizando seu pedido!");
            actions.finalizar();
        }
    }, [transcript]);
}
