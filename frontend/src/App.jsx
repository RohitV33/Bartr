import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import Home          from './pages/Home';
import { Login, Signup } from './pages/Auth';
import Listings      from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import ListingForm   from './pages/ListingForm';
import Dashboard     from './pages/Dashboard';
import Profile       from './pages/Profile';
import Chat          from './pages/Chat';
import About         from './pages/About';

import './styles/index.css';

gsap.registerPlugin(ScrollTrigger);

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-rust/30 border-t-rust rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function Cursor() {
  useEffect(() => {
    const dot  = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    if (window.matchMedia('(pointer: coarse)').matches) {
      dot.style.display = ring.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }
    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = e => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', move);
    const tick = () => {
      gsap.set(dot,  { x: mx, y: my });
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      gsap.set(ring, { x: rx, y: ry });
      requestAnimationFrame(tick);
    };
    tick();
    const grow   = () => document.body.classList.add('cursor-grow');
    const shrink = () => document.body.classList.remove('cursor-grow');
    const bindAll = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', grow);
        el.addEventListener('mouseleave', shrink);
      });
    };
    bindAll();
    const obs = new MutationObserver(bindAll);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { document.removeEventListener('mousemove', move); obs.disconnect(); };
  }, []);
  return null;
}

function AppShell() {
  return (
    <BrowserRouter>
      <div id="cursor" />
      <div id="cursor-ring" />
      <Cursor />
      <Routes>
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/"                  element={<Home />} />
                <Route path="/listings"          element={<Listings />} />
                <Route path="/listings/new"      element={<ProtectedRoute><ListingForm /></ProtectedRoute>} />
                <Route path="/listings/:id/edit" element={<ProtectedRoute><ListingForm /></ProtectedRoute>} />
                <Route path="/listings/:id"      element={<ListingDetail />} />
                <Route path="/dashboard"         element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile/:id"       element={<Profile />} />
                <Route path="/chat"              element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/about"             element={<About />} />
                <Route path="*"                  element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background:'#1a1510', color:'#f2ede6', border:'1px solid rgba(201,187,168,0.15)', borderRadius:'14px', fontFamily:'Syne, sans-serif', fontSize:'13px' },
          success: { iconTheme: { primary:'#6b7c5e', secondary:'#fdfaf6' } },
          error:   { iconTheme: { primary:'#b85c38', secondary:'#fdfaf6' } },
        }}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return <AuthProvider><AppShell /></AuthProvider>;
}
