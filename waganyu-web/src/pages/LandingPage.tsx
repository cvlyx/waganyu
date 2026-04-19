import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap, Briefcase, Users, Star, Shield, MessageCircle,
  Lock, ArrowRight, Menu, X, CheckCircle, MapPin,
  Wrench, Bolt, Wind, BookOpen, Truck, Hammer,
  Paintbrush, ChefHat, Monitor, Mail, Search,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";

// -- Data ---------------------------------------------------------------------

const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Categories", href: "/#categories" },
  { label: "For Workers", href: "/#for-workers" },
  { label: "Pricing", href: "/#pricing" }
];

const STATS = [
  { icon: Users,     value: "12K+", label: "Verified Workers"  },
  { icon: Briefcase, value: "50K+", label: "Jobs Completed"    },
  { icon: Star,      value: "4.9",  label: "Average Rating"    },
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

const TESTIMONIALS = [
  { name: "Chisomo Phiri",   city: "Lilongwe", role: "Homeowner",    text: "Found a plumber within 30 minutes. Excellent work and very professional. Will use Waganyu again!",                    rating: 5 },
  { name: "Tadala Banda",    city: "Blantyre", role: "Business Owner", text: "We use Waganyu for all our office maintenance. The quality of workers is consistently high.",                       rating: 5 },
  { name: "Kondwani Mwale",  city: "Mzuzu",    role: "Electrician",   text: "As a worker, Waganyu has transformed my income. I get steady jobs and the payment system is reliable.",              rating: 5 },
];

// -- Helpers ------------------------------------------------------------------

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
    <p className="text-xs font-bold tracking-[0.15em] text-[#1DB954] uppercase mb-3">
      {children}
    </p>
  );
}

// -- Navbar -------------------------------------------------------------------

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
      scrolled ? "bg-[#282828]/90 backdrop-blur-md shadow-lg border-b border-[#404040]" : "bg-transparent"
    )}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">Waganyu</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-[#B3B3B3] hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-white hover:text-[#1DB954] transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link to="/signup" className="text-sm font-semibold text-white gradient-primary px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
            Get Started
          </Link>
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
          className="md:hidden bg-[#282828] border-b border-[#404040] px-6 pb-6 pt-2 flex flex-col gap-4"
        >
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-white py-1">{link.label}</a>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-[#404040]">
            <Link to="/login" className="text-sm font-semibold text-center text-white py-2.5 border border-[#404040] rounded-xl">Sign In</Link>
            <Link to="/signup" className="text-sm font-semibold text-center text-white gradient-primary py-2.5 rounded-xl">Get Started Free</Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}

