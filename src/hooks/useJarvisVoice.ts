import { useState, useCallback, useEffect, useRef } from 'react';

type AskResponse = {
  response?: string;
};

const NETWORK_FALLBACK_MESSAGE = 'Estou com instabilidade no momento, chefe.';

export function useJarvisVoice() {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscription, setLastTranscription] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1;
    utterance.pitch = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(
      (v) =>
        v.lang.includes('pt-BR') &&
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('google')),
    );

    if (maleVoice) utterance.voice = maleVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setResponse(text);
  }, []);

  const askBackend = useCallback(async (prompt: string) => {
    const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
    const askEndpoint = `${apiUrl}/ask`;

    const res = await fetch(askEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error(`Falha no backend (${res.status})`);
    }

    return (await res.json()) as AskResponse;
  }, []);

  const askAI = useCallback(
    async (prompt: string) => {
      setIsLoading(true);

      try {
        const data = await askBackend(prompt);
        const aiText = data.response?.trim();

        if (!aiText) {
          speak(NETWORK_FALLBACK_MESSAGE);
          return;
        }

        speak(aiText);
      } catch {
        speak(NETWORK_FALLBACK_MESSAGE);
      } finally {
        setIsLoading(false);
      }
    },
    [askBackend, speak],
  );

  const handleCommand = useCallback(
    async (command: string) => {
      const cmd = command.toLowerCase();

      if (cmd.includes('horas')) {
        const now = new Date();
        speak(`Chefe, agora são exatamente ${now.getHours()} horas e ${now.getMinutes()} minutos.`);
      } else if (cmd.includes('agenda') || cmd.includes('calendário')) {
        speak(
          'Chefe, estou acessando seus compromissos. Você tem uma reunião importante hoje às 14 horas com a diretoria.',
        );
      } else if (cmd.includes('whatsapp') || cmd.includes('mensagem')) {
        speak('Pois não, chefe. Para quem deseja enviar a mensagem?');
      } else if (cmd.includes('arquivos') || cmd.includes('sistema')) {
        speak('Acessando diretórios locais, chefe. Todos os sistemas de arquivos estão operando normalmente.');
      } else if (cmd.includes('confete')) {
        speak('Como desejar, chefe. Celebrando o sucesso do sistema!');
      } else if (cmd.includes('quem é você')) {
        speak('Eu sou o Jarvis, seu assistente pessoal inteligente, chefe. Estou aqui para facilitar sua vida.');
      } else if (cmd.includes('obrigado')) {
        speak('Sempre às ordens, chefe.');
      } else if (cmd.includes('pesquise no google') || cmd.includes('buscar no google')) {
        const query = cmd.replace('pesquise no google', '').replace('buscar no google', '').trim();
        if (!query) {
          speak('Claro, chefe. O que deseja pesquisar no Google?');
          return;
        }
        speak(`Pesquisando no Google por: ${query}`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      } else if (cmd.includes('pesquise') || cmd.includes('buscar') || cmd.includes('procure')) {
        const query = cmd
          .replace('pesquise', '')
          .replace('buscar', '')
          .replace('procure', '')
          .replace('na internet', '')
          .trim();
        if (!query) {
          speak('Claro, chefe. O que devo buscar na internet?');
          return;
        }
        speak(`Pesquisando no Google por: ${query}`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      } else if (cmd.includes('ia') || cmd.includes('inteligência artificial') || cmd.startsWith('pergunta')) {
        const prompt = cmd.replace('ia', '').replace('inteligência artificial', '').replace('pergunta', '').trim();
        if (!prompt) {
          speak('Perfeito, chefe. Qual pergunta devo enviar para a IA?');
          return;
        }
        await askAI(prompt);
      } else {
        speak('Ainda estou aprendendo a lidar com esse tipo de solicitação, chefe. Mas estou à sua disposição.');
      }
    },
    [askAI, speak],
  );

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz.');
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

      if (transcript.toLowerCase().includes('jarvis')) {
        const cleanCmd = transcript.toLowerCase().replace('jarvis', '').trim();
        if (cleanCmd) {
          void handleCommand(cleanCmd);
        } else {
          speak('Sim, chefe? Como posso ajudar?');
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

  useEffect(() => {
    const timer = setTimeout(() => {
      speak('Sistemas online, chefe. Jarvis à sua disposição.');
    }, 1500);
    return () => clearTimeout(timer);
  }, [speak]);

  return {
    isListening,
    toggleListening,
    lastTranscription,
    response,
    isSpeaking,
    isLoading,
    speak,
  };
}
