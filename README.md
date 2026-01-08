# RN Web Login Demo (Expo + NativeWind + shadcn-like UI)

Este projeto te dá:
- **Login** com a mesma lógica do seu `login.php` (via **proxy no servidor**, pra evitar CORS).
- **Dashboard fake** só pra validar o fluxo.
- UI no estilo "shadcn-like" (componentes em `components/ui/*`) usando **NativeWind**.

## 1) Rodar local (web / iOS / Android)
```bash
npm i
npm run start
# ou
npm run web
```

> Dica: no iOS/Android você pode testar com o app Expo Go.

## 2) Configurar a URL do seu backend (proxy)
Crie um `.env` na raiz com:
```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

- No seu VPS, seria algo como:
```bash
EXPO_PUBLIC_API_BASE_URL=https://seu-dominio.com
```

O app chama: `POST {BASE_URL}/api/login.php`

## 3) Proxy PHP (pra colocar no VPS)
Na pasta `server/` tem um `api/login.php` que replica a lógica do seu arquivo PHP:
- Faz POST em `https://portal.mrksolucoes.com.br/engine.php?class=LoginForm&method=onLogin&static=1`
- Se achar `Usuário não encontrado ou senha incorreta` → retorna erro
- Se achar `__adianti_goto_page` → sucesso

Você pode:
- copiar a pasta `server/` pro seu VPS (webroot),
- e acessar `https://seu-dominio.com/api/login.php`.

## 4) Deploy web (VPS)
Gere a build web:
```bash
npm run export:web
```

Vai criar uma pasta `dist/` (ou `web-build/`, dependendo do Expo). Você serve isso com Nginx apontando pro diretório.

---

Se quiser, eu também te mando um exemplo pronto de config Nginx: `/` servindo o site e `/api/` servindo o PHP.
