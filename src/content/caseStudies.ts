/**
 * Case study content maps to the shared template (see CASE_STUDIES.md).
 * Replace body copy with text from your Google Doc as you refine each page.
 */

export type CaseStudyMetaRow = { label: string; value: string }

export type CaseStudySection = {
  /** Stable id for anchors / future CMS */
  id: string
  /** Uppercase section label shown above the title */
  eyebrow?: string
  title: string
  /** Paragraphs (each rendered as <p>) */
  paragraphs: string[]
  /** Optional bullet list under the section */
  bullets?: string[]
  /** Optional labeled bullet groups (e.g. focus / results lists) */
  bulletGroups?: Array<{ label?: string; items: string[] }>
  /** Paragraphs rendered after bullets and bullet groups */
  closingParagraphs?: string[]
  /** Real section images (prefer over visualSuggestions when present) */
  images?: Array<{ src: string; alt: string }>
  /** Optional interactive prototype instead of static images */
  prototype?: 'wink'
  /** Art direction / layout notes for a future visual pass */
  visualSuggestions?: string[]
}

export type CaseStudySummaryItem = {
  label?: string
  value: string
  supporting?: string
}

export type CaseStudyClosingColumn = {
  eyebrow: string
  title: string
  paragraphs: string[]
}

export type CaseStudyListItem = {
  slug: string
  title: string
  tag: string
  /** Short line for cards / index */
  blurb: string
  meta: string
  /** Optional thumbnail for work index */
  imageSrc?: string
  imageAlt?: string
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
  /** Optional hero image (work index thumbnail reused when omitted) */
  heroImageSrc?: string
  heroImageAlt?: string
  /** Optional two-column text block before the footer */
  closingColumns?: CaseStudyClosingColumn[]
  /** Optional hero art-direction notes (below metrics strip) */
  heroVisualSuggestions?: string[]
  /** Renders a minimal coming-soon page instead of full case study layout */
  placeholder?: boolean
}

export const caseStudyList: CaseStudyListItem[] = [
  {
    slug: 'wink',
    title: 'Wink',
    tag: 'Smart Home · Platform · Hardware',
    blurb:
      'Founding designer to VP. Built the team, designed the platform, shipped 60+ products across 40+ brand partners. Hub 2 reduced setup from 30 to 7 minutes.',
    meta: '2013–2018 · Founding Designer → VP',
    imageSrc: '/work/wink.png',
    imageAlt: 'Wink smart home app on three iPhones showing home, shortcuts, and robots screens',
    published: true,
  },
  {
    slug: 'daily-harvest',
    title: 'Daily Harvest',
    tag: 'e-commerce subscription',
    blurb:
      'Reframed the subscription experience around how people actually shop. Increased conversion by 25%. Introduced flexible purchasing model. Simplified product + pricing complexity.',
    meta: '2019–2022 · Principal Product Designer',
    imageSrc: '/work/daily-harvest.png',
    imageAlt: 'Daily Harvest mobile site on iPhone showing hero and product offerings',
    published: true,
  },
  {
    slug: 'maximus-health-data',
    title: 'Maximus health data',
    tag: 'Personalized medicine',
    blurb:
      'Made health data understandable and actionable. Simplified complex biomarker data. Designed for trends and progress. Introduced AI-driven prototyping.',
    meta: '2023–2026 · Principal Product Designer',
    imageSrc: '/work/maximus-health-data.png',
    imageAlt: 'Maximus at-home health kit with lab results app showing Maximus score and cardiovascular risk',
    published: true,
  },
  {
    slug: 'bombardier',
    title: 'Bombardier',
    tag: 'Private jet experience',
    blurb:
      'Designed a multi-surface cabin experience. Created unified system across hardware + software. Introduced patented interaction model. Designed for long-term relevance.',
    meta: '2013 · Interaction Design Lead',
    imageSrc: '/work/bombardier.png',
    imageAlt: 'Bombardier private jet cabin with media and cabin control tablet and tactile dial',
    published: true,
  },
]

