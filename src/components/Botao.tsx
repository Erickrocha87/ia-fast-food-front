type Props = {
  label: string;
  onClick?: () => void; // 👈 agora é opcional!
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export const Button: React.FC<Props> = ({ label, onClick, disabled, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 text-white font-bold rounded-lg shadow transition-all cursor-pointer ${
        disabled
          ? "bg-gray-400"
          : "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500"
      }`}
    >
      {label}
    </button>
  );
};
