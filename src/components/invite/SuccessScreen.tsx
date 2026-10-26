"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Ticket, Sparkles, Crown } from "lucide-react";
import { FloatingBackground } from "@/components/ui/floating-background";
import type { Event } from "@/lib/events";

interface SuccessScreenProps {
  event: Event;
  guestName: string;
  onGetPass: () => void;
}

export function SuccessScreen({ event, guestName, onGetPass }: SuccessScreenProps) {
  useEffect(() => {
    const duration = 3500;
    const animationEnd = Date.now() + duration;
    // Burgundy (#800020), Rose Gold, Vintage Gold, and Cream confetti colors
    const colors = ['#800020', '#A82442', '#D4AF37', '#F7C6D0', '#FCF9F5'];
    const defaults = { startVelocity: 32, spread: 360, ticks: 70, zIndex: 10, colors };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 55 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.35), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.65, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card max-w-md w-full p-8 md:p-10 rounded-[2.5rem] text-center shadow-[0_16px_50px_rgba(128,0,32,0.18)] relative z-10 mx-auto mt-12 border border-[#800020]/20"
    >
      <FloatingBackground />
      
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#800020]/10 text-[#800020] dark:bg-[#800020]/30 dark:text-[#ff9bb0] text-xs font-semibold uppercase tracking-wider mb-4">
        <Crown className="w-3.5 h-3.5" /> RSVP Confirmed
      </div>

      <div className="text-6xl mb-4 select-none animate-bounce">🎉</div>
      <h2 className="text-3xl font-bold font-serif mb-3 text-[#800020] dark:text-[#ff9bb0]">
        Yay {guestName || 'VIP Guest'}!
      </h2>
      <p className="text-lg mb-6 text-foreground/80 font-medium leading-snug">
        You're officially on the Birthday VIP List! Can't wait to celebrate! 💕✨
      </p>
      
      <div className="bg-[#800020]/5 dark:bg-[#800020]/20 p-5 rounded-3xl mb-8 text-left border border-[#800020]/15 shadow-inner">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-[#800020] dark:text-[#ff9bb0] font-serif">
          <span>{event.cover_emoji || '👑'}</span> {event.title}
        </h3>
        {event.venue && (
          <p className="text-sm text-foreground/80 mb-2 flex items-center gap-2">
            <span>📍</span> {event.venue}
          </p>
        )}
        <p className="text-sm text-foreground/80 flex items-center gap-2">
          <span>📅</span> {event.type === 'fixed' ? event.fixed_date : 'Selected Birthday Date'}
        </p>
        <p className="text-xs text-[#800020]/80 dark:text-[#ff9bb0]/80 font-semibold mt-2 pt-2 border-t border-[#800020]/10 flex items-center gap-1.5">
          <span>👗</span> Dress Code: Comfortable & Cute (as always) ♡
        </p>
      </div>

      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button 
          size="lg"
          onClick={onGetPass}
          className="w-full rounded-full bg-[#800020] hover:bg-[#660019] text-white font-bold text-base md:text-lg py-6 shadow-xl hover:shadow-[#800020]/40 transition-all flex items-center justify-center gap-2 border-none"
        >
          <Ticket className="h-5 w-5" />
          Get My Birthday Pass ✨
        </Button>
      </motion.div>
    </motion.div>
  );
}
