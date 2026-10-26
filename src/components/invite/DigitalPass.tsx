"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, X, Loader2, Crown, Sparkles, Check, Share2, Calendar, Clock, MapPin } from "lucide-react";
import jsPDF from "jspdf";
import type { Event, RSVP } from "@/lib/events";
import { formatTime12Hour } from "@/lib/utils";

interface DigitalPassProps {
  event: Event;
  rsvp?: RSVP | null;
  onClose: () => void;
}

export function DigitalPass({ event, rsvp, onClose }: DigitalPassProps) {
  const passContainerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Format date and time
  const displayDate = event.type === 'fixed' 
    ? (event.fixed_date || '04 NOV 2026') 
    : (rsvp?.selected_date || '04 NOV 2026');

  const displayTime = event.type === 'fixed'
    ? (event.fixed_start_time ? formatTime12Hour(event.fixed_start_time) : '12:00 PM')
    : (rsvp?.selected_start_time ? formatTime12Hour(rsvp.selected_start_time) : '12:00 PM');

  const venueName = event.venue || 'The Local Roastery, Downtown';

  // Download high-resolution PNG of the Birthday Pass
  const downloadImage = async () => {
    try {
      setIsDownloading(true);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "/pass-sample.jpg";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 682;
      canvas.height = img.naturalHeight || 1024;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `birthday-vip-pass-${displayDate.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Failed to download pass image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Download PDF of the Birthday Pass
  const downloadPDF = async () => {
    try {
      setIsDownloading(true);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "/pass-sample.jpg";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const width = img.naturalWidth || 682;
      const height = img.naturalHeight || 1024;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [width, height],
      });

      pdf.addImage(img, "JPEG", 0, 0, width, height);
      pdf.save(`birthday-vip-pass-${displayDate.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (err) {
      console.error("Failed to download PDF", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyPassLink = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-start p-4 bg-[#140206]/85 backdrop-blur-2xl overflow-y-auto"
      style={{ paddingTop: '3vh', paddingBottom: '5vh' }}
    >
      {/* Close Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="fixed top-4 right-4 z-50 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-lg"
      >
        <X className="h-6 w-6" />
      </Button>

      <motion.div
        initial={{ y: 40, scale: 0.94 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
        className="w-full max-w-[420px] flex flex-col items-center my-auto"
      >
        {/* Pass Header Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800020] text-white border border-white/20 shadow-lg text-xs font-semibold tracking-widest uppercase mb-4 font-cinzel">
          <Crown className="w-3.5 h-3.5 text-amber-300" /> Official VIP Birthday Pass
        </div>

        {/* The Exact Vintage Ticket Pass */}
        <div 
          ref={passContainerRef}
          className="relative w-full rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(128,0,32,0.45),0_0_0_1px_rgba(255,255,255,0.15)] bg-[#800020] select-none"
        >
          {/* Authentic Pass Artwork */}
          <div className="relative w-full aspect-[682/1024]">
            <img 
              src="/pass-sample.jpg" 
              alt="Birthday VIP Pass" 
              className="w-full h-full object-cover block"
            />

            {/* Subtle gloss overlay highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
          </div>
        </div>

        {/* Live RSVP Details Pill */}
        <div className="w-full mt-4 p-3.5 rounded-2xl bg-white/95 dark:bg-[#20050d]/95 backdrop-blur-md border border-[#800020]/20 shadow-md text-xs text-foreground/90 flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-semibold border-b border-[#800020]/10 pb-1.5">
            <span className="flex items-center gap-1.5 text-[#800020] dark:text-[#ff9bb0] uppercase tracking-wider font-cinzel">
              <Sparkles className="w-3.5 h-3.5" /> VIP Access Confirmed
            </span>
            <span className="text-muted-foreground font-medium">Status: Active</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3 text-[#800020] dark:text-[#ff9bb0]" /> {displayDate}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3 text-[#800020] dark:text-[#ff9bb0]" /> {displayTime}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground truncate max-w-[120px]">
              <MapPin className="w-3 h-3 text-[#800020] dark:text-[#ff9bb0] shrink-0" /> {venueName}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full mt-4">
          <div className="flex gap-3 w-full">
            <Button 
              onClick={downloadImage} 
              disabled={isDownloading} 
              className="flex-1 rounded-full shadow-xl bg-[#800020] hover:bg-[#660019] text-white py-6 font-bold text-sm border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
              Save Image (PNG)
            </Button>
            <Button 
              onClick={downloadPDF} 
              disabled={isDownloading} 
              className="flex-1 rounded-full shadow-xl bg-[#4d0013] hover:bg-[#38000e] text-white py-6 font-bold text-sm border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Save PDF
            </Button>
          </div>

          <Button 
            variant="ghost" 
            onClick={copyPassLink}
            className="w-full rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 border border-white/10 flex items-center justify-center gap-2 backdrop-blur-md"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                Pass Link Copied to Clipboard!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Copy Shareable Pass Link
              </>
            )}
          </Button>
        </div>

        <p className="text-[11px] text-white/60 tracking-wider text-center mt-3 uppercase font-cinzel">
          ✦ Present this pass upon entry for VIP access ✦
        </p>
      </motion.div>
    </motion.div>
  );
}
