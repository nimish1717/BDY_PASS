"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, X, Loader2, Crown, Sparkles, Check, Share2, Calendar, Clock, MapPin, Coffee } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
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
  const searchParams = useSearchParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [passUrl, setPassUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPassUrl(window.location.href);
    }
  }, []);

  // Allow custom pass image URL via query param ?passUrl=... or event.pass_image_url
  const customPassUrl = searchParams.get("passUrl");
  const passImageSrc = customPassUrl || event.pass_image_url || "/pass-sample.jpg";

  // Dynamic Event Details
  const rawDate = event.type === 'fixed' 
    ? (event.fixed_date || '2026-11-04') 
    : (rsvp?.selected_date || event.fixed_date || '2026-11-04');

  const rawTime = event.type === 'fixed'
    ? (event.fixed_start_time || '12:00')
    : (rsvp?.selected_start_time || event.fixed_start_time || '12:00');

  const displayTime = formatTime12Hour(rawTime);
  const venueLocation = event.venue || 'The Local Roastery, Downtown';
  const eventTitle = event.title || 'Coffee & Catchup!';

  // Format dates for pass stubs
  const formatDates = (dateStr: string) => {
    try {
      const parsed = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
      if (!isNaN(parsed.getTime())) {
        const day = String(parsed.getDate()).padStart(2, '0');
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = monthNames[parsed.getMonth()];
        const year = String(parsed.getFullYear());
        const isoMonth = String(parsed.getMonth() + 1).padStart(2, '0');
        return {
          isoDate: `${year}-${isoMonth}-${day}`,
          dayMonth: `${day} ${month}`,
          year: year,
          fullDate: `${day} ${month} ${year}`
        };
      }
    } catch (e) {}
    return {
      isoDate: dateStr,
      dayMonth: "04 NOV",
      year: "2026",
      fullDate: "04 NOV 2026"
    };
  };

  const formattedDate = formatDates(rawDate);

  // Download high-resolution PNG with all dynamic details captured
  const downloadImage = async () => {
    if (!passContainerRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(passContainerRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `birthday-vip-pass-${formattedDate.isoDate}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download pass image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Download high-resolution PDF ticket
  const downloadPDF = async () => {
    if (!passContainerRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(passContainerRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`birthday-vip-pass-${formattedDate.isoDate}.pdf`);
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-start p-3 md:p-6 bg-[#140206]/85 backdrop-blur-2xl overflow-y-auto"
      style={{ paddingTop: '2.5vh', paddingBottom: '5vh' }}
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
        initial={{ y: 35, scale: 0.94 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
        className="w-full max-w-[430px] flex flex-col items-center my-auto"
      >
        {/* Pass Header Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800020] text-white border border-white/25 shadow-lg text-xs font-semibold tracking-widest uppercase mb-3 font-cinzel">
          <Crown className="w-3.5 h-3.5 text-amber-300" /> Official VIP Birthday Pass
        </div>

        {/* The Exact Vintage Ticket Pass Container */}
        <div 
          ref={passContainerRef}
          className="relative w-full rounded-[24px] overflow-hidden shadow-[0_22px_65px_rgba(128,0,32,0.45),0_0_0_1px_rgba(255,255,255,0.18)] bg-[#800020] select-none"
        >
          {/* Base Artwork Image */}
          <div className="relative w-full aspect-[682/1024]">
            <img 
              src={passImageSrc} 
              alt="Birthday VIP Pass" 
              className="w-full h-full object-cover block"
            />

            {/* DYNAMIC OVERLAY: Top Right Date on Left Stub */}
            <div 
              style={{
                position: 'absolute',
                top: '5.2%',
                left: '63.2%',
                width: '10.5%',
                height: '4%',
                backgroundColor: '#78001e',
                color: '#f6eee0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1.05,
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textAlign: 'center',
                borderRadius: '3px',
                zIndex: 2,
              }}
              className="font-cinzel"
            >
              <span>{formattedDate.dayMonth}</span>
              <span style={{ fontSize: '7.5px', opacity: 0.9 }}>{formattedDate.year}</span>
            </div>

            {/* DYNAMIC OVERLAY: VIP Voucher "VALID ON" Date */}
            <div 
              style={{
                position: 'absolute',
                top: '68.8%',
                left: '37.8%',
                width: '18%',
                height: '5.2%',
                backgroundColor: '#f6efe2',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingLeft: '2px',
                zIndex: 2,
              }}
            >
              <span style={{ fontSize: '5.5px', color: '#7a525b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                VALID ON
              </span>
              <span style={{ fontSize: '9px', color: '#2a0810', fontWeight: 800, letterSpacing: '0.04em', lineHeight: 1.1 }} className="font-serif">
                {formattedDate.fullDate}
              </span>
            </div>

            {/* DYNAMIC OVERLAY: Right Stub with Dynamic Location, Time, Date, Title & QR Code */}
            <div 
              style={{
                position: 'absolute',
                top: '13.2%',
                left: '74.6%',
                width: '25.4%',
                height: '73.5%',
                backgroundColor: '#f6eee0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '6px 7px 4px 6px',
                zIndex: 2,
                boxSizing: 'border-box',
              }}
            >
              {/* Event Metadata Rows */}
              <div className="flex flex-col gap-1.5 w-full">
                {/* 1. DATE */}
                <div className="flex items-start gap-1">
                  <div className="text-[#800020] mt-0.5 shrink-0">
                    <Calendar size={11} strokeWidth={2.5} />
                  </div>
                  <div className="overflow-hidden">
                    <p style={{ fontSize: '6px', color: '#800020', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, lineHeight: 1 }}>
                      DATE
                    </p>
                    <p style={{ fontSize: '9px', color: '#2a0810', fontWeight: 700, margin: '1px 0 0 0', lineHeight: 1.1 }}>
                      {formattedDate.isoDate}
                    </p>
                  </div>
                </div>

                {/* 2. TIME */}
                <div className="flex items-start gap-1">
                  <div className="text-[#800020] mt-0.5 shrink-0">
                    <Clock size={11} strokeWidth={2.5} />
                  </div>
                  <div className="overflow-hidden">
                    <p style={{ fontSize: '6px', color: '#800020', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, lineHeight: 1 }}>
                      TIME
                    </p>
                    <p style={{ fontSize: '8.5px', color: '#2a0810', fontWeight: 700, margin: '1px 0 0 0', lineHeight: 1.1 }}>
                      {displayTime} ONWARDS
                    </p>
                  </div>
                </div>

                {/* 3. VENUE (LOCATION) */}
                <div className="flex items-start gap-1">
                  <div className="text-[#800020] mt-0.5 shrink-0">
                    <MapPin size={11} strokeWidth={2.5} />
                  </div>
                  <div className="overflow-hidden">
                    <p style={{ fontSize: '6px', color: '#800020', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, lineHeight: 1 }}>
                      VENUE
                    </p>
                    <p style={{ fontSize: '8.5px', color: '#2a0810', fontWeight: 700, margin: '1px 0 0 0', lineHeight: 1.15, wordBreak: 'break-word' }}>
                      {venueLocation}
                    </p>
                  </div>
                </div>

                {/* 4. EVENT TITLE */}
                <div className="flex items-start gap-1">
                  <div className="text-[#800020] mt-0.5 shrink-0">
                    <Coffee size={11} strokeWidth={2.5} />
                  </div>
                  <div className="overflow-hidden">
                    <p style={{ fontSize: '6px', color: '#800020', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, lineHeight: 1 }}>
                      EVENT
                    </p>
                    <p style={{ fontSize: '8.5px', color: '#2a0810', fontWeight: 700, margin: '1px 0 0 0', lineHeight: 1.15, wordBreak: 'break-word' }}>
                      {eventTitle}
                    </p>
                  </div>
                </div>

                {/* 5. DRESS CODE */}
                <div className="flex items-start gap-1">
                  <div className="text-[#800020] mt-0.5 shrink-0">
                    <Sparkles size={11} strokeWidth={2.5} />
                  </div>
                  <div className="overflow-hidden">
                    <p style={{ fontSize: '6px', color: '#800020', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, lineHeight: 1 }}>
                      DRESS CODE
                    </p>
                    <p className="font-handwriting" style={{ fontSize: '9.5px', color: '#800020', fontWeight: 700, margin: '1px 0 0 0', lineHeight: 1 }}>
                      Comfortable & Cute ♡
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code Box */}
              <div className="flex flex-col items-center mt-1">
                <div 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    padding: '4px', 
                    borderRadius: '8px', 
                    border: '1.5px solid #800020', 
                    boxShadow: '0 2px 6px rgba(128, 0, 32, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <QRCodeCanvas 
                    value={passUrl || 'https://bdypass.vercel.app'} 
                    size={68} 
                    level="M" 
                    includeMargin={false} 
                  />
                  {/* Heart in center of QR */}
                  <span 
                    style={{ 
                      position: 'absolute', 
                      fontSize: '9px', 
                      color: '#800020',
                      backgroundColor: '#ffffff',
                      borderRadius: '50%',
                      padding: '1px 2px',
                      lineHeight: 1
                    }}
                  >
                    ♡
                  </span>
                </div>

                <p 
                  style={{ 
                    fontSize: '5.5px', 
                    color: '#800020', 
                    fontWeight: 800, 
                    letterSpacing: '0.06em', 
                    textTransform: 'uppercase',
                    marginTop: '3px',
                    textAlign: 'center'
                  }}
                >
                  SCAN TO CONFIRM ENTRY ✦
                </p>
              </div>

            </div>

            {/* Subtle gloss overlay highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
          </div>
        </div>

        {/* Live Details Pill Below Pass */}
        <div className="w-full mt-3.5 p-3.5 rounded-2xl bg-white/95 dark:bg-[#20050d]/95 backdrop-blur-md border border-[#800020]/20 shadow-md text-xs text-foreground/90 flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-semibold border-b border-[#800020]/10 pb-1.5">
            <span className="flex items-center gap-1.5 text-[#800020] dark:text-[#ff9bb0] uppercase tracking-wider font-cinzel">
              <Sparkles className="w-3.5 h-3.5" /> VIP Access Confirmed
            </span>
            <span className="text-muted-foreground font-medium text-[11px]">Valid Pass</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3 text-[#800020] dark:text-[#ff9bb0]" /> {formattedDate.isoDate}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3 text-[#800020] dark:text-[#ff9bb0]" /> {displayTime}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground truncate max-w-[130px]">
              <MapPin className="w-3 h-3 text-[#800020] dark:text-[#ff9bb0] shrink-0" /> {venueLocation}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full mt-3.5">
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
