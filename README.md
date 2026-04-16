# Jarvis (Web + Voz)

Este projeto contém a interface web do Jarvis com React + TypeScript (Vite) e um backend Node.js para chamadas de IA com DeepSeek.

## Arquitetura

- **Frontend (Vite/React):** reconhecimento de voz + síntese de voz + UI.
- **Backend (Express):** endpoint seguro `POST /ask` que chama DeepSeek (`deepseek-chat`).
- **Segurança:** a chave `DEEPSEEK_API_KEY` fica **somente** no backend.

## Rodando localmente

### 1) Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

### 2) Backend

```bash
cd server
npm install
cp ../.env.example .env
npm run dev
```

> No backend, garanta que `DEEPSEEK_API_KEY` esteja preenchida no `.env`.

## Variáveis de ambiente

### Frontend (`.env` na raiz)

- `VITE_API_BASE_URL` (ex.: `http://localhost:8787`)
- `VITE_BACKEND_DEV_URL` (usado no proxy do Vite)
- `VITE_BASE_PATH` (para deploy no GitHub Pages)

### Backend (`server/.env`)

- `DEEPSEEK_API_KEY`
- `PORT` (padrão `8787`)
- `ALLOWED_ORIGIN` (ex.: `http://localhost:5173`)

## Endpoint do backend

### `POST /ask`

Body:

```json
{ "prompt": "sua pergunta" }
```

Resposta:

```json
{ "response": "resposta da IA" }
```

## Deploy

### Frontend no GitHub Pages

1. Defina `VITE_BASE_PATH` com o caminho do repositório, por exemplo: `/nome-do-repo/`.
2. Gere build:

```bash
npm run build
```

3. Publique a pasta `dist` no GitHub Pages.

### Backend no Render

1. Crie um Web Service apontando para `server`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Configure variáveis no Render:
   - `DEEPSEEK_API_KEY`
   - `ALLOWED_ORIGIN` com a URL do GitHub Pages

## Comandos de voz úteis

- `Jarvis, que horas são`
- `Jarvis, pesquise no google por notícias de tecnologia`
- `Jarvis, pesquise inteligência artificial na internet`
- `Jarvis, pergunta qual a diferença entre API REST e GraphQL`
