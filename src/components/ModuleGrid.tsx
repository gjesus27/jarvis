import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Files, Clock, Bell, Cpu } from 'lucide-react';

const modules = [
  { id: 'cal', title: 'AGENDA', icon: Calendar, status: '12 Eventos', color: 'text-blue-500', detail: 'Próximo: Reunião às 14h' },
  { id: 'msg', title: 'WHATSAPP', icon: MessageSquare, status: '4 Pendentes', color: 'text-green-500', detail: 'De: Stark Industries' },
  { id: 'file', title: 'SISTEMA', icon: Files, status: '98% Espaço', color: 'text-yellow-500', detail: 'Backup: Concluído' },
  { id: 'cpu', title: 'NÚCLEO', icon: Cpu, status: 'Estável', color: 'text-purple-500', detail: 'Temp: 42°C' },
  { id: 'rem', title: 'LEMBRETES', icon: Clock, status: 'Ativo', color: 'text-red-400', detail: 'Medicamento: 15h' },
  { id: 'not', title: 'ALERTAS', icon: Bell, status: 'Normal', color: 'text-orange-500', detail: 'Sem ameaças detectadas' },
];

export function ModuleGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {modules.map((mod, i) => (
        <motion.div
          key={mod.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(6,182,212,0.1)' }}
          className="bg-cyan-950/10 border border-cyan-900/40 p-5 rounded-lg flex flex-col justify-between cursor-pointer group relative overflow-hidden"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 w-1 h-8 bg-cyan-500 rounded-full mt-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-black/40 border border-cyan-900/50 ${mod.color}`}>
              <mod.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-cyan-800 font-bold tracking-tighter uppercase">{mod.id}-SECURE-LINK</span>
          </div>

          <div>
            <h3 className="text-xs font-bold text-cyan-500/80 mb-1">{mod.title}</h3>
            <p className="text-lg font-bold text-white mb-2">{mod.status}</p>
            <p className="text-[10px] text-cyan-700 italic border-t border-cyan-900/20 pt-2">{mod.detail}</p>
          </div>

          {/* Background pattern */}
          <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <mod.icon className="w-16 h-16" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
