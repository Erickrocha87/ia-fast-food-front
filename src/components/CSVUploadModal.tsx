'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CSVUploadModalProps {
  open: boolean
  onClose: () => void
}

export function CSVUploadModal({ open, onClose }: CSVUploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Cardápio via CSV</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600 text-sm mb-3">
            Selecione um arquivo CSV contendo os itens do cardápio.
          </p>
          <Input type="file" accept=".csv" className="cursor-pointer" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
