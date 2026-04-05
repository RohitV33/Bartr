import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import SkillCard from '../components/listings/SkillCard';
import { useAuth } from '../context/AuthContext';
import { useReveal } from '../hooks/useGsap';

const CATEGORIES = ['All','Coding','Design','Writing','Music','Teaching','Video','Marketing','Finance','Other'];
const BANNER = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80';

export default function Listings() {
  useReveal();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q:        searchParams.get('q')        || '',
    category: searchParams.get('category') || '',
    skill:    '',
    location: '',
  });

  const PER_PAGE   = 9;
  const totalPages = Math.ceil(total / PER_PAGE);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: PER_PAGE });
      Object.entries(filters).forEach(([k, v]) => { if (v) p.set(k, v); });
      const { data } = await api.get(`/listings?${p}`);
      setListings(data.listings);
      setTotal(data.total);
    } catch { setListings([]); }
    finally  { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const apply = (u) => { setFilters(f => ({ ...f, ...u })); setPage(1); };

  return (
    <div className="bg-cream min-h-screen">

      {/* Banner with parallax feel */}
      <div className="relative h-56 overflow-hidden pt-20">
        <img src={BANNER} alt="Explore skills"
          className="absolute inset-0 w-full h-[140%] object-cover -top-[20%]" />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative z-10 h-full flex items-end pb-8 px-12">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-rust mb-2">Skill Exchange</p>
            <h1 className="font-display font-black text-white leading-tight"
              style={{ fontSize: 'clamp(36px,5vw,60px)' }}>
              Browse Skills
            </h1>
            <p className="font-mono text-[11px] text-white/40 mt-1">{total} listings available</p>
          </div>
        </div>
      </div>

      <div className="px-12 py-8 max-w-7xl mx-auto">

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand" />
            <input
              value={filters.q}
              onChange={e => apply({ q: e.target.value })}
              placeholder="Search skills, keywords…"
              className="w-full bg-white border-[1.5px] border-cream2 rounded-xl
                         pl-10 pr-10 py-3 text-[14px] text-charcoal placeholder-sand
                         focus:outline-none focus:border-rust transition-colors"
            />
            {filters.q && (
              <button onClick={() => apply({ q: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-charcoal">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border-[1.5px] border-cream2 rounded-xl
                         text-[13px] text-stone hover:border-charcoal hover:text-charcoal transition-all font-medium">
              <SlidersHorizontal size={14} />
              Filters
            </button>
            {user && (
              <Link to="/listings/new"
                className="flex items-center gap-2 px-4 py-3 bg-rust text-white rounded-xl
                           text-[13px] font-semibold hover:bg-ink transition-all">
                <Plus size={15} /> New Listing
              </Link>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => apply({ category: cat === 'All' ? '' : cat })}
              className={`font-mono text-[11px] tracking-[0.05em] px-4 py-2 rounded-full border-[1.5px]
                          transition-all duration-200 ${
                (cat === 'All' && !filters.category) || filters.category === cat
                  ? 'bg-ink border-ink text-white'
                  : 'bg-white border-cream2 text-stone hover:border-charcoal hover:text-charcoal'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Extra filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-cream2 p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { k:'skill',    label:'Specific Skill', placeholder:'e.g. React, Figma…' },
              { k:'location', label:'Location',       placeholder:'e.g. Mumbai, Delhi…' },
            ].map(({ k, label, placeholder }) => (
              <div key={k}>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-stone mb-2">{label}</label>
                <input value={filters[k]} onChange={e => apply({ [k]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-cream border border-cream2 rounded-xl px-3 py-2.5
                             text-[13px] text-charcoal placeholder-sand focus:outline-none focus:border-rust" />
              </div>
            ))}
            <div className="flex items-end">
              <button onClick={() => { setFilters({ q:'', category:'', skill:'', location:'' }); setPage(1); }}
                className="flex items-center gap-1 text-[12px] text-stone hover:text-rust transition-colors font-medium">
                <X size={12} /> Clear all
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-cream2 h-72 animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-stone mb-2">No listings found</p>
            <p className="text-stone/60 text-sm mb-6">Try adjusting your filters</p>
            {user && (
              <Link to="/listings/new"
                className="inline-flex items-center gap-2 bg-rust text-white px-6 py-3 rounded-full text-[13px] font-semibold">
                <Plus size={14} /> Create the first listing
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((l, i) => (
              <div key={l.id} className={`sr delay-${Math.min(i % 3 + 1, 5)}`}>
                <SkillCard listing={l} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 bg-white border border-cream2 rounded-lg text-stone hover:text-charcoal disabled:opacity-30 transition-all">
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(totalPages, 7))].map((_, i) => (
              <button key={i+1} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-[13px] font-mono transition-all ${
                  page === i+1 ? 'bg-ink text-white' : 'bg-white border border-cream2 text-stone hover:text-charcoal'
                }`}>
                {i+1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 bg-white border border-cream2 rounded-lg text-stone hover:text-charcoal disabled:opacity-30 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
