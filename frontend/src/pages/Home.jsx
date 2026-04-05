import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal, useParallax } from '../hooks/useGsap';
import { ArrowRight } from 'lucide-react';
import StatsSection from '../components/common/StatsSection';

gsap.registerPlugin(ScrollTrigger);

const IMGS = {
  collab: 'https://images.pexels.com/photos/12741849/pexels-photo-12741849.jpeg',
  campus: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=85',
};

const STEPS = [
  {
    num: '01', icon: '✦', title: 'Build your profile',
    desc: 'List the skills you offer and the ones you need. Add portfolio work to show what you can do.',
    img: 'https://images.pexels.com/photos/7662057/pexels-photo-7662057.jpeg',
    accent: '#b85c38',
    tag: 'Your Identity',
  },
  {
    num: '02', icon: '◈', title: 'Find your match',
    desc: 'Browse thousands of listings. Filter by skill, category, or location. AI suggests best fits.',
    img: 'https://images.pexels.com/photos/5739231/pexels-photo-5739231.jpeg',
    accent: '#c97d50',
    tag: 'Smart Discovery',
  },
  {
    num: '03', icon: '⇄', title: 'Send a barter',
    desc: 'No money changes hands. Propose a trade — your skill for theirs. Simple, direct, fair.',
    img: 'https://images.pexels.com/photos/31377034/pexels-photo-31377034.jpeg',
    accent: '#d4956a',
    tag: 'Zero Cash',
  },
  {
    num: '04', icon: '★', title: 'Grow together',
    desc: 'Complete trades, grow your network, and build your trust score. A reputation that opens every door.',
    img: 'https://images.pexels.com/photos/9630217/pexels-photo-9630217.jpeg',
    accent: '#e0a882',
    tag: 'Real Impact',
  },
];

const CATEGORIES = [
  { label: 'Coding', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&q=80', count: 420 },
  { label: 'Design', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80', count: 315 },
  { label: 'Music', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80', count: 198 },
  { label: 'Writing', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80', count: 267 },
  { label: 'Teaching', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80', count: 341 },
  { label: 'Video', img: 'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=500&q=80', count: 156 },
];

const TESTIMONIALS = [
  { name: 'Priya S.', college: 'IIT Delhi', skill: 'UI Design', text: 'I traded logo design for Python tutoring. Best swap ever — my grades shot up and I built a real portfolio at the same time.' },
  { name: 'Marcus T.', college: 'Stanford', skill: 'Video Editing', text: 'Bartered three YouTube edits for a complete app prototype. Zero cash, maximum value. This platform changed how I think about skills.' },
  { name: 'Ananya K.', college: 'NIT Trichy', skill: 'Copywriting', text: 'Got a full website built in exchange for ten blog posts. The quality blew me away. Bartr makes collaboration feel human again.' },
];

const LIVE_TRADES = [
  { a: 'React Dev', b: 'Logo Design' },
  { a: 'Music Mix', b: 'Python Help' },
  { a: 'UI/UX Design', b: 'Video Edit' },
  { a: 'Copywriting', b: 'App Dev' },
];

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => { setIdx(i => (i + 1) % LIVE_TRADES.length); setShow(true); }, 360);
    }, 2800);
    return () => clearInterval(id);
  }, []);
  const t = LIVE_TRADES[idx];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '12px',
      background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.18)', borderRadius: '999px',
      padding: '10px 22px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80', opacity: .75, animation: 'livePing 1.2s cubic-bezier(0,0,.2,1) infinite' }} />
        <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'block' }} />
      </span>
      <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '9px', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Live trade</span>
      <div style={{ transition: 'opacity .36s,transform .36s', opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(-7px)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontFamily: 'Playfair Display,serif', fontWeight: 700, color: '#fff', fontSize: '14px' }}>{t.a}</span>
        <span style={{ color: '#b85c38', fontWeight: 900, margin: '0 6px', fontSize: '16px' }}>⇄</span>
        <span style={{ fontFamily: 'Playfair Display,serif', fontWeight: 700, color: '#fff', fontSize: '14px' }}>{t.b}</span>
      </div>
    </div>
  );
}

