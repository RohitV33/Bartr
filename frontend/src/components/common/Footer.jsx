import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream2 px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-rust rounded-lg flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fdfaf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight">Bartr</span>
            </Link>
            <p className="text-stone text-sm leading-relaxed max-w-xs">
              The student skill exchange platform. No money — just talent. Trade what you know for what you need.
            </p>
          </div>
          {[
            { title: 'Platform', links: [['Explore', '/listings'], ['Dashboard', '/dashboard'], ['About', '/about']] },
            { title: 'Legal',    links: [['Privacy', '#'], ['Terms', '#'], ['Guidelines', '#']] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-mono text-[10px] tracking-[0.18em] uppercase text-stone mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-stone hover:text-cream transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-6 flex justify-between items-center">
          <p className="font-mono text-[11px] text-stone/50">© 2025 Bartr. Built for students.</p>
          <p className="font-mono text-[11px] text-stone/30">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
