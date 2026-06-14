import { useRef, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UploadSimple, Trash, PencilSimple, X, Check, Sparkle, Image } from '@phosphor-icons/react'
import { portfolioApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Spinner } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'

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
    <div style={{transform:`scale(${scale})`,opacity,transformOrigin:'top center'}} className="relative overflow-hidden rounded-3xl mb-8 border-2 border-bartr-border bg-bartr-surface shadow-[4px_4px_0px_var(--border)] dotted-bg">
      <div className="relative px-8 py-10 z-10">
        <div className="inline-flex items-center gap-2 bg-bartr-text text-bartr-bg text-xs font-black px-3 py-1.5 rounded-lg border border-bartr-border mb-4">
          <Image className="w-3 h-3" /> Your Work
        </div>
        <h1 className="text-3xl font-black text-bartr-text mb-2" style={{fontFamily:"'Sora',sans-serif"}}>My Portfolio</h1>
        <p className="text-bartr-muted text-sm font-medium" style={{fontFamily:"'DM Sans',sans-serif"}}>Showcase your projects, designs, and achievements</p>
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
        className="bg-bartr-surface rounded-2xl border-2 border-bartr-border overflow-hidden transition-all duration-150 shadow-[3px_3px_0px_var(--border)]"
        style={{ transform: hov ? 'translate(-2px, -2px)' : 'none', boxShadow: hov ? '6px 6px 0px var(--border)' : '3px 3px 0px var(--border)' }}
      >
        {/* Image */}
        <div className="relative overflow-hidden border-b-2 border-bartr-border" style={{height: 200}}>
          {item.file_type?.startsWith('image') ? (
            <img
              src={item.file_url} alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hov ? 'scale(1.06)' : 'scale(1)' }}
            />
          ) : (
            <div className="w-full h-full bg-bartr-bg flex items-center justify-center">
              <span className="text-5xl">{item.file_type?.includes('pdf') ? '📄' : '🎬'}</span>
            </div>
          )}
          {/* Action buttons on hover */}
          {!editing && (
            <div className="absolute top-3 right-3 flex gap-2 transition-all duration-200" style={{opacity: hov ? 1 : 0, transform: hov ? 'translateY(0)' : 'translateY(-8px)'}}>
              <button onClick={() => setEditing(true)} className="w-8 h-8 bg-bartr-surface/90 border border-bartr-border backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-bartr-text hover:text-bartr-bg shadow-md transition-all">
                <PencilSimple className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(item.id)} className="w-8 h-8 bg-red-500/10 border border-red-500 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-red-500/20 shadow-md transition-all">
                <Trash className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {editing ? (
            <div className="space-y-2.5">
              <input value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-bartr-bg border-2 border-bartr-border text-sm text-bartr-text focus:outline-none focus:border-bartr-text transition-all font-medium"
                style={{fontFamily:"'DM Sans',sans-serif"}} />
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                className="w-full px-3 py-2 rounded-xl bg-bartr-bg border-2 border-bartr-border text-sm text-bartr-text focus:outline-none focus:border-bartr-text transition-all resize-none font-medium"
                placeholder="Description…" style={{fontFamily:"'DM Sans',sans-serif"}} />
              <input value={tags} onChange={e => setTags(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-bartr-bg border-2 border-bartr-border text-sm text-bartr-text focus:outline-none focus:border-bartr-text transition-all font-medium"
                placeholder="Tags (comma-separated)" style={{fontFamily:"'DM Sans',sans-serif"}} />
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-bartr-text text-bartr-bg border-2 border-bartr-border text-xs font-bold rounded-xl hover:bg-bartr-text/90 transition-all shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none">
                  <Check className="w-3 h-3" /> Save
                </button>
                <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 bg-bartr-surface text-bartr-text border-2 border-bartr-border text-xs font-bold rounded-xl hover:bg-bartr-bg transition-all">
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-black text-bartr-text text-sm mb-1" style={{fontFamily:"'Sora',sans-serif"}}>{item.title}</p>
              {item.description && <p className="text-xs text-bartr-muted line-clamp-2 font-medium" style={{fontFamily:"'DM Sans',sans-serif"}}>{item.description}</p>}
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-bartr-bg text-bartr-text border border-bartr-border px-2 py-0.5 rounded-lg font-black" style={{fontFamily:"'DM Sans',sans-serif"}}>{tag}</span>
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
    <div className="px-4 py-2">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <PortfolioHero scrollY={scrollY} />

      {/* Upload area */}
      <Reveal delay={60}>
        <div className="bg-bartr-surface border-2 border-bartr-border shadow-[4px_4px_0px_var(--border)] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-black text-bartr-text mb-5" style={{fontFamily:"'Sora',sans-serif"}}>Upload New Item</h2>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 mb-5 ${
              dragOver ? 'border-bartr-text bg-bartr-text/5' : selectedFile ? 'border-bartr-text bg-bartr-text/10' : 'border-bartr-border hover:border-bartr-text hover:bg-bartr-text/5'
            }`}
          >
            <input ref={fileRef} type="file" accept="image/*,video/*,application/pdf" className="hidden" onChange={e => setSelectedFile(e.target.files[0])} />
            {selectedFile ? (
              <div>
                <div className="w-12 h-12 bg-bartr-text/10 border border-bartr-border rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-bartr-text" />
                </div>
                <p className="font-black text-bartr-text text-sm" style={{fontFamily:"'Sora',sans-serif"}}>{selectedFile.name}</p>
                <p className="text-xs text-bartr-muted font-bold mt-1" style={{fontFamily:"'DM Sans',sans-serif"}}>{(selectedFile.size/1024/1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 bg-bartr-text/10 border border-bartr-border rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UploadSimple className="w-6 h-6 text-bartr-text" />
                </div>
                <p className="text-sm font-bold text-bartr-text mb-1" style={{fontFamily:"'Sora',sans-serif"}}>Drop your file here or click to upload</p>
                <p className="text-xs text-bartr-muted font-bold" style={{fontFamily:"'DM Sans',sans-serif"}}>Images, PDF, or Video · Max 5MB</p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="space-y-3">
              <input
                value={uploadData.title}
                onChange={e => setUploadData(d => ({ ...d, title: e.target.value }))}
                placeholder="Project title *"
                className="w-full px-4 py-3 rounded-xl bg-bartr-bg border-2 border-bartr-border text-sm text-bartr-text placeholder-bartr-muted focus:outline-none focus:border-bartr-text transition-all font-medium"
                style={{fontFamily:"'DM Sans',sans-serif"}}
              />
              <textarea
                value={uploadData.description}
                onChange={e => setUploadData(d => ({ ...d, description: e.target.value }))}
                placeholder="Describe the project…"
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-bartr-bg border-2 border-bartr-border text-sm text-bartr-text placeholder-bartr-muted focus:outline-none focus:border-bartr-text transition-all resize-none font-medium"
                style={{fontFamily:"'DM Sans',sans-serif"}}
              />
              <input
                value={uploadData.tags}
                onChange={e => setUploadData(d => ({ ...d, tags: e.target.value }))}
                placeholder="Tags: design, figma, ui…"
                className="w-full px-4 py-3 rounded-xl bg-bartr-bg border-2 border-bartr-border text-sm text-bartr-text placeholder-bartr-muted focus:outline-none focus:border-bartr-text transition-all font-medium"
                style={{fontFamily:"'DM Sans',sans-serif"}}
              />
              {uploadError && <p className="text-sm text-red-500 font-bold" style={{fontFamily:"'DM Sans',sans-serif"}}>{uploadError}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setSelectedFile(null)} className="flex-1 py-3 rounded-xl border-2 border-bartr-border bg-bartr-surface text-sm font-bold text-bartr-text hover:bg-bartr-bg transition-all" style={{fontFamily:"'Sora',sans-serif"}}>
                  Cancel
                </button>
                <button
                  disabled={!uploadData.title || uploadMutation.isPending}
                  onClick={handleUpload}
                  className="flex-1 py-3 rounded-xl bg-bartr-text text-bartr-bg border-2 border-bartr-border text-sm font-bold disabled:opacity-50 hover:bg-bartr-text/90 transition-all shadow-[3px_3px_0px_var(--border)] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
                  style={{fontFamily:"'Sora',sans-serif"}}
                >
                  {uploadMutation.isPending
                    ? <><div className="w-4 h-4 border-2 border-bartr-bg border-t-transparent rounded-full animate-spin" /> Uploading…</>
                    : <><UploadSimple className="w-4 h-4" /> Upload</>
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
          <div className="text-center py-20 bg-bartr-surface border-2 border-bartr-border rounded-2xl shadow-[4px_4px_0px_var(--border)] max-w-xl mx-auto dotted-bg">
            <div className="w-20 h-20 bg-bartr-text/10 border border-bartr-border rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Image className="w-10 h-10 text-bartr-text" />
            </div>
            <h3 className="text-xl font-black text-bartr-text mb-2" style={{fontFamily:"'Sora',sans-serif"}}>No portfolio items yet</h3>
            <p className="text-bartr-muted font-medium text-sm" style={{fontFamily:"'DM Sans',sans-serif"}}>Upload your first project to showcase your work.</p>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <p className="text-sm text-bartr-muted mb-5 font-bold" style={{fontFamily:"'DM Sans',sans-serif"}}>
              <span className="text-bartr-text font-black text-lg">{items.length}</span> project{items.length !== 1 ? 's' : ''}
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