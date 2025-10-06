import Link from "next/link";

type Props = {
    linkName: string;
    label: string;
    buttonString: string;
}

export const Card = ({linkName, label, buttonString}: Props) => {
  return (
    <div>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:-translate-y-1 transition-transform">
        <span className="text-4xl mb-3 text-green-600">🍽</span>
        <h3 className="text-xl font-bold mb-2 text-green-800">{linkName}</h3>
        <p className="text-gray-700 mb-4 text-center">
          {label}
        </p>
        <Link href="/new-order">
          <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-300 text-white rounded font-bold shadow hover:from-blue-600 hover:to-blue-400 transition">
            {buttonString}
          </button>
        </Link>
      </div>
    </div>
  );
};
