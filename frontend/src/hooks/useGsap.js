import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Custom cursor ─────────────────────────────────── */
export function useCursor() {
  useEffect(() => {
    const dot  = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);

    // dot follows exactly
    const moveDot = () => {
      gsap.set(dot,  { x: mx, y: my });
      gsap.set(ring, { x: rx += (mx - rx) * 0.1, y: ry += (my - ry) * 0.1 });
      requestAnimationFrame(moveDot);
    };
    moveDot();

    // hover grow
    const addGrow = (e) => e.currentTarget.closest('body').classList.add('cursor-grow');
    const rmGrow  = (e) => e.currentTarget.closest('body').classList.remove('cursor-grow');
    const targets = document.querySelectorAll('a, button, [data-cursor]');
    targets.forEach(t => { t.addEventListener('mouseenter', addGrow); t.addEventListener('mouseleave', rmGrow); });

    return () => {
      window.removeEventListener('mousemove', onMove);
      targets.forEach(t => { t.removeEventListener('mouseenter', addGrow); t.removeEventListener('mouseleave', rmGrow); });
    };
  }, []);
}

/* ── Scroll reveal via IntersectionObserver ──────── */
export function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const els = document.querySelectorAll('.sr, .sr-left, .sr-right, .sr-scale');
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ── GSAP Parallax on a ref ──────────────────────── */
export function useParallax(ref, speed = 0.25) {
  useEffect(() => {
    if (!ref.current) return;
    const tween = gsap.to(ref.current, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end:   'bottom top',
        scrub: true,
      },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [ref, speed]);
}
