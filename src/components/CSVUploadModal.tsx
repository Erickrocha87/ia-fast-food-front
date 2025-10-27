"use client"

import React, { useState } from "react"

export const CSVUploadModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())

    const items = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim())
      const obj: any = {}
      headers.forEach((header, index) => {
        obj[header] = values[index]
      })
      return obj
    })

    return items
  }

  const handleImport = () => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      localStorage.setItem("cardapio", JSON.stringify(parsed))
      alert("✅ Cardápio salvo no navegador!")
      onClose()
      window.location.reload()
    }
    reader.readAsText(file)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-3">Importar Cardápio (CSV)</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {file && <p className="text-sm text-gray-600 mb-3">Arquivo: {file.name}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!file}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Importar
          </button>
        </div>
      </div>
    </div>
  )
}
