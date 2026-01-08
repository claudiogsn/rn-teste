import React, { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { useAuthStore } from "@/lib/authStore";
import { useContextStore } from "@/lib/contextStore";
import { getUnitsUser, Unit } from "@/lib/portalApi";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function UnitModal({ open, onClose }: Props) {
  const user = useAuthStore((s) => s.user);

  const setUnit = useContextStore((s) => s.setUnit);
  const clearGroup = useContextStore((s) => s.clearGroup);

  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !user) return;

    setLoading(true);

    getUnitsUser(user.id, user.token)
      .then(setUnits)
      .catch((err) => {
        console.error("Erro ao carregar unidades", err);
        setUnits([]);
      })
      .finally(() => setLoading(false));
  }, [open, user]);

  function selectUnit(unit: Unit) {
    setUnit(unit); // ✅ troca unidade
    clearGroup(); // ✅ força escolher grupo novamente
    onClose();
  }

  return (
    <Modal visible={open} transparent animationType="slide">
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl p-5 max-h-[70%]">
          <Text className="text-base font-bold text-primary mb-3">
            Selecionar unidade
          </Text>

          {loading && (
            <Text className="text-sm text-muted mb-2">Carregando...</Text>
          )}

          <ScrollView>
            {units.map((u) => (
              <Pressable
                key={u.id}
                onPress={() => selectUnit(u)}
                className="flex-row items-center p-4 mb-2 rounded-xl bg-secondary"
              >
                <FontAwesome5 name="store" size={16} color="#0B46AC" />
                <Text className="ml-3 text-sm font-semibold text-foreground">
                  {u.id} – {u.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            onPress={onClose}
            className="mt-3 p-3 rounded-xl items-center"
          >
            <Text className="text-sm text-muted">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
