/**
 * Case study content maps to the shared template (see CASE_STUDIES.md).
 * Replace body copy with text from your Google Doc as you refine each page.
 */

export type CaseStudyMetaRow = { label: string; value: string }

export type CaseStudySection = {
  /** Stable id for anchors / future CMS */
  id: string
  title: string
  /** Paragraphs (each rendered as <p>) */
  paragraphs: string[]
  /** Optional bullet list under the section */
  bullets?: string[]
  /** Art direction / layout notes for a future visual pass */
  visualSuggestions?: string[]
}

export type CaseStudySummaryItem = { label: string; value: string }

export type CaseStudyListItem = {
  slug: string
  title: string
  tag: string
  /** Short line for cards / index */
  blurb: string
  meta: string
  /** If false, card links to # and shows as placeholder */
  published: boolean
}

export type CaseStudy = {
  slug: string
  title: string
  subtitle: string
  tag: string
  /** One-line hook under the title */
  dek: string
  meta: CaseStudyMetaRow[]
  summary: CaseStudySummaryItem[]
  sections: CaseStudySection[]
  /** Optional hero art-direction notes (below metrics strip) */
  heroVisualSuggestions?: string[]
}

export const caseStudyList: CaseStudyListItem[] = [
  {
    slug: 'wink',
    title: 'Wink',
    tag: 'Smart Home · Platform · Hardware',
    blurb:
      'Founding designer to VP. Built the team, designed the platform, shipped 60+ products across 40+ brand partners. Hub 2 reduced setup from 30 to 7 minutes.',
    meta: '2013–2018 · Founding Designer → VP',
    published: true,
  },
  {
    slug: 'project-alpha',
    title: 'Lorem ipsum dolor',
    tag: 'Placeholder · Case study',
    blurb:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    meta: 'TBD',
    published: false,
  },
  {
    slug: 'project-beta',
    title: 'Sit amet consectetur',
    tag: 'Placeholder · Case study',
    blurb:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    meta: 'TBD',
    published: false,
  },
]

