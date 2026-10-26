"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Sparkles, CalendarDays, MapPin, Clock, Volume2, VolumeX, Moon, Sun, Crown, Ticket } from "lucide-react";
import { formatTime12Hour } from "@/lib/utils";

import { DeclineFlow } from "@/components/invite/DeclineFlow";
import { SuccessScreen } from "@/components/invite/SuccessScreen";
import { DigitalPass } from "@/components/invite/DigitalPass";
import { FloatingBackground } from "@/components/ui/floating-background";
import { supabase } from "@/lib/supabase";

import { Event, RSVP, submitRSVP } from "@/lib/events";
import { format } from "date-fns";

const mockEvent: Event = {
  id: 'example-event-id',
  title: "Coffee & Catchup! ☕️",
  description: "Good food • Great people • Better memories! Join me to celebrate my birthday with coffee, pastries, and chaos!",
  type: "flexible",
  venue: "Delhi",
  personalized_message: "Same girl, bigger chaos! Can't wait to see you there! ♡",
  cover_emoji: "👑",
  allowed_start_time: "10:00",
  allowed_end_time: "20:00",
  created_at: new Date().toISOString()
};

export default function InvitePage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpState, setRsvpState] = useState<'pending' | 'success'>('pending');
  const [rsvpData, setRsvpData] = useState<RSVP | null>(null);
  
  const [showDecline, setShowDecline] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-11-04T00:00:00"));
  const [selectedTime, setSelectedTime] = useState<string>("11:00");
  
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await supabase.from('events').select('*').eq('id', eventId).single();
        if (data) {
          setEvent(data);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Supabase fetch notice:", e);
      }

      // Check localStorage backup
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("bdy_events") || "[]");
          const found = stored.find((ev: any) => ev.id === eventId);
          if (found) {
            setEvent(found);
            setLoading(false);
            return;
          }
        } catch (e) {}
      }

      // Fallback to mock birthday event
      setEvent(mockEvent);
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleConfirm = async () => {
    if (!event) return;

    if (event.type === 'flexible') {
      const allowedStart = event.allowed_start_time || "00:00";
      const allowedEnd = event.allowed_end_time || "23:59";
      if (selectedTime < allowedStart || selectedTime > allowedEnd) {
        return;
      }
    }

    const newRsvp: Partial<RSVP> = {
      event_id: event.id,
      guest_name: "VIP Guest",
      status: "confirmed",
      selected_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : "2026-11-04",
      selected_start_time: selectedTime || "12:00",
    };

    const savedRsvp = await submitRSVP(newRsvp);
    if (savedRsvp) {
      setRsvpData(savedRsvp);
    } else {
      setRsvpData({ ...newRsvp, id: 'temp-id', responded_at: new Date().toISOString() } as RSVP);
    }

    setRsvpState('success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl"
          >
            👑
          </motion.div>
          <div className="w-48 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#800020]"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="text-sm font-serif text-[#800020] font-semibold tracking-wider uppercase">Loading Birthday Pass...</p>
        </div>
      </div>
    );
  }

  if (!event) return <div className="text-center p-8 text-[#800020]">Birthday Event not found</div>;

  const isTimeInvalid = event.type === 'flexible' && (selectedTime < (event.allowed_start_time || "00:00") || selectedTime > (event.allowed_end_time || "23:59"));

  return (
    <main className="relative min-h-screen flex flex-col items-center py-12 px-4 overflow-x-hidden">
      <FloatingBackground />

      {/* Top Bar Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="rounded-full bg-white/40 dark:bg-black/30 backdrop-blur-md border border-[#800020]/20 text-[#800020] dark:text-[#f8d7dc]">
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full bg-white/40 dark:bg-black/30 backdrop-blur-md border border-[#800020]/20 text-[#800020] dark:text-[#f8d7dc]">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {rsvpState === 'pending' ? (
          <motion.div 
            key="invite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 glass-card max-w-md w-full p-6 md:p-8 rounded-[2.5rem] shadow-[0_16px_50px_rgba(128,0,32,0.15)] flex flex-col border border-[#800020]/20"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#800020]/10 text-[#800020] dark:bg-[#800020]/30 dark:text-[#ff9bb0] text-xs font-semibold uppercase tracking-wider mb-3 font-cinzel">
                <Crown className="w-3.5 h-3.5" /> VIP Birthday Pass
              </div>

              <motion.div 
                whileHover={{ scale: 1.1, rotate: 8 }}
                className="text-7xl mb-3 drop-shadow-md inline-block cursor-pointer select-none"
              >
                {event.cover_emoji || '👑'}
              </motion.div>
              <h1 className="text-3xl font-bold font-serif text-[#800020] dark:text-[#ff9bb0] mb-2">{event.title}</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
            </div>

            <div className="space-y-4 mb-6 bg-[#800020]/5 dark:bg-[#800020]/20 p-5 rounded-3xl border border-[#800020]/15">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#800020] dark:text-[#ff9bb0] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-xs uppercase tracking-wider text-[#800020] dark:text-[#ff9bb0]">Venue</p>
                  <p className="text-sm font-medium text-foreground">{event.venue}</p>
                </div>
              </div>
              
              {event.type === 'fixed' ? (
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-[#800020] dark:text-[#ff9bb0] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs uppercase tracking-wider text-[#800020] dark:text-[#ff9bb0]">Date & Time</p>
                    <p className="text-sm font-medium text-foreground">{event.fixed_date} at {formatTime12Hour(event.fixed_start_time)}</p>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#800020]/15">
                  <p className="font-semibold text-xs uppercase tracking-wider text-[#800020] dark:text-[#ff9bb0] mb-2">Pick your celebration date & time:</p>
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-2 flex flex-col items-center gap-3 border border-[#800020]/10 shadow-sm">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md"
                    />
                    {selectedDate && (
                      <div className="w-full px-4 pb-2">
                        <label className="text-xs text-muted-foreground mb-1 block font-medium">Preferred Time:</label>
                        <input 
                          type="time" 
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          min={event.allowed_start_time || "00:00"}
                          max={event.allowed_end_time || "23:59"}
                          className={`w-full bg-muted border rounded-xl p-3 outline-none focus:ring-2 transition-all ${isTimeInvalid ? 'border-destructive focus:ring-destructive/50 text-destructive' : 'border-[#800020]/30 focus:ring-[#800020]/50'}`}
                        />
                        <div className="flex justify-between items-center mt-1.5 px-1">
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                            Allowed: {formatTime12Hour(event.allowed_start_time)} - {formatTime12Hour(event.allowed_end_time)}
                          </p>
                          {isTimeInvalid && (
                            <p className="text-[10px] text-destructive font-bold animate-pulse">Outside party hours!</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <motion.div whileHover={(!isTimeInvalid && (event.type !== 'flexible' || selectedDate)) ? { scale: 1.02 } : {}} whileTap={(!isTimeInvalid && (event.type !== 'flexible' || selectedDate)) ? { scale: 0.98 } : {}}>
                <Button 
                  size="lg" 
                  onClick={handleConfirm}
                  disabled={(event.type === 'flexible' && !selectedDate) || isTimeInvalid}
                  className="w-full rounded-full bg-[#800020] hover:bg-[#660019] text-white font-bold text-base md:text-lg py-6 shadow-xl hover:shadow-[#800020]/40 disabled:opacity-50 transition-all border-none flex items-center justify-center gap-2"
                >
                  <Ticket className="h-5 w-5" />
                  I'm Coming to Celebrate! 🎉
                </Button>
              </motion.div>
              
              <Button 
                variant="ghost" 
                onClick={() => setShowDecline(true)}
                className="w-full rounded-full text-muted-foreground hover:bg-[#800020]/10 hover:text-[#800020]"
              >
                Can't Make It 😢
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSurprise(true)}
                className="rounded-full text-xs font-semibold border-[#800020]/30 text-[#800020] hover:bg-[#800020]/10 dark:text-[#ff9bb0]"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Birthday Surprise 🎁
              </Button>
            </div>
          </motion.div>
        ) : (
          <SuccessScreen 
            key="success"
            event={event} 
            rsvp={rsvpData}
            guestName="VIP Guest" 
            onGetPass={() => setShowPass(true)} 
          />
        )}
      </AnimatePresence>

      <DeclineFlow isOpen={showDecline} onClose={() => setShowDecline(false)} />
      
      {showPass && (
        <DigitalPass event={event} rsvp={rsvpData} onClose={() => setShowPass(false)} />
      )}

      {/* Surprise Modal */}
      <AnimatePresence>
        {showSurprise && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm"
            onClick={() => setShowSurprise(false)}
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -8 }} 
              animate={{ scale: 1, rotate: 0 }} 
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-[#800020] text-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm text-center border-2 border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">👑</div>
              <p className="text-lg font-serif font-bold mb-6 leading-relaxed">
                "Same girl, bigger chaos! You are simply amazing and I cannot wait to celebrate my birthday with you!" ♡
              </p>
              <Button onClick={() => setShowSurprise(false)} className="rounded-full bg-white text-[#800020] hover:bg-white/90 font-bold px-6">
                Aww, Yay! 💖
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
