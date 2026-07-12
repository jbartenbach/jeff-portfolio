import { useState } from 'react'

type Tab = 'home' | 'shortcuts' | 'robots' | 'activity'

const tabs: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'shortcuts', label: 'Shortcuts' },
  { id: 'robots', label: 'Robots' },
  { id: 'activity', label: 'Activity' },
]

const contentSrc: Record<Tab, string> = {
  home: '/work/wink-prototype/content-home.png',
  shortcuts: '/work/wink-prototype/content-shortcuts.png',
  robots: '/work/wink-prototype/content-robots.png',
  activity: '/work/wink-prototype/content-activity.png',
}

const screenBg: Record<Tab, string> = {
  home: '#3db5d8',
  shortcuts: '#2a323d',
  robots: '#2a323d',
  activity: '#2a323d',
}

function NavIcon({ id }: { id: Tab }) {
  if (id === 'home') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    )
  }
  if (id === 'shortcuts') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 7h16M4 12h16M4 17h16" />
        <circle cx="8" cy="7" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="14" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="10" cy="17" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (id === 'robots') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="6" y="7" width="12" height="11" rx="2.5" />
        <circle cx="10" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="14" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <path d="M9.5 15.5h5M12 4.5v2.5M8.5 9.5h-2M17.5 9.5h2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.2l2.8 1.6" />
    </svg>
  )
}

/**
 * Interactive Wink app mini-prototype: four tabs via bottom nav.
 */
export default function WinkPrototype() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div className="mx-auto w-full max-w-[280px]">
      <div
        className="relative aspect-[9/19] overflow-hidden rounded-[2rem] border border-slate-600/80 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
        style={{ backgroundColor: screenBg[tab] }}
      >
        <div
          className={`relative z-20 flex items-center justify-between px-5 pt-3.5 text-[11px] font-semibold tracking-tight text-white ${
            tab === 'home' ? '' : ''
          }`}
        >
          <span>2:43</span>
          <span className="inline-flex h-2.5 w-5 items-stretch rounded-[2px] border border-current p-px">
            <span className="w-[55%] rounded-[1px] bg-current" />
          </span>
        </div>

        <img
          src={contentSrc[tab]}
          alt={`Wink ${tab} screen`}
          className="absolute inset-0 h-full w-full object-cover object-top"
          draggable={false}
        />

        <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-4 pt-10">
          <nav
            className="flex h-14 items-center rounded-full bg-[#1a222c]/80 px-1 shadow-lg backdrop-blur-md"
            aria-label="Wink app navigation"
          >
            {tabs.map((t) => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-label={t.label}
                  aria-pressed={active}
                  onClick={() => setTab(t.id)}
                  className={`flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 ${
                    active ? 'text-white' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <NavIcon id={t.id} />
                  <span className="text-[9px] font-medium leading-none">{t.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">Tap the nav to explore</p>
    </div>
  )
}
