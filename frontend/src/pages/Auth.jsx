import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';

const SIDE_IMG = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=85';

function Field({ label, type = 'text', value, onChange, placeholder, required }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPass = type === 'password';
  return (
    <div className="mb-8 relative group mt-4">
      <label className={`absolute left-0 transition-all duration-300 font-mono tracking-widest uppercase pointer-events-none ${focused || value ? '-top-5 text-[9px] text-[#b85c38]' : 'top-3 text-[11px] text-[#888]'}`}>
        {label}
      </label>
      <div className="relative">
        <input
          type={isPass ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ''}
          required={required}
          className="w-full bg-transparent border-b border-white/20 focus:border-[#b85c38]
                     py-3 flex-1 text-[15px] text-[#f5eedc] placeholder-white/10
                     outline-none transition-colors duration-300 font-syne"
        />
        {isPass && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#f5eedc] transition-colors focus:outline-none">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

function AuthShell({ title, sub, children, altText, altLink, altLabel }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.auth-img-overlay', { height: '100%', duration: 1.5, ease: 'power4.inOut' });
      gsap.from('.auth-img', { scale: 1.1, duration: 2, ease: 'power3.out' });
      gsap.from('.auth-elem', { 
        y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0e0d0b] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* Left Image Section */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden border-r border-white/10">
        <div className="absolute inset-0">
          <img src={SIDE_IMG} alt="Waitless collaboration" className="auth-img w-full h-full object-cover filter brightness-[0.5] saturate-[1.2]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-[#0e0d0b]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0d0b]/90 via-[#0e0d0b]/30 to-transparent" />
          <div className="auth-img-overlay absolute bottom-0 left-0 w-full bg-[#0e0d0b]" />
        </div>
        
        <div className="relative z-10 auth-elem">
          <Link to="/" className="inline-flex items-center gap-3 decoration-none group">
            <div className="w-10 h-10 bg-[#b85c38] rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 shadow-[0_0_20px_rgba(184,92,56,0.4)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fdfaf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              </svg>
            </div>
            <span className="font-display font-black text-2xl text-[#f5eedc] tracking-wide">Bartr</span>
          </Link>
        </div>

        <div className="relative z-10 auth-elem pb-10">
          <div className="w-16 h-[2px] bg-gradient-to-r from-[#b85c38] to-transparent mb-8" />
          <h2 className="font-display font-black text-white leading-[1.05] mb-6" style={{ fontSize: 'clamp(44px,5vw,72px)' }}>
            Trade skills.<br/>
            <span style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#b85c38,#e8845a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Build trust.
            </span>
          </h2>
          <p className="font-syne text-[16px] md:text-[18px] leading-relaxed text-white/50 max-w-md">
            Join thousands of students exchanging expertise across India's top colleges without spending a single rupee.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center p-8 lg:p-16 relative">
        <Link to="/" className="absolute top-8 right-8 lg:top-12 lg:right-12 z-20 auth-elem flex items-center gap-2 font-syne text-[13px] font-semibold text-white/40 hover:text-[#b85c38] transition-colors duration-300 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#b85c38]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-[420px] mx-auto relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden auth-elem mb-12">
            <Link to="/" className="inline-flex items-center gap-2 decoration-none">
              <div className="w-8 h-8 bg-[#b85c38] rounded-lg flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fdfaf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                </svg>
              </div>
              <span className="font-display font-black text-xl text-[#f5eedc]">Bartr</span>
            </Link>
          </div>

          <p className="auth-elem font-mono text-[11px] tracking-widest uppercase text-[#b85c38] mb-4 flex items-center gap-3">
            <span className="block w-6 h-px bg-[#b85c38]" />
            {sub}
          </p>
          <h1 className="auth-elem font-display font-black text-[#f5eedc] mb-12 leading-tight" style={{ fontSize: 'clamp(32px,4vw,48px)' }}>
            {title}
          </h1>

          <div className="auth-elem">
            {children}
          </div>

          <p className="auth-elem text-center text-[13px] text-white/40 mt-[10%] font-syne">
            {altText}{' '}
            <Link to={altLink} className="text-[#b85c38] font-bold hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 pb-0.5 inline-block">
              {altLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const h = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Welcome back." sub="Authentication"
      altText="New here?" altLink="/signup" altLabel="Create an account">
      <form onSubmit={submit}>
        <Field label="College Email" type="email" value={form.email} onChange={h('email')} placeholder="you@college.edu" required />
        <Field label="Password" type="password" value={form.password} onChange={h('password')} placeholder="••••••••" required />
        <div className="flex justify-end mb-10 -mt-2">
          <a href="#" className="font-mono text-[10px] uppercase tracking-wider text-white/30 hover:text-[#b85c38] transition-colors">Forgot password?</a>
        </div>
        <button type="submit" disabled={loading}
          className="w-full relative flex items-center justify-center gap-3 bg-[linear-gradient(135deg,#b85c38,#ff9966)] text-white font-bold
                     py-4 rounded-full transition-all duration-300 disabled:opacity-50 group hover:shadow-[0_10px_30px_rgba(184,92,56,0.35)] hover:-translate-y-1">
          {loading ? 'Authenticating…' : (
            <>
              <span className="font-syne tracking-wide">Sign In to Dashboard</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}

export function Signup() {
  const { signup } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', college:'', location:'' });
  const [loading, setLoading] = useState(false);
  const h = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signup(form);
      toast.success('Welcome to Bartr! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Join the movement." sub="Create Profile"
      altText="Already have an account?" altLink="/login" altLabel="Sign in securely">
      <form onSubmit={submit}>
        <Field label="Full Name" value={form.name} onChange={h('name')} placeholder="Alex Johnson" required />
        <Field label="College Email" type="email" value={form.email} onChange={h('email')} placeholder="you@college.edu" required />
        <Field label="Password" type="password" value={form.password} onChange={h('password')} placeholder="Min. 6 characters" required />
        <div className="grid grid-cols-2 gap-6">
          <Field label="College" value={form.college} onChange={h('college')} placeholder="IIT Delhi" />
          <Field label="City" value={form.location} onChange={h('location')} placeholder="Mumbai" />
        </div>
        <p className="font-mono text-[9px] uppercase tracking-wider text-white/30 mb-8 leading-relaxed mt-2">
          By signing up you agree to our{' '}
          <a href="#" className="text-[#b85c38] hover:text-white transition-colors">Terms</a> and{' '}
          <a href="#" className="text-[#b85c38] hover:text-white transition-colors">Privacy Policy</a>.
        </p>
        <button type="submit" disabled={loading}
          className="w-full relative flex items-center justify-center gap-3 bg-[linear-gradient(135deg,#b85c38,#ff9966)] text-white font-bold
                     py-4 rounded-full transition-all duration-300 disabled:opacity-50 group hover:shadow-[0_10px_30px_rgba(184,92,56,0.35)] hover:-translate-y-1">
          {loading ? 'Creating Profile…' : (
            <>
              <span className="font-syne tracking-wide">Create Free Account</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
