import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

export function Select(props: {
  label?: string;
  value?: string | number;
  onChange?: (v: string) => void;
  items: { label: string; value: string }[];
}) {
  const { label, value, onChange, items } = props;

  return (
    <View className="w-full">
      {label ? <Text className="text-muted mb-2 text-sm">{label}</Text> : null}

      <View className="h-12 px-2 rounded-xl bg-card border border-border justify-center overflow-hidden">
        <Picker
          selectedValue={String(value ?? "")}
          onValueChange={(v) => onChange?.(String(v))}
          style={{ height: 48, width: "100%" }}
        >
          {items.map((it) => (
            <Picker.Item key={it.value} label={it.label} value={it.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
