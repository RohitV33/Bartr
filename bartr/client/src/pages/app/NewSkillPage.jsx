import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { skillsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { Input, Textarea, Select, Button, PageHeader, Spinner } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'

const schema = z.object({
  title: z.string().min(3, 'At least 3 characters'),
  description: z.string().min(10, 'Describe the skill in at least 10 characters'),
  category_id: z.string().min(1, 'Select a category'),
  proficiency_level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']),
  is_offering: z.boolean(),
})

export default function NewSkillPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, setValue, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { is_offering: true, proficiency_level: 'INTERMEDIATE' },
  })

  const isOffering = watch('is_offering')
  const selectedCategory = watch('category_id')

  const { data: catData, isLoading: catsLoading } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => skillsApi.getCategories().then(r => r.data.data.categories),
  })
  const categories = catData || []

  const mutation = useMutation({
    mutationFn: (data) => skillsApi.create(data),
    onSuccess: (res) => navigate(`/skills/${res.data.data.skill.id}`),
    onError: (err) => setError('root', { message: extractError(err) }),
  })

  if (catsLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader
        title="Post a Skill"
        subtitle="Share what you can teach or what you're looking to learn"
      />

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        {/* Toggle: offering vs requesting */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
          {[true, false].map(val => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setValue('is_offering', val)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold font-sora transition-all ${isOffering === val ? 'bg-white text-bartr-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {val ? '✨ I can teach this' : '🎯 I want to learn this'}
            </button>
          ))}
        </div>

        {errors.root && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-red-600 font-dm">{errors.root.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5">
          <Input
            label="Skill title"
            placeholder={isOffering ? 'e.g. React Development, Piano Lessons…' : 'e.g. UI/UX Design, Spanish…'}
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label={isOffering ? 'What you can teach' : 'What you\'re looking for'}
            placeholder={
                isOffering
                  ? `Describe your experience, what you'll teach, and how you'll run sessions…`
                  : `Describe what you want to learn, your current level, and what outcome you're hoping for…`
              }
            rows={4}
            error={errors.description?.message}
            {...register('description')}
          />

          {/* Category grid */}
          <div>
            <label className="text-sm font-medium text-gray-700 font-sora block mb-2">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setValue('category_id', cat.id, { shouldValidate: true })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${selectedCategory === cat.id ? 'border-bartr-dark bg-bartr-dark text-white' : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'}`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-xs font-sora font-medium leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>
            {errors.category_id && <p className="text-xs text-red-500 font-dm mt-1">{errors.category_id.message}</p>}
          </div>

          <Select
            label={isOffering ? 'Your proficiency level' : 'Your current level in this skill'}
            error={errors.proficiency_level?.message}
            {...register('proficiency_level')}
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="EXPERT">Expert</option>
          </Select>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" size="md" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" size="md" loading={mutation.isPending} className="flex-1">
              {isOffering ? '✨ Post offering' : '🎯 Post request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
