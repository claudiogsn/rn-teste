const DEFAULT_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || "";

export type LoginResult =
  | { success: true; user: { login: string } }
  | { success: false; message: string; debug?: any };

export async function loginRequest(login: string, password: string): Promise<LoginResult> {
  // Prefer: proxy no seu domínio (evita CORS no web e replica o PHP)
  if (DEFAULT_BASE) {
    const url = `${DEFAULT_BASE.replace(/\/$/, "")}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    const data = (await resp.json().catch(() => null)) as any;
    if (!data) return { success: false, message: "Resposta inválida do servidor" };
    return data;
  }

  // Fallback (pode falhar no web por CORS):
  const remoteUrl = "https://portal.mrksolucoes.com.br/engine.php?class=LoginForm&method=onLogin&static=1";
  const body = new URLSearchParams({
    login,
    password,
    previous_class: "",
    previous_method: "",
    previous_parameters: "",
  });

  const r = await fetch(remoteUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      accept: "*/*",
    },
    body,
  });

  const text = await r.text();

  if (!r.ok) return { success: false, message: "Falha na comunicação com o servidor" };

  if (text.includes("__adianti_error('Erro', 'Usuário não encontrado ou senha incorreta'")) {
    return { success: false, message: "Usuário não encontrado ou senha incorreta", debug: { sample: text.slice(0, 500) } };
  }

  if (text.includes("__adianti_goto_page")) {
    return { success: true, user: { login } };
  }

  return { success: false, message: "Erro inesperado na autenticação", debug: { sample: text.slice(0, 500) } };
}