export const caseStudiesBySlug: Record<string, CaseStudy> = {
  wink: {
    slug: 'wink',
    title: 'Wink',
    subtitle: 'Simplifying the smart home for everyone',
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
      { label: 'Users', value: '1M+', supporting: 'Designed from scratch and scaled to over 1 million users' },
      {
        label: 'Partners',
        value: '40+',
        supporting: 'First platform to work with Alexa, Google Home, Nest, and Philips Hue',
      },
      {
        label: 'Setup time',
        value: '30 → 7 mins',
        supporting: 'Worked with engineering to make setup feel like magic — Plug it in. See it in the app.',
      },
      { label: 'Support calls', value: '↓ 7x', supporting: '7x fewer support calls after new hardware and software launch' },
    ],
    heroImageSrc: '/work/wink-hero.png',
    heroImageAlt: 'Wink smart home app on iPhone showing Lights, Blinds, Smoke Alarm, and Locks controls',
    sections: [
      {
        id: 'problem',
        eyebrow: 'The Problem',
        title: 'The smart home was everywhere but nowhere together',
        paragraphs: [
          'Smart home technology was fragmented, technical, but clunky to use for most people.',
          'The experience of connecting products across brands required either technical expertise or expensive professional installation.',
          'The challenge wasn\'t just controlling devices — it was creating a system where multiple products could feel like one.',
          'Consumer devices used different radios and many required their own hub, and none of them worked together.',
        ],
        bulletGroups: [
          {
            label: 'Each Device',
            items: ['Had its own app', 'Its own setup process', 'Its own logic'],
          },
        ],
        images: [
          {
            src: '/work/wink-problem.png',
            alt: 'Cluttered countertop of smart home hubs, cables, and a phone full of separate brand apps',
          },
        ],
      },
      {
        id: 'role',
        eyebrow: 'My role',
        title: 'Founding member and design leader',
        paragraphs: [],
        bullets: [
          'Defining the core interaction model and information architecture',
          'Designing the end-to-end mobile experience',
          'Shaping the hardware + software relationship (Wink Hub)',
          'Building and leading a 7-person design team',
          'Driving alignment across product, engineering, and partners',
        ],
        images: [
          {
            src: '/work/wink-role-whiteboard.png',
            alt: 'Whiteboard session mapping Wink Hub experience principles, ecosystem, and automations',
          },
        ],
      },
      {
        id: 'insight',
        eyebrow: 'The insight',
        title: 'Intent is everything',
        paragraphs: [
          'Early on, we had a very product-first approach to the design to make it simple to know what you\'re controlling, but we realized the problem we needed to solve was more conceptual. Users didn\'t think in terms of protocols, brands, or device types.',
          'They thought in terms of intent:',
        ],
        bullets: ['"Turn off the lights"', '"Lock the house"', '"Set a routine before bed"'],
        images: [
          {
            src: '/work/wink-insight-1.png',
            alt: 'Wink Lights screen with a grid of room light and outlet controls',
          },
          {
            src: '/work/wink-insight-2.png',
            alt: 'Wink Locks screen showing Front Door locked and Back Door unlocked',
          },
          {
            src: '/work/wink-insight-3.png',
            alt: 'Nest Thermostat screen showing temperature dial and home away modes',
          },
        ],
      },
      {
        id: 'reframe',
        eyebrow: 'The Reframe',
        title: 'Change the mental model',
        paragraphs: ['We redesigned the experience around a simplified mental model:'],
        bullets: [
          'Devices — Control individual products in a consistent way, regardless of brand',
          'Shortcuts — Trigger multiple actions with a single interaction (e.g. "Goodnight" → lights off, doors locked)',
          'Automations — Create behavior over time based on triggers (e.g. "When I leave, turn everything off")',
        ],
        images: [
          {
            src: '/work/wink.png',
            alt: 'Wink smart home app on three iPhones showing home, shortcuts, and robots screens',
          },
        ],
      },
      {
        id: 'prototype',
        eyebrow: 'Prototype',
        title: 'Prototyping as a catalyst',
        paragraphs: [
          'To bring this system to life, I built an interactive prototype that simulated how multiple devices could work together in a single experience.',
        ],
        bulletGroups: [
          {
            label: 'This prototype',
            items: [
              'Made an abstract system feel tangible',
              'Aligned stakeholders around a shared vision',
              'Demonstrated the value of a unified platform',
            ],
          },
        ],
        closingParagraphs: [
          'It ultimately helped secure a key partnership with The Home Depot, accelerating the launch of Wink as a standalone product.',
        ],
        prototype: 'wink',
      },
      {
        id: 'challenge-brands',
        eyebrow: 'Challenge',
        title: 'Designing across brands',
        paragraphs: [
          'One of the biggest challenges was creating a consistent experience across products from different companies. We worked with multiple lighting, lock, and thermostat brands — each with their own identity and expectations. A key example was Philips Hue, who wanted a more custom interaction model for their lighting controls. I worked closely with them to understand their priorities, align on the broader user problem, and advocate for consistency across the platform.',
          'We ultimately maintained a unified interaction model, incorporated brand identity within the UI, and created a system that balanced consistency with recognition.',
          'This approach improved usability, while strengthening partner relationships.',
        ],
        images: [
          {
            src: '/work/wink-insight-1.png',
            alt: 'Wink Lights screen with a grid of room light and outlet controls',
          },
          {
            src: '/work/wink-challenge-brands-2.png',
            alt: 'Philips Hue lighting controls with color wheel and swatch presets',
          },
        ],
      },
      {
        id: 'challenge-hardware',
        eyebrow: 'Challenge',
        title: 'Hardware + software integration',
        paragraphs: ['The Wink Hub was designed to remove complexity from setup and connectivity.'],
        bulletGroups: [
          {
            label: 'We focused on',
            items: [
              'Simplifying Wi-Fi connection',
              'Hiding technical complexity (radios, protocols)',
              'Making setup feel fast and approachable',
            ],
          },
          {
            label: 'This resulted in',
            items: [
              'Setup time reduced from 30 minutes to 7 minutes',
              '70% reduction in customer support calls',
              '97% in-app satisfaction rate',
            ],
          },
        ],
        images: [
          {
            src: '/work/wink-challenge-hub.png',
            alt: 'Wink Hub 2 packaging, hardware, and successful setup screen on a phone',
          },
        ],
      },
      {
        id: 'outcome',
        eyebrow: 'Outcome',
        title: 'A simple accessible smart home',
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
        eyebrow: 'Reflection',
        title: 'Keep breaking down complex systems',
        paragraphs: ['This project fundamentally shaped how I approach complex systems.'],
        bulletGroups: [
          {
            label: 'I learned that',
            items: [
              'Clarity comes from strong mental models, not feature sets',
              'Prototyping is one of the fastest ways to create alignment',
              'Consistency across systems is more valuable than individual optimization',
            ],
          },
        ],
        closingParagraphs: [
          'Most importantly, I learned how to turn complexity into something that feels simple, intuitive, and useful — which continues to guide my work today.',
        ],
      },
    ],
  },
  'maximus-health-data': {
    slug: 'maximus-health-data',
    title: 'Maximus health data',
    subtitle: 'Making health data understandable and actionable',
    tag: 'Personalized medicine',
    dek:
      'Made health data understandable and actionable. Simplified complex biomarker data. Designed for trends and progress. Introduced AI-driven prototyping.',
    meta: [{ label: 'Role', value: '2023–2026 · Principal Product Designer' }],
    summary: [],
    sections: [],
    placeholder: true,
  },
  'daily-harvest': {
    slug: 'daily-harvest',
    title: 'Daily Harvest',
    subtitle: 'Tasting Journey',
    tag: 'e-commerce subscription',
    dek:
      "Redesigned Daily Harvest's path from first-time visitor to loyal subscriber, introducing a no-commitment Tasting Box that let new customers try the food before buying into a subscription.",
    meta: [
      { label: 'Role', value: 'Principal Product Designer' },
      { label: 'Timeline', value: '2021 — 6mos' },
      { label: 'Team', value: 'CEO, Product Manager, Lead Engineer' },
      { label: 'Scope', value: 'Mobile app, website — onboarding' },
    ],
    summary: [
      {
        label: 'Conversion',
        value: '+25%',
        supporting: 'Increase in conversion of first-time visitors',
      },
      {
        label: 'Speed',
        value: '>6 mos',
        supporting: 'Researched, redesigned, and shipped iteratively',
      },
    ],
    heroImageSrc: '/work/daily-harvest.png',
    heroImageAlt: 'Daily Harvest mobile site on iPhone showing hero and product offerings',
    sections: [
      {
        id: 'problem',
        eyebrow: 'The problem',
        title: 'Committing before trying',
        paragraphs: [
          "New customers were being asked to choose a recurring plan before they'd tasted a single item, creating hesitation right at signup.",
          '"I don\'t want to commit to a subscription for food I haven\'t even tried yet."',
        ],
        images: [
          {
            src: '/work/daily-harvest-problem.png',
            alt: 'Daily Harvest Select Your Plan screen asking customers to choose Small, Medium, or Large before trying the food',
          },
        ],
      },
      {
        id: 'role',
        eyebrow: 'My Role',
        title: 'Lead Designer',
        paragraphs: [],
        bullets: [
          'Led research efforts and distilled customer insights',
          'Created and evangelized the core concept; Try, Love, Repeat',
          'Designed the end-to-end user experience',
          'Worked closely with product management to meet business goals',
          'Worked closely with Engineers to scope changes and create a successful iterative path',
          'Drove alignment with stakeholders including the CEO',
        ],
        images: [
          {
            src: '/work/daily-harvest-role.png',
            alt: 'Multiple iPhones showing Daily Harvest flows for onboarding, box selection, checkout, and tasting journey',
          },
        ],
      },
      {
        id: 'insight',
        eyebrow: 'The insight',
        title: 'Trust is built one bite at a time',
        paragraphs: [
          "Customers didn't commit to Daily Harvest all at once — they moved through it in stages, from first taste to favorite items to daily habit.",
          'The journey we designed around:',
        ],
        bullets: [
          '"Get a taste" — start with a Tasting Box filled with what looks good',
          '"Find your faves" — tell us what you like (and don\'t), and we\'ll help you find more of it',
          '"Keep good going" — eat more fruits and vegetables every day',
        ],
        images: [
          {
            src: '/work/daily-harvest-insight.png',
            alt: 'Daily Harvest tasting journey with Try, Love, Repeat and How it Works phone screen',
          },
        ],
      },
      {
        id: 'reframe',
        eyebrow: 'The reframe',
        title: 'A Try, Love, Repeat framework',
        paragraphs: ['We translated the customer\'s stages into a three-part design framework:'],
        bullets: [
          'Try — Give customers options while reducing the variables of change, so we could get a clean signal on what was working',
          'Love — Guide customers to rate the food from their first box so we could help them find more of what they liked',
          'Repeat — Surface recurring-plan savings more prominently once a customer had dialed in the foods they loved',
        ],
        images: [
          {
            src: '/work/daily-harvest-reframe-1.png',
            alt: 'Daily Harvest Select Your Items screen with best sellers and quantity controls',
          },
          {
            src: '/work/daily-harvest-reframe-2.png',
            alt: 'Daily Harvest welcome screen with tasting box delivery details',
          },
          {
            src: '/work/daily-harvest-reframe-3.png',
            alt: 'Daily Harvest For You screen with Ready to Restock and Get Em Again',
          },
        ],
      },
      {
        id: 'explorations',
        eyebrow: 'Explorations',
        title: 'Exploring the box-building and checkout experience',
        paragraphs: [
          'To find the right shape for the experience, multiple directions were explored for how customers would choose a delivery cadence, build their box, and check out.',
        ],
        bulletGroups: [
          {
            label: 'Explored Directions',
            items: [
              'On-demand vs. auto-refill delivery, each with its own pricing and incentives',
              'A "Build Your Box" flow for selecting items from Our Picks, Smoothies, and Harvest Bowls',
              'Checkout variations comparing Tasting Box vs. Recurring Plan pricing and savings',
            ],
          },
        ],
        images: [
          {
            src: '/work/daily-harvest-explorations.png',
            alt: 'Daily Harvest explorations showing Choose a Delivery, Select Your Items, and Checkout screens',
          },
        ],
      },
      {
        id: 'refine',
        eyebrow: 'Refine',
        title: 'Simplifying box selection at checkout',
        paragraphs: [
          'Early versions asked customers to pick a box size before it was clear whether they wanted a one-time Tasting Box or an ongoing Recurring Plan, creating confusion at a key decision point.',
        ],
        bulletGroups: [
          {
            label: 'What Changed',
            items: [
              'Renamed "Select a Box Size" to "Select a Box Type," leading with the plan decision',
              'Simplified the toggle from Recurring Plan / Tasting Box to Recurring Plan / Single Box',
              'Adjusted the checkout button to draw clearer attention at the final step',
            ],
          },
        ],
        images: [
          {
            src: '/work/daily-harvest-refine.png',
            alt: 'Before and after Daily Harvest box selection: Select a Box Size versus Select a Box Type',
          },
        ],
      },
      {
        id: 'outcome',
        eyebrow: 'Impact',
        title: 'A lower-friction path to trial and re-engagement',
        paragraphs: [
          'Removing the subscription requirement changed how new and lapsed customers could enter the funnel.',
        ],
        bullets: [
          '25% increase in conversion of first-time visitors',
          'Unlocked purchasing without a subscription, allowing re-engagement with churned customers',
          'Created a path to reduce cancellations by converting them to single-box purchasers',
        ],
      },
    ],
  },
  bombardier: {
    slug: 'bombardier',
    title: 'Bombardier',
    subtitle: 'Redesign the passenger cabin experience',
    tag: 'Private jet experience',
    dek:
      "Explored three concept directions for a private jet cabin control system, then refined a dial-based interaction model into a production interface for Bombardier's Global 7500.",
    meta: [
      { label: 'Role', value: 'Senior Interaction Designer' },
      { label: 'Timeline', value: '2012' },
      { label: 'Team', value: 'Lorem ipsum' },
      { label: 'Scope', value: 'Side-ledge interface, tablet app, and in-seat dial controller' },
    ],
    summary: [
      {
        label: 'Concepts Explored',
        value: '3',
        supporting: 'Performance, Bespoke, and Zen directions explored before landing on the final design',
      },
      {
        label: 'Patents',
        value: '7',
        supporting: 'Interface design patents awarded',
      },
      {
        label: 'Award',
        value: 'Red Dot 2018',
        supporting: 'Red Dot Award in Product Design',
      },
      {
        label: 'Announced',
        value: 'May 2018',
        supporting: 'Shipped as Bombardier\'s "nice Touch CMS"',
      },
    ],
    heroImageSrc: '/work/bombardier.png',
    heroImageAlt: 'Bombardier private jet cabin with media and cabin control tablet and tactile dial',
    sections: [
      {
        id: 'problem',
        eyebrow: 'Problem',
        title: 'Fragmented physical controls',
        paragraphs: [
          "Bombardier's private jet cabins relied on scattered physical switches and recessed buttons for lighting, shades, temperature, and entertainment — functional, but with no single, intuitive way to control the cabin experience.",
        ],
        visualSuggestions: ['Existing cabin controls', 'Recessed button panel'],
      },
      {
        id: 'role',
        eyebrow: 'My Role',
        title: 'Senior Interaction Designer',
        paragraphs: [],
        bullets: [
          'Explored three concept directions — Performance, Bespoke, and Zen — for cabin controls',
          'Designed and iterated wireframes for the side-ledge, tablet, and dial interfaces',
          'Refined the winning concept from early wireframes through to a shippable interaction model',
        ],
        visualSuggestions: ['Screen placeholder', 'Screen placeholder'],
      },
      {
        id: 'insight',
        eyebrow: 'Insight',
        title: 'The right control needed the right feel',
        paragraphs: [
          'Cabin controls could be more than functional — the physical form and interaction model needed to match the tone of a private aircraft cabin. Rather than assume one answer, the same problem was explored through three different lenses.',
          'Three directions, three philosophies:',
        ],
        bullets: [
          'Performance — a digital, dashboard-driven approach',
          'Bespoke — personalized, inspired by travel and leather goods',
          'Zen — calm, tactile, and minimal',
        ],
        visualSuggestions: ['Performance mood board', 'Bespoke mood board', 'Zen mood board'],
      },
      {
        id: 'reframe',
        eyebrow: 'Knob Experience',
        title: 'One dial, five gestures',
        paragraphs: [
          "The Zen concept's dial became the core interaction model, reduced to a small, consistent gesture set:",
        ],
        bullets: [
          'Swipe to wake',
          'Tap to select an item',
          'Touch the ring to show adjustment',
          'Turn the dial to make an adjustment',
          'Release the ring to show the selection screen',
        ],
        visualSuggestions: ['Knob interaction diagrams'],
      },
      {
        id: 'prototype',
        eyebrow: 'Wireframes & Iterations',
        title: 'Wireframing three directions in parallel',
        paragraphs: [
          'Each concept was pushed through wireframes and a first round of visual design before converging on a single direction.',
        ],
        bulletGroups: [
          {
            label: 'What Was Prototyped',
            items: [
              'Performance — a browsable media and cabin-control dashboard with zone maps for lighting, shades, and speakers',
              'Bespoke — a side-ledge touch interface with Watch / Listen / Cabin menus and seat-level sliders for reading light, table light, and volume',
              'Zen — a tactile dial with expanding icon sets for lights, temperature, and shades',
            ],
          },
        ],
        visualSuggestions: ['Performance Round 1', 'Bespoke Round 1', 'Zen Round 1'],
      },
      {
        id: 'challenge-dial',
        eyebrow: 'Challenge',
        title: 'Cramming a full cabin system onto a single dial',
        paragraphs: [
          'The dial is small enough to sit on a side table, but it needed to control media playback, zone lighting, presets, shades, temperature, and cabin-attendant calls — all through turning, tapping, and swiping one compact physical control.',
        ],
        visualSuggestions: ['Knob wireframes', 'Icon set explorations'],
      },
      {
        id: 'challenge-direction',
        eyebrow: 'Challenge',
        title: 'Choosing one direction from three',
        paragraphs: [
          'Performance, Bespoke, and Zen each had a fully realized wireframe and a first round of visual design before the team converged on the dial-based Zen direction as the interaction model that ultimately shipped.',
        ],
        visualSuggestions: ['3 Concepts mood board comparison'],
      },
      {
        id: 'outcome',
        eyebrow: 'Outcome',
        title: 'Announced as the "nice Touch CMS"',
        paragraphs: [
          'The dial-based interaction model shipped on the Bombardier Global 7500, giving passengers tactile control over lighting, temperature, shades, and entertainment from a single knob.',
        ],
        bullets: [
          'Announced in May 2018 as the "nice Touch CMS"',
          'Awarded 7 interface design patents',
          'Won a Red Dot Award in Product Design, 2018',
        ],
      },
      {
        id: 'reflection',
        eyebrow: 'Reflection',
        title: 'Lorem ipsum dolor sit amet',
        paragraphs: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
        bulletGroups: [
          {
            label: 'Lorem ipsum',
            items: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
          },
        ],
        closingParagraphs: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
      },
    ],
  },
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudiesBySlug[slug]
}
