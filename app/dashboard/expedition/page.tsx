'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LaserFlow from '@/components/LaserFlow'; 

export default function ExpeditionPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-[#050505] min-h-screen" />;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-white">
      
      {/* --- BACKGROUND LAYER: RESPONSIVE DOCKING --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LaserFlow 
          color="#ab69ce"           // High-intensity Violet
          horizontalBeamOffset={0.0} 
          // Dynamic offset: shifts based on mobile vs desktop card height
          verticalBeamOffset={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.42 : 0.35}   
          wispDensity={3.0}
          wispSpeed={8.0}
          wispIntensity={14.0}       
          fogIntensity={0.9}
          horizontalSizing={1.6}
          verticalSizing={10.0}      
          decay={0.6}                
          falloffStart={4.0}
        />
      </div>

      {/* --- CONTENT LAYER: MOBILE-FIRST DOCK --- */}
      <div className="relative z-10 flex flex-col items-center justify-end min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 90 }}
          // Taller min-height on mobile (85vh) to fit full itinerary without overlap
          className="w-full max-w-[95%] lg:max-w-[1400px] min-h-[85vh] lg:min-h-[620px] bg-white/5 backdrop-blur-[120px] rounded-t-[40px] border-t border-x border-white/10 shadow-[0_-50px_100px_-20px_rgba(171,105,206,0.4)] relative overflow-hidden p-8 lg:p-16"
        >
          {/* Flush Edge Glow Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[4px] bg-gradient-to-r from-transparent via-[#ab69ce] to-transparent blur-xl opacity-100" />
          
          {/* HEADING: Adjusted sizing for mobile */}
          <div className="flex flex-col items-center lg:items-end mb-12 lg:mb-16 text-center lg:text-right">
            <h1 className="text-4xl lg:text-7xl font-medium tracking-tight text-white leading-tight">
              Industrial <span className="text-[#ab69ce] font-semibold">Visit</span>
            </h1>
            <p className="text-[10px] lg:text-[11px] font-medium tracking-[0.6em] lg:tracking-[0.8em] text-zinc-500 mt-3 uppercase">
              MARCH 2026
            </p>
          </div>

          {/* GRID: Stacks on mobile, splits on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pt-8 lg:pt-12 border-t border-white/5">
            {/* PHASE 01: MONDAY */}
            <div className="space-y-4">
              <h3 className="text-zinc-600 font-bold text-[10px] tracking-[0.4em] uppercase border-l border-white/10 pl-4 mb-6">
                23.03 // PHASE_01
              </h3>
              <div className="space-y-3 font-medium uppercase text-[11px] lg:text-[12px] tracking-widest text-zinc-300 pl-4">
                <p className="flex flex-col lg:flex-row lg:justify-between"><span className="opacity-40">04:50 AM —</span> KNR DEPARTURE BY JANASHATHABTHI(12081)</p>
                <p className="flex flex-col lg:flex-row lg:justify-between"><span className="opacity-40">11:00 AM —</span> TECHMAGHI VISIT</p>
                <p className="flex flex-col lg:flex-row lg:justify-between"><span className="opacity-40">04:00 PM —</span> JEEP TREKKING</p>
                <p className="flex flex-col lg:flex-row lg:justify-between text-[#ab69ce]"><span className="opacity-60">CHECK-IN —</span> TRANQUIL GREENS RESORT- Stay, Party, end Enjoyment!</p>
              </div>
            </div>

            {/* PHASE 02: TUESDAY */}
            <div className="space-y-4">
              <h3 className="text-[#ab69ce] font-bold text-[10px] tracking-[0.4em] uppercase border-l border-[#ab69ce]/30 pl-4 mb-6">
                24.03 // PHASE_02
              </h3>
              <div className="space-y-3 font-medium uppercase text-[11px] lg:text-[12px] tracking-widest text-zinc-300 pl-4">
                <p className="flex flex-col lg:flex-row lg:justify-between"><span className="opacity-40">07:00 AM —</span> MUNNAR TRANSIT</p>
                <p className="flex flex-col lg:flex-row lg:justify-between"><span className="opacity-40">10:30 AM —</span> ROSE GARDEN</p>
                <p className="flex flex-col lg:flex-row lg:justify-between"><span className="opacity-40">11:30 AM —</span> MATTUPETTY DAM Or Any other places possible!</p>
                <p className="flex flex-col lg:flex-row lg:justify-between text-[#ab69ce] font-semibold"><span className="opacity-60">11:30 PM —</span>  RETURN MAVELI EXP (16604)</p>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
        </motion.div>
      </div>
    </div>
  );
}