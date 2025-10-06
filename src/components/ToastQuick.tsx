import { useEffect } from "react";

type Props = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
};

export default function QuickToast({ message, type = "success", onClose, duration = 1500 }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const bg = 
    type === "success"
      ? "bg-green-50 border-green-500 text-green-800"
      : type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-gray-50 border-gray-200 text-gray-800";

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 max-w-sm w-full border-2 px-4 py-3 rounded-lg shadow-lg ${bg} transform transition-all duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 text-base font-bold">{message}</div>
      </div>
    </div>
  );
}