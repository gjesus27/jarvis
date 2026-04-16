import { motion } from 'framer-motion';

interface JarvisCoreProps {
  isListening: boolean;
  isSpeaking: boolean;
  onActivate: () => void;
}

export const JarvisCore: React.FC<JarvisCoreProps> = ({ isListening, isSpeaking, onActivate }) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-black bg-opacity-40 rounded-3xl border border-blue-500/20 backdrop-blur-md shadow-2xl shadow-blue-500/10">
      {/* Outer spinning ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-64 h-64 rounded-full border-4 border-dashed border-blue-400 opacity-20"
      />

      {/* Pulsing inner rings */}
      <motion.div
        animate={{ 
          scale: isSpeaking ? [1, 1.1, 1] : 1,
          opacity: isSpeaking ? [0.4, 0.7, 0.4] : 0.4 
        }}
        transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
        className="absolute w-48 h-48 rounded-full border-2 border-blue-300"
      />

      <motion.div
        animate={{ 
          scale: isListening ? [1, 1.05, 1] : 1,
          boxShadow: isListening 
            ? ["0 0 20px rgba(59, 130, 246, 0.5)", "0 0 40px rgba(59, 130, 246, 0.8)", "0 0 20px rgba(59, 130, 246, 0.5)"]
            : "0 0 20px rgba(59, 130, 246, 0.3)"
        }}
        transition={{ duration: 1, repeat: Infinity }}
        onClick={onActivate}
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center cursor-pointer group overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_30%,rgba(0,0,0,0.4)_70%)]" />
        <div className="z-10 text-white font-bold tracking-widest text-xl drop-shadow-md">
          {isSpeaking ? "JARVIS" : isListening ? "LISTENING" : "IDLE"}
        </div>
      </motion.div>

      {/* Voice bars simulation */}
      <div className="mt-8 flex gap-1 h-8 items-center">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isSpeaking || isListening ? [8, Math.random() * 24 + 8, 8] : 8 
            }}
            transition={{ duration: 0.2, repeat: Infinity, delay: i * 0.05 }}
            className="w-1 bg-blue-400 rounded-full"
          />
        ))}
      </div>
      
      <p className="mt-4 text-blue-300/60 text-xs font-mono tracking-tighter uppercase">
        Sistema Online | Protocolo Mark VII
      </p>
    </div>
  );
};
