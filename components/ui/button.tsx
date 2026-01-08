import React from "react";
import { Pressable, Text, ActivityIndicator, ViewStyle } from "react-native";

type Variant = "default" | "outline" | "destructive";
type Size = "sm" | "md" | "lg";

export function Button(props: {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
}) {
  const { title, onPress, disabled, loading, variant = "default", size = "md", style } = props;

  const base = "rounded-xl items-center justify-center flex-row";
  const sizes: Record<Size, string> = {
    sm: "h-10 px-4",
    md: "h-12 px-5",
    lg: "h-14 px-6",
  };
  const variants: Record<Variant, string> = {
    default: "bg-primary",
    outline: "bg-transparent border border-border",
    destructive: "bg-danger",
  };
  const textVariants: Record<Variant, string> = {
    default: "text-black",
    outline: "text-foreground",
    destructive: "text-white",
  };

  return (
    <Pressable
      className={[
        base,
        sizes[size],
        variants[variant],
        disabled ? "opacity-50" : "opacity-100",
      ].join(" ")}
      style={style}
      disabled={disabled || loading}
      onPress={onPress}
      accessibilityRole="button"
    >
      {loading ? (
        <>
          <ActivityIndicator />
          <Text className={["ml-2 font-semibold", textVariants[variant]].join(" ")}>{title}</Text>
        </>
      ) : (
        <Text className={["font-semibold", textVariants[variant]].join(" ")}>{title}</Text>
      )}
    </Pressable>
  );
}
