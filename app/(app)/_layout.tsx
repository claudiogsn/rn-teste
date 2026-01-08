import React, { useEffect, useState } from "react";
import { Stack, useRouter, Redirect } from "expo-router";
import { View, Text, Pressable, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { useAuthStore } from "@/lib/authStore";
import { useContextStore } from "@/lib/contextStore";
import { useNavStore } from "@/lib/navigationStore";

import UnitModal from "@/components/app/UnitModal";
import SideDrawer from "@/components/app/SideDrawer";

import "../../global.css";


export default function AppLayout() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const { unit, group } = useContextStore();
  const { current, navigate } = useNavStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);

  // 🔐 proteção
  if (!user) {
    return <Redirect href="/login" />;
  }

  // 🔁 sincroniza store → router
  useEffect(() => {
    router.replace(`/${current}`);
  }, [current]);

  const photo =
    user.photo_urls?.[0] ||
    user.photo_url ||
    user.photo_fallback_url ||
    undefined;

  return (
    <View className="flex-1 bg-background">
      {/* ================= HEADER ================= */}
      <View className="bg-primary px-4 pt-6 pb-4 flex-row items-center justify-between">
        {/* MENU */}
        <Pressable
          onPress={() => setDrawerOpen(true)}
          className="w-10 h-10 items-center justify-center rounded-xl bg-white/15"
        >
          <FontAwesome5 name="bars" size={18} color="#fff" />
        </Pressable>

        {/* USER INFO */}
        <View className="flex-1 px-3">
          <Text className="text-white text-xs opacity-90">Olá,</Text>
          <Text className="text-white text-base font-bold" numberOfLines={1}>
            {user.name}
          </Text>

          <Text className="text-white/90 text-xs" numberOfLines={1}>
            {unit?.name || "Unidade não selecionada"}
            {group ? ` · ${group.name}` : ""}
          </Text>
        </View>

        {/* FOTO */}
        <Pressable className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
          {photo ? (
            <Image
              source={{ uri: photo }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <FontAwesome5 name="user" size={16} color="#fff" />
            </View>
          )}
        </Pressable>
      </View>

      {/* ================= TELAS ================= */}
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {/* ================= BOTTOM BAR ================= */}
      <View className="bg-card border-t border-border px-5 py-3 flex-row items-center justify-between">
        <BottomButton
          icon="store"
          label="Unidade"
          onPress={() => setUnitOpen(true)}
        />

        <BottomCenterButton
          active={current === "home"}
          onPress={() => navigate("home")}
        />

        <BottomButton
          icon="th-large"
          label="Menus"
          onPress={() => navigate("menus")}
        />
      </View>

      {/* ================= MODAIS ================= */}
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <UnitModal open={unitOpen} onClose={() => setUnitOpen(false)} />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENTES                                                                 */
/* -------------------------------------------------------------------------- */

function BottomButton({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-12 h-12 rounded-2xl items-center justify-center"
    >
      <FontAwesome5 name={icon as any} size={18} color="#0B46AC" />
      <Text className="text-[10px] text-foreground mt-1">{label}</Text>
    </Pressable>
  );
}

function BottomCenterButton({
  onPress,
  active,
}: {
  onPress: () => void;
  active: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-16 h-16 rounded-full items-center justify-center -mt-8"
      style={{ backgroundColor: active ? "#08A794" : "#94a3b8" }}
    >
      <FontAwesome5 name="home" size={20} color="#fff" />
      <Text className="text-[10px] text-white mt-1 font-bold">Home</Text>
    </Pressable>
  );
}
