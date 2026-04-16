import { useState, useCallback, useEffect } from 'react';

export function useJarvisVoice() {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscription, setLastTranscription] = useState("");
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const handleCommand = useCallback((command: string) => {
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
    } else {
      speak("Ainda estou aprendendo a lidar com esse tipo de solicitação, chefe. Mas estou à sua disposição.");
    }
  }, [speak]);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastTranscription(transcript);
      
      if (transcript.toLowerCase().includes("jarvis")) {
        const cleanCmd = transcript.toLowerCase().replace("jarvis", "").trim();
        if (cleanCmd) {
          handleCommand(cleanCmd);
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
