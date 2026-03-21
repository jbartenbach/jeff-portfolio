import { Link } from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

/**
 * Shared header/footer for marketing pages (home, work index, case studies).
 */
export default function PublicSiteChrome({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-display text-2xl tracking-tight text-white hover:text-amber-100 transition-colors">
            Jeff Bartenbach
          </Link>
          <nav className="flex gap-8 text-sm font-medium text-slate-400">
            <Link to="/#work" className="hover:text-white transition-colors">
              Work
            </Link>
            <Link to="/#about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link to="/#contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer id="contact" className="border-t border-slate-800 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left">
          <span className="font-display text-2xl text-white">Jeff Bartenbach</span>
          <p className="text-sm text-slate-400">
            <a href="tel:2067347275" className="text-amber-500 hover:opacity-80">
              206.734.7275
            </a>
            {' · '}
            <a href="mailto:jbartenbach@gmail.com" className="text-amber-500 hover:opacity-80">
              jbartenbach@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
