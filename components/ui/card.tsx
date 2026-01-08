import React, { ReactNode } from "react";
import { View, Text } from "react-native";

export function Card(props: { children: ReactNode }) {
  return <View className="bg-card border border-border rounded-xl p-5">{props.children}</View>;
}

export function CardHeader(props: { title: string; subtitle?: string }) {
  return (
    <View className="mb-4">
      <Text className="text-foreground text-xl font-semibold">{props.title}</Text>
      {props.subtitle ? <Text className="text-muted mt-1">{props.subtitle}</Text> : null}
    </View>
  );
}
