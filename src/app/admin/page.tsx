"use client";
import { useState } from "react";
import {
  Cog,
  Users,
  UtensilsCrossed,
  Mic,
  Database,
  DollarSign,
  Clock,
} from "lucide-react";
import { Icon } from "@iconify/react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("geral");

  const stats = {
    liveOrders: 5,
    avgPrep: 12,
    revenue: 1250,
    newCustomers: 15,
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f9f9ff] to-[#f2f6ff] p-8 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] p-3 rounded-2xl text-white shadow-md">
            <Cog className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              Painel de Administração – ServeAI
            </h1>
            <p className="text-sm text-[#7a5cff] font-medium">
              Configurações do Sistema
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm shadow-sm hover:shadow-md transition">
          <span>Sair</span>
          <Icon icon="fluent:arrow-exit-20-regular" className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white border border-[#ececff] rounded-full p-1 shadow-sm mb-10">
        {[
          { id: "geral", label: "Geral", icon: <Clock className="w-4 h-4" /> },
          { id: "usuarios", label: "Usuários", icon: <Users className="w-4 h-4" /> },
          { id: "cardapio", label: "Cardápio", icon: <UtensilsCrossed className="w-4 h-4" /> },
          { id: "ia", label: "IA", icon: <Mic className="w-4 h-4" /> },
          { id: "sistema", label: "Sistema", icon: <Database className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white shadow-md"
                : "text-gray-600 hover:text-[#6b46ff]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== GERAL ==================== */}
      {activeTab === "geral" && (
        <div>
          <h2 className="text-lg font-semibold mb-6">Desempenho do Restaurante</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card
              title="Ordens Ativas"
              icon={<Clock className="text-[#fb923c]" />}
              value={`${stats.liveOrders} ativas`}
              subtitle={`Tempo médio de preparo: ${stats.avgPrep} min`}
            />
            <Card
              title="Lucro de Hoje"
              icon={<DollarSign className="text-green-500" />}
              value={`R$ ${stats.revenue.toLocaleString()}`}
              subtitle="Lucro médio por pedido: R$ 7,50"
            />
            <Card
              title="Novos Clientes"
              icon={<Users className="text-blue-600" />}
              value={stats.newCustomers}
              subtitle="Hoje"
            />
          </div>
        </div>
      )}

      {/* ==================== USUÁRIOS ==================== */}
      {activeTab === "usuarios" && (
        <div className="grid gap-6">
          <h2 className="text-lg font-semibold text-[#6d4aff]">Gerenciar Usuários</h2>
          <UserCard name="João Silva" role="Garçom" status="Ativo" />
          <UserCard name="Maria Santos" role="Garçom" status="Ativo" />
          <UserCard name="Pedro Costa" role="Atendente" status="Inativo" />
        </div>
      )}

      {/* ==================== CARDÁPIO ==================== */}
      {activeTab === "cardapio" && (
        <div>
          <h2 className="text-lg font-semibold text-[#6d4aff] mb-4">Cardápio Digital</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <MiniCard label="Total de Itens" value="142 produtos" color="from-[#c084fc] to-[#818cf8]" />
            <MiniCard label="Categorias" value="12 categorias" color="from-[#818cf8] to-[#60a5fa]" />
            <MiniCard label="Itens Ativos" value="138 disponíveis" color="from-[#7b4fff] to-[#3b82f6]" />
          </div>
          <button className="mt-6 bg-gradient-to-r from-[#7b4fff] to-[#3b82f6] text-white px-5 py-2 rounded-xl text-sm font-medium shadow-md hover:opacity-90 transition">
            <Icon icon="fluent:food-24-regular" className="inline w-4 h-4 mr-1" />
            Adicionar Item
          </button>
        </div>
      )}

      {/* ==================== IA ==================== */}
      {activeTab === "ia" && (
        <div className="grid md:grid-cols-2 gap-6">
          <ConfigCard
            title="Reconhecimento de Voz"
            subtitle="Configure a IA de reconhecimento de voz"
            icon="fluent:mic-24-filled"
            fields={[
              { label: "Ativar Reconhecimento de Voz", type: "toggle" },
              { label: "Idioma de Reconhecimento", value: "Português (Brasil)" },
              { label: "Sensibilidade do Microfone", value: "Média" },
            ]}
          />
          <ConfigCard
            title="Resposta da IA"
            subtitle="Personalize como a IA responde"
            icon="fluent:voice-assistant-24-filled"
            fields={[
              { label: "Tom da Voz", value: "Amigável" },
              { label: "Velocidade da Fala", value: "Normal" },
              { label: "Modelo de IA", value: "Avançado" },
            ]}
          />
        </div>
      )}

      {/* ==================== SISTEMA ==================== */}
      {activeTab === "sistema" && (
        <div className="grid md:grid-cols-2 gap-6">
          <ConfigCard
            title="Backup e Dados"
            subtitle="Proteja as informações do sistema"
            icon="fluent:database-24-filled"
            fields={[
              { label: "Backup Automático", type: "toggle" },
              { label: "Fazer Backup Agora", value: "Manual" },
              { label: "Restaurar Backup", value: "Disponível" },
            ]}
            footer="Último backup: Hoje às 03:00"
          />
          <ConfigCard
            title="Informações do Sistema"
            subtitle="Detalhes da versão e licença"
            icon="fluent:shield-checkmark-24-filled"
            fields={[
              { label: "Versão", value: "ServeAI v2.1.5" },
              { label: "Licença", value: "Ativa" },
              { label: "Validade", value: "31/12/2025" },
              { label: "Dispositivo", value: "Tablet-001" },
            ]}
          />
        </div>
      )}
    </section>
  );
}

/* === COMPONENTES REUTILIZÁVEIS === */
function Card({ title, icon, value, subtitle }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ececff] hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-2 text-gray-700">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-2xl font-semibold text-[#4b4bff]">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function MiniCard({ label, value, color }) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-r ${color} text-white p-[1px] shadow-sm`}
    >
      <div className="bg-white text-gray-700 rounded-2xl p-4 text-center">
        <h4 className="text-sm font-semibold text-[#6b46ff]">{label}</h4>
        <p className="text-sm text-gray-600 mt-1">{value}</p>
      </div>
    </div>
  );
}

function UserCard({ name, role, status }) {
  const active =
    status === "Ativo"
      ? "bg-green-100 text-green-600"
      : "bg-gray-100 text-gray-500";

  return (
    <div className="bg-white border border-[#ececff] rounded-2xl px-5 py-4 flex justify-between items-center shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#818cf8] flex items-center justify-center text-white font-medium">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${active}`}>
          {status}
        </span>
        <button className="border border-gray-200 rounded-xl px-3 py-1 text-sm hover:bg-gray-50">
          Editar
        </button>
      </div>
    </div>
  );
}

function ConfigCard({ title, subtitle, icon, fields, footer }) {
  return (
    <div className="bg-white border border-[#ececff] rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={icon} className="text-[#7b4fff] w-5 h-5" />
          <h3 className="font-semibold text-[#6b46ff]">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
        <ul className="space-y-2">
          {fields.map((f, i) => (
            <li key={i} className="flex justify-between items-center border-b border-gray-100 py-2">
              <span className="text-sm text-gray-700">{f.label}</span>
              {f.type === "toggle" ? (
                <div className="relative inline-block w-10 h-5">
                  <input
                    type="checkbox"
                    className="opacity-0 w-0 h-0 peer"
                    defaultChecked
                  />
                  <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full peer-checked:bg-[#7b4fff] transition"></span>
                  <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5"></span>
                </div>
              ) : (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                  {f.value}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {footer && (
        <p className="text-xs text-[#7b4fff] bg-[#f5f0ff] rounded-lg px-3 py-1 mt-4">
          {footer}
        </p>
      )}
    </div>
  );
}
