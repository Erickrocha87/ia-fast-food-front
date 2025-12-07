"use client";
import { useState, useEffect } from "react";
import {
  Users,
  UtensilsCrossed,
  DollarSign,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { jwtDecode } from "jwt-decode";
import { useUser } from "@/hooks/useUser";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("geral");
  const { isReady } = useAuthGuard();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { users, findAll } = useUser();

  useEffect(() => {
    findAll();
  }, []);

  const [stats, setStats] = useState({
    liveOrders: 0,
    avgPrep: 0,
    revenue: 0,
    newCustomers: 0,
  });

  interface MyToken {
    id: number;
    userName: string;
    email: string;
    role: string;
  }

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<MyToken>(token);
      setUserName(decoded.userName);
      setUserRole(decoded.role);
    }
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setErro(null);

      const res = await fetch("http://localhost:1337/menu", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setMenuItems(data);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setErro("Erro ao buscar cardápio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "cardapio") {
      fetchMenuItems();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:1337/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        setStats({
          liveOrders: data.ordensAtivas || 0,
          avgPrep: data.tempoMedio || 0,
          revenue: data.faturamento || 0,
          newCustomers: data.totalPedidos || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    };

    fetchStats();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <div className="w-full h-screen flex bg-[#0f172a]/5 text-gray-800 overflow-hidden">
      <aside className="hidden md:flex w-64 h-full flex-col bg-gradient-to-b from-[#7b4fff] via-[#a855f7] to-[#3b82f6] text-white p-6 gap-8">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-sm">ServeAI</p>
            <p className="text-xs text-white/70">Pedidos Inteligentes</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2 text-sm">
          {[
            {
              id: "geral",
              label: "Dashboard",
              icon: <LayoutGrid className="w-4 h-4" />,
            },
            {
              id: "usuarios",
              label: "Usuários",
              icon: <Users className="w-4 h-4" />,
            },
            {
              id: "cardapio",
              label: "Cardápio",
              icon: <UtensilsCrossed className="w-4 h-4" />,
            },
            {
              id: "cozinha",
              label: "Cozinha",
              icon: <UtensilsCrossed className="w-4 h-4" />,
            },
            {
              id: "escolher",
              label: "Escolher",
              icon: <UtensilsCrossed className="w-4 h-4" />,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-white/15 shadow-sm"
                  : "bg-transparent hover:bg-white/10"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="bg-black/10 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70 mb-1">
            Sem plano
          </p>
          <h3 className="text-base font-semibold mb-3">Teste grátis</h3>

          <div className="space-y-2 mb-4 text-[11px]">
            <ProgressLine label="Pedidos com IA" value="0/50" />
            <ProgressLine label="Mesas simultâneas" value="0/5" />
            <ProgressLine label="Usuários" value="0/3" />
          </div>

          <button className="w-full text-xs font-semibold bg-white text-[#7b4fff] rounded-full py-2 shadow hover:bg-[#f6f3ff] transition">
            ASSINAR AGORA
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
              E
            </div>
            <div className="text-xs">
              <p className="font-semibold">{userName}</p>
              <p className="text-white/60">
                {userRole === "USER" ? "Usuário" : "Administrador"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 h-full bg-[#f9f9ff] flex flex-col overflow-hidden">
        <header className="w-full px-6 lg:px-10 pt-6 pb-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">
              Plano{" "}
              <span className="text-[#7b4fff] font-medium">teste grátis</span>
            </p>
            <h1 className="text-2xl font-semibold text-gray-900">
              Olá, {userName}
            </h1>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="flex items-center gap-1 bg-[#f4f4ff] border border-[#e2e4ff] px-4 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-white transition"
          >
            <span>Sair</span>
            <Icon icon="fluent:arrow-exit-20-regular" className="w-4 h-4" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-6 space-y-8">
          {activeTab === "geral" && (
            <>
              <section className="mt-4">
                <h2 className="text-base font-semibold mb-4">
                  Desempenho do restaurante
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Card
                    title="Ordens Ativas"
                    icon={<Clock className="text-[#fb923c]" />}
                    value={`${stats.liveOrders} ativas`}
                    subtitle={`Tempo médio de preparo: ${stats.avgPrep} min`}
                  />
                  <Card
                    title="Faturamento de Hoje"
                    icon={<DollarSign className="text-green-500" />}
                    value={`R$ ${stats.revenue.toFixed(2)}`}
                    subtitle={`Total de pedidos: ${stats.newCustomers}`}
                  />
                  <Card
                    title="Pedidos do dia"
                    icon={<Users className="text-blue-600" />}
                    value={stats.newCustomers}
                    subtitle="Registrados no sistema"
                  />
                </div>
              </section>
            </>
          )}

          <section className="mt-2">
            {activeTab === "usuarios" && (
              <div className="grid gap-6">
                <h2 className="text-lg font-semibold text-[#6d4aff]">
                  Gerenciar Usuários
                </h2>

                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    name={user.restaurantName}
                    role={user.role}
                  />
                ))}
              </div>
            )}

            {activeTab === "cardapio" && (
              <div>
                <h2 className="text-lg font-semibold text-[#6d4aff] mb-6">
                  Cardápio Digital
                </h2>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                  <button
                    onClick={() => document.getElementById("csvInput")?.click()}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white px-6 py-3 rounded-xl text-sm font-medium shadow-md hover:opacity-90 transition"
                  >
                    <Icon
                      icon="fluent:document-arrow-up-24-regular"
                      className="w-5 h-5"
                    />
                    Importar CSV
                  </button>

                  <input
                    id="csvInput"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append("file", file);

                      try {
                        const res = await fetch(
                          "http://localhost:1337/csv/import",
                          {
                            method: "POST",
                            body: formData,
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        );

                        const data = await res.json();
                        if (!res.ok)
                          throw new Error(data.error || "Erro ao enviar CSV");

                        alert(
                          `✅ Cardápio importado com sucesso!\nItens importados: ${
                            data.imported || 0
                          }`
                        );
                        fetchMenuItems();
                      } catch (err) {
                        alert("Falha na importação");
                      }
                    }}
                  />
                </div>

                <div className="bg-white rounded-2xl border border-[#ececff] shadow-sm p-6">
                  <h3 className="text-base font-semibold text-[#4c33ff] mb-4 flex items-center gap-2">
                    <Icon
                      icon="fluent:food-24-filled"
                      className="w-5 h-5 text-[#6b46ff]"
                    />
                    Itens do Cardápio
                  </h3>

                  {loading ? (
                    <p className="text-gray-500">Carregando cardápio...</p>
                  ) : erro ? (
                    <p className="text-red-500">{erro}</p>
                  ) : menuItems.length === 0 ? (
                    <p className="text-gray-400 italic">
                      Nenhum item cadastrado ainda.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {menuItems.map((item) => (
                        <div
                          key={item.id}
                          className="border border-[#e5e0ff] rounded-xl p-4 bg-[#fafaff] hover:shadow-md transition"
                        >
                          <h4 className="font-medium text-[#4b38ff]">
                            {item.name}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-[#6d4aff] mt-2">
                            R$ {item.price?.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

/* ================= COMPONENTES REUTILIZÁVEIS ================= */

function ProgressLine({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
        <div className="h-full w-1/5 bg-white/70 rounded-full" />
      </div>
    </div>
  );
}

function Card({ title, icon, value, subtitle }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ececff] hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-2 text-gray-700">
        {icon}
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <p className="text-2xl font-semibold text-[#4b4bff]">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function UserCard({ name, role }) {
  return (
    <div className="bg-white border border-[#ececff] rounded-2xl px-5 py-4 flex justify-between items-center shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#818cf8] flex items-center justify-center text-white font-medium">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="border border-gray-200 rounded-xl px-3 py-1 text-xs hover:bg-gray-50">
          Editar
        </button>
      </div>
    </div>
  );
}

function ConfigCard({ title, subtitle, icon, fields }) {
  return (
    <div className="bg-white border border-[#ececff] rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={icon} className="text-[#7b4fff] w-5 h-5" />
          <h3 className="font-semibold text-[#6b46ff] text-sm">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
        <ul className="space-y-2">
          {fields.map((f, i) => (
            <li
              key={i}
              className="flex justify-between items-center border-b border-gray-100 py-2"
            >
              <span className="text-sm text-gray-700">{f.label}</span>
              {f.type === "toggle" ? (
                <div className="relative inline-block w-10 h-5">
                  <input
                    type="checkbox"
                    className="opacity-0 w-0 h-0 peer"
                    defaultChecked
                  />
                  <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full peer-checked:bg-[#7b4fff] transition" />
                  <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5" />
                </div>
              ) : (
                <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                  {f.value}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
