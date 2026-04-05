import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useReveal } from '../hooks/useGsap';
import { ArrowLeft, Send, Eye, Edit2, Trash2, Star, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const CAT_IMAGES = {
  Coding:    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
  Design:    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
  Writing:   'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
  Music:     'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80',
  Teaching:  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
  Video:     'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=1200&q=80',
  Marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  Finance:   'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
  Other:     'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
};

export default function ListingDetail() {
  useReveal();
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing,    setListing]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [showBarter, setShowBarter] = useState(false);
  const [barterMsg,  setBarterMsg]  = useState('');
  const [offered,    setOffered]    = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(r => setListing(r.data))
      .catch(() => toast.error('Listing not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const deleteListing = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      toast.success('Listing deleted');
      navigate('/listings');
    } catch { toast.error('Delete failed'); }
  };

  const sendBarter = async () => {
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      await api.post('/barter', {
        listing_id: id,
        message: barterMsg,
        offered_skills: offered,
      });
      toast.success('Barter request sent! 🎉');
      setShowBarter(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-rust/30 border-t-rust rounded-full animate-spin" />
    </div>
  );
  if (!listing) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="text-stone">Listing not found</p>
    </div>
  );

  const isOwn = user?.id === listing.user_id;
  const img   = CAT_IMAGES[listing.category] || CAT_IMAGES.Other;

  return (
    <div className="bg-cream min-h-screen pt-20 pb-16">

      {/* Hero banner with parallax feel */}
      <div className="relative h-64 overflow-hidden">
        <img src={img} alt={listing.category}
          className="absolute inset-0 w-full h-[130%] object-cover -top-[15%]" />
        <div className="absolute inset-0 bg-ink/58" />
        <div className="relative z-10 h-full flex items-end px-12 pb-7">
          <Link to="/listings"
            className="flex items-center gap-2 text-white/55 hover:text-white text-[13px] transition-colors font-medium">
            <ArrowLeft size={15} /> Back to Listings
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="sr bg-white rounded-3xl border border-cream2 p-8 mb-5 shadow-sm">

              {/* Meta row */}
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-[9px] tracking-widest uppercase
                                 border border-cream2 px-3 py-1 rounded-full text-stone">
                  {listing.category}
                </span>
                <span className={`font-mono text-[9px] tracking-wide px-3 py-1 rounded-full border ${
                  listing.status === 'active'
                    ? 'text-sage border-sage/30 bg-sage/5'
                    : 'text-stone border-cream2'
                }`}>
                  {listing.status}
                </span>
                <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-stone/40">
                  <Eye size={11} /> {listing.views || 0}
                </span>
              </div>

              <h1 className="font-display font-black text-ink leading-tight mb-5"
                style={{ fontSize: 'clamp(24px,3.5vw,38px)' }}>
                {listing.title}
              </h1>

              <p className="text-stone text-[14px] leading-relaxed mb-8">{listing.description}</p>

              {/* Skills offered */}
              <div className="mb-6">
                <p className="font-mono text-[9px] tracking-widest uppercase text-stone mb-3">Skills Offered</p>
                <div className="flex flex-wrap gap-2">
                  {listing.skills_offered?.map(s => (
                    <span key={s}
                      className="font-mono text-[10px] px-3 py-1.5 rounded-full border border-cream2 bg-cream text-stone">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills wanted */}
              {listing.skills_wanted?.length > 0 && (
                <div className="mb-6">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-stone mb-3">Wants in Return</p>
                  <div className="flex flex-wrap gap-2">
                    {listing.skills_wanted.map(s => (
                      <span key={s}
                        className="font-mono text-[10px] px-3 py-1.5 rounded-full border border-rust/25 bg-rust/5 text-rust">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Attachment */}
              {listing.media_url && (
                <div className="mb-8">
                  <a href={listing.media_url} target="_blank" rel="noreferrer"
                     className="inline-flex items-center gap-2 px-5 py-2.5 bg-cream2 text-charcoal rounded-xl text-[13px] hover:bg-rust hover:text-white transition-colors font-medium">
                    <Eye size={14} /> View Attached Media / Portfolio
                  </a>
                </div>
              )}

              {/* Owner actions */}
              {isOwn && (
                <div className="flex gap-3 mt-8 pt-6 border-t border-cream2">
                  <Link to={`/listings/${id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 border border-cream2 rounded-xl
                               text-[13px] text-stone hover:text-charcoal hover:border-charcoal transition-all">
                    <Edit2 size={13} /> Edit
                  </Link>
                  <button onClick={deleteListing}
                    className="flex items-center gap-2 px-4 py-2 border border-rust/20 bg-rust/5 rounded-xl
                               text-[13px] text-rust hover:bg-rust/10 transition-all">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Owner card */}
            <div className="sr bg-white rounded-2xl border border-cream2 p-5 shadow-sm">
              <p className="font-mono text-[9px] tracking-widest uppercase text-stone mb-4">Posted By</p>
              <Link to={`/profile/${listing.user_id}`}
                className="flex items-center gap-3 mb-4 group">
                <img
                  src={listing.owner_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${listing.owner_name}&backgroundColor=b85c38&textColor=fdfaf6`}
                  alt={listing.owner_name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="font-semibold text-[14px] text-charcoal group-hover:text-rust transition-colors">
                    {listing.owner_name}
                  </p>
                  {listing.college && (
                    <p className="font-mono text-[10px] text-stone mt-0.5">{listing.college}</p>
                  )}
                </div>
              </Link>
              <div className="flex items-center justify-between text-[11px] text-stone/50 font-mono">
                <span className="flex items-center gap-1">
                  <Star size={10} className="text-rust fill-rust" />
                  {Number(listing.trust_score || 4.5).toFixed(1)} rating
                </span>
                {listing.location && (
                  <span className="flex items-center gap-1"><MapPin size={10} />{listing.location}</span>
                )}
              </div>
              {listing.owner_bio && (
                <p className="text-[12px] text-stone/60 mt-3 pt-3 border-t border-cream2 leading-relaxed">
                  {listing.owner_bio}
                </p>
              )}
            </div>

            {/* CTA / Barter form */}
            {!isOwn && (
              !showBarter ? (
                <button
                  onClick={() => user ? setShowBarter(true) : navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 bg-rust text-white
                             font-semibold py-4 rounded-2xl hover:bg-ink transition-all text-[14px]"
                >
                  <Send size={15} /> Send Barter Request
                </button>
              ) : (
                <div className="bg-white rounded-2xl border border-rust/20 p-5 shadow-sm">
                  <h3 className="font-display font-bold text-ink text-[17px] mb-5">Propose a Trade</h3>

                  <div className="mb-4">
                    <label className="font-mono text-[9px] tracking-widest uppercase text-stone block mb-2">
                      Your Skills to Offer
                    </label>
                    <input
                      placeholder="e.g. React, After Effects (comma-separated)"
                      onChange={e => setOffered(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      className="w-full border-b-2 border-cream2 focus:border-rust py-2.5 text-[13px]
                                 text-charcoal outline-none bg-transparent placeholder-sand transition-colors"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="font-mono text-[9px] tracking-widest uppercase text-stone block mb-2">
                      Message
                    </label>
                    <textarea
                      value={barterMsg}
                      onChange={e => setBarterMsg(e.target.value)}
                      rows={3}
                      placeholder="Introduce yourself and explain your proposal…"
                      className="w-full border border-cream2 rounded-xl px-3 py-2.5 text-[13px]
                                 text-charcoal outline-none focus:border-rust resize-none
                                 placeholder-sand transition-colors"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBarter(false)}
                      className="flex-1 py-3 rounded-xl border border-cream2 text-[13px]
                                 text-stone hover:text-charcoal hover:border-charcoal transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendBarter}
                      disabled={submitting}
                      className="flex-1 bg-rust text-white font-semibold py-3 rounded-xl text-[13px]
                                 hover:bg-ink transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Sending…' : 'Send Request'}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
