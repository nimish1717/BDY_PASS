"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { HeartHandshake } from "lucide-react";

export function DeclineFlow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [declineClicks, setDeclineClicks] = useState(0);

  const handleDecline = () => {
    if (declineClicks === 0) {
      setDeclineClicks(1);
    } else {
      // Force confirm on 2nd attempt inside the modal
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card max-w-md w-full p-8 rounded-3xl text-center shadow-2xl relative border border-[#800020]/20"
          >
            <motion.div 
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="text-7xl mb-5 select-none"
            >
              🥺
            </motion.div>
            <h2 className="text-2xl font-bold font-serif mb-3 text-[#800020] dark:text-[#ff9bb0]">
              Are you absolutely sure?
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
                className="rounded-full bg-[#800020] hover:bg-[#660019] text-white font-bold text-base py-6 shadow-xl hover:shadow-[#800020]/40 transition-all border-none"
              >
                <HeartHandshake className="mr-2 h-5 w-5" />
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
