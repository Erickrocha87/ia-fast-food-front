// "use client";

// import { useRef } from "react";
// import Papa from "papaparse";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// interface CSVUploadModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({ open, onClose }) => {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   if (!file) return;

//   //   Papa.parse(file, {
//   //     header: true,
//   //     skipEmptyLines: true,
//   //     complete: (results) => {
//   //       console.log("✅ CSV lido com sucesso:", results.data);

//   //       localStorage.setItem("cardapio", JSON.stringify(results.data));
//   //       alert("✅ Cardápio importado com sucesso!");
//   //       onClose();
//   //     },
//   //     error: (err) => {
//   //       console.error("❌ Erro ao ler CSV:", err);
//   //       alert("Erro ao importar o CSV. Verifique o formato.");
//   //     },
//   //   });
//   // };

//   const handleButtonClick = () => {
//     fileInputRef.current?.click(); // 👉 abre o Windows Explorer
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Importar Cardápio CSV</DialogTitle>
//         </DialogHeader>

//         <div className="flex flex-col items-center justify-center py-6">
//           <input
//             type="file"
//             ref={fileInputRef}
//             accept=".csv"
//             onChange={handleFileUpload}
//             hidden
//           />
//           <Button
//             onClick={handleButtonClick}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
//           >
//             📂 Selecionar Arquivo CSV
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
