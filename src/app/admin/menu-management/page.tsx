"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CSVUploadModal } from "@/components/CSVUploadModal"

export default function MenuManagementPage() {
  const [open, setOpen] = useState(false)
  const [cardapio, setCardapio] = useState<any[]>([])

  useEffect(() => {
    const data = localStorage.getItem("cardapio")
    if (data) {
      setCardapio(JSON.parse(data))
    }
  }, [])

  const lerCardapio = () => {
    if (cardapio.length === 0) {
      alert("Nenhum cardápio importado para leitura.");
      return;
    }

    const texto = cardapio
      .map(
        (i) =>
          `${i.nome}, ${i.descricao}, preço ${Number(i.preco).toFixed(2)} reais.`
      )
      .join(". ");

    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = "pt-BR";
    utter.rate = 0.95; // fala um pouco mais devagar
    utter.pitch = 1.15; // voz mais feminina e suave

    // 🎙️ tenta usar voz feminina natural
    const escolherVoz = () => {
      const voices = speechSynthesis.getVoices();
      return (
        voices.find((v) =>
          /(female|mulher|brasil|brazil|pt-BR|maria|google)/i.test(v.name)
        ) || voices[0]
      );
    };

    const aplicarVoz = () => {
      utter.voice = escolherVoz();
      speechSynthesis.speak(utter);
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = aplicarVoz;
    } else {
      aplicarVoz();
    }
  };


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Gerenciamento de Menu</h1>
      <p className="text-gray-600 mb-6">
        Gerencie os itens, preços e descrições do cardápio.
      </p>

      <div className="mb-8">
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          + Adicionar Cardápio (CSV)
        </Button>
      </div>

      {cardapio.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-500 text-center">
          Nenhum cardápio importado ainda.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-3">Itens importados:</h2>
          <table className="w-full text-sm text-left border">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                {Object.keys(cardapio[0]).map((col) => (
                  <th key={col} className="px-4 py-2 capitalize">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cardapio.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  {Object.values(item).map((val, i) => (
                    <td key={i} className="px-4 py-2">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {cardapio.length > 0 && (
            <div className="text-center mt-6">
              <button
                onClick={() => lerCardapio()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                🔊 Ler Cardápio
              </button>
            </div>
          )}
        </div>
      )}

      <CSVUploadModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
