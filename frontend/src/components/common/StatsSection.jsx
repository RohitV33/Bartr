import { useEffect, useRef, useState } from "react";

const STATS = [
  { n: 12, suffix: "K+", decimals: 0, l: "Happy Clients" },
  { n: 98, suffix: "%",  decimals: 0, l: "Satisfaction Rate" },
  { n: 4,  suffix: "B+", decimals: 1, l: "Revenue Generated" },
  { n: 15, suffix: "+",  decimals: 0, l: "Years of Expertise" },
];

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function useCountUp(target, decimals, active, duration = 1800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [active, target, decimals, duration]);

  return value.toFixed(decimals);
}

function StatCard({ stat, delay, active }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const count = useCountUp(stat.n, stat.decimals, active);

  return (
    <div
      ref={ref}
      className="stat-card"
      style={{
        padding: "40px 32px",
        position: "relative",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {/* hover glow */}
      <div
        className="stat-glow"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,160,80,0.06) 0%, transparent 70%)",
          opacity: 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* gold accent bar */}
      <div
        className="stat-accent"
        style={{
          width: 24,
          height: 2,
          background:
            "linear-gradient(90deg, rgba(200,160,80,0.3), rgba(200,160,80,0.9))",
          margin: "0 auto 20px",
          borderRadius: 1,
          transition: "width 0.4s ease",
        }}
      />

      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          fontSize: "clamp(44px, 4.5vw, 68px)",
          lineHeight: 1,
          color: "#f5eedc",
          marginBottom: 12,
          letterSpacing: "-0.02em",
        }}
      >
        {count}
        <span style={{ color: "rgba(200,160,80,0.85)" }}>{stat.suffix}</span>
      </p>

      <p
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(138,127,114,0.6)",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {stat.l}
      </p>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef(null);
  const [eyebrowVisible, setEyebrowVisible] = useState(false);
  const [countActive, setCountActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEyebrowVisible(true);
          setCountActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Mono:wght@400;500&display=swap');

        .stats-section { background: #0e0c09; }

        .stat-card + .stat-card::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 1px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(200,160,80,0.2) 30%,
            rgba(200,160,80,0.35) 50%,
            rgba(200,160,80,0.2) 70%,
            transparent
          );
        }

        .stat-card:hover .stat-glow { opacity: 1 !important; }
        .stat-card:hover .stat-accent { width: 40px !important; }

        @media (max-width: 600px) {
          .stat-card + .stat-card::before { display: none; }
          .stat-card { border-bottom: 1px solid rgba(200,160,80,0.1) !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="stats-section"
        style={{ padding: "80px 40px", position: "relative", overflow: "hidden" }}
      >
        {/* ambient background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(200,160,80,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 50%, rgba(180,130,60,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* top gold hairline */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(200,160,80,0.4) 30%, rgba(200,160,80,0.8) 50%, rgba(200,160,80,0.4) 70%, transparent)",
          }}
        />

        {/* bottom gold hairline */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(200,160,80,0.2) 40%, rgba(200,160,80,0.5) 50%, rgba(200,160,80,0.2) 60%, transparent)",
          }}
        />

        {/* eyebrow label */}
        <p
          style={{
            textAlign: "center",
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(200,160,80,0.6)",
            marginBottom: 56,
            opacity: eyebrowVisible ? 1 : 0,
            transform: eyebrowVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          By the numbers
        </p>

        {/* stats grid */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 0,
            position: "relative",
          }}
        >
          {STATS.map((s, i) => (
            <StatCard
              key={s.l}
              stat={s}
              delay={i * 100}
              active={countActive}
            />
          ))}
        </div>
      </section>
    </>
  );
}