import { motion } from 'framer-motion';

export function ArcReactor({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-4 border-dashed border-cyan-500/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 border-2 border-cyan-500/30 rounded-full"
      />

      {/* Main Reactor Body */}
      <div className={`relative w-40 h-40 rounded-full border-8 border-cyan-900/50 flex items-center justify-center bg-black transition-all duration-500 ${isActive ? 'shadow-[0_0_100px_rgba(6,182,212,0.4)]' : 'shadow-none'}`}>
        {/* Pulsing Core */}
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className={`w-24 h-24 rounded-full border-4 border-cyan-400 flex items-center justify-center bg-cyan-900/10 ${isActive ? 'opacity-100' : 'opacity-20'}`}
        >
          <div className="w-16 h-16 rounded-full border-2 border-cyan-200 bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.8)]" />
        </motion.div>

        {/* Decorative elements */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-1 bg-cyan-500/20"
            style={{ transform: `rotate(${i * 45}deg)` }}
          >
            <div className="w-4 h-full bg-cyan-400 ml-auto" />
          </div>
        ))}
      </div>
      
      {/* Scanning Line Effect */}
      {isActive && (
        <motion.div
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-0.5 bg-cyan-500/50 shadow-[0_0_10px_cyan] z-20 pointer-events-none"
        />
      )}
    </div>
  );
}
