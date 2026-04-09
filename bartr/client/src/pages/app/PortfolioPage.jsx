import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, Trash2, Edit2, X, Check } from 'lucide-react'
import { portfolioApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Card, Spinner, EmptyState, Button, Input, Textarea, PageHeader } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'

function PortfolioItem({ item, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description || '')
  const [tags, setTags] = useState(item.tags?.join(', ') || '')

  const handleSave = () => {
    onUpdate(item.id, { title, description, tags })
    setEditing(false)
  }

  return (
    <Card className="overflow-hidden">
      {item.file_type?.startsWith('image') ? (
        <img src={item.file_url} alt={item.title} className="w-full h-44 object-cover bg-gray-100" />
      ) : (
        <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
          <span className="text-4xl">{item.file_type?.includes('pdf') ? '📄' : '🎬'}</span>
        </div>
      )}
      <div className="p-4">
        {editing ? (
          <div className="space-y-2">
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-yellow-300" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none" placeholder="Description…" />
            <input value={tags} onChange={e => setTags(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-yellow-300" placeholder="Tags (comma-separated)" />
            <div className="flex gap-2">
              <Button variant="primary" size="xs" onClick={handleSave}><Check className="w-3 h-3" /></Button>
              <Button variant="ghost" size="xs" onClick={() => setEditing(false)}><X className="w-3 h-3" /></Button>
            </div>
          </div>
        ) : (
          <>
            <p className="font-sora font-semibold text-gray-900 text-sm">{item.title}</p>
            {item.description && <p className="text-xs text-gray-500 font-dm mt-0.5 line-clamp-2">{item.description}</p>}
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-dm">{tag}</span>)}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-gray-700 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => onDelete(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

export default function PortfolioPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const fileRef = useRef()
  const [uploadData, setUploadData] = useState({ title: '', description: '', tags: '' })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadError, setUploadError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.PORTFOLIO(user?.id),
    queryFn: () => portfolioApi.forUser(user?.id).then(r => r.data.data.items),
    enabled: !!user?.id,
  })
  const items = data || []

  const uploadMutation = useMutation({
    mutationFn: (fd) => portfolioApi.create(fd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIO(user?.id) })
      setSelectedFile(null)
      setUploadData({ title: '', description: '', tags: '' })
      setUploadError('')
    },
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setSelectedFile(file)
  }

  const handleUpload = () => {
    if (!selectedFile || !uploadData.title) return
    const fd = new FormData()
    fd.append('file', selectedFile)
    fd.append('title', uploadData.title)
    fd.append('description', uploadData.description)
    fd.append('tags', uploadData.tags)
    uploadMutation.mutate(fd)
  }

  return (
    <div>
      <PageHeader title="My Portfolio" subtitle="Showcase your work and projects" />

      {/* Upload card */}
      <Card className="p-6 mb-8">
        <h2 className="font-sora font-bold text-gray-900 mb-4">Upload a new item</h2>
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-yellow-300 transition-colors mb-4"
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept="image/*,video/*,application/pdf" className="hidden" onChange={handleFileChange} />
          {selectedFile ? (
            <div>
              <p className="font-semibold text-gray-900 font-sora">{selectedFile.name}</p>
              <p className="text-xs text-gray-400 font-dm mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-dm text-gray-500">Click to upload an image, PDF, or video</p>
              <p className="text-xs text-gray-400 font-dm mt-1">Max 5MB</p>
            </>
          )}
        </div>

        {selectedFile && (
          <div className="space-y-3">
            <Input
              label="Title *"
              value={uploadData.title}
              onChange={e => setUploadData(d => ({ ...d, title: e.target.value }))}
              placeholder="e.g. Fintech App Redesign"
            />
            <Textarea
              label="Description"
              value={uploadData.description}
              onChange={e => setUploadData(d => ({ ...d, description: e.target.value }))}
              placeholder="Describe the project…"
              rows={2}
            />
            <Input
              label="Tags (comma-separated)"
              value={uploadData.tags}
              onChange={e => setUploadData(d => ({ ...d, tags: e.target.value }))}
              placeholder="design, figma, ui"
            />
            {uploadError && <p className="text-sm text-red-500 font-dm">{uploadError}</p>}
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={() => setSelectedFile(null)}>Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!uploadData.title}
                loading={uploadMutation.isPending}
                onClick={handleUpload}
              >
                Upload
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : items.length === 0 ? (
        <EmptyState icon="🖼️" title="No portfolio items yet" description="Upload your first project to showcase your work." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <PortfolioItem
              key={item.id}
              item={item}
              onDelete={(id) => deleteMutation.mutate(id)}
              onUpdate={(id, data) => updateMutation.mutate({ id, data })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
