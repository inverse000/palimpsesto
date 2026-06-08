interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-ivory-100 text-2xl tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-ivory-500 font-serif italic">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
