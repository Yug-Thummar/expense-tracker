import { IndianRupee, Info, LayoutDashboard, Receipt } from 'lucide-react'
import type { ReactNode } from 'react'

export type AppView = 'dashboard' | 'transactions' | 'about'

const NAV_ITEMS: { id: AppView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'about', label: 'About', icon: Info },
]

type AppShellProps = {
  view: AppView
  onViewChange: (view: AppView) => void
  children: ReactNode
}

export function AppShell({ view, onViewChange, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink lg:flex">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-white lg:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <BrandMark />
          <div>
            <p className="text-sm font-semibold">Expense Tracker</p>
            <p className="text-xs text-muted">Personal notebook</p>
          </div>
        </div>
        <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavButton key={item.id} item={item} active={view === item.id} mobile={false} onViewChange={onViewChange} />
          ))}
        </nav>
        <p className="m-4 rounded-xl bg-canvas px-3 py-3 text-xs leading-5 text-muted">
          Records stay in this browser profile. They are not uploaded to a server.
        </p>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur lg:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <BrandMark />
            <div>
              <p className="text-sm font-semibold leading-tight">Expense Tracker</p>
              <p className="text-xs text-muted">Saved in this browser</p>
            </div>
          </div>
          <nav aria-label="Primary" className="grid grid-cols-3 gap-2 px-3 pb-3">
            {NAV_ITEMS.map((item) => (
              <NavButton key={item.id} item={item} active={view === item.id} mobile onViewChange={onViewChange} />
            ))}
          </nav>
        </header>
        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function BrandMark() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
      <IndianRupee aria-hidden="true" size={18} />
    </span>
  )
}

function NavButton({
  item,
  active,
  mobile,
  onViewChange,
}: {
  item: (typeof NAV_ITEMS)[number]
  active: boolean
  mobile: boolean
  onViewChange: (view: AppView) => void
}) {
  const Icon = item.icon
  const layout = mobile
    ? 'flex h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold'
    : 'flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold'
  const state = active ? 'bg-soft text-accent' : 'text-muted hover:bg-canvas hover:text-ink'

  return (
    <button
      type="button"
      className={`${layout} cursor-pointer ${state}`}
      aria-current={active ? 'page' : undefined}
      onClick={() => onViewChange(item.id)}
    >
      <Icon aria-hidden="true" size={16} />
      {item.label}
    </button>
  )
}
