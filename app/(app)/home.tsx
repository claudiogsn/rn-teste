import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { generateResumoFinanceiroPorGrupo } from "@/lib/portalApi";
import { useAuthStore } from "@/lib/authStore";
import { useContextStore } from "@/lib/contextStore";

/* -------------------------------------------------------------------------- */
/* Utils                                                                      */
/* -------------------------------------------------------------------------- */

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

/* -------------------------------------------------------------------------- */
/* Home                                                                        */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const router = useRouter();

  // ✅ Zustand da forma correta
  const token = useAuthStore((s) => s.user?.token);
  const { unit, group } = useContextStore();

  const [loading, setLoading] = useState(false);
  const [resumo, setResumo] = useState({
    faturamento_bruto: 0,
    faturamento_liquido: 0,
    descontos: 0,
    taxa_servico: 0,
    numero_clientes: 0,
    ticket_medio: 0,
  });

  /* ------------------------------------------------------------------------ */
  /* Effects                                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!group?.id || !token) return;

    carregarResumo();
  }, [group?.id, token]); // 🔥 troca de grupo refaz a chamada

  /* ------------------------------------------------------------------------ */
  /* API                                                                       */
  /* ------------------------------------------------------------------------ */

  async function carregarResumo() {
    try {
      setLoading(true);

      const hoje = new Date();
      const inicio = new Date();
      inicio.setDate(hoje.getDate() - 7);

      const dt_inicio = `${inicio.toISOString().split("T")[0]} 00:00:00`;
      const dt_fim = `${hoje.toISOString().split("T")[0]} 23:59:59`;

      const result: any = await generateResumoFinanceiroPorGrupo(group!.id, dt_inicio, dt_fim, token!);



      const rows = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];



      let bruto = 0;
      let liquido = 0;
      let descontos = 0;
      let taxa = 0;
      let clientes = 0;

      rows.forEach((l: any) => {
        bruto += Number(l.faturamento_bruto || 0);
        liquido += Number(l.faturamento_liquido || 0);
        descontos += Number(l.descontos || 0);
        taxa += Number(l.taxa_servico || 0);
        clientes += Number(l.numero_clientes || 0);
      });

      setResumo({
        faturamento_bruto: bruto,
        faturamento_liquido: liquido,
        descontos,
        taxa_servico: taxa,
        numero_clientes: clientes,
        ticket_medio: clientes > 0 ? bruto / clientes : 0,
      });
    } catch (err) {
      console.error("Erro dashboard", err);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* UI                                                                        */
  /* ------------------------------------------------------------------------ */

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 pt-4">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-gray-500 text-xs">Últimos 7 dias</Text>

        <Text className="text-xl font-bold text-gray-900">
          Visão Financeira
        </Text>

        {unit && group && (
          <Text className="text-xs text-gray-500 mt-1">
            {unit.name} · {group.name}
          </Text>
        )}
      </View>

      {loading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          {/* KPI GRID */}
          <View className="flex-row flex-wrap justify-between">
            <Kpi
              label="Faturamento"
              value={formatBRL(resumo.faturamento_bruto)}
            />
            <Kpi
              label="Líquido"
              value={formatBRL(resumo.faturamento_liquido)}
            />
            <Kpi label="Ticket Médio" value={formatBRL(resumo.ticket_medio)} />
            <Kpi label="Clientes" value={resumo.numero_clientes.toString()} />
            <Kpi
              label="Descontos"
              value={formatBRL(resumo.descontos)}
              accent="amber"
            />
            <Kpi
              label="Taxa Serviço"
              value={formatBRL(resumo.taxa_servico)}
              accent="amber"
            />
          </View>

          {/* Ações */}
          <View className="mt-6 space-y-3">
            <ActionCard
              title="Faturamento Diário"
              onPress={() => router.push("/dashboard/daily")}
            />
            <ActionCard
              title="Ranking de Produtos"
              onPress={() => router.push("/dashboard/ranking")}
            />
            <ActionCard
              title="Participação por Loja"
              onPress={() => router.push("/dashboard/stores")}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                  */
/* -------------------------------------------------------------------------- */

function Kpi({
  label,
  value,
  accent = "blue",
}: {
  label: string;
  value: string;
  accent?: "blue" | "amber";
}) {
  const border = accent === "blue" ? "border-blue-500" : "border-amber-500";

  return (
    <View
      className={`w-[48%] bg-white mb-4 p-4 rounded-xl border-l-4 ${border}`}
    >
      <Text className="text-gray-500 text-xs">{label}</Text>
      <Text className="text-lg font-bold text-gray-900 mt-1">{value}</Text>
    </View>
  );
}

function ActionCard({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-xl shadow flex-row justify-between items-center"
    >
      <Text className="text-gray-800 font-semibold">{title}</Text>
      <Text className="text-gray-400 text-xl">›</Text>
    </TouchableOpacity>
  );
}
