import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Send, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function Bubble({ msg, isMe }) {
  return (
    <div className={`flex items-end gap-2 mb-4 ${isMe ? 'flex-row-reverse' : ''}`}>
      <img
        src={msg.sender_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender_name}&backgroundColor=b85c38&textColor=fdfaf6`}
        alt={msg.sender_name}
        className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1"
      />
      <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed max-w-xs md:max-w-sm ${
          isMe
            ? 'bg-ink text-white rounded-br-sm'
            : 'bg-white text-charcoal border border-cream2 rounded-bl-sm'
        }`}>
          {msg.content}
        </div>
        <span className="font-mono text-[10px] text-stone/50 px-1">
          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

export default function Chat() {
  const { user } = useAuth();
  const [rooms, setRooms]         = useState([]);
  const [active, setActive]       = useState(null);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [typing, setTyping]       = useState(false);
  const endRef = useRef(null);

  useEffect(() => { api.get('/chat/rooms').then(r => setRooms(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    if (!active) return;
    api.get(`/chat/rooms/${active.id}/messages`).then(r => setMessages(r.data)).catch(() => {});
  }, [active]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim() || !active) return;
    const msg = {
      id: Date.now(), room_id: active.id,
      sender_id: user.id, sender_name: user.name,
      sender_avatar: user.avatar_url,
      content: input.trim(), created_at: new Date().toISOString(),
    };
    setMessages(m => [...m, msg]);
    setInput('');
  };

  if (!user) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="text-stone">Please sign in to access chat.</p>
    </div>
  );

  const otherName = active
    ? (active.user1_id === user.id ? active.user2_name : active.user1_name)
    : null;

  return (
    <div className="bg-cream h-screen flex flex-col pt-[70px]">
      <div className="flex flex-1 overflow-hidden max-w-7xl w-full mx-auto">

        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-cream2 flex flex-col flex-shrink-0">
          <div className="p-5 border-b border-cream2">
            <h2 className="font-display font-bold text-ink text-xl mb-3">Messages</h2>
            <input placeholder="Search conversations…"
              className="w-full bg-cream2 rounded-xl px-3 py-2.5 font-mono text-[12px] text-charcoal
                         placeholder-stone outline-none" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {rooms.length === 0 ? (
              <div className="text-center pt-12 px-4">
                <MessageSquare size={28} className="text-stone/25 mx-auto mb-3" />
                <p className="text-stone/50 text-[12px]">No conversations yet</p>
                <p className="font-mono text-[10px] text-stone/30 mt-1">Accept a barter to start chatting</p>
              </div>
            ) : rooms.map(r => {
              const other = r.user1_id === user.id ? r.user2_name : r.user1_name;
              const otherAvatar = r.user1_id === user.id ? r.user2_avatar : r.user1_avatar;
              return (
                <button key={r.id} onClick={() => setActive(r)}
                  className={`w-full flex items-center gap-3 p-4 border-b border-cream2 text-left
                               hover:bg-cream transition-colors relative
                               ${active?.id === r.id ? 'bg-cream' : ''}`}>
                  {active?.id === r.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rust" />
                  )}
                  <img
                    src={otherAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${other}&backgroundColor=2a2520&textColor=f2ede6`}
                    alt={other} className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-charcoal">{other}</p>
                    <p className="font-mono text-[10px] text-stone truncate mt-0.5">{r.last_message || 'No messages yet'}</p>
                  </div>
                  {r.unread > 0 && (
                    <span className="w-5 h-5 bg-rust text-white font-mono text-[9px] rounded-full flex items-center justify-center">
                      {r.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col bg-cream overflow-hidden">
          {active ? (
            <>
              <div className="bg-white border-b border-cream2 px-6 py-4 flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${otherName}&backgroundColor=2a2520&textColor=f2ede6`}
                  alt={otherName} className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-charcoal text-[14px]">{otherName}</p>
                  {typing && <p className="font-mono text-[10px] text-rust animate-pulse">Typing…</p>}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {messages.length === 0 ? (
                  <div className="text-center pt-14">
                    <p className="text-stone/50 text-[13px]">Start the conversation 👋</p>
                  </div>
                ) : messages.map(m => (
                  <Bubble key={m.id} msg={m} isMe={m.sender_id === user.id} />
                ))}
                <div ref={endRef} />
              </div>

              <div className="bg-white border-t border-cream2 p-4 flex gap-3 items-end">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Type a message…"
                  className="flex-1 bg-cream border border-cream2 rounded-2xl px-4 py-3 text-[13px]
                             text-charcoal placeholder-stone focus:outline-none focus:border-rust transition-colors"
                />
                <button onClick={send} disabled={!input.trim()}
                  className="w-11 h-11 bg-ink rounded-2xl flex items-center justify-center
                             hover:bg-rust transition-all disabled:opacity-40 flex-shrink-0">
                  <Send size={15} className="text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <MessageSquare size={40} className="text-stone/15 mb-4" />
              <p className="text-stone/40 text-[14px]">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
