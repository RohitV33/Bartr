import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { useReveal } from '../hooks/useGsap';
import { Plus, X, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Coding','Design','Writing','Music','Teaching','Video','Marketing','Finance','Other',
];

const BANNER = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80';

/* ── Tag input ─────────────────────────────────── */
function TagInput({ label, tags, onChange, placeholder }) {
  const [val, setVal] = useState('');

  const add = () => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setVal('');
    }
  };

  return (
    <div className="mb-7">
      <label className="font-mono text-[9px] tracking-widest uppercase text-stone block mb-3">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
        {tags.map(t => (
          <span key={t}
            className="flex items-center gap-1.5 font-mono text-[10px] px-3 py-1.5
                       rounded-full border border-cream2 bg-cream text-stone">
            {t}
            <button type="button" onClick={() => onChange(tags.filter(x => x !== t))}
              className="text-stone/40 hover:text-rust transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 border-b-2 border-cream2 focus-within:border-rust transition-colors">
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 py-2.5 text-[13px] text-charcoal outline-none bg-transparent placeholder-sand"
        />
        <button type="button" onClick={add}
          className="text-stone hover:text-rust transition-colors pb-1">
          <Plus size={16} />
        </button>
      </div>
      <p className="font-mono text-[9px] text-stone/40 mt-1.5">Press Enter or + to add</p>
    </div>
  );
}

/* ── Field ─────────────────────────────────────── */
function Field({ label, required, children }) {
  return (
    <div className="mb-6">
      <label className="font-mono text-[9px] tracking-widest uppercase text-stone block mb-2">
        {label} {required && <span className="text-rust">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = `w-full border-b-2 border-cream2 focus:border-rust py-3 text-[14px]
                   text-charcoal outline-none bg-transparent placeholder-sand transition-colors`;

export default function ListingForm() {
  useReveal();
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Coding',
    skills_offered: [], skills_wanted: [],
    media_url: '', location: '',
  });

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/listings/${id}`).then(r => {
      const l = r.data;
      setForm({
        title:          l.title,
        description:    l.description,
        category:       l.category,
        skills_offered: l.skills_offered || [],
        skills_wanted:  l.skills_wanted  || [],
        media_url:      l.media_url      || '',
        location:       l.location       || '',
      });
    }).catch(() => toast.error('Could not load listing'));
  }, [id, isEdit]);

  const h = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())            { toast.error('Title is required'); return; }
    if (form.skills_offered.length === 0) { toast.error('Add at least one skill you offer'); return; }
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/listings/${id}`, form);
        toast.success('Listing updated!');
        navigate(`/listings/${id}`);
      } else {
        const { data } = await api.post('/listings', form);
        toast.success('Listing published!');
        navigate(`/listings/${data.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save listing');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-cream min-h-screen pt-20 pb-16">

      {/* Banner */}
      <div className="relative h-48 overflow-hidden">
        <img src={BANNER} alt=""
          className="absolute inset-0 w-full h-[130%] object-cover -top-[15%]" />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative z-10 h-full flex items-end px-12 pb-8">
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-rust mb-1.5">
              {isEdit ? 'Edit Listing' : 'New Listing'}
            </p>
            <h1 className="font-display font-black text-white leading-tight"
              style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
              {isEdit ? 'Update Your Listing' : 'Offer a Skill'}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-xl mx-auto px-8 pt-10">
        <form onSubmit={submit}
          className="bg-white rounded-3xl border border-cream2 p-8 shadow-sm">

          {/* Title */}
          <Field label="Title" required>
            <input
              value={form.title}
              onChange={h('title')}
              required
              placeholder="e.g. I'll build your React app for logo design"
              className={inputClass}
            />
          </Field>

          {/* Description */}
          <Field label="Description" required>
            <textarea
              value={form.description}
              onChange={h('description')}
              required
              rows={4}
              placeholder="Describe what you offer, your experience level, and what you want in return…"
              className="w-full border border-cream2 rounded-xl px-4 py-3 text-[13px] text-charcoal
                         outline-none focus:border-rust resize-none placeholder-sand transition-colors"
            />
          </Field>

          {/* Category */}
          <Field label="Category" required>
            <div className="flex flex-wrap gap-2 mt-1">
              {CATEGORIES.map(c => (
                <button key={c} type="button"
                  onClick={() => setForm(f => ({ ...f, category: c }))}
                  className={`font-mono text-[10px] px-3 py-1.5 rounded-full border transition-all ${
                    form.category === c
                      ? 'bg-ink border-ink text-white'
                      : 'border-cream2 text-stone hover:border-charcoal hover:text-charcoal'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </Field>

          {/* Skills offered */}
          <TagInput
            label="Skills You Offer *"
            tags={form.skills_offered}
            onChange={v => setForm(f => ({ ...f, skills_offered: v }))}
            placeholder="e.g. React, Figma, Python…"
          />

          {/* Skills wanted */}
          <TagInput
            label="Skills You Want in Return"
            tags={form.skills_wanted}
            onChange={v => setForm(f => ({ ...f, skills_wanted: v }))}
            placeholder="e.g. Logo Design, Video Editing…"
          />

          {/* Location + Credits */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Field label="City">
              <input
                value={form.location}
                onChange={h('location')}
                placeholder="e.g. Mumbai"
                className={inputClass}
              />
            </Field>
            <Field label="Media URL (Optional)">
              <input
                type="url"
                value={form.media_url}
                onChange={h('media_url')}
                placeholder="YouTube, Google Drive, or Image link"
                className={inputClass}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-rust text-white font-semibold
                       py-4 rounded-xl hover:bg-ink transition-all duration-300 text-[14px]
                       disabled:opacity-50 group"
          >
            {loading
              ? 'Saving…'
              : (
                <>
                  <span>{isEdit ? 'Update Listing' : 'Publish Listing'}</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </>
              )
            }
          </button>
        </form>
      </div>
    </div>
  );
}
