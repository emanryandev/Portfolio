import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type AmbientIntensity = 'high' | 'medium' | 'low' | 'none';

export interface AmbientCodeBackgroundProps {
  intensity?: AmbientIntensity;
  parallax?: boolean; // Kept for API compatibility, but mouse tracking is intentionally removed
  snippets?: string[]; // Kept for compatibility, but no longer rendered.
}

export const AmbientCodeBackground: React.FC<AmbientCodeBackgroundProps> = ({
  intensity = 'medium',
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (intensity === 'none') return null;

  const getAuroraOpacity = () => {
    switch (intensity) {
      case 'high': return 0.6;
      case 'medium': return 0.45;
      case 'low': return 0.2;
      default: return 0.45;
    }
  };

  const getLinesOpacity = () => {
    switch (intensity) {
      case 'high': return 0.5;
      case 'medium': return 0.3;
      case 'low': return 0;
      default: return 0.3;
    }
  };

  const auroraOpacity = getAuroraOpacity();
  const linesOpacity = getLinesOpacity();

  return (
    <div 
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Soft Aurora Glows (Time-based breathing, NO mouse tracking) */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 mix-blend-screen" 
        style={{ opacity: auroraOpacity }}
      >
        {/* Glow 1 (Primary / Blue) */}
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 65%)',
            filter: 'blur(100px)',
          }}
          animate={!prefersReducedMotion ? {
            scale: [1, 1.1, 0.95, 1],
            x: ['0%', '2%', '-2%', '0%'],
            y: ['0%', '3%', '-1%', '0%'],
            opacity: [0.5, 0.8, 0.5],
          } : undefined}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Glow 2 (Accent / Light Indigo) */}
        <motion.div
          className="absolute top-[30%] -right-[15%] w-[70%] h-[70%] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 65%)',
            filter: 'blur(120px)',
          }}
          animate={!prefersReducedMotion ? {
            scale: [1, 1.15, 0.9, 1],
            x: ['0%', '-3%', '2%', '0%'],
            y: ['0%', '-2%', '4%', '0%'],
            opacity: [0.4, 0.7, 0.4],
          } : undefined}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Glow 3 (Center subtle base) */}
        <motion.div
          className="absolute top-[20%] left-[15%] w-[60%] h-[60%] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 60%)',
            filter: 'blur(90px)',
          }}
          animate={!prefersReducedMotion ? {
            scale: [1, 1.05, 0.98, 1],
            opacity: [0.3, 0.5, 0.3],
          } : undefined}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </div>

      {/* 2. Flowing Data Lines */}
      {linesOpacity > 0 && !prefersReducedMotion && (
        <div className="absolute inset-0" style={{ opacity: linesOpacity }}>
          
          {/* Line 1: Horizontal crossing Hero slightly above center */}
          <div className="absolute top-[35%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent">
            <motion.div
              className="absolute top-[-1px] h-[3px] w-[60px] bg-primary/60 rounded-full shadow-[0_0_15px_rgba(var(--primary),1)]"
              style={{ filter: 'blur(1px)' }}
              initial={{ left: '-10%', opacity: 0 }}
              animate={{ left: '110%', opacity: [0, 1, 1, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 1 }}
            />
          </div>

          {/* Line 2: Horizontal crossing bottom of screen */}
          <div className="absolute top-[80%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/5 to-transparent hidden md:block">
            <motion.div
              className="absolute top-[-1px] h-[3px] w-[100px] bg-primary/40 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.8)]"
              style={{ filter: 'blur(1.5px)' }}
              initial={{ right: '-10%', opacity: 0 }}
              animate={{ right: '110%', opacity: [0, 1, 1, 0] }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear", delay: 7 }}
            />
          </div>

          {/* Line 3: Vertical left accent */}
          <div className="absolute left-[20%] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent hidden lg:block">
            <motion.div
              className="absolute left-[-1px] w-[3px] h-[80px] bg-primary/50 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.9)]"
              style={{ filter: 'blur(1px)' }}
              initial={{ top: '-10%', opacity: 0 }}
              animate={{ top: '110%', opacity: [0, 1, 1, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 4 }}
            />
          </div>

        </div>
      )}
    </div>
  );
};
