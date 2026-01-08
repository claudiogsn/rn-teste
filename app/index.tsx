import { Redirect } from "expo-router";
import { useAuthStore } from "../lib/authStore";

export default function Index() {
  const user = useAuthStore((s) => s.user);
  return <Redirect href={user ? "/home" : "/login"} />;
}
