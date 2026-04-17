import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Zap, Briefcase, Users, Star, Shield, MessageCircle,
  Lock, ArrowRight, Menu, X, CheckCircle, MapPin,
  Wrench, Bolt, Wind, BookOpen, Truck, Hammer,
  Paintbrush, ChefHat, Monitor,
} from "lucide-react";
import clsx from "clsx";

// ── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["How it works", "Categories", "For Workers", "Pricing"];

const STATS = [
  { icon: Users,     value: "12K+", label: "Verified Workers"  },
  { icon: Briefcase, value: "50K+", label: "Jobs Completed"    },
  { icon: Star,      value: "4.9★", label: "Average Rating"    },
  { icon: MapPin,    value: "10+",  label: "Cities in Malawi"  },
];

const CATEGORIES = [
  { icon: Wrench,     label: "Plumbing"    },
  { icon: Bolt,       label: "Electrical"  },
  { icon: Wind,       label: "Cleaning"    },
  { icon: Hammer,     label: "Carpentry"   },
  { icon: BookOpen,   label: "Tutoring"    },
  { icon: ChefHat,    label: "Cooking"     },
  { icon: Truck,      label: "Moving"      },
  { icon: Paintbrush, label: "Painting"    },
  { icon: Monitor,    label: "IT Support"  },
];

const FEATURES = [
  { icon: Shield,         title: "Verified Professionals",  desc: "Every worker is background-checked and skill-verified before joining the platform."         },
  { icon: Zap,            title: "Instant Matching",        desc: "Post a job and receive applications from nearby professionals within minutes."               },
  { icon: Lock,           title: "Secure Payments",         desc: "Funds are held safely in escrow and only released when you're satisfied with the work."      },
  { icon: MessageCircle,  title: "In-App Messaging",        desc: "Chat directly with workers, share photos, and coordinate every detail in one place."         },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Post a Job",         desc: "Describe what you need, set your budget, and choose a category. Takes less than 2 minutes."  },
  { step: "02", title: "Get Applications",   desc: "Verified professionals near you apply. Browse profiles, ratings, and reviews."                },
  { step: "03", title: "Hire & Pay Safely",  desc: "Chat, agree on terms, and pay securely through the app. Funds released on completion."        },
];

