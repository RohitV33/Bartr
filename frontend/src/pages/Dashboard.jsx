import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useReveal } from '../hooks/useGsap';
import { Plus, ArrowRight, Star, Coins, Zap, CheckCircle, Clock, BarChart2 } from 'lucide-react';

const STATUS = {
  pending:   { label:'Pending',   cls:'bg-amber-50   text-amber-700   border-amber-200' },
  accepted:  { label:'Active',    cls:'bg-sage/10    text-sage        border-sage/30' },
  active:    { label:'Active',    cls:'bg-sage/10    text-sage        border-sage/30' },
  completed: { label:'Completed', cls:'bg-stone/10   text-stone       border-stone/20' },
  rejected:  { label:'Rejected',  cls:'bg-rust/8     text-rust        border-rust/20' },
  cancelled: { label:'Cancelled', cls:'bg-cream2     text-stone       border-cream2' },
};

function StatCard({ icon: Icon, value, label, accent = false }) {
  return (
    <div className={`rounded-2xl p-6 border ${accent ? 'bg-ink border-ink text-white' : 'bg-white border-cream2'}`}>
      <Icon size={20} className={`mb-4 ${accent ? 'text-rust' : 'text-stone'}`} />
      <p className={`font-display font-bold text-4xl mb-1 ${accent ? 'text-white' : 'text-ink'}`}>{value}</p>
      <p className={`font-mono text-[10px] tracking-widest uppercase ${accent ? 'text-white/40' : 'text-stone'}`}>{label}</p>
    </div>
  );
}

function TradeRow({ trade, userId }) {
  const isReq  = trade.requester_id === userId;
  const other  = isReq ? trade.provider_name : trade.requester_name;
  const avatar = isReq ? trade.provider_avatar : trade.requester_avatar;
  const st     = STATUS[trade.status] || STATUS.pending;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-cream2 last:border-0 hover:bg-cream/50 -mx-6 px-6 transition-colors">
      <img
        src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${other}&backgroundColor=b85c38&textColor=fdfaf6`}
        alt={other} className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-charcoal truncate">{trade.listing_title}</p>
        <p className="font-mono text-[10px] text-stone mt-0.5">with {other} · {isReq ? 'You requested' : 'Incoming'}</p>
      </div>
      <span className={`font-mono text-[9px] tracking-wide px-3 py-1 rounded-full border ${st.cls}`}>{st.label}</span>
    </div>
  );
}

export default function Dashboard() {
  useReveal();
  const { user } = useAuth();
  const [barters, setBarters]       = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [notifs, setNotifs]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState('all');

  useEffect(() => {
    if (!user) return;
    Promise.all([api.get('/barter'), api.get('/listings?limit=6'), api.get('/notifications')])
      .then(([b, l, n]) => {
        setBarters(b.data);
        setMyListings(l.data.listings?.filter(x => x.user_id === user.id) || []);
        setNotifs(n.data.slice(0, 6));
      }).finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <p className="text-stone mb-4">Please sign in first</p>
        <Link to="/login" className="bg-ink text-white px-6 py-3 rounded-full text-[13px] font-semibold">Sign In</Link>
      </div>
    </div>
  );

  const active    = barters.filter(b => ['accepted','active'].includes(b.status));
  const pending   = barters.filter(b => b.status === 'pending');
  const completed = barters.filter(b => b.status === 'completed');
  const filtered  = tab === 'active' ? active : tab === 'pending' ? pending : tab === 'done' ? completed : barters;

  return (
    <div className="min-h-screen bg-cream2 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="sr flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=b85c38&textColor=fdfaf6`}
              alt={user.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white"
            />
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-stone mb-0.5">Dashboard</p>
              <h1 className="font-display font-black text-ink text-3xl">Hey, {user.name.split(' ')[0]}.</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-mono text-[10px] text-rust flex items-center gap-1">
                  <Star size={10} fill="currentColor" />{Number(user.trust_score || 5).toFixed(1)} trust
                </span>
              </div>
            </div>
          </div>
          <Link to="/listings/new"
            className="flex items-center gap-2 bg-rust text-white font-semibold px-5 py-3 rounded-xl
                       text-[13px] hover:bg-ink transition-all">
            <Plus size={15} /> New Listing
          </Link>
        </div>

        {/* Stats */}
        <div className="sr delay-1 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Zap}         value={active.length}    label="Active Trades" accent />
          <StatCard icon={Clock}       value={pending.length}   label="Pending" />
          <StatCard icon={CheckCircle} value={completed.length} label="Completed" />
          <StatCard icon={BarChart2}   value={myListings.length} label="My Listings" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Trades panel */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 border border-cream2 w-fit">
              {[['all','All'],['active','Active'],['pending','Pending'],['done','Done']].map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)}
                  className={`px-4 py-2 rounded-lg font-mono text-[11px] tracking-wide transition-all ${
                    tab === k ? 'bg-ink text-white' : 'text-stone hover:text-charcoal'
                  }`}>
                  {l}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-cream2 px-6 py-2">
              {loading ? (
                <div className="py-8 space-y-4">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-cream rounded-xl animate-pulse" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-14">
                  <p className="font-display text-stone text-lg mb-2">No trades yet</p>
                  <Link to="/listings" className="font-mono text-[11px] text-rust hover:underline">Browse listings →</Link>
                </div>
              ) : filtered.map(t => <TradeRow key={t.id} trade={t} userId={user.id} />)}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
              <div className="px-5 py-4 border-b border-cream2">
                <p className="font-mono text-[10px] tracking-widest uppercase text-stone">Notifications</p>
              </div>
              {notifs.length === 0 ? (
                <p className="text-center text-stone/50 text-[12px] py-8">All clear!</p>
              ) : notifs.map(n => (
                <div key={n.id} className={`flex gap-3 px-5 py-3.5 border-b border-cream2 last:border-0 ${n.read ? 'opacity-40' : ''}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-rust mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] font-semibold text-charcoal">{n.title}</p>
                    <p className="font-mono text-[10px] text-stone mt-0.5 leading-relaxed">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* My listings */}
            <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
              <div className="px-5 py-4 border-b border-cream2 flex items-center justify-between">
                <p className="font-mono text-[10px] tracking-widest uppercase text-stone">My Listings</p>
                <Link to="/listings/new" className="font-mono text-[10px] text-rust hover:underline">+ New</Link>
              </div>
              {myListings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-stone/50 text-[12px] mb-3">No listings yet</p>
                  <Link to="/listings/new"
                    className="font-mono text-[11px] bg-cream px-4 py-2 rounded-lg text-stone hover:text-charcoal transition-colors">
                    Create your first
                  </Link>
                </div>
              ) : myListings.map(l => (
                <Link key={l.id} to={`/listings/${l.id}`}
                  className="flex items-center justify-between px-5 py-3.5 border-b border-cream2 last:border-0
                             hover:bg-cream transition-colors group">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-charcoal truncate">{l.title}</p>
                    <p className="font-mono text-[10px] text-stone mt-0.5">{l.views} views · {l.category}</p>
                  </div>
                  <ArrowRight size={13} className="text-stone/30 group-hover:text-rust transition-colors flex-shrink-0 ml-2" />
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
