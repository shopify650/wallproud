# Wallproud ⚡️

Wallproud is a minimalist, Framer-inspired testimonial and on-site collection widget platform. It allows developers and creators to collect reviews and display beautiful "Walls of Love", sliders, and grids directly on their websites or within Framer projects.

## Features

- **Minimalist Aesthetics**: Designed with a sleek, modern glassmorphic look.
- **On-Site Collection Widget**: Embed customizable widgets directly in Framer or HTML websites.
- **Multiple Layouts**: Support for Grid, Carousel, Slider, and Wall of Love formats.
- **Supabase Backend**: Fast, secure database operations and real-time state sync.
- **Automatic Vercel Integration**: Fully optimized for Next.js and deployed automatically via Vercel.

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

## CI/CD and Deployment

Wallproud is connected to Vercel for continuous deployment. Every time you push to the `main` branch:
- Vercel automatically detects the updates.
- A production build is compiled and verified.
- The new version goes live seamlessly.
