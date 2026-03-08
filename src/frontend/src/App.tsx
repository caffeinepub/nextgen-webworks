import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  CheckCircle,
  ChevronRight,
  Clock,
  Cpu,
  ExternalLink,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  Menu,
  MessageCircle,
  PenTool,
  Share2,
  Star,
  TrendingUp,
  Twitter,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BudgetRange,
  BusinessType,
  DesignStyle,
  ServiceType,
} from "./backend.d";
import { useActor } from "./hooks/useActor";

// ── Scroll animation hook ────────────────────────────────────────
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

// ── Animated counter hook ────────────────────────────────────────
function useCounter(target: number, active: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);

  return count;
}

// ── Star rating component ────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        return (
          <div key={i} className="relative w-4 h-4">
            <Star className="w-4 h-4 text-muted-foreground/30 fill-muted-foreground/10" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Particle background component ────────────────────────────────
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `oklch(0.72 0.18 210 / ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.78 0.18 210 / ${p.opacity})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// ── Section wrapper with scroll animation ────────────────────────
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Services", id: "services" },
    { label: "Portfolio", id: "portfolio" },
    { label: "Stats", id: "stats" },
    { label: "Reviews", id: "reviews" },
    { label: "Order", id: "order" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-[0_4px_30px_oklch(0_0_0_/_0.3)]"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-neon-sm group-hover:shadow-neon-md transition-all duration-300">
            <Zap className="w-4 h-4 text-primary-foreground fill-current" />
          </div>
          <span
            className="font-display font-bold text-lg leading-tight gradient-text"
            style={{ letterSpacing: "-0.01em" }}
          >
            Nextgen Webworks
          </span>
        </button>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <li key={link.id}>
              <button
                type="button"
                data-ocid={`nav.link.${i + 1}`}
                onClick={() => scrollTo(link.id)}
                className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-all duration-200"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button
            data-ocid="nav.primary_button"
            onClick={() => scrollTo("order")}
            className="hidden sm:flex btn-primary-glow text-primary-foreground font-semibold px-5 h-9 rounded-lg"
          >
            Get Started
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border/50">
          <ul className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <li key={link.id}>
                <button
                  type="button"
                  data-ocid={`nav.link.${i + 1}`}
                  onClick={() => scrollTo(link.id)}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all"
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li className="pt-2 border-t border-border/50 mt-2">
              <Button
                onClick={() => scrollTo("order")}
                className="w-full btn-primary-glow text-primary-foreground font-semibold"
              >
                Get Started
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

// ── Hero Section ─────────────────────────────────────────────────
function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-bg.dim_1920x1080.jpg"
          alt=""
          className="w-full h-full object-cover opacity-20"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <ParticleBackground />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-neon-purple/8 blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 max-w-5xl text-center pt-20">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-sm font-medium mb-8"
          style={{ animationDelay: "0ms" }}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Next-Generation Digital Agency</span>
        </div>

        {/* Agency name */}
        <h1
          className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-6"
          style={{ animation: "fade-up 0.8s ease-out 0.1s both" }}
        >
          <span className="gradient-text">Nextgen</span>
          <br />
          <span className="text-foreground">Webworks</span>
        </h1>

        {/* Tagline */}
        <p
          className="text-lg sm:text-xl text-neon-cyan font-semibold mb-4 tracking-wide"
          style={{ animation: "fade-up 0.8s ease-out 0.25s both" }}
        >
          Next-Generation Websites for Modern Brands.
        </p>

        {/* Headline */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground/90 leading-tight mb-6 max-w-3xl mx-auto"
          style={{ animation: "fade-up 0.8s ease-out 0.35s both" }}
        >
          We Build Powerful Websites and{" "}
          <span className="gradient-text-purple">AI Solutions</span> for
          Businesses
        </h2>

        {/* Description */}
        <p
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animation: "fade-up 0.8s ease-out 0.45s both" }}
        >
          We help businesses grow online with cutting-edge websites, AI-powered
          tools, and result-driven digital marketing strategies.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ animation: "fade-up 0.8s ease-out 0.55s both" }}
        >
          <Button
            data-ocid="hero.primary_button"
            size="lg"
            onClick={() => scrollTo("order")}
            className="btn-primary-glow text-primary-foreground font-bold px-8 h-12 rounded-xl text-base shadow-neon-md group"
          >
            Order Your Website
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            data-ocid="hero.secondary_button"
            size="lg"
            variant="outline"
            onClick={() => scrollTo("portfolio")}
            className="btn-outline-glow h-12 px-8 rounded-xl text-base font-semibold"
          >
            View Our Work
          </Button>
        </div>

        {/* Stats preview */}
        <div
          className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-16 pt-10 border-t border-border/30"
          style={{ animation: "fade-up 0.8s ease-out 0.7s both" }}
        >
          {[
            { value: "50+", label: "Websites Created" },
            { value: "20+", label: "Countries Served" },
            { value: "100+", label: "Happy Clients" },
            { value: "8 Days", label: "Avg. Delivery" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-2xl text-neon-cyan">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-6 h-10 border-2 border-neon-cyan/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-neon-cyan rounded-full" />
        </div>
      </div>
    </section>
  );
}

// ── Services Section ──────────────────────────────────────────────
const SERVICES = [
  {
    icon: Globe,
    title: "Website Making",
    description:
      "Custom business websites built to convert visitors into customers. Fast, beautiful, and fully responsive.",
    color: "cyan",
  },
  {
    icon: Bot,
    title: "AI Receptionist",
    description:
      "24/7 AI-powered receptionist that handles inquiries, bookings, and customer queries automatically.",
    color: "purple",
  },
  {
    icon: Cpu,
    title: "AI Assistant",
    description:
      "Smart AI assistants that automate workflows, answer questions, and save your team hours every week.",
    color: "cyan",
  },
  {
    icon: PenTool,
    title: "Website Editing & Redesign",
    description:
      "Transform your outdated website into a modern, high-performing digital asset.",
    color: "purple",
  },
  {
    icon: Share2,
    title: "Social Media Management",
    description:
      "Professional content strategy and management to grow your audience and engagement.",
    color: "cyan",
  },
  {
    icon: Video,
    title: "Video Ads Creation",
    description:
      "Compelling video ads that capture attention and drive measurable business results.",
    color: "purple",
  },
];

function ServicesSection() {
  const [featured, ...rest] = SERVICES;
  return (
    <section id="services" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 dot-bg opacity-30" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Left-aligned heading with vertical accent rule — distinct from hero's centered style */}
        <AnimatedSection className="mb-16">
          <div className="flex items-start gap-6">
            <div className="w-1 self-stretch bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent rounded-full shrink-0 mt-1" />
            <div>
              <span className="text-neon-cyan text-xs font-semibold uppercase tracking-[0.2em] mb-3 block">
                What We Do
              </span>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-foreground leading-[0.95] mb-4">
                Our{" "}
                <span className="relative">
                  <span className="gradient-text">Services</span>
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Everything your business needs to dominate the digital space
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Featured hero card — Website Making spans full width on mobile, 2 cols on desktop */}
        <AnimatedSection className="mb-6">
          <div className="card-glass rounded-3xl overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-1 grid grid-cols-1 md:grid-cols-2">
            {/* Left: rich gradient panel */}
            <div className="relative p-8 sm:p-10 bg-gradient-to-br from-neon-cyan/15 via-neon-cyan/5 to-transparent border-b md:border-b-0 md:border-r border-neon-cyan/10 overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-neon-cyan/10 blur-3xl" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-neon-cyan/15 text-neon-cyan flex items-center justify-center mb-6 group-hover:bg-neon-cyan/25 group-hover:shadow-neon-md transition-all duration-300 border border-neon-cyan/20">
                  <featured.icon className="w-7 h-7" />
                </div>
                <div className="text-[80px] font-display font-black text-neon-cyan/5 leading-none select-none absolute top-4 right-4">
                  01
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground mb-3">
                  {featured.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {featured.description}
                </p>
              </div>
            </div>
            {/* Right: feature bullets */}
            <div className="p-8 sm:p-10 flex flex-col justify-center gap-4">
              {[
                "Fully custom design — no templates",
                "Mobile-first, lightning-fast performance",
                "SEO-optimized from day one",
                "Delivered in as little as 8 days",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-neon-cyan/15 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                  </div>
                  <span className="text-foreground/80 text-sm">{point}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-border/30">
                <span className="inline-flex items-center gap-1.5 text-neon-cyan text-sm font-semibold">
                  Our flagship service <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Remaining 5 cards in a 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((service, i) => (
            <AnimatedSection key={service.title} delay={(i + 1) * 80}>
              <div className="card-glass rounded-2xl p-6 sm:p-7 h-full group cursor-default transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      service.color === "cyan"
                        ? "bg-neon-cyan/10 text-neon-cyan group-hover:bg-neon-cyan/20 group-hover:shadow-neon-sm"
                        : "bg-neon-purple/10 text-neon-purple group-hover:bg-neon-purple/20 group-hover:shadow-purple-sm"
                    }`}
                  >
                    <service.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-4xl font-display font-black leading-none select-none ${service.color === "cyan" ? "text-neon-cyan/6" : "text-neon-purple/6"}`}
                  >
                    {String(i + 2).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-foreground mb-2.5">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
                <div
                  className={`mt-5 h-px w-0 group-hover:w-full transition-all duration-500 rounded-full ${
                    service.color === "cyan"
                      ? "bg-gradient-to-r from-neon-cyan to-transparent"
                      : "bg-gradient-to-r from-neon-purple to-transparent"
                  }`}
                />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Portfolio Section ─────────────────────────────────────────────
const PORTFOLIO_ITEMS = [
  {
    title: "Business Website Project",
    description:
      "A stunning, conversion-optimized business website built for maximum impact. Features modern design, seamless UX, and mobile-first responsiveness.",
    link: "https://my-site-1sq8ek0o-advssrajawat.wix-vibe-site.com/",
    gradient: "from-neon-cyan/20 via-neon-cyan/5 to-transparent",
    accent: "text-neon-cyan",
    tag: "Business",
  },
  {
    title: "Saree Mumbai E-commerce Website",
    description:
      "A beautiful e-commerce platform for a premium saree brand. Elegant design that showcases products beautifully while driving online sales.",
    link: "https://saree-mumbai-1.preview.emergentagent.com/",
    gradient: "from-neon-purple/20 via-neon-purple/5 to-transparent",
    accent: "text-neon-purple",
    tag: "E-commerce",
  },
];

const NAV_WIDTHS = [
  { w: 28, id: "n1" },
  { w: 22, id: "n2" },
  { w: 24, id: "n3" },
  { w: 20, id: "n4" },
];

// Wireframe mockup preview for portfolio cards
function WebsiteWireframe({ index }: { index: number }) {
  const isCyan = index === 0;
  const color = isCyan ? "oklch(0.72 0.18 210" : "oklch(0.65 0.22 290";
  return (
    <div className="absolute inset-0 p-4 flex flex-col gap-2 pointer-events-none select-none overflow-hidden">
      {/* Nav bar */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-16 h-2.5 rounded-sm opacity-30"
          style={{ background: `${color})` }}
        />
        <div className="flex-1" />
        {NAV_WIDTHS.map(({ w, id }) => (
          <div
            key={id}
            className="h-2 rounded-sm bg-white/10"
            style={{ width: `${w}px` }}
          />
        ))}
        <div
          className="w-16 h-6 rounded opacity-20 shrink-0"
          style={{ background: `${color} / 0.5)` }}
        />
      </div>
      {/* Hero block */}
      <div
        className="flex-1 rounded-lg flex flex-col justify-center gap-2 px-3"
        style={{ background: `${color} / 0.04)` }}
      >
        <div
          className="w-3/4 h-4 rounded opacity-25"
          style={{ background: `${color})` }}
        />
        <div className="w-1/2 h-3 rounded bg-white/10" />
        <div className="w-2/3 h-2.5 rounded bg-white/8" />
        <div className="flex gap-2 mt-1">
          <div
            className="w-20 h-6 rounded opacity-30"
            style={{ background: `${color} / 0.6)` }}
          />
          <div className="w-20 h-6 rounded border border-white/15" />
        </div>
      </div>
      {/* Content row */}
      <div className="grid grid-cols-3 gap-2 shrink-0">
        {[0, 1, 2].map((j) => (
          <div
            key={j}
            className="rounded-md p-2 flex flex-col gap-1.5"
            style={{
              background: `${color} / 0.05)`,
              border: `1px solid ${color} / 0.1)`,
            }}
          >
            <div
              className="w-5 h-5 rounded opacity-20"
              style={{ background: `${color})` }}
            />
            <div className="w-full h-1.5 rounded bg-white/10" />
            <div className="w-3/4 h-1.5 rounded bg-white/7" />
          </div>
        ))}
      </div>
      {/* Footer strip */}
      <div className="h-5 rounded bg-white/4 shrink-0 flex items-center px-2 gap-3">
        <div className="w-12 h-1.5 rounded bg-white/15" />
        <div className="flex-1" />
        <div className="w-6 h-1.5 rounded bg-white/10" />
        <div className="w-6 h-1.5 rounded bg-white/10" />
        <div className="w-6 h-1.5 rounded bg-white/10" />
      </div>
    </div>
  );
}

function PortfolioSection() {
  return (
    <section id="portfolio" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-1/50 to-transparent" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Split heading: oversized ghost number + main title */}
        <AnimatedSection className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <span className="text-neon-cyan text-xs font-semibold uppercase tracking-[0.2em] mb-3 block">
                Client Projects
              </span>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[0.95]">
                <span className="text-foreground">Our </span>
                <span
                  className="text-foreground/10 font-black"
                  style={{
                    WebkitTextStroke: "1px oklch(0.72 0.18 210 / 0.4)",
                  }}
                >
                  Work
                </span>
                <span className="gradient-text"> /</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xs text-right hidden sm:block">
              50+ sites delivered worldwide
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-12" delay={100}>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
            Nextgen Webworks has created{" "}
            <span className="text-neon-cyan font-semibold">50+ websites</span>{" "}
            for businesses worldwide. Below are two of our best and most
            successful projects.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PORTFOLIO_ITEMS.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 150}>
              <div
                data-ocid={`portfolio.item.${i + 1}`}
                className="card-glass rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500"
              >
                {/* Realistic wireframe preview */}
                <div
                  className={`relative h-56 sm:h-64 bg-gradient-to-br ${project.gradient} border-b border-border/20 overflow-hidden`}
                >
                  {/* Subtle grid */}
                  <div className="absolute inset-0 grid-bg opacity-20" />
                  {/* Wireframe content */}
                  <WebsiteWireframe index={i} />
                  {/* Hover overlay lifts inner content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/10 transition-all duration-500" />
                  {/* Browser chrome top bar */}
                  <div className="absolute top-3 left-3 right-3 h-7 rounded-md bg-black/40 backdrop-blur-sm border border-white/8 flex items-center px-3 gap-1.5 z-10">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    <div className="flex-1 h-3.5 rounded-sm bg-white/8 ml-2 text-[9px] text-white/30 flex items-center px-2 overflow-hidden font-mono tracking-tight">
                      {project.link.replace("https://", "").slice(0, 40)}
                    </div>
                  </div>
                  {/* Project number — top right corner design element */}
                  <div
                    className={`absolute bottom-3 left-4 font-display font-black text-6xl leading-none select-none opacity-[0.06] ${project.accent}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Tag */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${
                        i === 0
                          ? "border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan"
                          : "border-neon-purple/30 bg-neon-purple/10 text-neon-purple"
                      }`}
                    >
                      {project.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <h3 className="font-display font-bold text-xl text-foreground mb-2.5">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`portfolio.visit_button.${i + 1}`}
                  >
                    <Button
                      variant="outline"
                      className={`btn-outline-glow font-semibold group/btn ${
                        i === 0
                          ? "border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
                          : "border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10"
                      }`}
                    >
                      Visit Website
                      <ExternalLink className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Button>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Stats Section ─────────────────────────────────────────────────
const STATS = [
  { icon: Globe, value: 50, suffix: "+", label: "Websites Created" },
  { icon: TrendingUp, value: 20, suffix: "+", label: "Countries Served" },
  { icon: Users, value: 100, suffix: "+", label: "Happy Clients" },
  { icon: Clock, value: 8, suffix: " Days", label: "Avg. Delivery" },
];

// Individual stat card with its own counter
function StatCard({
  stat,
  visible,
}: {
  stat: (typeof STATS)[0];
  visible: boolean;
}) {
  const count = useCounter(stat.value, visible);
  return (
    <div className="card-glass rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 relative">
      {/* Accent top bar — unique signature detail */}
      <div className="h-0.5 w-full bg-gradient-to-r from-neon-cyan/60 via-neon-purple/40 to-transparent" />
      <div className="p-6 sm:p-8 text-center">
        <div className="w-11 h-11 rounded-xl bg-neon-cyan/10 text-neon-cyan flex items-center justify-center mx-auto mb-4 group-hover:bg-neon-cyan/20 group-hover:shadow-neon-sm transition-all duration-300">
          <stat.icon className="w-5 h-5" />
        </div>
        <div className="font-display font-extrabold text-4xl sm:text-5xl gradient-text mb-1.5 tabular-nums">
          {count}
          {stat.suffix}
        </div>
        <div className="text-muted-foreground text-sm font-medium">
          {stat.label}
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  const { ref, visible } = useScrollAnimation();

  return (
    <section id="stats" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-2/80 to-surface-1/60" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Glow orbs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 -translate-y-1/2 bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 -translate-y-1/2 bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Oversized watermark number behind heading — signature detail */}
        <AnimatedSection className="mb-16 relative">
          <div
            className="absolute -top-6 left-0 font-display font-black text-[clamp(80px,15vw,160px)] leading-none select-none pointer-events-none"
            style={{
              WebkitTextStroke: "1px oklch(0.72 0.18 210 / 0.08)",
              color: "transparent",
            }}
          >
            100+
          </div>
          <div className="relative z-10">
            <span className="text-neon-cyan text-xs font-semibold uppercase tracking-[0.2em] mb-3 block">
              Our Track Record
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-foreground leading-[0.95] mb-4">
              Numbers That <span className="gradient-text">Speak</span>
            </h2>
          </div>
        </AnimatedSection>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} visible={visible} />
          ))}
        </div>

        <AnimatedSection delay={200}>
          <div className="card-glass rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto">
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Our clients come from{" "}
              <span className="text-neon-cyan font-semibold">India</span>,{" "}
              <span className="text-neon-cyan font-semibold">Europe</span>,{" "}
              <span className="text-neon-cyan font-semibold">America</span>, and
              parts of{" "}
              <span className="text-neon-cyan font-semibold">Africa</span>,
              helping businesses grow globally.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ── Reviews Section ───────────────────────────────────────────────
const REVIEWS = [
  {
    name: "John Taylor",
    rating: 4.9,
    review:
      "Nextgen Webworks built an amazing website for our business. The design is modern and the process was very smooth.",
    country: "USA",
    initials: "JT",
  },
  {
    name: "Riya Sharma",
    rating: 5,
    review:
      "The best website development team I have worked with. Fast delivery and excellent support.",
    country: "India",
    initials: "RS",
  },
  {
    name: "Vedik Shrivastav",
    rating: 4.8,
    review:
      "Professional team with great attention to detail. Our website looks incredible.",
    country: "India",
    initials: "VS",
  },
  {
    name: "Brendon Johnson",
    rating: 5,
    review:
      "They delivered a high-quality website that helped our business look more professional online.",
    country: "UK",
    initials: "BJ",
  },
];

function ReviewsSection() {
  return (
    <section id="reviews" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 dot-bg opacity-20" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Editorial: rating score lives left, heading right — asymmetric composition */}
        <AnimatedSection className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-end">
            {/* Big score block */}
            <div className="flex flex-col items-start">
              <div className="font-display font-black text-[80px] sm:text-[100px] leading-none gradient-text">
                4.9
              </div>
              <div className="flex items-center gap-2 -mt-2">
                <StarRating rating={5} />
                <span className="text-muted-foreground text-sm">/ 5</span>
              </div>
              <span className="text-muted-foreground text-xs mt-1.5 font-medium">
                Average client rating
              </span>
            </div>
            {/* Heading */}
            <div className="pb-2">
              <span className="text-neon-cyan text-xs font-semibold uppercase tracking-[0.2em] mb-3 block">
                Client Reviews
              </span>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-foreground leading-[0.95]">
                What Our <span className="gradient-text-purple">Clients</span>
                <br />
                Say
              </h2>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((review, i) => (
            <AnimatedSection key={review.name} delay={i * 100}>
              <div className="card-glass rounded-2xl p-6 sm:p-8 h-full group hover:-translate-y-1 transition-all duration-300">
                {/* Quote */}
                <div className="text-5xl text-neon-cyan/20 font-display font-bold leading-none mb-4 select-none">
                  "
                </div>
                <p className="text-muted-foreground text-base leading-relaxed mb-6">
                  {review.review}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 flex items-center justify-center border border-neon-cyan/20 text-xs font-bold text-neon-cyan">
                      {review.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {review.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {review.country}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <StarRating rating={review.rating} />
                    <div className="text-xs text-amber-400 font-semibold mt-1">
                      {review.rating} / 5
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Order Section ─────────────────────────────────────────────────
function OrderSection() {
  const { actor } = useActor();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    country: "",
    serviceType: "" as ServiceType | "",
    businessType: "" as BusinessType | "",
    featuresRequired: "",
    designStyle: "" as DesignStyle | "",
    budgetRange: "" as BudgetRange | "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Not connected to backend.");
      return;
    }
    if (
      !form.serviceType ||
      !form.businessType ||
      !form.designStyle ||
      !form.budgetRange
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      const features = form.featuresRequired
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      await actor.submitProjectRequest({
        id: crypto.randomUUID(),
        name: form.name,
        email: form.email,
        businessName: form.businessName,
        country: form.country,
        serviceType: form.serviceType as ServiceType,
        businessType: form.businessType as BusinessType,
        featuresRequired: features,
        serviceDetails: [],
        designStyle: form.designStyle as DesignStyle,
        budgetRange: form.budgetRange as BudgetRange,
        owner: {} as never,
        timestamp: BigInt(Date.now()),
      });

      setStatus("success");
      toast.success(
        "Project request submitted! We'll be in touch within 24 hours.",
      );
      setForm({
        name: "",
        email: "",
        businessName: "",
        country: "",
        serviceType: "",
        businessType: "",
        featuresRequired: "",
        designStyle: "",
        budgetRange: "",
      });
    } catch {
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-2/60 to-surface-1/40" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <AnimatedSection className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface-2 text-muted-foreground text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5 text-neon-cyan" />
            Start Your Project
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl gradient-text mb-4">
            Order Your Website
          </h2>
          <p className="text-muted-foreground text-lg">
            Tell us about your project and we'll get back to you within{" "}
            <span className="text-neon-cyan font-semibold">24 hours</span>.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <form
            onSubmit={handleSubmit}
            className="card-glass rounded-3xl p-6 sm:p-10 space-y-6"
          >
            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="order-name"
                  className="text-foreground/80 text-sm font-medium"
                >
                  Full Name *
                </Label>
                <Input
                  id="order-name"
                  data-ocid="order.name.input"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-surface-3/50 border-border/50 focus:border-neon-cyan/50 focus:ring-neon-cyan/20 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="order-email"
                  className="text-foreground/80 text-sm font-medium"
                >
                  Email Address *
                </Label>
                <Input
                  id="order-email"
                  data-ocid="order.email.input"
                  type="email"
                  placeholder="john@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-surface-3/50 border-border/50 focus:border-neon-cyan/50 h-11"
                />
              </div>
            </div>

            {/* Row 2: Business Name + Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="order-business"
                  className="text-foreground/80 text-sm font-medium"
                >
                  Business Name *
                </Label>
                <Input
                  id="order-business"
                  data-ocid="order.business_name.input"
                  placeholder="Your Company Ltd."
                  value={form.businessName}
                  onChange={(e) =>
                    setForm({ ...form, businessName: e.target.value })
                  }
                  required
                  className="bg-surface-3/50 border-border/50 focus:border-neon-cyan/50 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="order-country"
                  className="text-foreground/80 text-sm font-medium"
                >
                  Country *
                </Label>
                <Input
                  id="order-country"
                  data-ocid="order.country.input"
                  placeholder="United States"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  required
                  className="bg-surface-3/50 border-border/50 focus:border-neon-cyan/50 h-11"
                />
              </div>
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">
                Type of Service *
              </Label>
              <Select
                value={form.serviceType}
                onValueChange={(v) =>
                  setForm({ ...form, serviceType: v as ServiceType })
                }
              >
                <SelectTrigger
                  data-ocid="order.service_type.select"
                  className="bg-surface-3/50 border-border/50 h-11"
                >
                  <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={ServiceType.webDevelopment}>
                    Website Making
                  </SelectItem>
                  <SelectItem value={ServiceType.other}>
                    AI Receptionist
                  </SelectItem>
                  <SelectItem value={ServiceType.consulting}>
                    AI Assistant
                  </SelectItem>
                  <SelectItem value={ServiceType.branding}>
                    Website Editing & Redesign
                  </SelectItem>
                  <SelectItem value={ServiceType.graphicDesign}>
                    Social Media Management
                  </SelectItem>
                  <SelectItem value={ServiceType.other}>
                    Video Ads Creation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Row: Business Type + Design Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">
                  Type of Business *
                </Label>
                <Select
                  value={form.businessType}
                  onValueChange={(v) =>
                    setForm({ ...form, businessType: v as BusinessType })
                  }
                >
                  <SelectTrigger
                    data-ocid="order.business_type.select"
                    className="bg-surface-3/50 border-border/50 h-11"
                  >
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value={BusinessType.startup}>
                      Startup
                    </SelectItem>
                    <SelectItem value={BusinessType.smallBusiness}>
                      Small Business
                    </SelectItem>
                    <SelectItem value={BusinessType.enterprise}>
                      Enterprise
                    </SelectItem>
                    <SelectItem value={BusinessType.nonProfit}>
                      Non-Profit
                    </SelectItem>
                    <SelectItem value={BusinessType.individual}>
                      Individual
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">
                  Design Style *
                </Label>
                <Select
                  value={form.designStyle}
                  onValueChange={(v) =>
                    setForm({ ...form, designStyle: v as DesignStyle })
                  }
                >
                  <SelectTrigger
                    data-ocid="order.design_style.select"
                    className="bg-surface-3/50 border-border/50 h-11"
                  >
                    <SelectValue placeholder="Select style..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value={DesignStyle.modern}>Modern</SelectItem>
                    <SelectItem value={DesignStyle.minimalist}>
                      Minimalist
                    </SelectItem>
                    <SelectItem value={DesignStyle.professional}>
                      Professional
                    </SelectItem>
                    <SelectItem value={DesignStyle.playful}>Playful</SelectItem>
                    <SelectItem value={DesignStyle.classic}>Classic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm font-medium">
                Budget Range *
              </Label>
              <Select
                value={form.budgetRange}
                onValueChange={(v) =>
                  setForm({ ...form, budgetRange: v as BudgetRange })
                }
              >
                <SelectTrigger
                  data-ocid="order.budget_range.select"
                  className="bg-surface-3/50 border-border/50 h-11"
                >
                  <SelectValue placeholder="Select budget..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={BudgetRange.low}>
                    Low ($500 – $1,500)
                  </SelectItem>
                  <SelectItem value={BudgetRange.medium}>
                    Medium ($1,500 – $5,000)
                  </SelectItem>
                  <SelectItem value={BudgetRange.high}>
                    High ($5,000+)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label
                htmlFor="order-features"
                className="text-foreground/80 text-sm font-medium"
              >
                Features Required
              </Label>
              <Textarea
                id="order-features"
                data-ocid="order.features.textarea"
                placeholder="e.g. Contact form, Live chat, E-commerce, Blog, Portfolio..."
                value={form.featuresRequired}
                onChange={(e) =>
                  setForm({ ...form, featuresRequired: e.target.value })
                }
                rows={3}
                className="bg-surface-3/50 border-border/50 focus:border-neon-cyan/50 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Separate features with commas
              </p>
            </div>

            {/* Status messages */}
            {status === "success" && (
              <div
                data-ocid="order.success_state"
                className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              >
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">
                  Request submitted! We'll get back to you within 24 hours.
                </span>
              </div>
            )}
            {status === "error" && (
              <div
                data-ocid="order.error_state"
                className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">
                  Something went wrong. Please try again.
                </span>
              </div>
            )}

            {/* Submit */}
            <Button
              data-ocid="order.submit_button"
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full btn-primary-glow text-primary-foreground font-bold h-12 rounded-xl text-base shadow-neon-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Project Request
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ── About Section ─────────────────────────────────────────────────
const FOUNDERS = [
  {
    name: "Vinay",
    role: "Co-Founder & CEO",
    description:
      "Visionary entrepreneur passionate about technology and digital innovation.",
    initials: "V",
    color: "cyan",
  },
  {
    name: "Bhavya",
    role: "Co-Founder & Creative Director",
    description:
      "Creative strategist focused on modern design, branding, and user experience.",
    initials: "B",
    color: "purple",
  },
  {
    name: "Aarav",
    role: "Co-Founder & CTO",
    description:
      "Technical expert specializing in web development and AI-based solutions.",
    initials: "A",
    color: "cyan",
  },
];

function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 dot-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <AnimatedSection className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div>
              <span className="text-neon-cyan text-xs font-semibold uppercase tracking-[0.2em] mb-3 block">
                Who We Are
              </span>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-foreground leading-[0.95] mb-6">
                About <br className="hidden sm:block" />
                <span className="gradient-text">Nextgen</span>
                <span
                  className="font-black"
                  style={{
                    WebkitTextStroke: "1px oklch(0.72 0.18 210 / 0.5)",
                    color: "transparent",
                  }}
                >
                  {" Webworks"}
                </span>
              </h2>
            </div>
            <div className="lg:pt-14">
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Nextgen Webworks is a modern digital agency focused on building
                high-quality websites and AI-powered solutions for businesses
                around the world. Our mission is to help brands grow online with
                powerful websites, intelligent automation, and creative digital
                strategies.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FOUNDERS.map((founder, i) => (
            <AnimatedSection key={founder.name} delay={i * 120}>
              <div className="card-glass rounded-2xl p-6 sm:p-8 text-center group hover:-translate-y-1 transition-all duration-300 h-full">
                {/* Avatar */}
                <div
                  className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-xl font-display font-bold border transition-all duration-300 ${
                    founder.color === "cyan"
                      ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 group-hover:bg-neon-cyan/20 group-hover:shadow-neon-sm"
                      : "bg-neon-purple/10 text-neon-purple border-neon-purple/20 group-hover:bg-neon-purple/20 group-hover:shadow-purple-sm"
                  }`}
                >
                  {founder.initials}
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-1">
                  {founder.name}
                </h3>
                <p
                  className={`text-xs font-semibold mb-4 ${
                    founder.color === "cyan"
                      ? "text-neon-cyan"
                      : "text-neon-purple"
                  }`}
                >
                  {founder.role}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {founder.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact Section ───────────────────────────────────────────────
function ContactSection() {
  const { actor } = useActor();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Not connected to backend.");
      return;
    }
    setLoading(true);
    setStatus("idle");
    try {
      await actor.submitContactMessage({
        id: crypto.randomUUID(),
        name: form.name,
        email: form.email,
        message: form.message,
        owner: {} as never,
        timestamp: BigInt(Date.now()),
      });
      setStatus("success");
      toast.success("Message sent! We'll respond shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { icon: Twitter, label: "Twitter/X", href: "https://x.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me" },
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-1/60 to-surface-2/80" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />

      {/* Glow orbs */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-cyan/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Info */}
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface-2 text-muted-foreground text-sm font-medium mb-6">
              <Mail className="w-3.5 h-3.5 text-neon-cyan" />
              Get In Touch
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl gradient-text mb-5">
              Start Your Project Today
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
              Ready to take your business to the next level? Let's build
              something amazing together.
            </p>

            {/* Email */}
            <a
              href="mailto:contact@nextgenwebworks.com"
              className="flex items-center gap-3 p-4 card-glass rounded-xl hover:border-neon-cyan/40 transition-all duration-300 mb-6 group"
            >
              <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center text-neon-cyan group-hover:bg-neon-cyan/20 transition-all">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">
                  Email us at
                </div>
                <div className="text-foreground font-semibold text-sm">
                  contact@nextgenwebworks.com
                </div>
              </div>
            </a>

            {/* Social links */}
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-4">
                Follow us on social media
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 card-glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/40 transition-all duration-300"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right: Form */}
          <AnimatedSection delay={150}>
            <form
              onSubmit={handleSubmit}
              className="card-glass rounded-3xl p-6 sm:p-8 space-y-5"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="contact-name"
                  className="text-foreground/80 text-sm font-medium"
                >
                  Name *
                </Label>
                <Input
                  id="contact-name"
                  data-ocid="contact.name.input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-surface-3/50 border-border/50 focus:border-neon-cyan/50 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="contact-email"
                  className="text-foreground/80 text-sm font-medium"
                >
                  Email *
                </Label>
                <Input
                  id="contact-email"
                  data-ocid="contact.email.input"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-surface-3/50 border-border/50 focus:border-neon-cyan/50 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="contact-message"
                  className="text-foreground/80 text-sm font-medium"
                >
                  Message *
                </Label>
                <Textarea
                  id="contact-message"
                  data-ocid="contact.message.textarea"
                  placeholder="Tell us about your project..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  rows={4}
                  className="bg-surface-3/50 border-border/50 focus:border-neon-cyan/50 resize-none"
                />
              </div>

              {status === "success" && (
                <div
                  data-ocid="contact.success_state"
                  className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                >
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">
                    Message sent! We'll get back to you shortly.
                  </span>
                </div>
              )}
              {status === "error" && (
                <div
                  data-ocid="contact.error_state"
                  className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">
                    Failed to send. Please try again.
                  </span>
                </div>
              )}

              <Button
                data-ocid="contact.submit_button"
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full btn-primary-glow text-primary-foreground font-bold h-12 rounded-xl text-base shadow-neon-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/30 bg-surface-1/80 backdrop-blur-md">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-neon-sm">
                <Zap className="w-4 h-4 text-primary-foreground fill-current" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">
                Nextgen Webworks
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Next-Generation Websites for Modern Brands. Building powerful
              digital experiences that convert.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-foreground/80 text-sm mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                "services",
                "portfolio",
                "stats",
                "reviews",
                "order",
                "about",
                "contact",
              ].map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(id)}
                    className="text-muted-foreground hover:text-neon-cyan text-sm capitalize transition-colors duration-200"
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground/80 text-sm mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <a
              href="mailto:contact@nextgenwebworks.com"
              className="text-muted-foreground hover:text-neon-cyan text-sm transition-colors duration-200 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              contact@nextgenwebworks.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {year} Nextgen Webworks. All rights reserved.</p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neon-cyan transition-colors duration-200"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" theme="dark" />
      <Navbar />
      <main>
        <HeroSection />
        <div className="h-px section-divider" />
        <ServicesSection />
        <div className="h-px section-divider" />
        <PortfolioSection />
        <div className="h-px section-divider" />
        <StatsSection />
        <div className="h-px section-divider" />
        <ReviewsSection />
        <div className="h-px section-divider" />
        <OrderSection />
        <div className="h-px section-divider" />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
