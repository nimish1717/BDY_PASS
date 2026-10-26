# Birthday Pass 🎟️

Birthday Pass is a premium, mobile-first web app designed to create and share digital invitation experiences for your birthday celebrations. Generate beautifully designed VIP ticket passes with QR codes, personalized messages, and allow guests to RSVP seamlessly to both "fixed" time and "flexible" window birthday events.

## Features ✨

- **Vintage VIP Ticket Pass:** Stunning Burgundy (#800020) and vintage parchment ticket pass with scalloped tear-off stub, authentic rubber stamps, and custom QR codes.
- **Animated & Interactive:** Filled with floating party shapes, smooth framer-motion transitions, and burgundy-gold confetti effects.
- **Flexible Scheduling:** Admins can send flexible window dates where guests can choose a time that works best for them.
- **Digital Passes:** Generates beautiful "Birthday Pass" digital VIP cards with QR codes that can be downloaded as images (PNG) and PDFs.
- **Premium UI:** Glassmorphism, soft pastel gradients, and satisfying micro-interactions using shadcn/ui and Tailwind CSS.
- **Admin Dashboard:** Easily track RSVPs, create new events, and copy shareable invite links.

## Tech Stack 🛠

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/) & canvas-confetti
- **Forms & State:** react-hook-form, zod
- **Backend/Auth:** [Supabase](https://supabase.com/)
- **Utilities:** date-fns, lucide-react, sonner (for toasts), qrcode.react

## Getting Started 🚀

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Setup Environment:**
   Create a `.env.local` file based on `.env.example` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Database Setup

Run the following SQL in your Supabase project to create the required tables:

```sql
create table admins (
  id uuid primary key references auth.users(id),
  email text unique not null
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text check (type in ('fixed', 'flexible')) not null,
  venue text,
  personalized_message text,
  cover_emoji text default '💌',
  fixed_date date,
  fixed_start_time time,
  fixed_end_time time,
  range_start_date date,
  range_end_date date,
  allowed_start_time time,
  allowed_end_time time,
  created_at timestamp with time zone default now()
);

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  guest_name text,
  status text check (status in ('confirmed', 'declined', 'pending')) default 'pending',
  selected_date date,
  selected_start_time time,
  selected_end_time time,
  responded_at timestamp with time zone default now()
);
```

## Project Structure 📁

- `src/app`: Next.js App Router pages (Landing, Admin, Invite details).
- `src/components`: UI components organized by feature (ui, invite, admin).
- `src/lib`: Utility functions, Supabase client initialization.

## License

MIT
