import { useState, useCallback, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Users } from 'lucide-react'
import { skillsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { Spinner, SkillCard } from '../../components/shared.jsx'
import { Briefcase, HandHeart, SearchX } from 'lucide-react'

/* ─── Scroll Reveal ─────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '', direction = 'up' }) {
  const [v, setV] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); io.disconnect() }
    }, { threshold: 0.06 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  const transforms = { up: 'translateY(30px)', down: 'translateY(-30px)', left: 'translateX(30px)', right: 'translateX(-30px)' }
  return (
    <div ref={ref} className={className} style={{
      transitionDelay: `${delay}ms`,
      opacity: v ? 1 : 0,
      transform: v ? 'translate(0)' : transforms[direction] || 'translateY(30px)',
      transition: 'opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1)',
    }}>
      {children}
    </div>
  )
}

/* ─── Hero Section ──────────────────────────────────────────────────────────── */
function SearchHero({ q, onChange, onPost }) {
  const heroRef = useRef()
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMouseMove = (e) => {
    const r = heroRef.current?.getBoundingClientRect()
    if (!r) return
    setMousePos({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    })
  }

  const scale = Math.max(1 - scrollY * 0.0003, 0.94)
  const opacity = Math.max(1 - scrollY * 0.003, 0)

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      style={{ transform: `scale(${scale})`, opacity, transformOrigin: 'top center' }}
      className="relative overflow-hidden rounded-[2rem] mb-10"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-amber-900/40" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.4
        }} />
        <div className="absolute inset-0 transition-opacity duration-300" style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(245,158,11,0.15) 0%, transparent 60%)`
        }} />
      </div>

      <div className="relative px-8 pt-14 pb-12">
        <div className="hidden md:block">
          <div style={{ position: 'absolute', top: '22%', right: '8%' }}>
            <div className="flex items-center gap-2 bg-amber-400/20 backdrop-blur-md text-amber-200 px-4 py-2.5 rounded-2xl border border-amber-400/20 shadow-xl">
              <Users className="w-4 h-4" />
              <div>
                <p className="text-xs font-bold leading-none">2,400+</p>
                <p className="text-[10px] opacity-70 leading-none mt-0.5">Active learners</p>
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', top: '55%', right: '12%' }}>
            <div className="flex items-center gap-2 bg-emerald-400/20 backdrop-blur-md text-emerald-200 px-4 py-2.5 rounded-2xl border border-emerald-400/20 shadow-xl">
              <TrendingUp className="w-4 h-4" />
              <div>
                <p className="text-xs font-bold leading-none">840+</p>
                <p className="text-[10px] opacity-70 leading-none mt-0.5">Exchanges done</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-400/20 mb-4">
            <Sparkles className="w-3 h-3" /> Skill Exchange Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-bartr-text leading-tight mb-3"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            Discover &<br />
            <span className="text-amber-500 dark:text-amber-400">Exchange Skills</span>
          </h1>
          <p className="text-bartr-muted text-base mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Connect with students. Trade knowledge. Grow together.
          </p>

          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={q}
                onChange={onChange}
                placeholder="Search skills, topics, keywords…"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            <button
              onClick={onPost}
              className="flex items-center gap-2 bg-amber-400 text-gray-900 text-sm font-bold px-5 py-4 rounded-2xl hover:bg-amber-300 active:scale-95 transition-all duration-150 whitespace-nowrap shadow-lg shadow-amber-400/30"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              <Plus className="w-4 h-4" /> Post Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Pill Button ────────────────────────────────────────────────────────────── */
function Pill({ active, onClick, children, accent }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border whitespace-nowrap
        ${active
          ? accent
            ? 'bg-amber-400 text-gray-900 border-amber-400 shadow-md shadow-amber-200 dark:shadow-amber-900'
            : 'bg-gray-900 text-white border-gray-900 shadow-md dark:bg-white dark:text-gray-900 dark:border-white'
          : 'bg-bartr-surface border-bartr-border text-bartr-muted hover:border-bartr-text hover:shadow-sm'
        }`}
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      {children}
    </button>
  )
}

/* ─── Enhanced Skill Card Wrapper ───────────────────────────────────────────── */
function AnimatedSkillCard({ skill, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(245,158,11,0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
        borderRadius: 20,
        position: 'relative',
      }}
    >
      <SkillCard skill={skill} />
    </div>
  )
}

const TYPE_OPTIONS = [
  { value: '', label: 'All Skills' },
  { value: 'offering', label: <span className="flex items-center gap-1.5"><HandHeart className="w-4 h-4" /> Offering</span> },
  { value: 'requesting', label: <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Requesting</span> },
]

export default function BrowsePage() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const { data: catData } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => skillsApi.getCategories().then(r => r.data.data.categories),
  })
  const categories = catData || []

  const params = { q, type, category, page, limit: 16 }
  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEYS.SKILLS(params),
    queryFn: () => skillsApi.browse(params).then(r => r.data),
    keepPreviousData: true,
  })

  const skills = data?.data || []
  const pagination = data?.pagination

  const handleSearch = useCallback((e) => { setQ(e.target.value); setPage(1) }, [])
  const handleCategory = (slug) => { setCategory(prev => prev === slug ? '' : slug); setPage(1) }
  const handleType = (val) => { setType(val); setPage(1) }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      <SearchHero q={q} onChange={handleSearch} onPost={() => navigate('/skills/new')} />

      {/* Filter row */}
      <Reveal delay={0}>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs font-bold text-bartr-muted uppercase tracking-widest mr-2" style={{ fontFamily: "'Sora', sans-serif" }}>Type</span>
          {TYPE_OPTIONS.map(opt => (
            <Pill key={opt.value} active={type === opt.value} onClick={() => handleType(opt.value)}>{opt.label}</Pill>
          ))}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-xs font-bold text-bartr-muted uppercase tracking-widest mr-2" style={{ fontFamily: "'Sora', sans-serif" }}>Category</span>
          <Pill active={!category} onClick={() => handleCategory('')} accent>All</Pill>
          {categories.map(cat => (
            <Pill key={cat.id} active={category === cat.slug} onClick={() => handleCategory(cat.slug)} accent>
              {cat.icon} {cat.name}
            </Pill>
          ))}
        </div>
      </Reveal>

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : skills.length === 0 ? (
        <Reveal>
          <div className="text-center py-20">
            <div className="flex justify-center text-bartr-muted mb-4"><SearchX className="w-16 h-16" /></div>
            <h3 className="text-xl font-bold text-bartr-text mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>No skills found</h3>
            <button onClick={() => navigate('/skills/new')} className="bg-bartr-dark text-white dark:bg-white dark:text-gray-900 px-6 py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition-all">
              Post a skill
            </button>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-2xl font-black text-bartr-text" style={{ fontFamily: "'Sora', sans-serif" }}>{pagination?.total || 0}</span>
                <span className="text-bartr-muted ml-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>skills available</span>
              </div>
              {isFetching && !isLoading && <Spinner size="sm" />}
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {skills.map((skill, i) => (
              <Reveal key={skill.id} delay={(i % 8) * 60}>
                <AnimatedSkillCard skill={skill} onClick={() => navigate(`/skills/${skill.id}`)} />
              </Reveal>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Reveal>
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-5 py-2.5 rounded-2xl border-2 border-bartr-border text-sm font-bold text-bartr-muted hover:bg-bartr-surface disabled:opacity-30 transition-all"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-5 py-2.5 rounded-2xl border-2 border-bartr-border text-sm font-bold text-bartr-muted hover:bg-bartr-surface disabled:opacity-30 transition-all"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>
          )}
        </>
      )}
    </div>
  )
}