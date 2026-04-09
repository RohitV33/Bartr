import { useRef, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, Trash2, Edit2, X, Check, Sparkles, Image } from 'lucide-react'
import { portfolioApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Spinner } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'

/* ─── Custom Cursor ─────────────────────────────────────────────────────────── */
function CustomCursor() {
  const dot = useRef(null); const ring = useRef(null)
  const pos = useRef({x:0,y:0}); const rp = useRef({x:0,y:0}); const [h,setH]=useState(false)
  useEffect(()=>{
    const mv=(e)=>{pos.current={x:e.clientX,y:e.clientY};if(dot.current){dot.current.style.left=`${e.clientX}px`;dot.current.style.top=`${e.clientY}px`}}
    const ov=(e)=>setH(!!e.target.closest('button,a,[role=button],input,textarea'))
    window.addEventListener('mousemove',mv);window.addEventListener('mouseover',ov)
    let raf;const a=()=>{rp.current.x+=(pos.current.x-rp.current.x)*.1;rp.current.y+=(pos.current.y-rp.current.y)*.1;if(ring.current){ring.current.style.left=`${rp.current.x}px`;ring.current.style.top=`${rp.current.y}px`};raf=requestAnimationFrame(a)};raf=requestAnimationFrame(a)
    return()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseover',ov);cancelAnimationFrame(raf)}
  },[])
  return (
    <>
      <div ref={dot} style={{position:'fixed',width:8,height:8,borderRadius:'50%',background:'#f59e0b',pointerEvents:'none',zIndex:9999,transform:'translate(-50%,-50%)',mixBlendMode:'multiply'}} />
      <div ref={ring} style={{position:'fixed',width:h?48:32,height:h?48:32,borderRadius:'50%',border:`2px solid ${h?'#f59e0b':'rgba(245,158,11,0.4)'}`,pointerEvents:'none',zIndex:9998,transform:'translate(-50%,-50%)',transition:'width .3s ease,height .3s ease,border-color .3s ease'}} />
    </>
  )
}

