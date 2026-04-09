import { useState, useCallback, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { skillsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { Spinner, EmptyState, SkillCard, Button } from '../../components/shared.jsx'

const TYPE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'offering', label: '✨ Offering' },
  { value: 'requesting', label: '🎯 Requesting' },
]

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0 }) {
  const [v, setV] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), { threshold: 0.06 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity .4s ease, transform .4s ease',
      }}
    >
      {children}
    </div>
  )
}

/* ── Parallax search hero ── */
function SearchHero({ q, onChange, onPost }) {
  const heroRef = useRef()
  const orb1 = useRef()
  const orb2 = useRef()
  const orb3 = useRef()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMouseMove = (e) => {
    const r = heroRef.current.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 20
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 20
    if (orb1.current) orb1.current.style.transform = `translate(${dx}px, ${dy}px)`
    if (orb2.current) orb2.current.style.transform = `translate(${-dx * 0.6}px, ${-dy * 0.6}px)`
    if (orb3.current) orb3.current.style.transform = `translate(${dx * 0.3}px, ${dy * 0.8}px)`
  }

  const handleMouseLeave = () => {
    [orb1, orb2, orb3].forEach(r => { if (r.current) r.current.style.transform = '' })
  }

  const scale = Math.max(1 - scrollY * 0.0003, 0.95)
  const opacity = Math.max(1 - scrollY * 0.004, 0)

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `scale(${scale})`, opacity, transformOrigin: 'top center' }}
      className="relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 px-8 pt-10 pb-8 mb-8"
    >
      {/* Orbs */}
      <div ref={orb1} className="absolute -top-14 -right-14 w-52 h-52 rounded-full bg-yellow-100 opacity-50" style={{ transition: 'transform .1s ease-out' }} />
      <div ref={orb2} className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-100 opacity-40" style={{ transition: 'transform .1s ease-out' }} />
      <div ref={orb3} className="absolute top-4 left-1/2 w-24 h-24 rounded-full bg-emerald-100 opacity-30" style={{ transition: 'transform .12s ease-out', animation: 'floatB 7s ease-in-out infinite' }} />

      <style>{`
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      `}</style>

      <div className="relative flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold font-sora text-gray-900">Browse Skills</h1>
          <p className="text-sm text-gray-400 font-dm mt-1">Find students to exchange knowledge with</p>
        </div>
        <button
          onClick={onPost}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-700 active:scale-95 transition-all duration-150 whitespace-nowrap flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Post skill
        </button>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={q}
          onChange={onChange}
          placeholder="Search skills, topics, keywords…"
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-dm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all shadow-sm"
        />
      </div>
    </div>
  )
}

/* ── Pill button ── */
function Pill({ active, onClick, children, yellow }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold font-sora transition-all duration-200 border whitespace-nowrap
        ${active
          ? yellow
            ? 'bg-yellow-300 text-gray-900 border-yellow-300'
            : 'bg-gray-900 text-white border-gray-900'
          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
        }`}
    >
      {children}
    </button>
  )
}

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

      {/* Hero with parallax + scroll-zoom */}
      <SearchHero q={q} onChange={handleSearch} onPost={() => navigate('/skills/new')} />

      {/* Type pills */}
      <Reveal>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {TYPE_OPTIONS.map(opt => (
            <Pill key={opt.value} active={type === opt.value} onClick={() => handleType(opt.value)}>
              {opt.label}
            </Pill>
          ))}
        </div>
      </Reveal>

      {/* Category pills */}
      <Reveal delay={60}>
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Pill active={!category} onClick={() => handleCategory('')} yellow>
            All categories
          </Pill>
          {categories.map(cat => (
            <Pill key={cat.id} active={category === cat.slug} onClick={() => handleCategory(cat.slug)} yellow>
              {cat.icon} {cat.name}
            </Pill>
          ))}
        </div>
      </Reveal>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : skills.length === 0 ? (
        <Reveal>
          <EmptyState
            icon="🔍"
            title="No skills found"
            description="Try adjusting your search or filters, or post a skill yourself."
            action={<Button variant="primary" size="sm" onClick={() => navigate('/skills/new')}>Post a skill</Button>}
          />
        </Reveal>
      ) : (
        <>
          {/* Result count + spinner */}
          <Reveal>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-400 font-dm">
                <span className="text-gray-900 font-semibold">{pagination?.total || 0}</span> skills found
              </p>
              {isFetching && !isLoading && <Spinner size="sm" />}
            </div>
          </Reveal>

          {/* Cards grid with staggered reveal */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skills.map((skill, i) => (
              <Reveal key={skill.id} delay={(i % 8) * 50}>
                <div
                  className="h-full hover:-translate-y-1 hover:shadow-sm transition-all duration-200 rounded-2xl"
                  onClick={() => navigate(`/skills/${skill.id}`)}
                >
                  <SkillCard skill={skill} />
                </div>
              </Reveal>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Reveal>
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium font-dm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, i) =>
                      p === '…' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold font-sora transition-all duration-150
                            ${page === p
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>

                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium font-dm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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