// -- Hero ---------------------------------------------------------------------

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-[#191414]">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#1DB954]/20 opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-[#282828]/30 opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-[#1DB954]/15 opacity-40 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left -- copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954] text-xs font-semibold px-4 py-2 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
              Malawi's #1 Task Marketplace
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 text-balance"
            >
              Get Any Task<br />
              <span className="text-[#1DB954]">Done Fast.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-[#B3B3B3] leading-relaxed mb-10 max-w-lg"
            >
              Connect with verified professionals for plumbing, electrical, cleaning, tutoring and more right in your neighbourhood across Malawi.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 gradient-primary text-white font-semibold text-base px-8 py-4 rounded-xl hover:opacity-90 transition-all hover:shadow-elevated group">
                <Zap size={18} />
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-[#282828] border-2 border-[#404040] text-white font-semibold text-base px-8 py-4 rounded-xl hover:border-[#1DB954] hover:text-[#1DB954] transition-all">
                <Users size={18} />
                I already have an account
              </Link>
            </motion.div>

            {/* Email Subscription */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8"
            >
              <p className="text-sm font-medium text-white mb-3">Get early access and updates</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md">
                <div className="relative flex-1">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-[#282828] border border-[#404040] rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1DB954] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1DB954]/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail size={16} />
                  Subscribe
                </button>
              </form>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex items-center gap-6 text-sm text-[#B3B3B3]"
            >
              {["Free to join", "Verified workers", "Secure payments"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[#1DB954]" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right -- stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((st, i) => (
              <motion.div
                key={st.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="bg-[#282828] border border-[#404040] rounded-2xl p-6 shadow-lg flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1DB954]/20 flex items-center justify-center">
                  <st.icon size={18} className="text-[#1DB954]" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">{st.value}</p>
                  <p className="text-sm text-[#B3B3B3]">{st.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// -- Categories ----------------------------------------------------------------

function Categories() {
  return (
    <section className="py-24 bg-[#191414]" id="categories">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-14">
          <SectionLabel>Popular Categories</SectionLabel>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Whatever you need, we've got it</h2>
        </FadeUp>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3">
          {CATEGORIES.map((cat, i) => (
            <FadeUp key={cat.label} delay={i * 0.05}>
              <Link to="#" className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-[#404040] bg-[#282828] hover:border-[#1DB954] hover:bg-[#1DB954]/20 transition-all cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-[#1DB954]/20 group-hover:bg-[#1DB954] flex items-center justify-center transition-colors">
                  <cat.icon size={20} className="text-[#1DB954] group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-semibold text-white text-center leading-tight">{cat.label}</span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// -- How it works --------------------------------------------------------------

function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Post a Job",
      desc: "Describe what you need, set your budget, and choose a category. Takes less than 2 minutes.",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    {
      icon: Users,
      title: "Get Applications",
      desc: "Verified professionals near you apply. Browse profiles, ratings, and reviews.",
      color: "bg-green-500/20 text-green-400 border-green-500/30"
    },
    {
      icon: Shield,
      title: "Hire & Pay Safely",
      desc: "Chat, agree on terms, and pay securely through the app. Funds released on completion.",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
  ];

  return (
    <section className="py-24 bg-[#282828]" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-16">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Get started in three simple steps</h2>
          <p className="text-[#B3B3B3] mt-4 max-w-2xl mx-auto">
            From posting your job to getting it done - we've made the entire process seamless and secure
          </p>
        </FadeUp>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1DB954]/30 to-transparent transform -translate-y-1/2" />
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, i) => (
              <FadeUp key={step.title} delay={i * 0.15}>
                <div className="relative">
                  {/* Step number circle */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#1DB954] text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                    {i + 1}
                  </div>
                  
                  {/* Card */}
                  <div className="bg-[#191414] border border-[#404040] rounded-2xl p-8 pt-12 shadow-lg hover:border-[#1DB954]/50 transition-all group">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${step.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <step.icon size={24} />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-[#B3B3B3] leading-relaxed">{step.desc}</p>
                    
                    {/* Arrow connector */}
                    {i < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 z-20">
                        <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
                          <ArrowRight size={16} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
        
        {/* Bottom CTA */}
        <FadeUp delay={0.5} className="text-center mt-16">
          <Link to="/signup" className="inline-flex items-center gap-2 bg-[#1DB954] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#1DB954]/90 transition-colors group">
            <Zap size={18} />
            Get Started Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

// -- Features -----------------------------------------------------------------

function Features() {
  return (
    <section className="py-24 bg-[#191414]" id="for-workers">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <FadeUp>
            <SectionLabel>Why Waganyu</SectionLabel>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 text-balance">
              Built for trust,<br />designed for speed
            </h2>
            <p className="text-base text-[#B3B3B3] leading-relaxed mb-8">
              We've built every feature with one goal in mind making it effortless to get work done and get paid, safely and reliably across Malawi.
            </p>
            <Link to="#" className="inline-flex items-center gap-2 text-[#1DB954] font-semibold text-sm hover:gap-3 transition-all">
              Learn more about how we work <ArrowRight size={16} />
            </Link>
          </FadeUp>

          {/* Right */}
          <div className="flex flex-col gap-4">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.08}>
                <div className="flex items-start gap-4 bg-[#282828] border border-[#404040] rounded-2xl p-5 hover:border-[#1DB954] hover:shadow-lg transition-all">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <f.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-[#B3B3B3] leading-relaxed">{f.desc}</p>
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

// -- Testimonials -------------------------------------------------------------

function Testimonials() {
  return (
    <section className="py-24 bg-[#282828]">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-14">
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Trusted across Malawi</h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1}>
              <div className="bg-[#191414] border border-[#404040] rounded-2xl p-6 shadow-lg flex flex-col gap-4 h-full">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-[#1DB954] fill-[#1DB954]" />
                  ))}
                </div>
                <p className="text-sm text-white leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#404040]">
                  <div className="w-9 h-9 rounded-xl bg-[#1DB954]/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#1DB954]">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[#B3B3B3]">{t.role} · {t.city}</p>
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

// -- CTA Banner --------------------------------------------------------------

function CTABanner() {
  return (
    <section className="py-24 bg-[#191414]" id="pricing">
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
              Whether you need to hire someone or find work Waganyu connects you with the right people, fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-white text-[#1DB954] font-bold text-base px-8 py-4 rounded-xl hover:bg-[#1DB954]/20 transition-colors group">
                <Zap size={18} />
                Create Free Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="#" className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-semibold text-base px-8 py-4 rounded-xl hover:bg-white/25 transition-colors">
                <Briefcase size={18} />
                Download the App
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// -- Footer -------------------------------------------------------------------

function Footer() {
  return (
    <footer className="bg-[#191414] text-white py-16">
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
            <p className="text-sm text-[#B3B3B3] leading-relaxed">
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
              <h4 className="text-sm font-bold mb-4 text-white">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <Link to="#" className="text-sm text-[#B3B3B3] hover:text-white transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#404040] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#666666] tracking-wider">WAGANYU DIGITAL EXCELLENCE © 2025</p>
          <p className="text-xs text-[#666666]">Made with in Malawi</p>
        </div>
      </div>
    </footer>
  );
}

// -- Page ---------------------------------------------------------------------

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users
  useEffect(() => {
    if (!isLoading && user) {
      if (user.profileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/setup");
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#191414] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render landing page for authenticated users
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#191414]">
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
