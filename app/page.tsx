"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Sparkles,
  ArrowRight,
  Share2,
  Palette,
  Globe,
  LayoutGrid,
  Smartphone,
  Shield,
  Zap,
  BarChart3,
  CheckCircle,
  ChevronDown,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/logo";

const stats = [
  ["12,847+", "Testimonials collected"],
  ["1,423+", "Widgets embedded"],
  ["98.7%", "Satisfaction rate"],
  ["+23%", "Avg. conversion lift"],
];

const steps = [
  {
    step: "01",
    icon: Share2,
    title: "Share your collection link",
    desc: "Send customers a beautiful page. They leave a rating, written story, and optional video — no account needed on their end.",
  },
  {
    step: "02",
    icon: Palette,
    title: "Pick a widget style",
    desc: "Choose from 6 layouts — Grid, Wall of Love, Carousel, Slider, Minimal, or Masonry. Match your brand in one click.",
  },
  {
    step: "03",
    icon: Globe,
    title: "Embed with one script tag",
    desc: "Copy a single line of JavaScript and paste it anywhere. Shadow DOM isolation means zero style conflicts.",
  },
];

const features = [
  {
    icon: LayoutGrid,
    title: "Six widget styles",
    desc: "Grid, Wall of Love, Carousel, Slider, Minimal, and Masonry — all fully customizable to match your brand.",
  },
  {
    icon: Smartphone,
    title: "Embed anywhere",
    desc: "One line of JavaScript works on any site: Shopify, Webflow, Framer, Next.js, or vanilla HTML.",
  },
  {
    icon: Star,
    title: "Collect in seconds",
    desc: "Share a link. Customers leave a rating, story, and video without creating an account.",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    desc: "Widgets load in under 100ms. Zero impact on your Core Web Vitals or page speed.",
  },
  {
    icon: Shield,
    title: "Spam protection",
    desc: "Rate limiting, IP deduplication, and manual approval keep your collection clean and authentic.",
  },
  {
    icon: BarChart3,
    title: "Real-time insights",
    desc: "See who submitted, track trends, and watch your collection grow in real time.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director, ScaleUp Inc.",
    text: "We switched from a manual testimonial page to WallProud. Our conversion rate jumped 23% in two weeks. The embed took five minutes.",
    avatar: "S",
    highlight: true,
  },
  {
    name: "Marcus Rivera",
    role: "Founder, River SaaS",
    text: "The embed was up in 5 minutes. Looks completely native on our site. Couldn't be happier with how seamless it was.",
    avatar: "M",
    highlight: false,
  },
  {
    name: "Aiko Tanaka",
    role: "Product Lead, Zenlytics",
    text: "Beautiful widgets, zero maintenance. Our customers actually enjoy leaving video testimonials now. The response rate doubled.",
    avatar: "A",
    highlight: false,
  },
  {
    name: "James Wilson",
    role: "CTO, BuildRight",
    text: "Shadow DOM isolation is a game-changer. It just works, no matter what CSS framework the host site uses. Finally.",
    avatar: "J",
    highlight: false,
  },
  {
    name: "Priya Patel",
    role: "Growth, Lunar Tech",
    text: "We went from zero social proof to a beautiful Wall of Love in one afternoon. Our sales team sends the link to every prospect.",
    avatar: "P",
    highlight: true,
  },
  {
    name: "Tom Eriksson",
    role: "Indie Hacker",
    text: "I've tried three other testimonial tools. WallProud is the only one that looks this good out of the box. No tweaking required.",
    avatar: "T",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Do I need to install anything on my website?",
    a: "No. Just copy one script tag and paste it into your site's HTML. Works with any framework — React, Vue, Shopify, Webflow, Framer, you name it.",
  },
  {
    q: "Will the widget slow down my site?",
    a: "Widgets load in under 100ms and have zero impact on Core Web Vitals. We use shadow DOM for full style isolation.",
  },
  {
    q: "Can I customize the colors and fonts?",
    a: "Yes. Every widget style supports custom colors, fonts, spacing, and border radius. Match your brand in seconds.",
  },
  {
    q: "What happens if I exceed my plan limits?",
    a: "We'll notify you before you hit any limit. You can upgrade at any time, or downgrade without losing data.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Our Free plan includes 10 testimonials and one widget. No credit card required, no time limit.",
  },
  {
    q: "Can I import existing testimonials?",
    a: "Yes. You can import testimonials via CSV or manually add them. We support ratings, text, images, and video URLs.",
  },
];

