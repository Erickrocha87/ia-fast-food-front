'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CSVUploadModal } from "@/components/CSVUploadModal"

export default function MenuManagementPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Menu Management</h1>
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

      <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-500 text-center">
        Nenhum cardápio importado ainda.
      </div>

      <CSVUploadModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
