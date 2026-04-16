# Jarvis Fullstack (React + TypeScript + Express + DeepSeek)

Projeto Jarvis com frontend em React/Vite e backend em Express para integração segura com DeepSeek.

## Requisitos

- Node.js 18+
- npm

## Configuração local

### 1) Frontend

```bash
npm install
cp .env.example .env
```

No `.env` (raiz), configure:

```env
VITE_API_URL=https://SEU-BACKEND.onrender.com
VITE_BASE_PATH=/NOME-DO-REPO/
```

Para desenvolvimento local, você pode trocar temporariamente:

```env
VITE_API_URL=http://localhost:8787
VITE_BASE_PATH=/
```

Executar frontend:

```bash
npm run dev
```

### 2) Backend

```bash
cd server
npm install
cp ../.env.example .env
npm run dev
```

No `server/.env`:

```env
DEEPSEEK_API_KEY=ds-sua-chave-aqui
PORT=8787
ALLOWED_ORIGIN=http://localhost:5173
```

## Deploy do frontend no GitHub Pages

A configuração de build já está preparada para GitHub Pages com base padrão `/NOME-DO-REPO/` em `vite.config.ts`.

### Deploy manual

1. Ajuste `homepage` no `package.json` para sua URL real.
2. Garanta que `.env` tenha `VITE_API_URL` do backend em produção.
3. Rode:

```bash
npm run deploy
```

Esse comando executa `predeploy` (`npm run build`) e publica `dist` com `gh-pages`.

### Deploy automático (GitHub Actions)

Arquivo: `.github/workflows/deploy.yml`

Ele faz automaticamente:

- instalação de dependências
- build do projeto
- geração de fallback SPA (`dist/404.html`)
- adição de `.nojekyll`
- publicação no GitHub Pages

Para funcionar corretamente, configure no repositório:

- **Settings → Pages → Source:** GitHub Actions
- **Secrets and variables → Actions → Repository secret:**
  - `VITE_API_URL` com URL pública do backend (Render)

## Backend (Render)

O backend já está preparado com `render.yaml` na raiz, apontando para `server`.

Variáveis necessárias no Render:

- `DEEPSEEK_API_KEY`
- `ALLOWED_ORIGIN` (URL do GitHub Pages)

## Observações

- A chave `DEEPSEEK_API_KEY` nunca deve ir para o frontend.
- O frontend usa `import.meta.env.VITE_API_URL` para chamar `/ask`.
- A interface e lógica principal do Jarvis foram preservadas.
