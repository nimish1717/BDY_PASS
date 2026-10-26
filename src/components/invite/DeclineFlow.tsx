"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { HeartHandshake, Sparkles, Frown } from "lucide-react";

export function DeclineFlow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [declineClicks, setDeclineClicks] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setDeclineClicks(0);
    }
  }, [isOpen]);

  const handleDecline = () => {
    if (declineClicks === 0) {
      setDeclineClicks(1);
    } else if (declineClicks === 1) {
      // Show angry screen instead of closing or going to home!
      setDeclineClicks(2);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140206]/80 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card max-w-md w-full p-8 md:p-9 rounded-[2.5rem] text-center shadow-2xl relative border border-[#800020]/25 bg-white/95 dark:bg-[#1a0309]/95"
          >
            {declineClicks < 2 ? (
              // Emotional guilt-trip screens (Step 0 & Step 1)
              <div>
                <motion.div 
                  animate={{ rotate: [-6, 6, -6] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="text-7xl mb-5 select-none"
                >
                  {declineClicks === 0 ? "🥺" : "😭"}
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold font-serif mb-3 text-[#800020] dark:text-[#ff9bb0]">
                  {declineClicks === 0 ? "Are you absolutely sure?" : "REALLY?! You can't?!"}
                </h2>

                <p className="text-muted-foreground mb-8 text-base leading-relaxed">
                  {declineClicks === 0 
                    ? "The birthday girl will be super sad without you! 😔💔" 
                    : "Are you REALLY sure? The birthday girl won't let you miss this chaos! 😭✨"}
                </p>
                
                <div className="flex flex-col gap-3">
                  <Button 
                    size="lg"
                    onClick={onClose}
                    className="rounded-full bg-[#800020] hover:bg-[#660019] text-white font-bold text-base py-6 shadow-xl hover:shadow-[#800020]/40 transition-all border-none flex items-center justify-center gap-2"
                  >
                    <HeartHandshake className="h-5 w-5" />
                    Okay, I'll Celebrate! 💖
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleDecline}
                    className="rounded-full text-muted-foreground hover:bg-[#800020]/10 hover:text-[#800020]"
                  >
                    {declineClicks === 0 ? "Still Can't Make It 😅" : "I really can't! 🏃‍♂️💨"}
                  </Button>
                </div>
              </div>
            ) : (
              // ANGRY FINAL SCREEN (Does NOT take to home, shows angry message and BYEEE!)
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="flex flex-col items-center"
              >
                <motion.div 
                  animate={{ 
                    rotate: [-12, 12, -12, 12, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
                  className="text-7xl mb-4 select-none drop-shadow-md"
                >
                  😡
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold font-serif mb-2 text-[#800020] dark:text-[#ff6b81] tracking-tight">
                  WOW. UNBELIEVABLE! 😤💔
                </h2>

                <p className="text-[#800020]/90 dark:text-[#ff9bb0] font-medium text-base mb-3 leading-snug">
                  You actually clicked it?! The birthday girl is officially heartbroken and offended! 😾
                </p>

                <div className="p-4 rounded-2xl bg-[#800020]/10 dark:bg-[#800020]/30 border border-[#800020]/20 text-xs text-foreground/80 mb-6 leading-relaxed">
                  <p className="font-semibold text-[#800020] dark:text-[#ff9bb0] mb-1">
                    🚫 Your Penalties:
                  </p>
                  <p>• Zero birthday cake for you! 🎂</p>
                  <p>• Removed from the VIP priority list! 📝❌</p>
                  <p>• Maximum FOMO while we party! 🥂✨</p>
                </div>

                {/* Big Angry BYEEE */}
                <motion.div 
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-4xl md:text-5xl font-black text-[#800020] dark:text-[#ff5277] mb-6 font-serif tracking-widest drop-shadow-sm select-none"
                >
                  BYEEE! 🚪👋🙄
                </motion.div>

                {/* Reconsider redemption button */}
                <div className="w-full flex flex-col gap-2.5">
                  <Button 
                    size="lg"
                    onClick={onClose}
                    className="w-full rounded-full bg-[#800020] hover:bg-[#660019] text-white font-bold text-base py-6 shadow-xl hover:shadow-[#800020]/40 transition-all border-none flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    Wait! I changed my mind! 🥺💖
                  </Button>

                  <p className="text-[11px] text-muted-foreground mt-1">
                    (You can still save this friendship by clicking above)
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
