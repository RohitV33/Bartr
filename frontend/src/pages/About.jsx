import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal, useParallax } from '../hooks/useGsap';
import { ArrowRight, Heart, Zap, Globe, Lightbulb } from 'lucide-react';

const IMGS = {
  hero:  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=85',
  team:  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80',
  cta:   'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=85',
};

const TEAM = [
  { name: 'Arjun Mehta',    role: 'Co-Founder & CEO', init: 'AM', college: 'IIT Bombay'     },
  { name: 'Sara Chen',      role: 'Co-Founder & CTO', init: 'SC', college: 'Stanford'        },
  { name: 'Priya Kapoor',   role: 'Head of Design',   init: 'PK', college: 'NID Ahmedabad'  },
  { name: 'Marcus Johnson', role: 'Head of Growth',   init: 'MJ', college: 'Harvard'         },
];

const VALUES = [
  { icon: Heart,     title: 'Community First',  desc: 'Every feature we build strengthens connections between students on campus and beyond.' },
  { icon: Zap,       title: 'Zero Friction',    desc: 'Trade a skill in minutes. No negotiations, no invoices, no payment apps — just talent.' },
  { icon: Globe,     title: 'Accessible',       desc: 'No financial barriers whatsoever. Your skill is your ticket to everything on the platform.' },
  { icon: Lightbulb, title: 'Always Learning',  desc: 'Every completed trade is a chance to grow. We celebrate curiosity and continuous improvement.' },
];

export default function About() {
  useReveal();

  const heroImgRef = useRef(null);
  const ctaImgRef  = useRef(null);
  const teamImgRef = useRef(null);

  useParallax(heroImgRef, 0.22);
  useParallax(ctaImgRef,  0.18);
  useParallax(teamImgRef, 0.16);

  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <img
          ref={heroImgRef}
          src={IMGS.hero}
          alt="About Bartr"
          className="absolute inset-0 w-full h-[130%] object-cover -top-[15%]"
        />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="relative z-10 max-w-5xl mx-auto px-12 pb-20 pt-36 w-full">
          <p className="sr font-mono text-[10px] tracking-widest uppercase text-rust mb-5">Our Mission</p>
          <h1 className="sr delay-1 font-display font-black text-white leading-tight"
            style={{ fontSize: 'clamp(40px,7vw,88px)' }}>
            Skills are the<br /><em className="italic text-rust">new currency.</em>
          </h1>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-24 px-12 bg-cream">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="sr font-mono text-[10px] tracking-widest uppercase text-rust mb-4">The Story</p>
            <h2 className="sr delay-1 font-display font-bold italic text-ink leading-tight mb-6"
              style={{ fontSize: 'clamp(28px,4vw,46px)' }}>
              From a dorm room problem.
            </h2>
            <div className="space-y-4 text-stone text-[14px] leading-relaxed">
              <p className="sr delay-2">
                It started when our founder needed a website designed but couldn't afford a designer.
                A classmate needed Python help. The swap took two hours. Both walked away better off.
              </p>
              <p className="sr delay-3">
                That moment revealed a massive untapped opportunity — millions of students sitting next
                to each other, all with complementary skills, but no platform to connect them fairly.
              </p>
              <p className="sr delay-4">
                Bartr was built to fix that. We created the infrastructure for a trust-based, barter-first
                skill economy that lives on every campus in India and beyond.
              </p>
            </div>
          </div>

          <div className="sr sr-right rounded-2xl overflow-hidden border border-cream2 img-zoom">
            <img
              ref={teamImgRef}
              src={IMGS.team}
              alt="Students working together"
              className="w-full h-72 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 px-12 bg-cream2">
        <div className="max-w-5xl mx-auto">
          <div className="sr text-center mb-14">
            <p className="font-mono text-[10px] tracking-widest uppercase text-rust mb-3">What we stand for</p>
            <h2 className="font-display font-black text-ink leading-tight"
              style={{ fontSize: 'clamp(32px,4.5vw,54px)' }}>
              Our <em className="italic text-rust">values.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title}
                className={`sr bg-white rounded-2xl p-6 border border-cream2
                            hover:border-rust/30 transition-all duration-300 delay-${i + 1}`}>
                <div className="w-9 h-9 bg-rust/8 rounded-xl flex items-center justify-center mb-5">
                  <Icon size={17} className="text-rust" />
                </div>
                <h3 className="font-display font-bold text-ink text-[16px] mb-2 leading-tight">{title}</h3>
                <p className="text-stone text-[12px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 px-12 bg-cream">
        <div className="max-w-5xl mx-auto">
          <div className="sr text-center mb-14">
            <p className="font-mono text-[10px] tracking-widest uppercase text-rust mb-3">The people</p>
            <h2 className="font-display font-black text-ink leading-tight"
              style={{ fontSize: 'clamp(32px,4.5vw,54px)' }}>
              The <em className="italic text-rust">team.</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <div key={m.name} className={`sr text-center delay-${i + 1}`}>
                <div className="w-16 h-16 rounded-2xl bg-rust/8 border border-rust/12
                                flex items-center justify-center font-display font-bold
                                text-rust text-lg mx-auto mb-3">
                  {m.init}
                </div>
                <p className="font-semibold text-charcoal text-[13px]">{m.name}</p>
                <p className="font-mono text-[10px] text-rust mt-0.5">{m.role}</p>
                <p className="font-mono text-[10px] text-stone/50 mt-0.5">{m.college}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA with parallax ── */}
      <section className="relative min-h-[48vh] flex items-center justify-center overflow-hidden px-12 py-20">
        <img
          ref={ctaImgRef}
          src={IMGS.cta}
          alt="Campus"
          className="absolute inset-0 w-full h-[130%] object-cover -top-[15%]"
        />
        <div className="absolute inset-0 bg-ink/68" />

        <div className="sr sr-scale relative z-10 text-center max-w-xl mx-auto">
          <p className="font-mono text-[10px] tracking-widest uppercase text-rust mb-5">Ready?</p>
          <h2 className="font-display font-black text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(36px,5.5vw,68px)' }}>
            Join the <em className="italic text-rust">movement.</em>
          </h2>
          <p className="text-white/45 text-[14px] mb-10 leading-relaxed max-w-sm mx-auto">
            It's free, it's fast, and it could change how you think about learning and collaboration forever.
          </p>
          <Link to="/signup"
            className="inline-flex items-center gap-2 bg-white text-ink font-bold px-8 py-4 rounded-full
                       hover:bg-rust hover:text-white transition-all duration-300 text-[14px] group">
            Start Bartering
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
