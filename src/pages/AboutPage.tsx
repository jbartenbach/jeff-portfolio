import PublicSiteChrome from '../components/case-study/PublicSiteChrome'
import { AIPracticeSection, WhatIDoSection } from '../components/site/AboutSections'
import PageHeader from '../components/site/PageHeader'

export default function AboutPage() {
  return (
    <PublicSiteChrome>
      <PageHeader
        eyebrow="About"
        title={
          <>
            Design leadership at <em className="text-slate-400 not-italic">every layer</em> of the stack.
          </>
        }
        description="Twenty years across hardware, software, health, and consumer tech — building teams, shipping 0-to-1 products, and scaling systems people actually use."
      />
      <main>
        <WhatIDoSection />
        <AIPracticeSection />
      </main>
    </PublicSiteChrome>
  )
}
