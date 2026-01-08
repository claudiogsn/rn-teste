import { Redirect } from "expo-router";
import { useAuthStore } from "@/lib/authStore";

export default function Index() {
  const user = useAuthStore((s) => s.user);
  // CORREÇÃO: Mudar de "/login" para "/auth/login"
  return <Redirect href={user ? "/home" : "/auth/login"} />;
}
