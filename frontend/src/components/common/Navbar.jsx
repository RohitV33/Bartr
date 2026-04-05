import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ChevronDown, Bell, Zap, MessageSquare } from 'lucide-react';
import api from '../../utils/api';

export default function Navbar() {
  const { user, logout }            = useAuth();
  const location                    = useLocation();
  const navigate                    = useNavigate();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const [notifs, setNotifs]         = useState(0);
  const [heroPage, setHeroPage]     = useState(true);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      setHeroPage(window.scrollY < 80);
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (user) api.get('/notifications').then(r => setNotifs(r.data.filter(n => !n.read).length)).catch(() => {});
  }, [user, location]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropOpen) return;
    const fn = (e) => {
      if (!e.target.closest('.nb-user-wrap')) setDropOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [dropOpen]);

  const isHome        = location.pathname === '/';
  const transparent   = isHome && heroPage;

  const links = [
    { to: '/listings',  label: 'Explore'    },
    { to: '/dashboard', label: 'Dashboard'  },
    { to: '/about',     label: 'About'      },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .nb-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all 0.45s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Hero (transparent dark) ── */
        .nb-root.nb-hero {
          background: rgba(15,12,8,0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(184,92,56,0.12);
        }

        /* ── Scrolled (light cream) ── */
        .nb-root.nb-scrolled {
          background: rgba(242,237,230,0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(201,187,168,0.45);
          box-shadow: 0 4px 40px rgba(26,21,16,0.08);
        }

        /* ── Default (non-home opaque dark) ── */
        .nb-root.nb-dark {
          background: rgba(15,12,8,0.96);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(184,92,56,0.12);
        }

        .nb-gold-line {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(184,92,56,0.45) 30%, rgba(232,132,90,0.75) 50%, rgba(184,92,56,0.45) 70%, transparent);
          transition: opacity 0.4s;
        }
        .nb-scrolled .nb-gold-line {
          background: linear-gradient(90deg, transparent, rgba(184,92,56,0.25) 50%, transparent);
        }

        .nb-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          height: 72px;
          transition: height 0.4s ease;
        }
        .nb-scrolled .nb-inner { height: 60px; }

        /* Logo */
        .nb-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
        .nb-logo-mark {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #b85c38, #e8845a);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(184,92,56,0.4);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .nb-logo:hover .nb-logo-mark {
          transform: rotate(-8deg) scale(1.08);
          box-shadow: 0 6px 24px rgba(184,92,56,0.55);
        }
        .nb-logo-text {
          font-family: 'Playfair Display', serif; font-weight: 900; font-size: 21px;
          letter-spacing: -0.3px; transition: color 0.3s;
        }
        .nb-hero .nb-logo-text,
        .nb-dark .nb-logo-text  { color: #f5eedc; }
        .nb-scrolled .nb-logo-text { color: #1a1510; }

        /* Nav links */
        .nb-links { display: flex; align-items: center; gap: 2px; }
        .nb-link {
          position: relative; padding: 7px 16px; border-radius: 999px;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 500;
          text-decoration: none; transition: all 0.25s ease; letter-spacing: 0.01em;
        }
        .nb-hero .nb-link,
        .nb-dark .nb-link  { color: rgba(255,255,255,0.55); }
        .nb-hero .nb-link:hover,
        .nb-dark .nb-link:hover { color: rgba(255,255,255,0.92); background: rgba(255,255,255,0.07); }
        .nb-hero .nb-link.nb-active,
        .nb-dark .nb-link.nb-active { color: #f5eedc; background: rgba(184,92,56,0.18); }

        .nb-scrolled .nb-link { color: #8a7f72; }
        .nb-scrolled .nb-link:hover { color: #2a2520; background: rgba(26,21,16,0.06); }
        .nb-scrolled .nb-link.nb-active { color: #1a1510; background: rgba(26,21,16,0.07); }

        .nb-dot {
          position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);
          width: 3px; height: 3px; border-radius: 50%; background: #b85c38;
          opacity: 0; transition: opacity 0.25s;
        }
        .nb-link.nb-active .nb-dot { opacity: 1; }

        /* Right side */
        .nb-right { display: flex; align-items: center; gap: 8px; }

        /* Messages button */
        .nb-msgs {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 16px; border-radius: 999px;
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
          text-decoration: none; transition: all 0.25s ease; letter-spacing: 0.02em;
          border: 1px solid; cursor: pointer;
        }
        .nb-hero .nb-msgs,
        .nb-dark .nb-msgs {
          color: rgba(255,255,255,0.6);
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
        }
        .nb-hero .nb-msgs:hover,
        .nb-dark .nb-msgs:hover {
          color: #fff;
          border-color: rgba(184,92,56,0.5);
          background: rgba(184,92,56,0.12);
        }
        .nb-scrolled .nb-msgs {
          color: #8a7f72;
          border-color: rgba(201,187,168,0.55);
          background: transparent;
        }
        .nb-scrolled .nb-msgs:hover {
          color: #b85c38;
          border-color: rgba(184,92,56,0.5);
          background: rgba(184,92,56,0.06);
        }
        .nb-msgs-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px rgba(74,222,128,0.6);
          flex-shrink: 0;
        }

        /* Bell */
        .nb-bell {
          position: relative; width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s; background: none; cursor: pointer;
          border: 1px solid;
        }
        .nb-hero .nb-bell,
        .nb-dark .nb-bell { color: rgba(255,255,255,0.5); border-color: rgba(255,255,255,0.1); }
        .nb-hero .nb-bell:hover,
        .nb-dark .nb-bell:hover { color: #fff; border-color: rgba(184,92,56,0.5); background: rgba(184,92,56,0.12); }
        .nb-scrolled .nb-bell { color: #8a7f72; border-color: rgba(201,187,168,0.55); }
        .nb-scrolled .nb-bell:hover { color: #2a2520; border-color: #c9bba8; background: rgba(26,21,16,0.05); }
        .nb-bell-badge {
          position: absolute; top: 3px; right: 3px;
          width: 15px; height: 15px; border-radius: 50%;
          background: #b85c38; font-family: 'DM Mono', monospace;
          font-size: 8px; color: #fff; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .nb-hero .nb-bell-badge,
        .nb-dark .nb-bell-badge { border: 1.5px solid rgba(15,12,8,0.7); }
        .nb-scrolled .nb-bell-badge { border: 1.5px solid #f2ede6; }

        /* User pill */
        .nb-user-wrap { position: relative; }
        .nb-user {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 12px 5px 5px; border-radius: 999px;
          border: 1px solid; background: none; cursor: pointer; transition: all 0.25s;
        }
        .nb-hero .nb-user,
        .nb-dark .nb-user { border-color: rgba(255,255,255,0.12); }
        .nb-hero .nb-user:hover,
        .nb-dark .nb-user:hover { border-color: rgba(184,92,56,0.45); background: rgba(184,92,56,0.08); }
        .nb-scrolled .nb-user { border-color: rgba(201,187,168,0.6); }
        .nb-scrolled .nb-user:hover { border-color: rgba(184,92,56,0.5); background: rgba(184,92,56,0.05); }

        .nb-avatar {
          width: 26px; height: 26px; border-radius: 50%; object-fit: cover; flex-shrink: 0;
        }
        .nb-uname {
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 500; transition: color 0.25s;
        }
        .nb-hero .nb-uname,
        .nb-dark .nb-uname { color: rgba(255,255,255,0.82); }
        .nb-scrolled .nb-uname { color: #2a2520; }
        .nb-chevron { transition: transform 0.3s, color 0.25s; }
        .nb-hero .nb-chevron,
        .nb-dark .nb-chevron { color: rgba(255,255,255,0.3); }
        .nb-scrolled .nb-chevron { color: #8a7f72; }

        /* Dropdown */
        .nb-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          min-width: 210px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(232,224,212,0.9);
          box-shadow: 0 20px 60px rgba(26,21,16,0.14), 0 4px 16px rgba(26,21,16,0.06);
          overflow: hidden; z-index: 200;
          animation: nbDropIn 0.2s ease;
        }
        @keyframes nbDropIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nb-dropdown-header {
          padding: 14px 16px 10px;
          border-bottom: 1px solid #f0e8de;
        }
        .nb-dropdown-name {
          font-family: 'Playfair Display', serif; font-weight: 700;
          font-size: 15px; color: #1a1510;
        }
        .nb-dropdown-sub {
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: #b85c38; letter-spacing: 0.1em; margin-top: 2px;
        }
        .nb-dropdown a,
        .nb-dropdown button {
          display: flex; align-items: center; gap: 10px;
          width: 100%; text-align: left;
          padding: 11px 16px;
          font-family: 'Syne', sans-serif; font-size: 13px;
          color: #6b6059; text-decoration: none;
          background: none; border: none; cursor: pointer;
          transition: all 0.18s;
        }
        .nb-dropdown a:hover,
        .nb-dropdown button:hover { color: #1a1510; background: #f8f4ef; }
        .nb-dropdown .nb-dd-icon { color: #c9bba8; font-size: 14px; width: 16px; }
        .nb-dropdown .nb-logout { color: #b85c38; }
        .nb-dropdown .nb-logout:hover { background: rgba(184,92,56,0.07); color: #9c4a2a; }
        .nb-divider { border: none; border-top: 1px solid #f0e8de; margin: 4px 0; }

        /* Sign in / CTA (logged out) */
        .nb-signin {
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 500;
          padding: 7px 16px; border-radius: 999px; text-decoration: none; transition: all 0.25s;
        }
        .nb-hero .nb-signin,
        .nb-dark .nb-signin { color: rgba(255,255,255,0.65); }
        .nb-hero .nb-signin:hover,
        .nb-dark .nb-signin:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .nb-scrolled .nb-signin { color: #8a7f72; }
        .nb-scrolled .nb-signin:hover { color: #2a2520; background: rgba(26,21,16,0.05); }

        .nb-cta {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          padding: 9px 22px; border-radius: 999px; text-decoration: none;
          background: #b85c38; color: #fff; letter-spacing: 0.02em;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(184,92,56,0.35);
        }
        .nb-cta:hover {
          background: #d4704a;
          box-shadow: 0 6px 24px rgba(184,92,56,0.5);
          transform: translateY(-1px);
        }

        /* Mobile */
        .nb-hamburger {
          display: none; background: none; border: none; cursor: pointer; padding: 4px;
          transition: color 0.3s;
        }
        .nb-hero .nb-hamburger,
        .nb-dark .nb-hamburger { color: rgba(255,255,255,0.8); }
        .nb-scrolled .nb-hamburger { color: #2a2520; }

        .nb-mobile-drawer {
          position: absolute; top: 100%; left: 0; right: 0;
          background: rgba(242,237,230,0.97); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(201,187,168,0.4);
          padding: 12px 20px 20px; display: flex; flex-direction: column; gap: 2px;
          box-shadow: 0 12px 40px rgba(26,21,16,0.1);
          animation: nbSlideDown 0.25s ease;
        }
        @keyframes nbSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nb-mobile-link {
          padding: 12px 16px; border-radius: 10px; text-decoration: none;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 500;
          color: #8a7f72; transition: all 0.2s;
        }
        .nb-mobile-link:hover, .nb-mobile-link.nb-active { color: #1a1510; background: rgba(26,21,16,0.05); }
        .nb-mobile-sep { border: none; border-top: 1px solid rgba(201,187,168,0.4); margin: 8px 0; }
        .nb-mobile-cta {
          display: block; margin-top: 4px; padding: 13px 20px; border-radius: 12px;
          background: #1a1510; color: #fff; text-align: center; text-decoration: none;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          transition: background 0.3s;
        }
        .nb-mobile-cta:hover { background: #b85c38; }

        @media (max-width: 768px) {
          .nb-inner { padding: 0 20px; }
          .nb-desktop { display: none !important; }
          .nb-hamburger { display: flex; }
        }
        .nb-desktop { display: flex; align-items: center; }
      `}</style>

      <nav className={`nb-root ${scrolled ? 'nb-scrolled' : isHome ? 'nb-hero' : 'nb-dark'}`}>
        <div className="nb-inner">

          {/* Logo */}
          <Link to="/" className="nb-logo">
            <div className="nb-logo-mark">
             <img 
  src="/images/logo1.png" 
  alt="Logo"
  style={{
    width: "50px",
    height: "50px",
    borderRadius: "50%" 
  }}
/>
            
            </div>
            <span className="nb-logo-text">Bartr</span>
          </Link>

          {/* Desktop links */}
          <div className="nb-links nb-desktop">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`nb-link ${isActive(l.to) ? 'nb-active' : ''}`}>
                {l.label}
                <span className="nb-dot" />
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="nb-right nb-desktop">
            {user ? (
              <>
                {/* Messages */}
                <Link to="/chat" className="nb-msgs">
                  <span className="nb-msgs-dot" />
                  Messages
                </Link>

                {/* Bell */}
                <Link to="/notifications" className="nb-bell">
                  <Bell size={14} />
                  {notifs > 0 && <span className="nb-bell-badge">{notifs}</span>}
                </Link>

                {/* User dropdown */}
                <div className="nb-user-wrap">
                  <button className="nb-user" onClick={() => setDropOpen(o => !o)}>
                    <img
                      className="nb-avatar"
                      src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=b85c38&textColor=fdfaf6`}
                      alt={user.name}
                    />
                    <span className="nb-uname">{user.name.split(' ')[0]}</span>
                    <ChevronDown
                      size={12}
                      className="nb-chevron"
                      style={{ transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  {dropOpen && (
                    <div className="nb-dropdown">
                      <div className="nb-dropdown-header">
                        <p className="nb-dropdown-name">{user.name}</p>
                        <p className="nb-dropdown-sub">★ {user.trust_score || '5.0'} trust score</p>
                      </div>
                      {[
                        { label: 'My Profile',    icon: '◉', to: `/profile/${user.id}` },
                        { label: 'Dashboard',     icon: '▦', to: '/dashboard'          },
                        { label: 'Messages',      icon: '◈', to: '/chat'               },
                        { label: '+ New Listing', icon: '✦', to: '/listings/new'       },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setDropOpen(false)}>
                          <span className="nb-dd-icon">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                      <hr className="nb-divider" />
                      <button className="nb-logout" onClick={() => { logout(); setDropOpen(false); navigate('/'); }}>
                        <span className="nb-dd-icon">→</span>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nb-signin">Sign in</Link>
                <Link to="/signup" className="nb-cta">
                  <Zap size={13} />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="nb-hamburger" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Gold hairline */}
        <div className="nb-gold-line" />

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="nb-mobile-drawer">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className={`nb-mobile-link ${isActive(l.to) ? 'nb-active' : ''}`}>
                {l.label}
              </Link>
            ))}
            {user && (
              <Link to="/chat" onClick={() => setMobileOpen(false)} className="nb-mobile-link">
                💬 Messages
              </Link>
            )}
            <hr className="nb-mobile-sep" />
            {user ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}
                style={{ padding: '12px 16px', color: '#b85c38', fontFamily: 'Syne,sans-serif', fontSize: '14px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '10px' }}>
                Sign out
              </button>
            ) : (
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="nb-mobile-cta">
                Get Started
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}