export default function Home() {
  useReveal();

  const ctaBgRef = useRef(null);
  const aboutImgRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnsRef = useRef(null);
  const heroEyeRef = useRef(null);

  useParallax(ctaBgRef, 0.22);
  useParallax(aboutImgRef, 0.20);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(heroEyeRef.current,
      { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: .7, ease: 'power3.out' })
      .fromTo(heroTitleRef.current.children,
        { opacity: 0, y: 80, skewY: 4 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, stagger: .14, ease: 'power4.out' }, '-=0.3')
      .fromTo(heroSubRef.current,
        { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=0.5')
      .fromTo(heroBtnsRef.current,
        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, '-=0.4');

    const stepCards = gsap.utils.toArray('.step-card');
    stepCards.forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 120 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' }
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="bg-cream">
      <style>{`
        @keyframes livePing  { 75%,100%{ transform:scale(2); opacity:0; } }
        @keyframes scrollBounce { 0%,100%{ transform:translateY(0); opacity:.5;} 50%{ transform:translateY(7px); opacity:1;} }
        @keyframes scrollX   { 0%{ transform:translateX(0);} 100%{ transform:translateX(-50%);} }

        .hero-video { position:absolute; inset:0; z-index:0; overflow:hidden; }
        .hero-video video { width:100%; height:100%; object-fit:cover; filter:blur(4px) brightness(0.5) saturate(1.15); transform:scale(1.07); }

        .btn-rust { display:inline-flex; align-items:center; gap:10px; background:#b85c38; color:#fff; font-weight:700; padding:16px 32px; border-radius:999px; font-size:15px; text-decoration:none; transition:background .3s,box-shadow .3s,transform .2s; }
        .btn-rust:hover { background:#fff; color:#1a1510; box-shadow:0 0 40px rgba(184,92,56,.45); transform:translateY(-2px); }
        .btn-icon { width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; transition:background .3s,transform .3s; }
        .btn-rust:hover .btn-icon { background:rgba(26,21,16,0.1); transform:translateX(3px); }

        .video-section { background:#0e0d0b; padding:100px 48px; position:relative; overflow:hidden; }
        .video-section::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(184,92,56,0.07) 0%,transparent 70%); pointer-events:none; }
        .video-frame { border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,0.07); box-shadow:0 32px 96px rgba(0,0,0,0.6),0 0 0 1px rgba(184,92,56,0.10); }

        .about-cta-link:hover .about-bar  { width: 52px !important; }
        .about-cta-link:hover .about-arrow { background: rgba(184,92,56,0.15) !important; border-color: rgba(184,92,56,0.8) !important; }

        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-img-col { min-height: 320px; }
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <div className="hero-video">
          <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=90">
            <source src="/Videos/videoo.mp4" type="video/mp4" />
          </video>
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(105deg,rgba(26,21,16,0.92) 0%,rgba(26,21,16,0.72) 45%,rgba(26,21,16,0.28) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top,rgba(26,21,16,0.75) 0%,transparent 55%)' }} />
        <div style={{ position: 'absolute', zIndex: 1, width: '600px', height: '600px', borderRadius: '50%', top: '5%', left: '-8%', background: 'radial-gradient(circle,rgba(184,92,56,0.13) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', maxWidth: '900px', padding: 'clamp(110px,14vw,160px) clamp(24px,6vw,80px) 80px' }}>
          <p ref={heroEyeRef} style={{ fontFamily: 'DM Mono,monospace', fontSize: '11px', letterSpacing: '.25em', textTransform: 'uppercase', color: 'rgba(184,92,56,1)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', opacity: 0 }}>
            <span style={{ display: 'inline-block', width: '42px', height: '1px', background: 'linear-gradient(90deg,#b85c38,transparent)' }} />
            No Money. Just Skills.
          </p>

          <h1 ref={heroTitleRef} style={{ fontFamily: 'Playfair Display,serif', fontWeight: 900, lineHeight: .9, color: '#fff', marginBottom: '32px', fontSize: 'clamp(64px,9vw,124px)' }}>
            <span style={{ display: 'block' }}>Trade</span>
            <span style={{ display: 'block', fontStyle: 'italic', background: 'linear-gradient(90deg,#b85c38,#ff9966)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Skills,</span>
            <span style={{ display: 'block', position: 'relative' }}>
              Not Cash.
              <span style={{ position: 'absolute', left: 0, bottom: '-10px', width: '60%', height: '2px', background: 'linear-gradient(90deg,#b85c38,transparent)', filter: 'blur(1px)' }} />
            </span>
          </h1>

          <p ref={heroSubRef} style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(15px,1.4vw,18px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', maxWidth: '520px', marginBottom: '44px', opacity: 0 }}>
            Connect with students across colleges. Exchange expertise —{' '}
            <span style={{ color: '#fff', fontWeight: 500 }}>coding, design, music, writing</span>{' '}
            — without spending a single rupee.
          </p>

          <div ref={heroBtnsRef} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '50px', opacity: 0 }}>
            <Link to="/signup" style={{ padding: '14px 26px', borderRadius: '999px', background: 'linear-gradient(135deg,#b85c38,#ff9966)', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', boxShadow: '0 10px 30px rgba(184,92,56,0.35)', transition: 'all .25s ease' }}>
              Start Bartering <ArrowRight size={16} />
            </Link>
            <Link to="/listings" style={{ padding: '13px 24px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.05)', transition: 'all .25s ease' }}>
              Browse Skills
            </Link>
          </div>

          <div style={{ position: 'absolute', top: '20%', right: '-120px', width: '300px', height: '300px', background: 'radial-gradient(circle,#b85c38,transparent 70%)', filter: 'blur(120px)', opacity: 0.25, pointerEvents: 'none' }} />
          <LiveTicker />
        </div>

        <div className="hidden lg:block" style={{ position: 'absolute', bottom: '48px', right: '48px', zIndex: 4, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '20px', padding: '20px 28px', textAlign: 'center', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}>
          <p style={{ fontFamily: 'Playfair Display,serif', fontWeight: 900, color: '#fff', fontSize: '36px', lineHeight: 1 }}>4.9</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', margin: '8px 0 6px' }}>
            {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#b85c38', fontSize: '13px' }}>{s}</span>)}
          </div>
          <p style={{ fontFamily: 'DM Mono,monospace', fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Trust Score</p>
        </div>

        <div className="hidden lg:flex" style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 4 }}>
          <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '9px', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Scroll</span>
          <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom,rgba(255,255,255,0.3),transparent)', animation: 'scrollBounce 1.9s ease-in-out infinite' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', zIndex: 4, background: 'linear-gradient(90deg,transparent,rgba(184,92,56,.5),transparent)' }} />
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div style={{ position: 'relative', background: 'linear-gradient(90deg,#b85c38,#d96b45,#b85c38)', padding: '16px 0', overflow: 'hidden', display: 'flex' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to right,#0d0d0d,transparent)', zIndex: 2 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to left,#0d0d0d,transparent)', zIndex: 2 }} />
        <div style={{ display: 'flex', width: 'max-content', animation: 'scrollX 20s linear infinite' }}>
          {[...Array(2)].flatMap(() =>
            ['Design', 'Code', 'Teach', 'Music', 'Video', 'Write', 'Market', 'Translate', 'Finance', 'Animate'].map((w, i) => (
              <span key={`${w}${i}`} style={{ fontFamily: 'Playfair Display,serif', fontStyle: 'italic', color: '#fff', fontSize: '18px', whiteSpace: 'nowrap', padding: '0 36px', display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.9 }}>
                <span style={{ width: '18px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                {w}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <StatsSection />

      {/* ═══ ABOUT ═══ */}
      <section className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '70vh', background: '#111008', position: 'relative', overflow: 'hidden' }}>

        {/* ambient glow */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(184,92,56,0.08) 0%,transparent 65%)', top: -150, left: -100, pointerEvents: 'none', zIndex: 0 }} />

        {/* LEFT */}
        <div className="sr" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(48px,7vw,80px) clamp(32px,5vw,64px)', zIndex: 2 }}>

          {/* vertical gold divider */}
          <div style={{ position: 'absolute', right: 0, top: '10%', bottom: '10%', width: 1, background: 'linear-gradient(180deg,transparent,rgba(184,92,56,0.3) 40%,rgba(184,92,56,0.5) 60%,transparent)' }} />

          <p className="sr" style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b85c38', marginBottom: 28 }}>
            <span style={{ width: 32, height: 1, background: 'linear-gradient(90deg,#b85c38,transparent)', display: 'inline-block' }} />
            Our Story
          </p>

          <h2 className="sr delay-1" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(36px,3.5vw,52px)', lineHeight: 1.05, color: '#f5eedc', marginBottom: 28 }}>
            Skills are the<br />
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#b85c38,#e8845a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>new currency.</em>
          </h2>

          <p className="sr delay-2" style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, lineHeight: 1.75, color: 'rgba(210,200,185,0.7)', maxWidth: 360, marginBottom: 16 }}>
            A student needed a website. A classmate needed Python help. Two hours later, both walked away better off — and Bartr was born.
          </p>
          <p className="sr delay-3" style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, lineHeight: 1.75, color: 'rgba(210,200,185,0.45)', maxWidth: 360, marginBottom: 44 }}>
            We built the infrastructure for a trust-based barter economy that lives on every campus. No money. No middlemen. Just mutual growth.
          </p>

          <Link to="/about" className="sr delay-4 about-cta-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b85c38', textDecoration: 'none', width: 'fit-content' }}>
            <span className="about-bar" style={{ width: 32, height: 1, background: '#b85c38', display: 'inline-block', transition: 'width 0.3s ease' }} />
            Read our story
            <span className="about-arrow" style={{ width: 28, height: 28, border: '1px solid rgba(184,92,56,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s,border-color 0.3s' }}>
              <ArrowRight size={12} />
            </span>
          </Link>

          {/* mini stat cards */}
          <div className="sr" style={{ display: 'flex', gap: 10, marginTop: 52, flexWrap: 'wrap' }}>
            {[
              { num: '12', suffix: 'K+', l: 'Students' },
              { num: '98', suffix: '%', l: 'Satisfied' },

            ].map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 18px' }}>
                <p style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 22, color: '#f5eedc', lineHeight: 1, marginBottom: 4 }}>
                  {s.num}<span style={{ color: '#b85c38' }}>{s.suffix}</span>
                </p>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT (image) */}
        <div className="about-img-col" style={{ position: 'relative', overflow: 'hidden', minHeight: 400 }}>
          <img ref={aboutImgRef} src={IMGS.collab} alt="Students collaborating"
            style={{ width: '100%', height: '120%', objectFit: 'cover', objectPosition: 'center', position: 'absolute', top: '-10%', filter: 'brightness(0.75) saturate(1.1)', transition: 'transform 8s ease' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to right,#111008 0%,rgba(17,16,8,0.25) 40%,transparent 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top,rgba(17,16,8,0.55) 0%,transparent 50%)' }} />

          <span style={{ position: 'absolute', top: 36, right: 36, zIndex: 2, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 12, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Est. 2024 · Bartr
          </span>

          <div style={{ position: 'absolute', bottom: 36, right: 36, zIndex: 2, background: 'rgba(17,16,8,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(184,92,56,0.25)', borderRadius: 16, padding: '18px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 32, color: '#f5eedc', lineHeight: 1, marginBottom: 6 }}>4.9</p>
            <p style={{ color: '#b85c38', fontSize: 11, letterSpacing: 2, marginBottom: 4 }}>★★★★★</p>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Trust Score</p>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="bg-ink py-32 px-6 sm:px-12 relative" style={{ background: '#0e0d0b' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 sr">
            <p className="font-mono text-[11px] tracking-widest uppercase text-rust mb-4">Simple Process</p>
            <h2 className="font-display font-black text-white leading-tight" style={{ fontSize: 'clamp(40px,6vw,72px)' }}>
              How Bartr <em className="italic" style={{ background: 'linear-gradient(90deg,#b85c38,#e8845a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>works.</em>
            </h2>
            <p className="text-stone text-[16px] leading-relaxed max-w-xl mx-auto mt-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Four simple steps stand between you and a skill exchange that changes your college career.
            </p>
          </div>

          <div className="flex flex-col gap-16 md:gap-32 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.1) 90%, transparent)' }} />

            {STEPS.map((step, i) => (
              <div key={step.num} className="step-card group flex flex-col md:flex-row items-center gap-10 md:gap-20 even:md:flex-row-reverse" style={{ opacity: 0, transform: 'translateY(120px)' }}>
                <div className="w-full md:w-1/2 relative">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden relative border border-white/10" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
                    <div className="absolute inset-0 bg-ink/20 z-10 group-hover:bg-transparent transition-colors duration-700" />
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-100" style={{ boxShadow: `inset 0 0 0 1px ${step.accent}40` }} />
                  </div>
                  <div className="absolute -top-6 -left-6 md:-left-10 w-20 h-20 bg-ink/90 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 z-30 pointer-events-none" style={{ boxShadow: '0 16px 32px rgba(0,0,0,0.5)' }}>
                    <span className="font-display font-black text-3xl" style={{ color: step.accent }}>{step.num}</span>
                  </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col md:px-12">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="w-12 h-12 rounded-full flex items-center justify-center text-xl border border-white/10" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: step.accent }}>
                      {step.icon}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest uppercase py-1 px-3 rounded-full border border-white/10" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-white text-3xl md:text-5xl leading-tight mb-6">
                    {step.title}
                  </h3>
                  <p className="font-syne text-[16px] md:text-[18px] leading-relaxed text-white/60">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="bg-cream2 py-24 px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="sr font-mono text-[11px] tracking-widest uppercase text-rust mb-3">Browse</p>
            <h2 className="sr delay-1 font-display font-black text-ink leading-tight" style={{ fontSize: 'clamp(36px,5vw,60px)' }}>
              What do you <em className="italic text-rust">offer?</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 auto-rows-[160px]">
            {CATEGORIES.slice(0, 2).map((cat, i) => (
              <Link key={cat.label} to={`/listings?category=${cat.label}`}
                className={`sr sr-scale relative rounded-xl overflow-hidden group cursor-pointer col-span-1 row-span-2 delay-${i + 1}`}>
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent group-hover:from-rust/70 transition-all duration-500" />
                <div className="absolute bottom-4 left-4">
                  <p className="font-display font-bold text-white text-lg mb-0.5">{cat.label}</p>
                  <p className="font-mono text-white/45 text-[9px] tracking-widest uppercase">{cat.count} listings</p>
                </div>
              </Link>
            ))}
            {CATEGORIES.slice(2).map((cat, i) => (
              <Link key={cat.label} to={`/listings?category=${cat.label}`}
                className={`sr sr-scale relative rounded-xl overflow-hidden group cursor-pointer col-span-1 row-span-1 delay-${i + 3}`}>
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent group-hover:from-rust/65 transition-all duration-500" />
                <div className="absolute bottom-3 left-3">
                  <p className="font-display font-bold text-white text-base">{cat.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VIDEO ═══ */}
      <section className="video-section">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p className="sr font-mono text-[11px] tracking-widest uppercase text-rust mb-4">See It Live</p>
            <h2 className="sr delay-1 font-display font-black italic text-white leading-tight" style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}>
              Real students,<br />real trades.
            </h2>
            <p className="sr delay-2 text-stone text-[15px] leading-relaxed mt-5 max-w-md mx-auto">
              Watch how bartering works on campus. No cash. No awkwardness. Just skills.
            </p>
          </div>
          <div className="sr sr-scale video-frame">
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&color=white"
              title="Bartr Platform Demo"
              style={{ width: '100%', aspectRatio: '16/9', display: 'block', border: 'none' }}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="bg-cream py-24 px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="sr font-mono text-[11px] tracking-widest uppercase text-rust mb-3">Social Proof</p>
            <h2 className="sr delay-1 font-display font-black text-ink leading-tight" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>
              They traded.<br /><em className="italic text-rust">They grew.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`sr bg-white rounded-2xl p-8 border border-cream2 hover-lift delay-${i + 1}`}>
                <div className="flex gap-0.5 mb-5">{'★★★★★'.split('').map((s, j) => <span key={j} className="text-rust text-sm">{s}</span>)}</div>
                <p className="font-display italic text-charcoal text-[16px] leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-cream2 pt-5">
                  <div className="w-10 h-10 rounded-full bg-cream2 flex items-center justify-center font-display font-bold text-rust text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-[13px]">{t.name}</p>
                    <p className="font-mono text-[10px] text-stone mt-0.5">{t.college} · {t.skill}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden px-12 py-24">
        <div className="parallax-wrap absolute inset-0">
          <img ref={ctaBgRef} src={IMGS.campus} alt="Campus" className="parallax-img absolute inset-0 w-full h-[130%] object-cover -top-[15%]" />
        </div>
        <div className="absolute inset-0 bg-ink/75" />
        <div className="relative z-10 text-center max-w-2xl mx-auto sr sr-scale">
          <p className="font-mono text-[11px] tracking-widest uppercase text-rust mb-5">Ready?</p>
          <h2 className="font-display font-black text-white leading-tight mb-6" style={{ fontSize: 'clamp(44px,7vw,88px)' }}>
            Join <em className="italic text-rust">12,000+</em><br />students.
          </h2>
          <p className="text-white/50 text-[15px] mb-10 leading-relaxed max-w-lg mx-auto">
            Your skill has real value. Someone out there needs exactly what you know — and has exactly what you need.
          </p>
          <Link to="/signup" className="btn-rust" style={{ display: 'inline-flex' }}>
            Create Free Account
            <span className="btn-icon"><ArrowRight size={15} /></span>
          </Link>
        </div>
      </section>

    </div>
  );
}