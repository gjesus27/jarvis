import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();

const PORT = Number(process.env.PORT ?? 8787);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';
const MAX_PROMPT_LENGTH = 500;
const TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;
const FALLBACK_RESPONSE = 'Estou enfrentando instabilidade com os sistemas de IA, chefe. Tente novamente em instantes.';

const responseCache = new Map();

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

async function requestDeepSeek(prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              'Você é Jarvis, assistente inteligente. Responda em português, de forma curta, direta e chamando o usuário de chefe.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`DeepSeek respondeu com status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error('DeepSeek retornou resposta vazia.');
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
}

async function askWithRetry(prompt) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await requestDeepSeek(prompt);
    } catch (error) {
      const isLastAttempt = attempt === MAX_RETRIES;
      const errorMessage = error instanceof Error ? error.message : 'erro desconhecido';
      console.error(`[askWithRetry] tentativa ${attempt + 1} falhou: ${errorMessage}`);

      if (isLastAttempt) {
        throw error;
      }
    }
  }

  throw new Error('Falha inesperada no fluxo de retry.');
}

app.post('/ask', async (req, res) => {
  const prompt = req.body?.prompt;

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ response: 'O campo prompt é obrigatório, chefe.' });
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res
      .status(400)
      .json({ response: `O prompt deve ter no máximo ${MAX_PROMPT_LENGTH} caracteres, chefe.` });
  }

  const cleanPrompt = prompt.trim();

  if (responseCache.has(cleanPrompt)) {
    return res.json({ response: responseCache.get(cleanPrompt) });
  }

  if (!DEEPSEEK_API_KEY) {
    console.error('[POST /ask] DEEPSEEK_API_KEY não configurada. Retornando fallback.');
    return res.json({ response: FALLBACK_RESPONSE });
  }

  try {
    const answer = await askWithRetry(cleanPrompt);
    responseCache.set(cleanPrompt, answer);

    return res.json({ response: answer });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'erro desconhecido';
    console.error(`[POST /ask] erro final após retries: ${errorMessage}`);

    return res.json({ response: FALLBACK_RESPONSE });
  }
});

app.listen(PORT, () => {
  console.log(`Jarvis server online em http://localhost:${PORT}`);
});
