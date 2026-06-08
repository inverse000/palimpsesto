import { NavLink } from 'react-router-dom'

interface NavItem {
  path: string
  label: string
  icon: string
  enabled: boolean
}

const navItems: NavItem[] = [
  { path: '/dashboard',  label: 'Archivo',     icon: '⊞', enabled: true },
  { path: '/proyectos',  label: 'Proyectos',   icon: '◫', enabled: true },
  { path: '/rituales',   label: 'Rituales',    icon: '◈', enabled: false },
  { path: '/conceptos',  label: 'Conceptos',   icon: '◉', enabled: false },
  { path: '/revisiones', label: 'Revisiones',  icon: '◷', enabled: false },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen bg-carbon-800 border-r border-carbon-700">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-carbon-700">
        <h1 className="font-display text-ivory-200 text-lg tracking-wide">
          Palimpsesto
        </h1>
        <p className="text-xs text-bronze-500 font-mono mt-0.5 tracking-wider">
          Yuyaypata
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) =>
          item.enabled ? (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2 rounded text-sm font-serif transition-all duration-150',
                  isActive
                    ? 'bg-bronze-900/30 text-bronze-400 border border-bronze-800/40'
                    : 'text-ivory-500 hover:text-ivory-200 hover:bg-carbon-700 border border-transparent',
                ].join(' ')
              }
            >
              <span className="text-base opacity-70">{item.icon}</span>
              {item.label}
            </NavLink>
          ) : (
            <div
              key={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm font-serif text-carbon-500 cursor-not-allowed border border-transparent"
              title="Disponible en próximas iteraciones"
            >
              <span className="text-base opacity-40">{item.icon}</span>
              {item.label}
              <span className="ml-auto text-xs font-mono text-carbon-600">v2+</span>
            </div>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-carbon-700">
        <p className="text-xs text-carbon-500 font-mono">V1 · MVP</p>
      </div>
    </aside>
  )
}