export const caseStudiesBySlug: Record<string, CaseStudy> = {
  wink: {
    slug: 'wink',
    title: 'Wink',
    subtitle: 'Simplifying the Smart Home for Everyone',
    tag: 'Smart Home · Platform · Hardware',
    dek:
      'Designed a unified platform to control 60+ connected devices through a single, intuitive experience — helping bring smart home technology to the mainstream.',
    meta: [
      { label: 'Role', value: 'Founding member & design leader' },
      { label: 'Timeline', value: '2013–2018' },
      { label: 'Team', value: 'Built & led a 7-person design team' },
      { label: 'Scope', value: 'Mobile app, Wink Hub, partner ecosystem' },
    ],
    summary: [
      { label: 'Scale', value: '1M+ users · 40+ partners' },
      { label: 'Setup time', value: '30 → 7 min' },
      { label: 'Support calls', value: '−85%' },
      { label: 'Industry impact', value: 'Early connected-home UX model' },
    ],
    heroVisualSuggestions: [
      'Clean collage of app screens + hub hardware',
      'Optional: subtle animation showing multiple devices → one interface',
    ],
    sections: [
      {
        id: 'problem',
        title: 'The problem',
        paragraphs: [
          'Smart home technology was fragmented, technical, and largely inaccessible to everyday users.',
          'Each device:',
        ],
        bullets: ['Had its own app', 'Its own setup process', 'Its own logic'],
        visualSuggestions: [
          'Diagram of fragmented ecosystem (multiple apps/devices)',
          'Screens from different brand apps (or representative UI)',
          '“Before” system chaos visual',
        ],
      },
      {
        id: 'problem-body',
        title: '',
        paragraphs: [
          'The experience of connecting products across brands required either technical expertise or expensive professional installation.',
          'The challenge wasn’t just controlling devices — it was creating a system where multiple products could feel like one.',
        ],
      },
      {
        id: 'role',
        title: 'My role',
        paragraphs: ['I was a founding member and design leader, responsible for:'],
        bullets: [
          'Defining the core interaction model and information architecture',
          'Designing the end-to-end mobile experience',
          'Shaping the hardware + software relationship (Wink Hub)',
          'Building and leading a 7-person design team',
          'Driving alignment across product, engineering, and partners',
        ],
      },
      {
        id: 'insight',
        title: 'The insight',
        paragraphs: [
          'Early on, we realized the problem wasn’t technical — it was conceptual.',
          'Users didn’t think in terms of protocols, brands, or device types.',
          'They thought in terms of intent:',
        ],
        bullets: ['“Turn off the lights”', '“Lock the house”', '“Set a routine before bed”'],
      },
      {
        id: 'insight-body',
        title: '',
        paragraphs: ['The system needed to reflect how people think, not how devices are built.'],
      },
      {
        id: 'reframing',
        title: 'Reframing the system',
        paragraphs: [
          'We redesigned the experience around a simplified mental model:',
        ],
        bullets: [
          'Devices — Control individual products in a consistent way, regardless of brand',
          'Shortcuts — Trigger multiple actions with a single interaction (e.g. “Goodnight” → lights off, doors locked)',
          'Automations — Create behavior over time based on triggers (e.g. “When I leave, turn everything off”)',
        ],
        visualSuggestions: [
          'IA diagram of Devices / Shortcuts / Automations',
          'Example flows of each',
          'Simple conceptual diagram (intent → action)',
        ],
      },
      {
        id: 'reframing-body',
        title: '',
        paragraphs: [
          'This allowed users to move from “How do I control this device?” to “What do I want my home to do?”',
        ],
      },
      {
        id: 'prototyping',
        title: 'Prototyping as a catalyst',
        paragraphs: [
          'To bring this system to life, I built an interactive prototype that simulated how multiple devices could work together in a single experience.',
          'At the time, this was done using HTML/CSS to create a mobile-like experience that could be used directly on a phone.',
          'This prototype:',
        ],
        bullets: [
          'Made an abstract system feel tangible',
          'Aligned stakeholders around a shared vision',
          'Demonstrated the value of a unified platform',
        ],
      },
      {
        id: 'prototyping-body',
        title: '',
        paragraphs: [
          'It ultimately helped secure a key partnership with The Home Depot, accelerating the launch of Wink as a standalone product.',
        ],
        visualSuggestions: [
          'Early prototype screens (even rough)',
          'Flow animation showing multi-device interaction',
          '“Prototype → real product” comparison',
        ],
      },
      {
        id: 'brands',
        title: 'Designing across brands',
        paragraphs: [
          'One of the biggest challenges was creating a consistent experience across products from different companies.',
          'We worked with multiple lighting, lock, and thermostat brands — each with their own identity and expectations.',
          'A key example was Philips Hue, who wanted a more custom interaction model for their lighting controls.',
          'I worked closely with them to understand their priorities, align on the broader user problem, and advocate for consistency across the platform.',
          'We ultimately maintained a unified interaction model, incorporated brand identity within the UI, and created a system that balanced consistency with recognition.',
          'This approach improved usability while strengthening partner relationships.',
        ],
        visualSuggestions: [
          'Same interaction across different brands',
          'Brand logos subtly integrated in UI',
          'Before/after or comparison of consistency',
        ],
      },
      {
        id: 'hardware-software',
        title: 'Hardware + software integration',
        paragraphs: [
          'The Wink Hub was designed to remove complexity from setup and connectivity.',
          'We focused on:',
        ],
        bullets: [
          'Simplifying Wi-Fi connection',
          'Hiding technical complexity (radios, protocols)',
          'Making setup feel fast and approachable',
        ],
      },
      {
        id: 'hardware-body',
        title: '',
        paragraphs: ['This resulted in:'],
        bullets: [
          'Setup time reduced from 30 minutes to 7 minutes',
          '85% reduction in customer support calls',
          '97% in-app satisfaction rate',
        ],
        visualSuggestions: [
          'Hub hardware + app setup flow',
          'Step-by-step onboarding visuals',
          'Before/after setup experience',
        ],
      },
      {
        id: 'outcome',
        title: 'Outcome',
        paragraphs: [
          'Wink became one of the first platforms to successfully unify multiple smart home products into a single, accessible experience.',
        ],
        bullets: [
          'Scaled to 1M+ users',
          'Integrated with 40+ partners',
          'First platform to integrate with Amazon Alexa',
          'Established interaction patterns still seen in smart home ecosystems today',
        ],
      },
      {
        id: 'reflection',
        title: 'Reflection',
        paragraphs: [
          'This project fundamentally shaped how I approach complex systems.',
          'I learned that:',
        ],
        bullets: [
          'Clarity comes from strong mental models, not feature sets',
          'Prototyping is one of the fastest ways to create alignment',
          'Consistency across systems is more valuable than individual optimization',
        ],
      },
      {
        id: 'reflection-body',
        title: '',
        paragraphs: [
          'Most importantly, I learned how to turn complexity into something that feels simple, intuitive, and useful — which continues to guide my work today.',
        ],
      },
    ],
  },
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudiesBySlug[slug]
}
