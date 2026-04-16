# Jarvis Fullstack (React + TypeScript + Express + DeepSeek)

Este projeto mantém a interface existente do Jarvis em React/Vite e adiciona um backend Node.js seguro para integração com DeepSeek, sem expor API keys no frontend.

## Arquitetura

- **Frontend (Vite + React + TypeScript):** UI + voz (SpeechRecognition e speechSynthesis).
- **Backend (Node.js + Express):** endpoint `POST /ask` para comunicação com DeepSeek.
- **Segurança:** `DEEPSEEK_API_KEY` existe somente no backend (`server/.env`).
- **Resiliência:** timeout, retry automático, fallback amigável e cache em memória.

## Requisitos

- Node.js 18+
- npm

## Configuração local

### 1) Frontend

Na raiz do projeto:

```bash
npm install
cp .env.example .env
```

Edite o `.env` e garanta:

```env
VITE_API_URL=http://localhost:8787
VITE_BASE_PATH=/
```

Suba o frontend:

```bash
npm run dev
```

### 2) Backend

No diretório `server`:

```bash
cd server
npm install
cp ../.env.example .env
```

No `server/.env`, configure ao menos:

```env
DEEPSEEK_API_KEY=ds-sua-chave-aqui
PORT=8787
ALLOWED_ORIGIN=http://localhost:5173
```

Suba o backend:

```bash
npm run dev
```

## Endpoint

### `POST /ask`

Request body:

```json
{
  "prompt": "string"
}
```

Regras:

- `prompt` obrigatório
- limite de 500 caracteres

Response (sempre retorna um texto em `response`):

```json
{
  "response": "string"
}
```

## Robustez aplicada no backend

- Timeout de **10 segundos** por chamada ao DeepSeek
- Retry automático de até **2 tentativas adicionais**
- Cache simples em memória com `Map`
- Fallback padrão em qualquer falha externa:
  - `Estou enfrentando instabilidade com os sistemas de IA, chefe. Tente novamente em instantes.`

## Deploy

### Frontend (GitHub Pages)

1. Configure `VITE_BASE_PATH` no ambiente de build com o subpath do repositório (ex.: `/jarvis/`).
2. Configure `VITE_API_URL` apontando para a URL pública do backend no Render.
3. Rode:

```bash
npm run build
```

4. Publique a pasta `dist` no GitHub Pages.

### Backend (Render)

O projeto já inclui `render.yaml` na raiz com serviço apontando para `server`.

No Render, defina variáveis:

- `DEEPSEEK_API_KEY`
- `ALLOWED_ORIGIN` (URL pública do frontend)
- `PORT` (opcional; Render normalmente injeta automaticamente)

## Observações importantes

- Não coloque `DEEPSEEK_API_KEY` no frontend.
- O frontend chama somente `VITE_API_URL + /ask`.
- Em caso de falhas de rede/backend, o hook de voz responde:
  - `Estou com instabilidade no momento, chefe.`
