import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useVoiceCommands(transcript: string, actions: any) {
  useEffect(() => {
    if (!transcript) return;

    const lower = transcript.toLowerCase();

    const speak = async (msg: string) => {
      try {
        if (speechSynthesis.speaking) speechSynthesis.cancel();

        const ttsResponse = await fetch("http://localhost:1337/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: msg }),
        });
        if (!ttsResponse.ok) throw new Error("Erro ao gerar áudio no servidor TTS");
        const audioBlob = await ttsResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (error) {
        console.error("Erro ao falar:", error);
        const utter = new SpeechSynthesisUtterance(msg);
        utter.lang = "pt-BR";
        utter.rate = 1;
        utter.pitch = 1.1;
        speechSynthesis.speak(utter);
      }
    };

    if (lower.includes("adicionar") || lower.includes("quero") || lower.includes("coloca")) {
      // supomos que o nome do item vem depois dessas palavras
      const match = lower.replace(/adicionar|quero|coloca/gi, "").trim();
      if (match) {
        actions.adicionar(match);
        speak(`Adicionei ${match} ao seu pedido.`);
      } else {
        speak("Não entendi qual item você quer adicionar.");
      }
    }

    if (lower.includes("remover") || lower.includes("tirar")) {
      const match = lower.replace(/remover|tirar/gi, "").trim();
      if (match) {
        actions.remover(match);
        speak(`Removi ${match} do seu pedido.`);
      } else {
        speak("Não entendi qual item você quer remover.");
      }
    }

    if (lower.includes("finalizar") || lower.includes("concluir") || lower.includes("fechar pedido")) {
      speak("Ok, finalizando seu pedido!");
      actions.finalizar();
    }
  }, [transcript, actions]);
}