function TestimonialCard({ name, role, text, avatar, highlight }: { name: string; role: string; text: string; avatar: string; highlight?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
        highlight
          ? "border-accent/40 bg-surface-1/80 shadow-lg shadow-accent/5"
          : "border-hairline/60 bg-surface-1/40"
      } hover:-translate-y-1 hover:border-hairline-soft/80 hover:bg-surface-1/60 hover:shadow-2xl hover:shadow-black/35`}
    >
      {highlight && (
        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wider">
          <Sparkles className="h-2.5 w-2.5" /> Featured
        </div>
      )}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted/90">
        &ldquo;{text}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-hairline/40 pt-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 font-display text-sm font-semibold text-ink ring-1 ring-white/10">
          {avatar}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{name}</p>
          <p className="text-xs text-muted/75 truncate">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-hairline/30 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left text-[15px] font-medium text-ink transition-colors hover:text-white"
      >
        <span>{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-8 text-[15px] leading-relaxed text-muted/80">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"grid" | "carousel" | "wall">("grid");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const previewTestimonials = [
    {
      name: "Alex Rivera",
      role: "Founder, SaaSFlow",
      text: "The integration took literally 2 minutes. WallProud widgets look exceptionally premium and match our brand styling perfectly.",
      avatar: "A",
      tag: "Conversion",
      height: "h-auto",
    },
    {
      name: "Emily Watson",
      role: "Head of Growth, Elevate",
      text: "Our conversion rate jumped 27% in the first week of putting WallProud on our landing page. The video testimonial feature is incredibly smooth.",
      avatar: "E",
      tag: "Video review",
      height: "h-auto md:row-span-2",
    },
    {
      name: "Chen Wei",
      role: "CTO, DevScale",
      text: "Finally a tool that doesn't bloat our loading speeds. 90+ Core Web Vitals score maintained, styling isolation is flawless.",
      avatar: "C",
      tag: "Performance",
      height: "h-auto",
    },
  ];

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev === 0 ? previewTestimonials.length - 1 : prev - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev === previewTestimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-black text-ink selection:bg-accent/30 selection:text-white overflow-x-hidden relative">
      {/* Framer-style ambient glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Primary hero glow — soft blue, centered above fold */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-[#0099ff]/[0.07] blur-[120px]" />
        {/* Secondary violet accent — offset left */}
        <div className="absolute top-[10%] left-[-5%] h-[400px] w-[500px] rounded-full bg-[#6a4cf5]/[0.05] blur-[100px]" />
        {/* Tertiary warm accent — offset right, lower */}
        <div className="absolute top-[30%] right-[-8%] h-[350px] w-[450px] rounded-full bg-[#d44df0]/[0.04] blur-[100px]" />
        {/* Subtle bottom-edge vignette fade to pure black */}
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[#090909] to-transparent" />
      </div>

      {/* ---- Nav ---- */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-canvas/70 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="flex items-center gap-6">
            <Link href="/pricing" className="text-[14px] font-medium text-muted transition hover:text-white">
              Pricing
            </Link>
            <Link href="/login" className="text-[14px] font-medium text-muted transition hover:text-white">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="relative inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-black transition-all duration-200 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center pt-24 text-center sm:pt-32">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface-1/60 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur-md shadow-inner"
          >
            <Sparkles className="h-3 w-3 text-accent animate-pulse" />
            <span>Social proof built for modern web apps</span>
            <div className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-5xl font-display-xxl leading-[0.9] tracking-tight bg-gradient-to-b from-white via-white to-white/45 bg-clip-text text-transparent pb-3"
          >
            Turn your best customers
            <br />
            into your best marketing
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted/80 font-normal"
          >
            WallProud lets you collect, curate, and showcase your customer reviews and video testimonials in gorgeous, optimized widgets. Set up in 5 minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-white/95 hover:scale-[1.03] hover:shadow-xl hover:shadow-white/5 active:scale-[0.98]"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-surface-1 border border-white/[0.08] px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:bg-surface-2 hover:border-white/20 active:scale-[0.98]"
            >
              View the demo
            </Link>
          </motion.div>

          {/* Core assurances */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-6 text-xs text-muted"
          >
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-accent/80" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-accent/80" /> Free tier forever</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-accent/80" /> Under 100ms load time</span>
          </motion.div>
        </div>

        {/* ---- Interactive Widget Previewer Mockup ---- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 mx-auto max-w-4xl relative z-20"
        >
          {/* Visual glow backdrop for mockup */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-[#6a4cf5]/10 via-transparent to-[#0099ff]/5 blur-3xl pointer-events-none" />

          {/* Browser Container */}
          <div className="rounded-2xl border border-white/[0.08] bg-surface-1/40 backdrop-blur-xl shadow-2xl overflow-hidden shadow-black/80">
            {/* Browser Header Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-surface-1/65 px-4 py-3">
              {/* Window controls */}
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              
              {/* Widget Switcher Tabs */}
              <div className="flex items-center gap-1 bg-surface-2 rounded-lg p-0.5 border border-white/[0.04]">
                {(["grid", "carousel", "wall"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                      activeTab === tab
                        ? "bg-white text-black shadow-sm"
                        : "text-muted hover:text-white"
                    }`}
                  >
                    {tab === "wall" ? "Wall of Love" : tab}
                  </button>
                ))}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-semibold text-green-400 uppercase tracking-widest hidden sm:inline">Live Widget Preview</span>
              </div>
            </div>

            {/* Browser Content Body */}
            <div className="p-6 md:p-8 min-h-[300px] flex items-center justify-center bg-gradient-to-b from-canvas/40 to-canvas/10">
              <AnimatePresence mode="wait">
                {activeTab === "grid" && (
                  <motion.div
                    key="grid-preview"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-4 md:grid-cols-3 w-full"
                  >
                    {previewTestimonials.map((t, idx) => (
                      <div key={idx} className="rounded-xl border border-white/[0.06] bg-surface-1/50 p-5 flex flex-col justify-between hover:border-white/[0.12] transition-colors">
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              ))}
                            </div>
                            <span className="text-[10px] font-medium text-accent/80 bg-accent/10 px-2 py-0.5 rounded-full">{t.tag}</span>
                          </div>
                          <p className="mt-3.5 text-sm text-muted/90 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                        </div>
                        <div className="mt-5 flex items-center gap-2.5 pt-3 border-t border-white/[0.04]">
                          <div className="h-7 w-7 rounded-full bg-surface-2 flex items-center justify-center text-xs font-bold text-white">{t.avatar}</div>
                          <div>
                            <p className="text-xs font-semibold text-white">{t.name}</p>
                            <p className="text-[10px] text-muted">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "carousel" && (
                  <motion.div
                    key="carousel-preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full flex flex-col items-center"
                  >
                    <div className="w-full max-w-xl rounded-xl border border-white/[0.06] bg-surface-1/50 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                          <span className="text-[10px] font-semibold text-accent uppercase tracking-wider bg-accent/10 px-2.5 py-0.5 rounded-full">
                            {previewTestimonials[carouselIndex].tag}
                          </span>
                        </div>
                        <p className="mt-4 text-[15px] text-ink/90 leading-relaxed italic">
                          &ldquo;{previewTestimonials[carouselIndex].text}&rdquo;
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                        <div className="h-9 w-9 rounded-full bg-surface-2 flex items-center justify-center text-sm font-bold text-white">
                          {previewTestimonials[carouselIndex].avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{previewTestimonials[carouselIndex].name}</p>
                          <p className="text-xs text-muted">{previewTestimonials[carouselIndex].role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3 mt-5">
                      <button
                        onClick={handlePrevCarousel}
                        className="p-2 rounded-full border border-white/[0.06] bg-surface-1 hover:bg-surface-2 text-muted hover:text-white transition-all active:scale-95"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-xs text-muted font-medium">
                        {carouselIndex + 1} / {previewTestimonials.length}
                      </span>
                      <button
                        onClick={handleNextCarousel}
                        className="p-2 rounded-full border border-white/[0.06] bg-surface-1 hover:bg-surface-2 text-muted hover:text-white transition-all active:scale-95"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "wall" && (
                  <motion.div
                    key="wall-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-4 md:grid-cols-2 w-full max-w-3xl"
                  >
                    {/* Columns representing Masonry */}
                    <div className="flex flex-col gap-4">
                      <div className="rounded-xl border border-white/[0.06] bg-surface-1/50 p-5 flex flex-col justify-between hover:border-white/[0.12] transition-all">
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              ))}
                            </div>
                            <span className="text-[10px] font-medium text-[#d44df0]/80 bg-[#d44df0]/10 px-2 py-0.5 rounded-full">Viral video</span>
                          </div>
                          <p className="mt-3 text-sm text-muted/90 leading-relaxed">&ldquo;WallProud is easily the most beautiful widget option we've ever designed with. Setup was complete in minutes.&rdquo;</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.04]">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-surface-2 flex items-center justify-center text-xs font-bold text-white">L</div>
                            <div>
                              <p className="text-xs font-semibold text-white">Liam Croft</p>
                              <p className="text-[10px] text-muted">Lead Designer, Studio3</p>
                            </div>
                          </div>
                          <div className="h-6 w-6 rounded-full bg-[#d44df0]/15 flex items-center justify-center">
                            <Play className="h-2.5 w-2.5 fill-[#d44df0] text-[#d44df0] ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-surface-1/50 p-5 flex flex-col justify-between hover:border-white/[0.12] transition-all">
                        <div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                          <p className="mt-3 text-sm text-muted/90 leading-relaxed">&ldquo;The client dashboard is beautiful, making curation exceptionally pleasant. Highly recommend!&rdquo;</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2.5 pt-3 border-t border-white/[0.04]">
                          <div className="h-7 w-7 rounded-full bg-surface-2 flex items-center justify-center text-xs font-bold text-white">R</div>
                          <div>
                            <p className="text-xs font-semibold text-white">Renée Lopez</p>
                            <p className="text-[10px] text-muted">Operations, NextGrid</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="rounded-xl border border-accent/30 bg-surface-1/65 p-5 flex flex-col justify-between hover:border-accent/60 transition-all shadow-lg shadow-accent/5">
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              ))}
                            </div>
                            <span className="text-[10px] font-semibold text-accent uppercase tracking-wider bg-accent/15 px-2.5 py-0.5 rounded-full">Top Review</span>
                          </div>
                          <p className="mt-3.5 text-sm text-ink font-medium leading-relaxed">&ldquo;Our conversion rates instantly shot up 23% after implementing WallProud. Our customers leave reviews with zero effort now!&rdquo;</p>
                        </div>
                        <div className="mt-5 flex items-center gap-2.5 pt-3 border-t border-white/[0.08]">
                          <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-black">P</div>
                          <div>
                            <p className="text-xs font-semibold text-white">Priya Patel</p>
                            <p className="text-[10px] text-muted">Growth, Lunar Tech</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-surface-1/50 p-5 flex flex-col justify-between hover:border-white/[0.12] transition-all">
                        <div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                          <p className="mt-3 text-sm text-muted/90 leading-relaxed">&ldquo;Very clean setup. Love the isolation from style conflicts.&rdquo;</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2.5 pt-3 border-t border-white/[0.04]">
                          <div className="h-7 w-7 rounded-full bg-surface-2 flex items-center justify-center text-xs font-bold text-white">J</div>
                          <div>
                            <p className="text-xs font-semibold text-white">James Wilson</p>
                            <p className="text-[10px] text-muted">CTO, BuildRight</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---- Stats ---- */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-28">
        <div className="rounded-2xl border border-white/[0.06] bg-surface-1/30 backdrop-blur-md">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] md:grid-cols-4 divide-y-0">
            {stats.map(([value, label], idx) => (
              <div key={label} className={`px-4 py-8 text-center ${idx >= 2 ? "border-t border-white/[0.06] md:border-t-0" : ""}`}>
                <p className="font-display-lg leading-none text-white tracking-tight">{value}</p>
                <p className="mt-2 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface-1/60 px-4 py-1 text-xs font-semibold tracking-wide text-muted backdrop-blur-sm">
            Setup Workflow
          </span>
          <h2 className="mt-4 font-display-lg leading-tight text-white">
            Go from collect to showcase in minutes
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted/70">
            Three simple steps. No complex code integrations. No styling struggles.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1/30 p-8 hover:bg-surface-1/55 transition-all duration-300 hover:border-white/[0.12] group"
              >
                <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-accent/5 blur-xl group-hover:bg-accent/10 transition-colors pointer-events-none" />
                <span className="text-xs font-semibold text-accent uppercase tracking-widest">{s.step}</span>
                <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-white">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mt-5 font-display-md text-white tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted/80">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <div className="absolute top-1/2 left-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-[#6a4cf5]/5 blur-[100px] pointer-events-none" />
        
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface-1/60 px-4 py-1 text-xs font-semibold tracking-wide text-muted backdrop-blur-sm">
            Everything Included
          </span>
          <h2 className="mt-4 font-display-lg leading-tight text-white">
            Powerful features, zero complexity
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted/70">
            A comprehensive tool suite to scale social proof across all digital products.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
                className="rounded-xl border border-white/[0.05] bg-surface-1/20 p-6 hover:bg-surface-1/40 hover:border-white/[0.1] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2/60 text-white group-hover:text-accent transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display-md text-[18px] text-white tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted/80">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---- Testimonials (Wall of Love) ---- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface-1/60 px-4 py-1 text-xs font-semibold tracking-wide text-muted backdrop-blur-sm">
            Wall of Love
          </span>
          <h2 className="mt-4 font-display-lg leading-tight text-white">
            Loved by builders & founders globally
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted/70">
            Real feedback from creators, developers, and operators shipping fast in 2026.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-28">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-display-lg leading-tight text-white">Frequently asked questions</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted/70">
            Answers to everything you need to know about WallProud.
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-surface-1/30 px-6 py-2 backdrop-blur-md shadow-2xl">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-surface-1/50 to-surface-1/20 px-8 py-16 text-center shadow-2xl shadow-black/80 backdrop-blur-md sm:px-16">
          {/* Subtle decoration halos */}
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[#d44df0]/10 blur-[40px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-44 w-44 rounded-full bg-[#0099ff]/10 blur-[40px] pointer-events-none" />
          
          <h2 className="font-display-lg leading-tight text-white tracking-tight">
            Start closing more customers today
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted/80">
            Join hundreds of high-growth companies using WallProud to convert traffic using organic customer love.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs text-muted font-medium">No credit card required. Free tier includes full features.</p>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-8 sm:flex-row">
          <Logo />
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted">
            <Link href="/pricing" className="transition hover:text-white">Pricing</Link>
            <Link href="/docs" className="transition hover:text-white">Docs</Link>
            <Link href="/blog" className="transition hover:text-white">Blog</Link>
            <Link href="/changelog" className="transition hover:text-white">Changelog</Link>
            <Link href="/login" className="transition hover:text-white">Log in</Link>
            <Link href="/signup" className="transition hover:text-white">Sign up</Link>
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
          </div>
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} WallProud. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
