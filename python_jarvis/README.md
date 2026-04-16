# JARVIS - Assistente Pessoal Inteligente

Bem-vindo ao Jarvis, seu assistente pessoal de alto nível.

## 🚀 Funcionalidades
- **Voz**: Reconhecimento e síntese de voz natural (PT-BR).
- **Agenda**: Integração completa com Google Calendar (listar e criar eventos).
- **WhatsApp**: Envio de mensagens automatizado.
- **Controle**: Acesso ao sistema de arquivos e programas.
- **Tone**: Tratamento respeitoso ("Chefe") e inteligente.

## 🛠️ Instalação

1. **Clone o projeto** e navegue até a pasta `python_jarvis`.
2. **Instale as dependências**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Google Calendar API**:
   - Vá ao [Google Cloud Console](https://console.cloud.google.com/).
   - Crie um projeto e ative a Google Calendar API.
   - Baixe o arquivo `credentials.json` e coloque na pasta raiz do projeto.
4. **Microfone**: Certifique-se de que seu microfone está configurado corretamente.

## 💻 Uso

Execute o comando:
```bash
python core/jarvis.py
```

### Comandos Exemplo:
- "Jarvis, que horas são?"
- "Jarvis, verifique minha agenda."
- "Jarvis, abra o navegador."
- "Jarvis, mande uma mensagem no WhatsApp."

## 📂 Estrutura
- `core/`: Motor principal.
- `voice/`: Motores de fala e escuta.
- `commands/`: Lógica de interpretação de comandos.
- `integrations/`: Conectores externos (Google, WhatsApp).
