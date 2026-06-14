import { useState, useCallback, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, Plus, CaretLeft, CaretRight, Sparkle, TrendUp, Users, MagnifyingGlassX, Sliders, Briefcase, HandHeart } from '@phosphor-icons/react'
import { skillsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { Spinner, SkillCard } from '../../components/shared.jsx'

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
  const transforms = { up: 'translateY(15px)', down: 'translateY(-15px)', left: 'translateX(15px)', right: 'translateX(-15px)' }
  return (
    <div ref={ref} className={className} style={{
      transitionDelay: `${delay}ms`,
      opacity: v ? 1 : 0,
      transform: v ? 'translate(0)' : transforms[direction] || 'translateY(15px)',
      transition: 'opacity 0.5s cubic-bezier(.16,1,.3,1), transform 0.5s cubic-bezier(.16,1,.3,1)',
    }}>
      {children}
    </div>
  )
}

const TYPE_OPTIONS = [
  { value: '', label: 'All Listings' },
  { value: 'offering', label: 'Offering' },
  { value: 'requesting', label: 'Requesting' },
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
    <div className="max-w-7xl mx-auto font-jakarta w-full">
      
      {/* Editorial Header */}
      <Reveal className="mb-10 pb-6 border-b border-[#0B0B0A]/5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#6D28D9] uppercase tracking-widest block mb-2">
            Talent Index
          </span>
          <h1 className="font-syne font-bold text-3xl sm:text-5xl text-[#0B0B0A] tracking-tight mb-2">
            Browse Student Skills
          </h1>
          <p className="text-[#0B0B0A]/50 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
            Search or filter listings. Discover reciprocal match partnerships across subjects and design/code categories.
          </p>
        </div>
        <button
          onClick={() => navigate('/skills/new')}
          className="bg-[#0B0B0A] hover:bg-[#0B0B0A]/90 text-[#F7F7F5] text-xs font-bold px-6 py-3.5 rounded-full flex items-center gap-1.5 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] tracking-wider uppercase"
        >
          <Plus className="w-4 h-4" /> Post a Skill
        </button>
      </Reveal>

      {/* Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sticky Filters Sidebar (30% width -> 4 cols on lg) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <Reveal className="bg-white border border-[#0B0B0A]/5 rounded-3xl p-6 space-y-8 shadow-[0_4px_25px_rgba(11,11,10,0.01)]">
            
            {/* Filter title */}
            <div className="flex items-center gap-2 border-b border-[#0B0B0A]/5 pb-3">
              <Sliders className="w-4 h-4 text-[#6D28D9]" />
              <h2 className="text-xs font-bold text-[#0B0B0A] uppercase tracking-widest" style={{ fontFamily: "'Syne', sans-serif" }}>
                Filter Catalog
              </h2>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-[#0B0B0A]/40 uppercase tracking-widest block" style={{ fontFamily: "'Syne', sans-serif" }}>Keywords</span>
              <div className="relative">
                <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0B0A]/30" />
                <input
                  value={q}
                  onChange={handleSearch}
                  placeholder="Search skills, software..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#0B0B0A]/10 bg-[#F7F7F5] text-[#0B0B0A] placeholder-[#0B0B0A]/30 text-xs focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all font-jakarta"
                />
              </div>
            </div>

            {/* Type buttons */}
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-[#0B0B0A]/40 uppercase tracking-widest block" style={{ fontFamily: "'Syne', sans-serif" }}>Swap Mode</span>
              <div className="flex flex-col gap-1.5">
                {TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleType(opt.value)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold font-jakarta transition-all ${
                      type === opt.value 
                        ? 'bg-[#0B0B0A] text-[#F7F7F5]' 
                        : 'text-[#0B0B0A]/60 hover:bg-[#0B0B0A]/5 hover:text-[#0B0B0A]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories checklist */}
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-[#0B0B0A]/40 uppercase tracking-widest block" style={{ fontFamily: "'Syne', sans-serif" }}>Categories</span>
              <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1">
                <button
                  onClick={() => handleCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-jakarta font-bold transition-all flex items-center justify-between ${
                    !category 
                      ? 'bg-[#6D28D9]/10 text-[#6D28D9]' 
                      : 'text-[#0B0B0A]/60 hover:bg-[#0B0B0A]/5 hover:text-[#0B0B0A]'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] opacity-40">→</span>
                </button>
                
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-jakarta font-bold transition-all flex items-center justify-between ${
                      category === cat.slug 
                        ? 'bg-[#6D28D9]/10 text-[#6D28D9]' 
                        : 'text-[#0B0B0A]/60 hover:bg-[#0B0B0A]/5 hover:text-[#0B0B0A]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-[10px] opacity-40">→</span>
                  </button>
                ))}
              </div>
            </div>

          </Reveal>
        </div>

        {/* Right Directory Feed Pane (70% width -> 8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          
          {isLoading ? (
            <div className="flex justify-center py-24"><Spinner size="lg" /></div>
          ) : skills.length === 0 ? (
            <Reveal>
              <div className="text-center py-20 bg-white border border-[#0B0B0A]/8 rounded-3xl max-w-xl mx-auto shadow-sm">
                <div className="flex justify-center text-[#6D28D9] mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#6D28D9]/5 flex items-center justify-center">
                    <MagnifyingGlassX className="w-8 h-8 text-[#6D28D9]" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#0B0B0A] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>No matches discovered</h3>
                <p className="text-[#0B0B0A]/60 mb-6 text-xs sm:text-sm font-medium">Be the first to list matching credentials on this topic.</p>
                
                <button 
                  onClick={() => navigate('/skills/new')} 
                  className="bg-[#0B0B0A] hover:bg-[#0B0B0A]/90 text-[#F7F7F5] text-xs font-bold px-6 py-3 rounded-full shadow-sm"
                >
                  Create Listing +
                </button>
              </div>
            </Reveal>
          ) : (
            <>
              {/* Counter details */}
              <Reveal>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-2xl font-bold text-[#0B0B0A]" style={{ fontFamily: "'Syne', sans-serif" }}>{pagination?.total || 0}</span>
                    <span className="text-[#0B0B0A]/40 ml-2 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>listings matching parameters</span>
                  </div>
                  {isFetching && !isLoading && <Spinner size="sm" />}
                </div>
              </Reveal>

              {/* Talent List (Horizontal rows) */}
              <div className="space-y-3">
                {skills.map((skill, i) => (
                  <Reveal key={skill.id} delay={(i % 8) * 40}>
                    <SkillCard 
                      skill={skill} 
                      layout="row" 
                      onClick={() => navigate(`/skills/${skill.id}`)} 
                    />
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
                      className="px-5 py-2.5 rounded-full border border-[#0B0B0A]/10 text-xs font-bold tracking-wider uppercase text-[#0B0B0A] hover:bg-[#0B0B0A]/5 disabled:opacity-30 transition-all active:scale-[0.98]"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      <CaretLeft className="w-4 h-4 inline mr-1" /> Prev
                    </button>
                    <button
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-5 py-2.5 rounded-full border border-[#0B0B0A]/10 text-xs font-bold tracking-wider uppercase text-[#0B0B0A] hover:bg-[#0B0B0A]/5 disabled:opacity-30 transition-all active:scale-[0.98]"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Next <CaretRight className="w-4 h-4 inline ml-1" />
                    </button>
                  </div>
                </Reveal>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  )
}