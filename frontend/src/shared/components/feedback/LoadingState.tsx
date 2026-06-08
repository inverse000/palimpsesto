interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-ivory-500">
      <div className="w-8 h-8 border-2 border-bronze-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-serif italic">{message}</p>
    </div>
  )
}

// Skeleton para cards
export function SkeletonCard() {
  return (
    <div className="bg-carbon-700 border border-carbon-600 rounded-lg p-5 animate-pulse">
      <div className="h-4 bg-carbon-600 rounded w-3/5 mb-3" />
      <div className="h-3 bg-carbon-600 rounded w-4/5 mb-2" />
      <div className="h-3 bg-carbon-600 rounded w-2/5" />
    </div>
  )
}
