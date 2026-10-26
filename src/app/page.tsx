"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FloatingBackground } from "@/components/ui/floating-background";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Ticket, Crown } from "lucide-react";

const quotes = [
  "Ready to celebrate the most special birthday ever? 🎂✨",
  "Good food, great people, better memories! 🥂💖",
  "Because one birthday party is never enough! 👯‍♀️👑",
  "You're officially VIP on the birthday guest list! 🎟️✨",
  "Same girl, bigger chaos! Let's celebrate! 🎉💕",
  "Can't wait to make unforgettable memories with you! 🌸🧁",
  "A birthday celebration you won't want to miss! 🥂✨",
  "Life is better with you celebrating by my side! 💖🎈",
  "Good times + Birthday vibes = Best day ever! 🧁✨",
  "Dress code: Comfortable & Cute (as always)! 👗♡"
];

function LandingContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "VIP Guest";
  const [quote, setQuote] = useState("");
  const router = useRouter();

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <FloatingBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="relative z-10 glass-card p-8 md:p-14 rounded-[2.5rem] flex flex-col items-center text-center max-w-lg w-full mx-auto border border-[#800020]/20 shadow-[0_12px_40px_rgba(128,0,32,0.15)]"
      >
        <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-[#800020]/10 text-[#800020] dark:bg-[#800020]/30 dark:text-[#f8d7dc] text-xs font-semibold tracking-wider uppercase font-cinzel">
          <Crown className="w-3.5 h-3.5" /> Special Birthday Edition
        </div>

        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="text-7xl mb-4 drop-shadow-xl select-none"
        >
          🎟️
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#800020] dark:text-[#ff9bb0] mb-3 drop-shadow-sm tracking-tight">
          Hey {name}!
        </h1>
        
        <p className="text-xs uppercase tracking-widest text-[#800020]/70 dark:text-[#ff9bb0]/70 font-semibold mb-4">
          You are cordially invited
        </p>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-base md:text-lg text-foreground/80 mb-8 font-medium px-4 italic leading-relaxed"
        >
          "{quote}"
        </motion.p>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button 
            size="lg" 
            onClick={() => router.push('/invite/example-event-id')}
            className="rounded-full bg-[#800020] hover:bg-[#660019] text-white font-bold text-base md:text-lg px-8 py-6 shadow-xl hover:shadow-[#800020]/40 transition-all border-none flex items-center gap-2"
          >
            <Ticket className="h-5 w-5" />
            See your Birthday Pass
            <ArrowRight className="h-5 w-5 ml-1" />
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#800020] font-serif text-xl">Loading Birthday Invite...</div>}>
      <LandingContent />
    </Suspense>
  );
}
