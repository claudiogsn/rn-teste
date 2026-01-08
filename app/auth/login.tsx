import React, { useMemo, useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";

import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { loginRequest } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { useContextStore } from "@/lib/contextStore";
import { getUserDetails } from "@/lib/portalApi";

/* -------------------------------------------------------------------------- */
/* Schema                                                                      */
/* -------------------------------------------------------------------------- */

const schema = z.object({
  login: z.string().min(2, "Informe seu login"),
  password: z.string().min(2, "Informe sua senha"),
});

type FormData = z.infer<typeof schema>;

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export default function LoginScreen() {
  const router = useRouter();

  const doLogin = useAuthStore((s) => s.login);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { login: "", password: "" },
    mode: "onSubmit",
  });

  const login = watch("login");
  const password = watch("password");

  const subtitle = useMemo(() => {
    const base = process.env.EXPO_PUBLIC_API_BASE_URL;
    if (base) return `Autenticando via ${base.replace(/\/$/, "")}`;
    return "Sem backend configurado";
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                    */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    /* 1️⃣ autenticação */
    const auth = await loginRequest(data.login, data.password);
    if (!auth.success) {
      setServerError(auth.message);
      return;
    }

    try {
      /* 2️⃣ detalhes do usuário */
      const response = await getUserDetails(data.login);

      if (!response.success || !response.userDetails) {
        throw new Error("Resposta inválida da API");
      }

      const details = response.userDetails;

      console.log("details", details);
      console.log("response", response);

      /* 3️⃣ auth store */
      doLogin(details);


      /* 4️⃣ contexto global (unit + group) */
      const { resetContext, setUnit, setGroup } = useContextStore.getState();

      resetContext();

      if (details.unit) {
        setUnit({
          id: details.unit.id,
          name: details.unit.name,
        });
      }

      if (details.group) {
        setGroup({
          id: details.group.id,
          name: details.group.name,
          slug: details.group.slug,
        });
      }

      /* 5️⃣ navegação */
      router.replace("/home");
    } catch (err: any) {
      console.error(err);
      setServerError(err?.message || "Erro ao carregar dados do usuário");
    }
  };

  /* ------------------------------------------------------------------------ */
  /* UI                                                                        */
  /* ------------------------------------------------------------------------ */

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-6"
      >
        <View className="max-w-md w-full self-center">
          <Text className="text-foreground text-3xl font-bold mb-2">
            Bem-vindo 👋
          </Text>

          <Text className="text-muted mb-6">
            Faça login para acessar o sistema.
          </Text>

          <Card>
            <CardHeader title="Login" />

            <View className="gap-4">
              <Input
                label="Usuário"
                placeholder="seu login"
                autoCapitalize="none"
                value={login}
                onChangeText={(t) =>
                  setValue("login", t, { shouldValidate: false })
                }
                error={errors.login?.message}
              />

              <Input
                label="Senha"
                placeholder="sua senha"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={(t) =>
                  setValue("password", t, { shouldValidate: false })
                }
                error={errors.password?.message}
              />

              {serverError && (
                <View className="bg-card border border-danger/60 rounded-xl p-3">
                  <Text className="text-danger text-sm">{serverError}</Text>
                </View>
              )}

              <Button
                title={isSubmitting ? "Entrando..." : "Entrar"}
                loading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              />

              <Text className="text-muted text-xs"></Text>
            </View>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
