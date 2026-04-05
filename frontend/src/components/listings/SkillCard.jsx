import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Star, MapPin } from 'lucide-react';

const CAT_IMAGES = {
  Coding:   'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=75',
  Design:   'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=75',
  Writing:  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=75',
  Music:    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=75',
  Teaching: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=75',
  Video:    'https://images.unsplash.com/photo-1574717024453-354056aafa98?w=400&q=75',
  Marketing:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=75',
  Finance:  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=75',
  Other:    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=75',
};

export default function SkillCard({ listing }) {
  const img = CAT_IMAGES[listing.category] || CAT_IMAGES.Other;

  return (
    <Link to={`/listings/${listing.id}`}
      className="group bg-white rounded-2xl border border-cream2 overflow-hidden
                 hover-lift transition-all duration-300 hover:border-rust/30 block">
      {/* Image */}
      <div className="h-44 overflow-hidden relative img-zoom">
        <img src={img} alt={listing.category} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[9px] tracking-widest uppercase
                           bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/20">
            {listing.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 w-7 h-7 bg-white/15 backdrop-blur-sm rounded-full
                        flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={13} className="text-white" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-display font-bold text-ink text-[16px] leading-tight mb-2 clamp-2
                       group-hover:text-rust transition-colors">
          {listing.title}
        </h3>
        <p className="text-stone text-[12px] leading-relaxed clamp-2 mb-4">{listing.description}</p>

        {/* Offering */}
        <div className="mb-3">
          <p className="font-mono text-[9px] tracking-widest uppercase text-stone/50 mb-1.5">Offering</p>
          <div className="flex flex-wrap gap-1.5">
            {listing.skills_offered?.slice(0, 3).map(s => (
              <span key={s}
                className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-cream border border-cream2 text-stone">
                {s}
              </span>
            ))}
            {listing.skills_offered?.length > 3 && (
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-cream border border-cream2 text-stone">
                +{listing.skills_offered.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Wants */}
        {listing.skills_wanted?.length > 0 && (
          <div className="mb-4">
            <p className="font-mono text-[9px] tracking-widest uppercase text-stone/50 mb-1.5">Wants</p>
            <div className="flex flex-wrap gap-1.5">
              {listing.skills_wanted?.slice(0, 2).map(s => (
                <span key={s}
                  className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-rust/25 bg-rust/5 text-rust">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 pt-3 border-t border-cream2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={listing.owner_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${listing.owner_name}&backgroundColor=b85c38&textColor=fdfaf6`}
            alt={listing.owner_name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-[12px] text-stone">{listing.owner_name}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-stone/50 font-mono">
          <span className="flex items-center gap-1">
            <Star size={10} className="text-rust fill-rust" />
            {Number(listing.trust_score || 4.5).toFixed(1)}
          </span>
          {listing.location && (
            <span className="flex items-center gap-1"><MapPin size={10} />{listing.location}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
