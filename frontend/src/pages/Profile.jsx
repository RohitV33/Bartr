import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useReveal } from '../hooks/useGsap';
import { Star, MapPin, BookOpen, Edit2, Shield, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  useReveal();
  const { id }                    = useParams();
  const { user: me, updateUser }  = useAuth();
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(false);
  const [form, setForm]           = useState({});
  const isOwn = me?.id === id;

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(r => { setProfile(r.data); setForm(r.data); })
      .catch(() => toast.error('Profile not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    try {
      const { data } = await api.put('/users/me', {
        name: form.name, bio: form.bio,
        college: form.college, location: form.location,
      });
      setProfile(p => ({ ...p, ...data }));
      updateUser(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-rust/30 border-t-rust rounded-full animate-spin" />
    </div>
  );
  if (!profile) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="text-stone font-body">Profile not found</p>
    </div>
  );

  const offerSkills = profile.skills?.filter(s => s.type === 'offer') || [];
  const needSkills  = profile.skills?.filter(s => s.type === 'need')  || [];

  const levelStyle = (l) =>
    l === 'expert'       ? 'border-rust/30 bg-rust/5 text-rust'
    : l === 'intermediate' ? 'border-sage/30 bg-sage/5 text-sage'
    :                        'border-cream2 bg-cream text-stone';

  return (
    <div className="bg-cream2 min-h-screen pt-20 pb-16">

      {/* Cover banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80"
          alt="cover"
          className="w-full h-[130%] object-cover absolute -top-[15%]"
        />
        <div className="absolute inset-0 bg-ink/55" />
      </div>

      <div className="max-w-4xl mx-auto px-8 -mt-10">

        {/* Profile card */}
        <div className="sr bg-white rounded-3xl border border-cream2 overflow-hidden mb-6 shadow-sm">
          <div className="px-8 pt-4 pb-7">
            <div className="flex items-end justify-between mb-5">
              <img
                src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}&backgroundColor=b85c38&textColor=fdfaf6`}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white -mt-10 relative z-10"
              />
              {isOwn && (
                <button
                  onClick={() => editing ? save() : setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-rust text-white rounded-xl
                             text-[13px] font-semibold hover:bg-ink transition-all"
                >
                  <Edit2 size={13} />
                  {editing ? 'Save Changes' : 'Edit Profile'}
                </button>
              )}
            </div>

            {editing ? (
              <div className="grid grid-cols-2 gap-5">
                {[['name','Full Name'],['bio','Bio'],['college','College'],['location','City']].map(([k, l]) => (
                  <div key={k}>
                    <label className="font-mono text-[9px] tracking-widest uppercase text-stone block mb-1.5">{l}</label>
                    <input
                      value={form[k] || ''}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                      className="w-full border-b-2 border-cream2 focus:border-rust py-2.5
                                 text-[14px] text-charcoal outline-none bg-transparent transition-colors"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="font-display font-black text-ink text-2xl">{profile.name}</h1>
                  {profile.is_verified && (
                    <Shield size={14} className="text-rust" title="Verified" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[12px] text-stone mb-3 font-mono">
                  {profile.college  && <span className="flex items-center gap-1"><BookOpen size={11} />{profile.college}</span>}
                  {profile.location && <span className="flex items-center gap-1"><MapPin size={11} />{profile.location}</span>}
                  <span className="flex items-center gap-1 text-rust">
                    <Star size={11} fill="currentColor" />
                    {Number(profile.trust_score || 5).toFixed(1)} trust score
                  </span>
                </div>
                {profile.bio && (
                  <p className="text-stone text-[13px] leading-relaxed max-w-lg">{profile.bio}</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Skills offering */}
            <div className="sr bg-white rounded-2xl border border-cream2 p-6">
              <p className="font-mono text-[9px] tracking-widest uppercase text-stone mb-4">Skills Offering</p>
              {offerSkills.length === 0 ? (
                <p className="text-stone/40 text-[13px]">No skills listed yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {offerSkills.map(s => (
                    <span key={s.id}
                      className={`font-mono text-[10px] px-3 py-1.5 rounded-full border ${levelStyle(s.level)}`}>
                      {s.skill_name}
                      <span className="opacity-50 text-[9px] ml-1">{s.level}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Skills wanted */}
            <div className="sr delay-1 bg-white rounded-2xl border border-cream2 p-6">
              <p className="font-mono text-[9px] tracking-widest uppercase text-stone mb-4">Looking For</p>
              {needSkills.length === 0 ? (
                <p className="text-stone/40 text-[13px]">Nothing listed</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {needSkills.map(s => (
                    <span key={s.id}
                      className="font-mono text-[10px] px-3 py-1.5 rounded-full border border-rust/25 bg-rust/5 text-rust">
                      {s.skill_name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Portfolio */}
            {profile.portfolio?.length > 0 && (
              <div className="sr delay-2 bg-white rounded-2xl border border-cream2 p-6">
                <p className="font-mono text-[9px] tracking-widest uppercase text-stone mb-4">Portfolio</p>
                <div className="grid grid-cols-3 gap-3">
                  {profile.portfolio.map(p => (
                    <div key={p.id}
                      className="rounded-xl overflow-hidden aspect-video border border-cream2 relative group">
                      {p.media_url
                        ? <img src={p.media_url} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        : <div className="w-full h-full bg-cream2 flex items-center justify-center"><ExternalLink size={18} className="text-stone/30" /></div>
                      }
                      <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-[11px] font-semibold text-center px-2">{p.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="sr bg-white rounded-2xl border border-cream2 p-5 h-fit">
            <p className="font-mono text-[9px] tracking-widest uppercase text-stone mb-4">Reviews</p>
            {!profile.reviews?.length ? (
              <div className="text-center py-8">
                <Star size={24} className="text-stone/15 mx-auto mb-2" />
                <p className="text-stone/40 text-[12px]">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-5">
                {profile.reviews.map(r => (
                  <div key={r.id} className="pb-5 border-b border-cream2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={r.reviewer_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${r.reviewer_name}&backgroundColor=2a2520&textColor=f2ede6`}
                        alt={r.reviewer_name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-[12px] font-semibold text-charcoal">{r.reviewer_name}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={9}
                              className={i < r.rating ? 'text-rust fill-rust' : 'text-cream2'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {r.comment && (
                      <p className="font-display italic text-[13px] text-stone leading-relaxed">"{r.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
