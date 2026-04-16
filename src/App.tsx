import { useState, useEffect } from 'react';
import { Terminal, Shield, Radio, Mic, MicOff, Settings, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArcReactor } from './components/ArcReactor';
import { ModuleGrid } from './components/ModuleGrid';
import { useJarvisVoice } from './hooks/useJarvisVoice';

function App() {
  const [logs, setLogs] = useState<string[]>(["Sistemas inicializados...", "Buscando protocolos de segurança...", "Conectando ao núcleo central..."]);
  const { isListening, toggleListening, lastTranscription, response } = useJarvisVoice();

  useEffect(() => {
    if (lastTranscription) {
      setLogs(prev => [`CHEFE: ${lastTranscription.toUpperCase()}`, ...prev.slice(0, 10)]);
      if (lastTranscription.toLowerCase().includes('confete')) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#ffffff', '#0891b2']
        });
      }
    }
  }, [lastTranscription]);

  useEffect(() => {
    if (response) {
      setLogs(prev => [`JARVIS: ${response.toUpperCase()}`, ...prev.slice(0, 10)]);
    }
  }, [response]);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono overflow-hidden flex flex-col">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-cyan-900/50 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase">JARVIS</h1>
            <p className="text-xs text-cyan-700">PROTOCOLO STARK v.4.2.1</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-green-500/80">CPU: 12%</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-500" />
            <span className="text-cyan-500/80">LATÊNCIA: 14ms</span>
          </div>
          <button className="p-2 hover:bg-cyan-900/20 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 flex gap-8 relative z-10">
        {/* Left Section: Controls and Status */}
        <section className="w-1/3 flex flex-col gap-6">
          <div className="bg-cyan-950/20 border border-cyan-900/50 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> CONSOLE DO SISTEMA
            </h2>
            <div className="h-64 overflow-y-auto space-y-2 scrollbar-hide text-xs">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border-l-2 pl-2 ${log.startsWith('JARVIS') ? 'border-cyan-500' : log.startsWith('CHEFE') ? 'border-yellow-500' : 'border-cyan-900 text-cyan-700'}`}
                  >
                    <span className="text-cyan-800">[{new Date().toLocaleTimeString()}]</span> {log}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-1 bg-cyan-950/20 border border-cyan-900/50 p-6 rounded-lg backdrop-blur-sm flex flex-col items-center justify-center relative group">
            <ArcReactor isActive={isListening} />
            <button 
              onClick={toggleListening}
              className={`mt-8 px-8 py-3 rounded-full border flex items-center gap-3 transition-all duration-300 ${isListening ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-cyan-500/20 border-cyan-500 text-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isListening ? 'DESATIVAR JARVIS' : 'ATIVAR JARVIS'}
            </button>
            <p className="mt-4 text-[10px] text-cyan-700 uppercase tracking-widest text-center">
              Diga "Jarvis" para ativar o comando por voz
            </p>
          </div>
        </section>

        {/* Right Section: Modules */}
        <section className="flex-1 flex flex-col gap-6">
          <ModuleGrid />
        </section>
      </main>

      {/* Footer Info */}
      <footer className="p-4 text-center border-t border-cyan-900/30 bg-black text-[10px] tracking-[0.3em] text-cyan-900">
        © STARK INDUSTRIES | TODOS OS DIREITOS RESERVADOS
      </footer>
    </div>
  );
}

export default App;
