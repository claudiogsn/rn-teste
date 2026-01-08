import React from "react";
import { TextInput, View, Text } from "react-native";

export function Input(props: {
  label?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: any;
  error?: string;
}) {
  const { label, error, ...rest } = props;

  return (
    <View className="w-full">
      {label ? <Text className="text-muted mb-2 text-sm">{label}</Text> : null}

      <TextInput
        className={[
          "w-full h-12 px-4 rounded-xl bg-card text-foreground border",
          error ? "border-danger" : "border-border",
        ].join(" ")}
        placeholderTextColor="rgba(148,163,184,0.7)"
        {...rest}
      />

      {error ? <Text className="text-danger mt-2 text-xs">{error}</Text> : null}
    </View>
  );
}