/* ─── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false); const ref = useRef()
  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);io.disconnect()}},{threshold:.05})
    if(ref.current) io.observe(ref.current); return()=>io.disconnect()
  },[])
  return <div ref={ref} className={className} style={{transitionDelay:`${delay}ms`,opacity:v?1:0,transform:v?'translateY(0)':'translateY(24px)',transition:'opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)'}}>{children}</div>
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
function PortfolioHero({ scrollY }) {
  const scale = Math.max(1 - scrollY * 0.0003, 0.94)
  const opacity = Math.max(1 - scrollY * 0.004, 0)
  return (
    <div style={{transform:`scale(${scale})`,opacity,transformOrigin:'top center'}} className="relative overflow-hidden rounded-[2rem] mb-8">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1400&q=80" alt="" className="w-full h-full object-cover" style={{transform:`translateY(${scrollY*.15}px)`,transition:'none'}} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/94 via-gray-900/75 to-purple-950/60" />
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(rgba(255,255,255,0.5) 1px,transparent 1px)',backgroundSize:'20px 20px'}} />
      </div>
      <div className="absolute right-0 top-0 w-80 h-80 opacity-15" style={{background:'radial-gradient(circle,#a855f7,transparent 70%)',transform:'translate(30%,-30%)'}} />
      <div className="relative px-8 py-10">
        <div className="inline-flex items-center gap-2 bg-purple-400/20 text-purple-300 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-400/20 mb-4">
          <Image className="w-3 h-3" /> Your Work
        </div>
        <h1 className="text-3xl font-black text-white mb-2" style={{fontFamily:"'Sora',sans-serif"}}>My Portfolio</h1>
        <p className="text-gray-300 text-sm" style={{fontFamily:"'DM Sans',sans-serif"}}>Showcase your projects, designs, and achievements</p>
      </div>
    </div>
  )
}

/* ─── Portfolio Item ─────────────────────────────────────────────────────────── */
function PortfolioItem({ item, onDelete, onUpdate, delay }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description || '')
  const [tags, setTags] = useState(item.tags?.join(', ') || '')
  const [hov, setHov] = useState(false)

  const handleSave = () => { onUpdate(item.id, { title, description, tags }); setEditing(false) }

  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300"
        style={{ boxShadow: hov ? '0 20px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.05)', transform: hov ? 'translateY(-4px)' : 'none' }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{height: 200}}>
          {item.file_type?.startsWith('image') ? (
            <img
              src={item.file_url} alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hov ? 'scale(1.06)' : 'scale(1)' }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-5xl">{item.file_type?.includes('pdf') ? '📄' : '🎬'}</span>
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300" style={{opacity: hov ? 1 : 0}} />
          {/* Action buttons on hover */}
          {!editing && (
            <div className="absolute top-3 right-3 flex gap-2 transition-all duration-200" style={{opacity: hov ? 1 : 0, transform: hov ? 'translateY(0)' : 'translateY(-8px)'}}>
              <button onClick={() => setEditing(true)} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white shadow-md transition-all">
                <Edit2 className="w-3.5 h-3.5 text-gray-700" />
              </button>
              <button onClick={() => onDelete(item.id)} className="w-8 h-8 bg-red-50/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-red-100 shadow-md transition-all">
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {editing ? (
            <div className="space-y-2.5">
              <input value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition-all"
                style={{fontFamily:"'DM Sans',sans-serif"}} />
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition-all resize-none"
                placeholder="Description…" style={{fontFamily:"'DM Sans',sans-serif"}} />
              <input value={tags} onChange={e => setTags(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition-all"
                placeholder="Tags (comma-separated)" style={{fontFamily:"'DM Sans',sans-serif"}} />
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-400 transition-all">
                  <Check className="w-3 h-3" /> Save
                </button>
                <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all">
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-black text-gray-900 text-sm mb-1" style={{fontFamily:"'Sora',sans-serif"}}>{item.title}</p>
              {item.description && <p className="text-xs text-gray-500 line-clamp-2" style={{fontFamily:"'DM Sans',sans-serif"}}>{item.description}</p>}
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-medium" style={{fontFamily:"'DM Sans',sans-serif"}}>{tag}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Reveal>
  )
}

export default function PortfolioPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const fileRef = useRef()
  const [uploadData, setUploadData] = useState({ title: '', description: '', tags: '' })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.PORTFOLIO(user?.id),
    queryFn: () => portfolioApi.forUser(user?.id).then(r => r.data.data.items),
    enabled: !!user?.id,
  })
  const items = data || []

  const uploadMutation = useMutation({
    mutationFn: (fd) => portfolioApi.create(fd),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIO(user?.id) }); setSelectedFile(null); setUploadData({ title:'',description:'',tags:'' }); setUploadError('') },
    onError: (err) => setUploadError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => portfolioApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIO(user?.id) }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => portfolioApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIO(user?.id) }),
  })

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setSelectedFile(file)
  }

  const handleUpload = () => {
    if (!selectedFile || !uploadData.title) return
    const fd = new FormData()
    fd.append('file', selectedFile); fd.append('title', uploadData.title); fd.append('description', uploadData.description); fd.append('tags', uploadData.tags)
    uploadMutation.mutate(fd)
  }

  return (
    <div style={{cursor:'none'}}>
      <CustomCursor />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap'); *{cursor:none!important}
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>

      <PortfolioHero scrollY={scrollY} />

      {/* Upload area */}
      <Reveal delay={60}>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-black text-gray-900 mb-5" style={{fontFamily:"'Sora',sans-serif"}}>Upload New Item</h2>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 mb-5 ${
              dragOver ? 'border-amber-400 bg-amber-50' : selectedFile ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
            }`}
          >
            <input ref={fileRef} type="file" accept="image/*,video/*,application/pdf" className="hidden" onChange={e => setSelectedFile(e.target.files[0])} />
            {selectedFile ? (
              <div>
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="font-black text-gray-900 text-sm" style={{fontFamily:"'Sora',sans-serif"}}>{selectedFile.name}</p>
                <p className="text-xs text-gray-400 mt-1" style={{fontFamily:"'DM Sans',sans-serif"}}>{(selectedFile.size/1024/1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-600 mb-1" style={{fontFamily:"'Sora',sans-serif"}}>Drop your file here or click to upload</p>
                <p className="text-xs text-gray-400" style={{fontFamily:"'DM Sans',sans-serif"}}>Images, PDF, or Video · Max 5MB</p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="space-y-3">
              <input
                value={uploadData.title}
                onChange={e => setUploadData(d => ({ ...d, title: e.target.value }))}
                placeholder="Project title *"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition-all"
                style={{fontFamily:"'DM Sans',sans-serif"}}
              />
              <textarea
                value={uploadData.description}
                onChange={e => setUploadData(d => ({ ...d, description: e.target.value }))}
                placeholder="Describe the project…"
                rows={2}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition-all resize-none"
                style={{fontFamily:"'DM Sans',sans-serif"}}
              />
              <input
                value={uploadData.tags}
                onChange={e => setUploadData(d => ({ ...d, tags: e.target.value }))}
                placeholder="Tags: design, figma, ui…"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition-all"
                style={{fontFamily:"'DM Sans',sans-serif"}}
              />
              {uploadError && <p className="text-sm text-red-500" style={{fontFamily:"'DM Sans',sans-serif"}}>{uploadError}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setSelectedFile(null)} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-gray-400 transition-all" style={{fontFamily:"'Sora',sans-serif"}}>
                  Cancel
                </button>
                <button
                  disabled={!uploadData.title || uploadMutation.isPending}
                  onClick={handleUpload}
                  className="flex-1 py-3 rounded-2xl bg-gray-900 text-white text-sm font-bold disabled:opacity-50 hover:bg-gray-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  style={{fontFamily:"'Sora',sans-serif"}}
                >
                  {uploadMutation.isPending
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading…</>
                    : <><Upload className="w-4 h-4" /> Upload</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </Reveal>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : items.length === 0 ? (
        <Reveal>
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Image className="w-10 h-10 text-purple-200" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2" style={{fontFamily:"'Sora',sans-serif"}}>No portfolio items yet</h3>
            <p className="text-gray-500" style={{fontFamily:"'DM Sans',sans-serif"}}>Upload your first project to showcase your work.</p>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <p className="text-sm text-gray-400 mb-5" style={{fontFamily:"'DM Sans',sans-serif"}}>
              <span className="text-gray-900 font-black text-lg">{items.length}</span> project{items.length !== 1 ? 's' : ''}
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <PortfolioItem
                key={item.id}
                item={item}
                delay={i * 60}
                onDelete={(id) => deleteMutation.mutate(id)}
                onUpdate={(id, data) => updateMutation.mutate({ id, data })}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}