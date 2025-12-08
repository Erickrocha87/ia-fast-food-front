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
import { useAuthGuard } from "@/hooks/useAuthGuard";
import toast, { Toaster } from "react-hot-toast";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"geral" | "mesas" | "cardapio">(
    "geral"
  );
  const { isReady } = useAuthGuard();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

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

interface SubscriptionData {
  active: boolean;
  plan?: string;
  tokensLimit?: number;
  tokensUsed?: number;
  tokensRemaining?: number;
  cycleStart?: string;
  cycleEnd?: string;
}

const API = "http://localhost:1337";

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  type Table = { id: number; name: string; active?: boolean };

  const [tables, setTables] = useState<Table[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [tablesError, setTablesError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<MyToken>(token);
      setUserName(decoded.userName);
      setUserRole(decoded.role);
    }
  }, []);

  const fetchTables = async () => {
    try {
      setTablesLoading(true);
      setTablesError(null);

      const res = await fetch(`${API_BASE}/tables`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erro HTTP ao buscar mesas");
      }

      const data = (await res.json()) as Table[];
      setTables(data);
    } catch (err) {
      console.error(err);
      setTablesError("Erro ao buscar mesas.");
    } finally {
      setTablesLoading(false);
    }
  };

  const handleAddTable = async () => {
    const value = window.prompt("Número ou nome da mesa:");
    if (!value) return;

    const name = value.trim();
    if (!name) return;

    try {
      setTablesLoading(true);
      setTablesError(null);

      const res = await fetch(`${API_BASE}/tables`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar mesa.");
      }

      setTables((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar mesa.");
    } finally {
      setTablesLoading(false);
    }
  };

  const handleRemoveTable = async (id: number) => {
    const ok = window.confirm("Deseja realmente remover esta mesa?");
    if (!ok) return;

    try {
      setTablesLoading(true);
      setTablesError(null);

      const res = await fetch(`${API_BASE}/tables/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao remover mesa.");
      }

      setTables((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao remover mesa.");
    } finally {
      setTablesLoading(false);
    }
  };

  const handleChooseTable = (name: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("serveai:mesaAtual", name);
    }
    router.push("/escolher");
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleDeleteMenuItem = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/menu/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao deletar item");
      }

      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item removido do cardápio.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar item do cardápio.");
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setErro(null);

      const res = await fetch(`${API_BASE}/menu`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });
      const data = await res.json();
      setMenuItems(data);
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
        const res = await fetch(`${API_BASE}/dashboard/stats`, {
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

  async function fetchSubscription() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSubscription({ active: false });
        return;
      }

      const res = await fetch(`${API}/me/subscription`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("📦 /me/subscription:", data);

      if (!data || data.active === false) {
        setSubscription({ active: false });
      } else {
        setSubscription({
          active: true,
          plan: data.plan,
          tokensLimit: data.tokensLimit,
          tokensUsed: data.tokensUsed,
          tokensRemaining: data.tokensRemaining,
          cycleStart: data.cycleStart,
          cycleEnd: data.cycleEnd,
        });
      }
    } catch (err) {
      console.error("Erro ao carregar assinatura:", err);
      setSubscription({ active: false });
    }
  }

  useEffect(() => {
    fetchSubscription();

    const interval = setInterval(() => {
      fetchSubscription();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ordersCompleted, setOrdersCompleted] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ordersPaid, setOrdersPaid] = useState<any[]>([]);
  const [ordersTab, setOrdersTab] = useState<"concluidos" | "pagos">(
    "concluidos"
  );
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      const token = localStorage.getItem("token");

      const [resCompleted, resPaid] = await Promise.all([
        fetch(`${API_BASE}/orders/cashier/completed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE}/orders/cashier/paid`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!resCompleted.ok || !resPaid.ok) {
        throw new Error("Erro HTTP ao buscar pedidos");
      }

      const [dataCompleted, dataPaid] = await Promise.all([
        resCompleted.json(),
        resPaid.json(),
      ]);

      setOrdersCompleted(dataCompleted);
      setOrdersPaid(dataPaid);
    } catch (err) {
      console.error(err);
      setOrdersError("Erro ao buscar pedidos");
    } finally {
      setOrdersLoading(false);
    }
  };

  const markOrderPaid = async (id: number) => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "READY" }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(
          data.error || data.message || "Erro ao marcar pedido como pago"
        );
      }

      await fetchOrders();
      toast.success("Pedido marcado como pago.");
    } catch (err) {
      console.error("Erro ao marcar pedido como pago", err);
      toast.error("Erro ao marcar pedido como pago.");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!isReady) {
    return null;
  }

   const planoAtivo = subscription?.active === true;
  const nomePlano = planoAtivo
    ? subscription?.plan ?? "Plano ativo"
    : "Sem plano";
  const tokensTexto = planoAtivo
    ? `${subscription?.tokensUsed ?? 0}/${
        subscription?.tokensLimit ?? 0
      } tokens`
    : "0/0 tokens";

  let tokensUsedPercent = 0;
  let tokensRemainingPercent = 0;
  let renewalPercent = 0;

  if (planoAtivo && subscription?.tokensLimit && subscription.tokensLimit > 0) {
    tokensUsedPercent =
      ((subscription.tokensUsed ?? 0) / subscription.tokensLimit) * 100;

    tokensRemainingPercent =
      ((subscription.tokensRemaining ?? 0) / subscription.tokensLimit) * 100;
  }

  if (planoAtivo && subscription?.cycleStart && subscription?.cycleEnd) {
    const start = new Date(subscription.cycleStart).getTime();
    const end = new Date(subscription.cycleEnd).getTime();
    const now = Date.now();

    if (end > start) {
      renewalPercent = ((now - start) / (end - start)) * 100;
    }
  }

  return (
    <div className="w-full h-screen flex bg-[#0f172a]/5 text-gray-800 overflow-hidden">
       <Toaster position="top-right" />
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
              id: "geral" as const,
              label: "Dashboard",
              icon: <LayoutGrid className="w-4 h-4" />,
            },
            {
              id: "mesas" as const,
              label: "Mesas",
              icon: <Users className="w-4 h-4" />,
            },
            {
              id: "cardapio" as const,
              label: "Cardápio",
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
            <ProgressLine
              label="Uso de tokens"
              value={tokensTexto}
              percent={tokensUsedPercent}
            />

            <ProgressLine
              label="Tokens restantes"
              value={`${subscription?.tokensRemaining ?? 0}`}
              percent={tokensRemainingPercent}
            />

            <div>
              <div className="flex justify-between text-[10px] mt-1">
                <span>Renovação</span>
                <span>
                  {planoAtivo && subscription?.cycleEnd
                    ? new Date(subscription.cycleEnd).toLocaleDateString(
                        "pt-BR"
                      )
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
              {userName?.[0] ?? "U"}
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

              <section className="mt-8">
                <OrdersTable
                  tab={ordersTab}
                  setTab={setOrdersTab}
                  completed={ordersCompleted}
                  paid={ordersPaid}
                  loading={ordersLoading}
                  error={ordersError}
                  onRefresh={fetchOrders}
                  onMarkPaid={markOrderPaid}
                />
              </section>
            </>
          )}

          <section className="mt-2">
            {activeTab === "mesas" && (
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#6d4aff]">
                    Mesas do Restaurante
                  </h2>
                  <button
                    onClick={handleAddTable}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white px-5 py-2 rounded-xl text-xs font-medium shadow-md hover:opacity-90 transition"
                  >
                    <Icon
                      icon="fluent:add-20-filled"
                      className="w-4 h-4 text-white"
                    />
                    Adicionar mesa
                  </button>
                </div>

                {tablesLoading && (
                  <p className="text-sm text-gray-500">Carregando mesas...</p>
                )}

                {tablesError && (
                  <p className="text-sm text-red-500">{tablesError}</p>
                )}

                {!tablesLoading && !tablesError && tables.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Nenhuma mesa cadastrada ainda. Clique em{" "}
                    <span className="font-semibold">“Adicionar mesa”</span> para
                    começar.
                  </p>
                )}

                {!tablesLoading && !tablesError && tables.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {tables.map((t) => (
                      <TableCard
                        key={t.id}
                        label={t.name}
                        onChoose={() => handleChooseTable(t.name)}
                        onRemove={() => handleRemoveTable(t.id)}
                      />
                    ))}
                  </div>
                )}
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
                        const res = await fetch(`${API_BASE}/csv/import`, {
                          method: "POST",
                          body: formData,
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                        });

                        const data = await res.json();
                        if (!res.ok)
                          throw new Error(data.error || "Erro ao enviar CSV");

                        toast.success(
                          `Cardápio importado com sucesso! Itens importados: ${
                            data.imported || 0
                          }`
                        );
                        fetchMenuItems();
                      } catch (err) {
                        console.error(err);
                        toast.error("Falha na importação do CSV.");
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

                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="mt-3 text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                          >
                            Remover
                          </button>
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

function ProgressLine({
  label,
  value,
  percent = 0,
}: {
  label: string;
  value: string | number;
  percent?: number;
}) {
  const safePercent = Math.max(0, Math.min(100, percent));

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

function TableCard({
  label,
  onChoose,
  onRemove,
}: {
  label: string;
  onChoose: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-white border border-[#ececff] rounded-2xl px-5 py-4 flex justify-between items-center shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#818cf8] flex items-center justify-center text-white font-medium">
          {label.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-sm">Mesa {label}</p>
          <p className="text-xs text-gray-500">
            Clique em &quot;Escolher&quot; para abrir pedidos.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onChoose}
          className="border border-[#7c3aed] bg-[#7c3aed] text-white rounded-xl px-3 py-1.5 text-xs hover:bg-[#6d28d9] transition"
        >
          Escolher
        </button>
        <button
          onClick={onRemove}
          className="border border-red-200 text-red-500 rounded-xl px-3 py-1.5 text-xs hover:bg-red-50 transition"
        >
          Remover
        </button>
      </div>
    </div>
  );
}

function OrdersTable({
  tab,
  setTab,
  completed,
  paid,
  loading,
  error,
  onRefresh,
  onMarkPaid,
}: {
  tab: "concluidos" | "pagos";
  setTab: (tab: "concluidos" | "pagos") => void;
  completed: any[];
  paid: any[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onMarkPaid: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const isConcluidos = tab === "concluidos";
  const currentOrders = isConcluidos ? completed : paid;

  const filtered = currentOrders.filter((order) => {
    const idMatch = String(order.id).includes(search);
    const tableMatch = String(order.tableNumber || "").includes(search);
    return idMatch || tableMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="bg-white border border-[#e3e0ff] rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[#6d4aff]">
            Pedidos {isConcluidos ? "concluídos" : "pagos"}
          </h2>
          <p className="text-xs text-gray-500">
            Acompanhe pedidos finalizados e controle o que já foi pago.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#f4f4ff] border border-[#e2e4ff] rounded-full p-1 text-xs">
            <button
              onClick={() => {
                setTab("concluidos");
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full transition ${
                isConcluidos
                  ? "bg-white shadow-sm text-[#16a34a]"
                  : "text-gray-500 hover:text-[#16a34a]"
              }`}
            >
              Concluídos
            </button>
            <button
              onClick={() => {
                setTab("pagos");
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full transition ${
                !isConcluidos
                  ? "bg-white shadow-sm text-[#2563eb]"
                  : "text-gray-500 hover:text-[#2563eb]"
              }`}
            >
              Pagos
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="text-xs px-3 py-2 rounded-xl bg-[#f4f4ff] border border-[#e2e4ff] hover:bg:white transition"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* filtros / busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#f7f7ff] border border-[#e0e0ff] rounded-xl px-3 py-2 text-sm w-full md:w-72">
            <Icon
              icon="fluent:search-20-regular"
              className="w-4 h-4 text-[#7b4fff]"
            />
            <input
              type="text"
              placeholder="Buscar por pedido ou mesa..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="ml-2 bg-transparent outline-none flex-1 text-xs text-gray-700"
            />
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Mostrando{" "}
          <span className="font-semibold">
            {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}
            {" - "}
            {Math.min(page * perPage, filtered.length)}
          </span>{" "}
          de <span className="font-semibold">{filtered.length}</span> pedidos
        </div>
      </div>

      {/* tabela */}
      <div className="overflow-x-auto border border-[#f0f0ff] rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-[#fafaff] text-xs text-gray-500">
            <tr className="border-b border-[#ececff]">
              <th className="text-left py-3 px-4">Pedido</th>
              <th className="text-left py-3 px-4">Mesa</th>
              <th className="text-left py-3 px-4">Itens</th>
              <th className="text-right py-3 px-4">Total</th>
              <th className="text-center py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Ação</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  Carregando pedidos...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-red-500 text-sm"
                >
                  {error}
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              paginated.map((order) => {
                const total = order.orderItems?.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );

                const itensLabel =
                  order.orderItems
                    ?.map(
                      (item) =>
                        `${item.quantity}x ${
                          item.menuItem?.name ?? "Item sem nome"
                        }`
                    )
                    .join(" • ") ?? "-";

                return (
                  <tr
                    key={order.id}
                    className="border-t border-[#f3f3ff] hover:bg-[#fafaff] transition"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-800 whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#eef2ff] text-[#4c51bf] text-xs font-medium">
                        Mesa {order.tableNumber ?? "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-[320px]">
                      <p className="text-xs text-gray-700 truncate">
                        {itensLabel}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="font-semibold text-[#6b46ff]">
                        R$ {total?.toFixed(2) ?? "0,00"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isConcluidos ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#dcfce7] text-[#166534] text-[11px] font-semibold">
                          Concluído
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#dbeafe] text-[#1d4ed8] text-[11px] font-semibold">
                          Pago
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isConcluidos ? (
                        <button
                          onClick={() => onMarkPaid(order.id)}
                          className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] shadow hover:brightness-110 transition"
                        >
                          Marcar como pago
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-[11px] text-gray-500">
        <span>
          Página {page} de {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-2 py-1 rounded-md border ${
              page === 1
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            Anterior
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`px-2 py-1 rounded-md border ${
              page === totalPages
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

