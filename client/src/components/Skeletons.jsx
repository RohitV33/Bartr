import React from 'react'

export const SkeletonBox = ({ className = '' }) => (
  <div className={`bg-bartr-border/20 animate-pulse rounded-xl ${className}`} />
)

export const SkillCardSkeleton = ({ layout = 'grid' }) => {
  if (layout === 'row') {
    return (
      <div className="bg-bartr-surface border-2 border-bartr-border/50 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <SkeletonBox className="w-16 h-16 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3 w-full">
          <div className="flex items-center justify-between">
            <SkeletonBox className="h-6 w-1/3" />
            <SkeletonBox className="h-6 w-24 rounded-full" />
          </div>
          <SkeletonBox className="h-4 w-2/3" />
          <div className="flex items-center gap-3 pt-2">
            <SkeletonBox className="w-8 h-8 rounded-full" />
            <SkeletonBox className="h-4 w-32" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bartr-surface border-2 border-bartr-border/50 rounded-3xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <SkeletonBox className="w-12 h-12 rounded-2xl" />
        <SkeletonBox className="h-6 w-20 rounded-full" />
      </div>
      <SkeletonBox className="h-7 w-3/4 mb-3" />
      <SkeletonBox className="h-4 w-full mb-2" />
      <SkeletonBox className="h-4 w-5/6 mb-6" />
      
      <div className="mt-auto pt-4 border-t-2 border-bartr-border/30 flex items-center gap-3">
        <SkeletonBox className="w-10 h-10 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

export const StatCardSkeleton = () => (
  <div className="bg-bartr-surface border-2 border-bartr-border/50 rounded-3xl p-6 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <SkeletonBox className="w-12 h-12 rounded-2xl" />
      <SkeletonBox className="h-5 w-32" />
    </div>
    <SkeletonBox className="h-8 w-12" />
  </div>
)
