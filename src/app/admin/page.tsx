"use client";
import { useState, useEffect } from "react";
import {
  Users,
  UtensilsCrossed,
  DollarSign,
  Clock,
  LayoutGrid,
  RefreshCw,
  Search,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { jwtDecode } from "jwt-decode";
import { useUser } from "@/hooks/useUser";
import { useAuthGuard } from "@/hooks/useAuthGuard";

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("geral");
  const { isReady } = useAuthGuard();

  // CARDÁPIO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { users, findAll } = useUser();

  useEffect(() => {
    findAll();
  }, []);

  // STATS
  const [stats, setStats] = useState({
    liveOrders: 0,
    avgPrep: 0,
    revenue: 0,
    newCustomers: 0,
  });

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  // Assinatura
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

  // =====================================================
  // 🔁 BUSCAR ASSINATURA REAL DO USUÁRIO (COM POLLING)
  // =====================================================
  async function fetchSubscription() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSubscription({ active: false });
        return;
      }

      const res = await fetch("http://localhost:1337/me/subscription", {
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
    // chama ao montar
    fetchSubscription();

    // e depois a cada 10 segundos
    const interval = setInterval(() => {
      fetchSubscription();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ================= PEDIDOS NO DASHBOARD =================

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ordersPending, setOrdersPending] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ordersCompleted, setOrdersCompleted] = useState<any[]>([]);
  const [ordersTab, setOrdersTab] = useState<"pendentes" | "concluidos">(
    "pendentes"
  );
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      const token = localStorage.getItem("token");

      const [resPend, resComp] = await Promise.all([
        fetch("http://localhost:1337/orders/kitchen", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:1337/orders/kitchen/completed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!resPend.ok || !resComp.ok) {
        throw new Error("Erro ao buscar pedidos");
      }

      const [dataPend, dataComp] = await Promise.all([
        resPend.json(),
        resComp.json(),
      ]);

      setOrdersPending(dataPend);
      setOrdersCompleted(dataComp);
    } catch (err) {
      console.error(err);
      setOrdersError("Erro ao buscar pedidos");
    } finally {
      setOrdersLoading(false);
    }
  };

  const completeOrder = async (id: number) => {
    try {
      setOrdersLoading(true);
      await fetch(`http://localhost:1337/orders/kitchen/${id}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetchOrders();
    } catch (err) {
      console.error("Erro ao concluir pedido", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================================================

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
      {/* SIDEBAR */}
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

        {/* CARD DO PLANO USANDO DADOS REAIS */}
        <div className="bg-black/10 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70 mb-1">
            {planoAtivo ? "Plano atual" : "Sem plano"}
          </p>
          <h3 className="text-base font-semibold mb-3">
            {planoAtivo ? nomePlano : "Teste grátis"}
          </h3>

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

            {/* Renovação sem progress bar */}
            <div>
              <div className="flex justify-between text-[10px] mb-1">
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

          <button className="w-full text-xs font-semibold bg-white text-[#7b4fff] rounded-full py-2 shadow hover:bg-[#f6f3ff] transition">
            {planoAtivo ? "Gerenciar plano" : "ASSINAR AGORA"}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
              {userName?.charAt(0) || "U"}
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

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 h-full bg-[#f9f9ff] flex flex-col overflow-hidden">
        <header className="w-full px-6 lg:px-10 pt-6 pb-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">
              Plano{" "}
              <span className="text-[#7b4fff] font-medium">
                {planoAtivo ? nomePlano : "sem plano ativo"}
              </span>
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
            className="flex items-center gap-1 bg-[#f4f4ff] border border-[#e2e4ff] px-4 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg:white transition"
          >
            <span>Sair</span>
            <Icon icon="fluent:arrow-exit-20-regular" className="w-4 h-4" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-6 space-y-8">
          {/* DASHBOARD GERAL */}
          {activeTab === "geral" && (
            <>
              {/* MÉTRICAS */}
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

              {/* TABELA DE PEDIDOS */}
              <section className="mt-8">
                <OrdersTable
                  tab={ordersTab}
                  setTab={setOrdersTab}
                  pending={ordersPending}
                  completed={ordersCompleted}
                  loading={ordersLoading}
                  error={ordersError}
                  onRefresh={fetchOrders}
                  onComplete={completeOrder}
                />
              </section>
            </>
          )}

          <section className="mt-2">
            {/* USUÁRIOS */}
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

            {/* CARDÁPIO */}
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
        <div
          className="h-full bg-white/80 rounded-full transition-all"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  value,
  subtitle,
}: {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  subtitle: string;
}) {
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

function UserCard({ name, role }: { name: string; role: string }) {
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

/* =============== TABELA DE PEDIDOS COM PAGINAÇÃO ================= */

function OrdersTable({
  tab,
  setTab,
  pending,
  completed,
  loading,
  error,
  onRefresh,
  onComplete,
}: {
  tab: "pendentes" | "concluidos";
  setTab: (tab: "pendentes" | "concluidos") => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pending: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  completed: any[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onComplete: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const currentOrders = tab === "pendentes" ? pending : completed;

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

  const isPendentes = tab === "pendentes";

  // helper pra somar total do pedido (se tiver price nos menuItems)
  const calcTotal = (order: any) => {
    if (!order.orderItems) return 0;
    return order.orderItems.reduce((sum: number, item: any) => {
      const price = item.menuItem?.price ?? 0;
      const qty = item.quantity ?? 1;
      return sum + price * qty;
    }, 0);
  };

  return (
    <div className="bg-white border border-[#e3e0ff] rounded-2xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTab("pendentes");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              isPendentes
                ? "bg-[#4f46e5] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Pendentes ({pending.length})
          </button>
          <button
            onClick={() => {
              setTab("concluidos");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              !isPendentes
                ? "bg-[#4f46e5] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Concluídos ({completed.length})
          </button>
        </div>

        <div className="flex flex-1 sm:flex-none items-center gap-2">
          <div className="flex-1 relative max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar por ID ou mesa"
              className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#4f46e5]"
            />
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Atualizar
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando pedidos...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          Nenhum pedido {isPendentes ? "pendente" : "concluído"} encontrado.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[11px] text-gray-500 border-b border-gray-100">
                  <th className="text-left py-2">ID</th>
                  <th className="text-left py-2">Mesa</th>
                  <th className="text-left py-2">Itens</th>
                  <th className="text-left py-2">Total</th>
                  <th className="text-left py-2">Criado em</th>
                  {isPendentes && <th className="text-right py-2">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map((order) => {
                  const total = calcTotal(order);
                  const created =
                    order.createdAt &&
                    new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                  const itensResumo = (order.orderItems || [])
                    .map(
                      (item: any) =>
                        `${item.quantity || 1}x ${
                          item.menuItem?.name || "Item"
                        }`
                    )
                    .join(", ");

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 last:border-none"
                    >
                      <td className="py-2 text-gray-700 font-medium">
                        #{order.id}
                      </td>
                      <td className="py-2 text-gray-700">
                        {order.tableNumber || "-"}
                      </td>
                      <td className="py-2 text-gray-600 max-w-[260px] truncate">
                        {itensResumo || "Sem itens"}
                      </td>
                      <td className="py-2 text-gray-800 font-semibold">
                        R$ {total.toFixed(2)}
                      </td>
                      <td className="py-2 text-gray-500">{created || "-"}</td>
                      {isPendentes && (
                        <td className="py-2 text-right">
                          <button
                            onClick={() => onComplete(order.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          >
                            Marcar como pronto
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* paginação */}
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
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
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
        </>
      )}
    </div>
  );
}
