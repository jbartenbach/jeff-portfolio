import PublicSiteChrome from '../components/case-study/PublicSiteChrome'
import PageHeader from '../components/site/PageHeader'
import { contactContent } from '../content/siteContent'

export default function ContactPage() {
  return (
    <PublicSiteChrome>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description={contactContent.intro}
      />
      <main className="border-b border-slate-800/70 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <p className="text-sm font-medium uppercase tracking-widest text-amber-500/90">Phone</p>
              <a
                href={contactContent.phone.href}
                className="mt-3 block font-display text-3xl text-white transition-colors hover:text-amber-400"
              >
                {contactContent.phone.display}
              </a>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <p className="text-sm font-medium uppercase tracking-widest text-amber-500/90">Email</p>
              <a
                href={contactContent.email.href}
                className="mt-3 block font-display text-3xl text-white transition-colors hover:text-amber-400"
              >
                {contactContent.email.display}
              </a>
            </div>
          </div>
        </div>
      </main>
    </PublicSiteChrome>
  )
}
