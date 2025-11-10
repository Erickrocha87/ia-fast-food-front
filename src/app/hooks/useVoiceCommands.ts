import { useEffect } from "react";

export function useVoiceCommands(transcript: string, actions: any) {
  useEffect(() => {
    if (!transcript) return;
    const lower = transcript.toLowerCase();

    const itens = [
      { nome: "pizza margherita", key: "pizza" },
      { nome: "hambúrguer clássico", key: "hamburguer" },
      { nome: "tacos mexicanos", key: "tacos" },
      { nome: "salada caesar", key: "salada" },
      { nome: "sushi combo", key: "sushi" },
    ];

    // Adicionar
    if (lower.includes("adicionar") || lower.includes("coloca") || lower.includes("quero")) {
      const encontrados = itens.filter((i) => lower.includes(i.key));
      if (encontrados.length > 0)
        encontrados.forEach((i) => actions.adicionar(i.nome));
    }

    // Remover
    if (lower.includes("remover") || lower.includes("tirar")) {
      const encontrados = itens.filter((i) => lower.includes(i.key));
      if (encontrados.length > 0)
        encontrados.forEach((i) => actions.remover(i.nome));
    }

    // Finalizar
    if (lower.includes("finalizar") || lower.includes("concluir") || lower.includes("fechar pedido")) {
      actions.finalizar();
    }
  }, [transcript]);
}