const TESTIMONIALS = [
  { name: "Chisomo Phiri",   city: "Lilongwe", role: "Homeowner",    text: "Found a plumber within 30 minutes. Excellent work and very professional. Will use Waganyu again!",                    rating: 5 },
  { name: "Tadala Banda",    city: "Blantyre", role: "Business Owner", text: "We use Waganyu for all our office maintenance. The quality of workers is consistently high.",                       rating: 5 },
  { name: "Kondwani Mwale",  city: "Mzuzu",    role: "Electrician",   text: "As a worker, Waganyu has transformed my income. I get steady jobs and the payment system is reliable.",              rating: 5 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-[0.15em] text-primary uppercase mb-3">
      {children}
    </p>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={clsx(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-card border-b border-border" : "bg-transparent"
    )}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">Waganyu</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l} href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm font-semibold text-foreground hover:text-primary transition-colors px-4 py-2">
            Sign In
          </a>
          <a href="#" className="text-sm font-semibold text-white gradient-primary px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
            Get Started
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-border px-6 pb-6 pt-2 flex flex-col gap-4"
        >
          {NAV_LINKS.map(l => (
            <a key={l} href="#" className="text-sm font-medium text-foreground py-1">{l}</a>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-border">
            <a href="#" className="text-sm font-semibold text-center text-foreground py-2.5 border border-border rounded-xl">Sign In</a>
            <a href="#" className="text-sm font-semibold text-center text-white gradient-primary py-2.5 rounded-xl">Get Started Free</a>
          </div>
        </motion.div>
      )}
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary-light opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-accent-light opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-primary-light opacity-30 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary-light border border-primary-mid text-primary text-xs font-semibold px-4 py-2 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              🇲🇼 Malawi's #1 Task Marketplace
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6 text-balance"
            >
              Get Any Task<br />
              <span className="text-primary">Done Fast.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg"
            >
              Connect with verified professionals for plumbing, electrical, cleaning, tutoring and more — right in your neighbourhood across Malawi.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <a href="#" className="inline-flex items-center justify-center gap-2 gradient-primary text-white font-semibold text-base px-8 py-4 rounded-xl hover:opacity-90 transition-all hover:shadow-elevated group">
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-border text-foreground font-semibold text-base px-8 py-4 rounded-xl hover:border-primary hover:text-primary transition-all">
                I already have an account
              </a>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex items-center gap-6 text-sm text-muted-foreground"
            >
              {["Free to join", "Verified workers", "Secure payments"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-primary" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((st, i) => (
              <motion.div
                key={st.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="bg-white border border-border rounded-2xl p-6 shadow-card flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                  <st.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground">{st.value}</p>
                  <p className="text-sm text-muted-foreground">{st.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Categories ────────────────────────────────────────────────────────────────

function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-14">
          <SectionLabel>Popular Categories</SectionLabel>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground">Whatever you need, we've got it</h2>
        </FadeUp>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3">
          {CATEGORIES.map((cat, i) => (
            <FadeUp key={cat.label} delay={i * 0.05}>
              <a href="#" className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:border-primary hover:bg-primary-light transition-all cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-primary-light group-hover:bg-primary flex items-center justify-center transition-colors">
                  <cat.icon size={20} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-semibold text-foreground text-center leading-tight">{cat.label}</span>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-16">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground">Three simple steps</h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <FadeUp key={step.step} delay={i * 0.1}>
              <div className="relative bg-white border border-border rounded-2xl p-8 shadow-card">
                <span className="text-5xl font-extrabold text-primary-light leading-none block mb-6">{step.step}</span>
                <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                    <ArrowRight size={20} className="text-border" />
                  </div>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────

function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <FadeUp>
            <SectionLabel>Why Waganyu</SectionLabel>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-6 text-balance">
              Built for trust,<br />designed for speed
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              We've built every feature with one goal in mind — making it effortless to get work done and get paid, safely and reliably across Malawi.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
              Learn more about how we work <ArrowRight size={16} />
            </a>
          </FadeUp>

          {/* Right */}
          <div className="flex flex-col gap-4">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.08}>
                <div className="flex items-start gap-4 bg-background border border-border rounded-2xl p-5 hover:border-primary-mid hover:shadow-card transition-all">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <f.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-14">
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground">Trusted across Malawi</h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1}>
              <div className="bg-white border border-border rounded-2xl p-6 shadow-card flex flex-col gap-4 h-full">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ────────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 lg:p-16 text-center">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />

            <p className="text-white/80 text-sm font-semibold tracking-widest uppercase mb-4">Ready to get started?</p>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 text-balance">
              Join thousands of Malawians<br />already using Waganyu
            </h2>
            <p className="text-white/75 text-base mb-10 max-w-xl mx-auto">
              Whether you need to hire someone or find work — Waganyu connects you with the right people, fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold text-base px-8 py-4 rounded-xl hover:bg-primary-light transition-colors group">
                Create Free Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-semibold text-base px-8 py-4 rounded-xl hover:bg-white/25 transition-colors">
                Download the App
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-foreground text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold">Waganyu</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Malawi's #1 task marketplace. Connecting people with skilled professionals since 2025.
            </p>
          </div>

          {/* Links */}
          {[
            { title: "Platform",  links: ["How it works", "Categories", "Pricing", "For Workers"] },
            { title: "Company",   links: ["About us", "Blog", "Careers", "Press"]                 },
            { title: "Support",   links: ["Help Centre", "Contact us", "Privacy Policy", "Terms"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-bold mb-4 text-white/80">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40 tracking-wider">WAGANYU DIGITAL EXCELLENCE © 2025</p>
          <p className="text-xs text-white/40">Made with ❤️ in Malawi</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}
