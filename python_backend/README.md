# JARVIS - Guia de Instalação e Uso

Este guia explica como configurar o seu assistente Jarvis em Python.

## Pré-requisitos
- Python 3.8 ou superior instalado.
- Microfone e alto-falantes funcionais.
- Conexão com a internet (para reconhecimento de voz via Google).

## Instalação

1.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Configuração de APIs (Opcional):**
    - Para o Google Agenda, você precisará de um arquivo `credentials.json` do Google Cloud Console.
    - O WhatsApp utiliza Selenium, então certifique-se de ter o Chrome instalado.

## Como usar

1.  **Execute o Jarvis:**
    ```bash
    python core/jarvis.py
    ```

2.  **Palavra de Ativação:**
    - Diga "Jarvis" seguido do seu comando.
    - Exemplo: "Jarvis, que horas são?" ou "Jarvis, bom dia".

## Funcionalidades Implementadas
- **Reconhecimento de Voz:** Utiliza a biblioteca `SpeechRecognition`.
- **Síntese de Voz:** Utiliza `pyttsx3` com suporte a PT-BR.
- **Comandos:** Interpretador de comandos extensível em `commands/handler.py`.
- **Interface Web:** Uma interface futurista foi desenvolvida em React para acompanhamento visual.

---
*Desenvolvido por Jarvis OS Team.*
