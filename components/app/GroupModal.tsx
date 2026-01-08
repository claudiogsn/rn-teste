import React, { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { useAuthStore } from "@/lib/authStore";
import { useContextStore } from "@/lib/contextStore";
import { getGroupsByUnit, Group } from "@/lib/portalApi";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function GroupModal({ open, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const unit = useContextStore((s) => s.unit);
  const setGroup = useContextStore((s) => s.setGroup);

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !user || !unit) return;

    setLoading(true);

    getGroupsByUnit(user.id, user.token)
      .then((list) => setGroups(list))
      .catch((err) => {
        console.error("Erro ao carregar grupos", err);
        setGroups([]);
      })
      .finally(() => setLoading(false));
  }, [open, user, unit]);

  function selectGroup(group: Group) {
    setGroup(group);
    onClose();
  }

  return (
    <Modal visible={open} transparent animationType="slide">
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl p-5 max-h-[70%]">
          <Text className="text-base font-bold text-primary mb-3">
            Selecionar grupo
          </Text>

          {!unit && (
            <Text className="text-sm text-muted">
              Selecione uma unidade primeiro
            </Text>
          )}

          {loading && <Text className="text-sm text-muted">Carregando...</Text>}

          <ScrollView>
            {groups.map((g) => (
              <Pressable
                key={g.id}
                onPress={() => selectGroup(g)}
                className="flex-row items-center p-4 mb-2 rounded-xl bg-secondary"
              >
                <FontAwesome5 name="layer-group" size={16} color="#0B46AC" />
                <Text className="ml-3 text-sm font-semibold text-foreground">
                  {g.id} – {g.nome}
                </Text>
              </Pressable>
            ))}

            {!loading && groups.length === 0 && unit && (
              <Text className="text-sm text-muted text-center mt-4">
                Nenhum grupo disponível para esta unidade
              </Text>
            )}
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
