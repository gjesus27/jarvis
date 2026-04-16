import { useState, useCallback, useEffect, useRef } from 'react';

type OpenAIResponse = {
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
};

export function useJarvisVoice() {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscription, setLastTranscription] = useState("");
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1;
    utterance.pitch = 0.9; // Lower pitch for Jarvis
    
    // Try to find a natural male voice
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => v.lang.includes('pt-BR') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('google')));
    if (maleVoice) utterance.voice = maleVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setResponse(text);
  }, []);

  const searchWeb = useCallback(async (query: string) => {
    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(ddgUrl);

      if (!res.ok) {
        throw new Error(`Falha na busca web (${res.status})`);
      }

      const data = await res.json();
      const abstract = data?.AbstractText as string | undefined;
      const related = data?.RelatedTopics?.[0]?.Text as string | undefined;

      if (abstract) {
        speak(`Encontrei isto na web: ${abstract}`);
        return;
      }

      if (related) {
        speak(`Aqui está o resultado mais relevante: ${related}`);
        return;
      }

      speak("Não encontrei um resumo direto, chefe. Vou abrir o Google com sua pesquisa.");
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    } catch {
      speak("A busca online falhou no momento, chefe. Vou abrir o Google para você.");
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    }
  }, [speak]);

  const askAI = useCallback(async (prompt: string) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
    const model = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) ?? "gpt-4.1-mini";

    if (!apiKey) {
      speak("Chefe, a IA não está configurada. Defina VITE_OPENAI_API_KEY no arquivo .env para ativar respostas inteligentes.");
      return;
    }

    try {
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          input: `Responda em português de forma curta e objetiva, chamando o usuário de chefe quando apropriado. Pergunta: ${prompt}`,
        }),
      });

      if (!res.ok) {
        throw new Error(`Falha na IA (${res.status})`);
      }

      const data = (await res.json()) as OpenAIResponse;
      const aiText = data.output?.[0]?.content?.[0]?.text;

      if (!aiText) {
        speak("Recebi resposta vazia da IA, chefe.");
        return;
      }

      speak(aiText.trim());
    } catch {
      speak("Não consegui consultar a IA agora, chefe. Tente novamente em instantes.");
    }
  }, [speak]);

  const handleCommand = useCallback(async (command: string) => {
    const cmd = command.toLowerCase();
    
    if (cmd.includes("horas")) {
      const now = new Date();
      speak(`Chefe, agora são exatamente ${now.getHours()} horas e ${now.getMinutes()} minutos.`);
    } else if (cmd.includes("agenda") || cmd.includes("calendário")) {
      speak("Chefe, estou acessando seus compromissos. Você tem uma reunião importante hoje às 14 horas com a diretoria.");
    } else if (cmd.includes("whatsapp") || cmd.includes("mensagem")) {
      speak("Pois não, chefe. Para quem deseja enviar a mensagem?");
    } else if (cmd.includes("arquivos") || cmd.includes("sistema")) {
      speak("Acessando diretórios locais, chefe. Todos os sistemas de arquivos estão operando normalmente.");
    } else if (cmd.includes("confete")) {
      speak("Como desejar, chefe. Celebrando o sucesso do sistema!");
      // This will trigger an effect in App if we want, or we can just say it.
    } else if (cmd.includes("quem é você")) {
      speak("Eu sou o Jarvis, seu assistente pessoal inteligente, chefe. Estou aqui para facilitar sua vida.");
    } else if (cmd.includes("obrigado")) {
      speak("Sempre às ordens, chefe.");
    } else if (cmd.includes("pesquise no google") || cmd.includes("buscar no google")) {
      const query = cmd
        .replace("pesquise no google", "")
        .replace("buscar no google", "")
        .trim();
      if (!query) {
        speak("Claro, chefe. O que deseja pesquisar no Google?");
        return;
      }
      speak(`Pesquisando no Google por: ${query}`);
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    } else if (cmd.includes("pesquise") || cmd.includes("buscar") || cmd.includes("procure")) {
      const query = cmd
        .replace("pesquise", "")
        .replace("buscar", "")
        .replace("procure", "")
        .replace("na internet", "")
        .trim();
      if (!query) {
        speak("Claro, chefe. O que devo buscar na internet?");
        return;
      }
      await searchWeb(query);
    } else if (cmd.includes("ia") || cmd.includes("inteligência artificial") || cmd.startsWith("pergunta")) {
      const prompt = cmd
        .replace("ia", "")
        .replace("inteligência artificial", "")
        .replace("pergunta", "")
        .trim();
      if (!prompt) {
        speak("Perfeito, chefe. Qual pergunta devo enviar para a IA?");
        return;
      }
      await askAI(prompt);
    } else {
      speak("Ainda estou aprendendo a lidar com esse tipo de solicitação, chefe. Mas estou à sua disposição.");
    }
  }, [askAI, searchWeb, speak]);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastTranscription(transcript);
      
      if (transcript.toLowerCase().includes("jarvis")) {
        const cleanCmd = transcript.toLowerCase().replace("jarvis", "").trim();
        if (cleanCmd) {
          void handleCommand(cleanCmd);
        } else {
          speak("Sim, chefe? Como posso ajudar?");
        }
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [isListening, handleCommand, speak]);

  // Initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Sistemas online, chefe. Jarvis à sua disposição.");
    }, 1500);
    return () => clearTimeout(timer);
  }, []); // Only on mount

  return {
    isListening,
    toggleListening,
    lastTranscription,
    response,
    isSpeaking,
    speak
  };
}
