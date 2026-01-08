import React from "react";
import { View, Text } from "react-native";

export default function Menus() {
  return (
    <View className="flex-1 p-4">
      <View className="bg-card border border-border rounded-2xl p-4">
        <Text className="text-sm text-muted">Menus</Text>
        <Text className="text-lg font-bold text-foreground mt-1">
          Tela de menus (próximo passo)
        </Text>
        <Text className="text-xs text-muted mt-2">
          Aqui vamos renderizar o grid com os menus da unidade selecionada.
        </Text>
      </View>
    </View>
  );
}
