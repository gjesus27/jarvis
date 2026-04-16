import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT ?? 8787);
const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/ask', async (req, res) => {
  const prompt = req.body?.prompt;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt é obrigatório' });
  }

  if (!deepseekApiKey) {
    return res.status(500).json({ error: 'DEEPSEEK_API_KEY não configurada no servidor' });
  }

  try {
    const aiRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              'Você é o Jarvis. Responda em português do Brasil de forma curta, útil e objetiva. Chame o usuário de chefe quando apropriado.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      return res.status(502).json({
        error: 'Falha ao consultar a DeepSeek',
        details: errorText,
      });
    }

    const data = await aiRes.json();
    const response = data?.choices?.[0]?.message?.content?.trim();

    if (!response) {
      return res.status(502).json({ error: 'Resposta vazia da DeepSeek' });
    }

    return res.json({ response });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro inesperado no servidor',
      details: error instanceof Error ? error.message : 'erro desconhecido',
    });
  }
});

app.listen(port, () => {
  console.log(`Jarvis server online em http://localhost:${port}`);
});
