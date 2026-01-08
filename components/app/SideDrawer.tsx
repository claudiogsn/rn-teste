import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../lib/authStore";
import { useNavStore } from "../../lib/navigationStore";
const navigate = useNavStore((s) => s.navigate);


const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = Math.min(300, SCREEN_WIDTH * 0.8);

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SideDrawer({ open, onClose }: Props) {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: open ? 0 : -DRAWER_WIDTH,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: open ? 1 : 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open]);

  function handleLogout() {
    onClose();
    logout();
    router.replace("/login");
  }

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            opacity: overlayOpacity,
            zIndex: 40,
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
      )}

      {/* DRAWER */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: DRAWER_WIDTH,
          backgroundColor: "#fff",
          transform: [{ translateX }],
          zIndex: 50,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 10,
        }}
      >
        <View className="p-5 border-b border-border">
          <Text className="text-lg font-bold text-primary">Portal MRK</Text>
          <Text className="text-xs text-muted mt-1">Menu principal</Text>
        </View>

        {/* ITENS */}
        <View className="p-4 space-y-2">
          <DrawerItem
            icon="home"
            label="Home"
            onPress={() => {
              onClose();
              navigate("home");
            }}
          />

          <DrawerItem
            icon="th-large"
            label="Menus"
            onPress={() => {
              onClose();
              navigate("menus");
            }}
          />

          <DrawerItem
            icon="chart-line"
            label="Dashboard"
            onPress={() => {
              onClose();
              navigate("dashboard");
            }}
          />
        </View>

        {/* FOOTER */}
        <View className="mt-auto p-4 border-t border-border">
          <DrawerItem
            icon="sign-out-alt"
            label="Sair"
            danger
            onPress={handleLogout}
          />
        </View>
      </Animated.View>
    </>
  );
}

function DrawerItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center p-3 rounded-xl"
      style={{
        backgroundColor: danger ? "#FEE2E2" : "#F8FAFC",
      }}
    >
      <FontAwesome5
        name={icon}
        size={16}
        color={danger ? "#EF4444" : "#0B46AC"}
      />
      <Text
        className="ml-3 text-sm font-semibold"
        style={{ color: danger ? "#EF4444" : "#191F2A" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
