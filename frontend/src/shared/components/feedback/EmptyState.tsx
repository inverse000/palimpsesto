import { Button } from '../ui/Button'

interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: string
}

export function EmptyState({ title, description, action, icon = '◈' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="text-4xl text-carbon-500 select-none">{icon}</span>
      <div className="flex flex-col gap-1">
        <p className="font-display text-ivory-400 text-base">{title}</p>
        {description && (
          <p className="text-sm text-ivory-500 font-serif max-w-xs">{description}</p>
        )}
      </div>
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
