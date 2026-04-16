# Jarvis Fullstack (React + TypeScript + Express + DeepSeek)

Projeto Jarvis com frontend em React/Vite e backend Node.js (Express) para integração segura com IA (DeepSeek), sem expor API keys no frontend.

## Arquitetura

- **Frontend (Vite + React + TypeScript):** Interface + comandos de voz
- **Backend (Node.js + Express):** Endpoint `/ask` que conversa com a IA
- **Segurança:** API key fica apenas no backend
- **Resiliência:** retry, timeout, fallback e cache

---

## Requisitos

- Node.js 18+
- npm

---

## Configuração local

### 🔹 Frontend

Na raiz:

```bash
npm install
cp .env.example .env