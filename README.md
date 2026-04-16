# Jarvis (Web + Voz)

Este projeto contém a interface web do Jarvis com:

- Reconhecimento de voz (Web Speech API).
- Síntese de voz (SpeechSynthesis).
- Busca web automática (DuckDuckGo + fallback Google).
- Consulta de IA via API da OpenAI (opcional, via `.env`).

## Passo a passo para rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure variáveis de ambiente (opcional para IA):
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` e informe `VITE_OPENAI_API_KEY`.
3. Inicie o projeto:
   ```bash
   npm run dev
   ```
4. Abra a URL do Vite no navegador (geralmente `http://localhost:5173`).
5. Clique em **ATIVAR JARVIS** e permita uso do microfone.

## Comandos de voz úteis

- `Jarvis, que horas são`
- `Jarvis, pesquise no google por notícias de tecnologia`
- `Jarvis, pesquise inteligência artificial na internet`
- `Jarvis, pergunta qual a diferença entre API REST e GraphQL`

## Observações

- A resposta por IA só funciona se `VITE_OPENAI_API_KEY` estiver configurada.
- Se a busca instantânea não retornar resumo, o Jarvis abre o Google automaticamente.
