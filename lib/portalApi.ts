type ApiResponse<T = any> = T & { success?: boolean };

const PORTAL_API_URL = process.env.EXPO_PUBLIC_PORTAL_API_URL || "";
const MOBILE_MENU_BASE = process.env.EXPO_PUBLIC_MOBILE_MENU_BASE || "";

function mustUrl() {
  if (!PORTAL_API_URL) {
    throw new Error("EXPO_PUBLIC_PORTAL_API_URL não configurada no .env");
  }
  return PORTAL_API_URL;
}

async function post<T>(method: string, data: any, token?: string): Promise<T> {
  const url = mustUrl();

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body: JSON.stringify({ method, data }),
  });

  const json = (await resp.json().catch(() => null)) as ApiResponse<T> | null;
  if (!json) throw new Error("Resposta inválida do servidor");
  return json as T;
}

export type UserPermission = {
  id: number;
  name: string;
};

export type UserUnit = {
  id: number;
  name: string;
};

export type UserGroup = {
  id: number;
  name: string;
  slug: string;
};

export type UserDetails = {
  id: number;
  name: string;
  login: string;
  function_name: string;

  system_unit_id: number;

  // fotos
  photo_url: string;
  photo_fallback_url: string;
  photo_urls: string[];

  // unidade padrão
  unit: UserUnit | null;

  // autenticação
  token: string;
  is_logged: boolean;

  // grupo padrão
  group: UserGroup | null;

  // permissões
  permissions: UserPermission[];
  permissions_names: string[];
};


export async function getUserDetails(userLogin: string): Promise<{
  success: boolean;
  userDetails: UserDetails;
}> {
  const r = await post<{
    success: boolean;
    userDetails: UserDetails;
  }>("getUserDetails", {
    user: userLogin,
  });

  if (!r.success || !r.userDetails) {
    throw new Error("userDetails não veio na resposta");
  }

  return r;
}


export type Unit = { id: number; name: string };

export async function getUnitsUser(
  userId: number,
  token: string,
): Promise<Unit[]> {
  const r = await post<{ success: boolean; units?: any[] }>(
    "getUnitsUser",
    { user: userId },
    token,
  );

  if (!r.success || !Array.isArray(r.units)) return [];
  return r.units as Unit[];
}

export type MenuItem = {
  id?: number;
  label: string;
  description?: string;
  route?: string;
  icon?: string; // ex: "fas fa-bars"
};

export async function getMenuMobile(
  userId: number,
  systemUnitId: number,
  token: string,
): Promise<MenuItem[]> {
  const r = await post<{ success: boolean; menus?: any[] }>(
    "getMenuMobile",
    { user_id: userId, system_unit_id: systemUnitId },
    token,
  );

  if (!r.success || !Array.isArray(r.menus)) return [];
  return r.menus as MenuItem[];
}

export function buildMenuUrl(params: {
  userId: number;
  unitId: number;
  token: string;
  route?: string;
}) {
  const { userId, unitId, token, route } = params;
  if (!MOBILE_MENU_BASE || !route) return null;

  // igual seu PHP: `${baseUrlMenu}${menu.route}.html?...`
  const base = MOBILE_MENU_BASE.replace(/\/$/, "");
  const path = route.endsWith(".html") ? route : `${route}.html`;

  return `${base}${path}?username=${userId}&unit_id=${unitId}&token=${encodeURIComponent(token)}`;
}

export type ResumoFinanceiroGrupo = {
  faturamento_bruto: number;
  faturamento_liquido: number;
  descontos: number;
  taxa_servico: number;
  numero_clientes: number;
};

export async function generateResumoFinanceiroPorGrupo(
  grupoId: number | null,
  dt_inicio: string,
  dt_fim: string,
  token: string,
): Promise<ResumoFinanceiroGrupo[]> {
  const r = await post<{
    success: boolean;
    data?: any[];
  }>("generateResumoFinanceiroPorGrupo", { grupoId, dt_inicio, dt_fim }, token);

  if (!r.success || !Array.isArray(r.data)) return [];
  return r.data as ResumoFinanceiroGrupo[];
}
export type Group = {
  id: number;
  name: string;
};

export async function getGroupsByUnit(
  systemUnitId: number,
  token: string,
): Promise<Group[]> {
  const r = await post<{ success: boolean; groups?: any[] }>(
    "getGroupsByUnit",
    { system_unit_id: systemUnitId },
    token,
  );

  if (!r.success || !Array.isArray(r.groups)) return [];
  return r.groups as Group[];
}


