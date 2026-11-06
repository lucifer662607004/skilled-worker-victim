// Story content: sections (one background each) made of beats (one argument each).
// Every figure is taken from the Home Office response CP 1707 unless marked otherwise.

export type Transition = "none" | "zoom" | "wipe-up" | "circle" | "split" | "diagonal" | "fade";

/** Camera keyframe: scale, x and y offset in % of the viewport. */
export type Cam = [scale: number, x: number, y: number];

export type ImageSet = {
  alt: string;
  wide: { src: string; width: number; height: number };
  tall: { src: string; width: number; height: number };
};

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  tone?: "amber" | "coral" | "white";
};

export type Beat = {
  id: string;
  rail: string; // short label for the progress rail
  align?: "left" | "right";
  hero?: boolean;
  kicker?: string;
  title?: string;
  titleTone?: "white" | "amber" | "coral";
  lead?: string;
  label?: string;
  stats?: Stat[];
  bigText?: { text: string; tone: "amber" | "coral" };
  body?: string;
  quote?: { text: string; cite: string };
  compare?: {
    rows: { who: string; tax: number; wait: string; tone: "amber" | "coral" }[];
    note: string;
  };
  asks?: string[];
  cta?: boolean;
  source?: string;
};

export type Section = {
  id: string;
  image: ImageSet;
  transition: Transition;
  camera: { wide: [Cam, Cam]; tall: [Cam, Cam] };
  beats: Beat[];
};

const wide = (name: string, w = 2560, h = 1440) => ({ src: `/scenes/${name}-wide.jpg`, width: w, height: h });
const tall = (name: string) => ({ src: `/scenes/${name}-tall.jpg`, width: 1440, height: 2560 });

export const SECTIONS: Section[] = [
  {
    id: "street",
    image: {
      alt: "A family of three walking hand in hand down a British terraced street at dusk",
      wide: wide("street"),
      tall: tall("street"),
    },
    transition: "none",
    camera: { wide: [[1.12, 3, 0], [1.02, -2, 0]], tall: [[1.15, 0, 2], [1.02, 0, -1]] },
    beats: [
      {
        id: "top",
        rail: "Keep the promise",
        hero: true,
        kicker: "Earned settlement · UK · 2026",
        title: "Keep the promise.",
        titleTone: "amber",
        lead:
          "Skilled workers already on the road to settlement are being moved from five years to ten, part-way through. We are asking for one thing: don't make it retrospective.",
      },
      {
        id: "story",
        rail: "Our story",
        kicker: "Our story",
        title: "We were months away from settlement.",
        body:
          "We have lived in Britain for more than four years. We pay full income tax and National Insurance, plus the Immigration Health Surcharge, and we have never received a penny in benefits. In a few months, we were due to apply.",
      },
    ],
  },
  {
    id: "road",
    image: {
      alt: "A long country road stretching far into the distance, a small family walking along it",
      wide: wide("road"),
      tall: tall("road"),
    },
    transition: "zoom",
    camera: { wide: [[1.0, 0, 0], [1.38, -6, 10]], tall: [[1.0, 0, 0], [1.4, 0, 9]] },
    beats: [
      {
        id: "ten-years",
        rail: "10 years, not 5",
        kicker: "2 November 2026",
        bigText: { text: "10 years, not 5", tone: "amber" },
        body:
          "The Government confirmed that most skilled workers earning under £50,271 will wait ten years for settlement instead of five, including people who are already here.",
        source: "Home Office, A Fairer Pathway to Settlement (CP 1707)",
      },
      {
        id: "how-many",
        rail: "Who is affected",
        stats: [
          { value: 146000, label: "skilled workers", tone: "amber" },
          { value: 85000, prefix: "+\u00a0", label: "family members", tone: "amber" },
        ],
        body:
          "who would have settled by 2030 under the current rules are now on the ten-year path, by the Home Office's own estimate.",
        source: "CP 1707, Annex A",
      },
    ],
  },
  {
    id: "bridge",
    image: {
      alt: "A family halfway across a long footbridge whose far end disappears into fog",
      wide: wide("bridge"),
      tall: tall("bridge"),
    },
    transition: "wipe-up",
    camera: { wide: [[1.05, 0, 0], [1.3, -8, 2]], tall: [[1.05, 0, 0], [1.3, 0, -4]] },
    beats: [
      {
        id: "ask",
        rail: "Our one ask",
        kicker: "Our one ask",
        title: "Don't make it retrospective.",
        body:
          "We are not asking the Government to scrap its reform. Apply the new qualifying periods to people who start the journey after the rules change, not to people who are already halfway across.",
      },
    ],
  },
  {
    id: "doors",
    image: {
      alt: "Two doors in a corridor: one open and full of warm light, one closed and in shadow",
      wide: wide("doors", 3024, 1296),
      tall: tall("doors"),
    },
    transition: "circle",
    camera: { wide: [[1.25, 14, 0], [1.25, -14, 0]], tall: [[1.55, 22, 0], [1.55, -22, 0]] },
    beats: [
      {
        id: "care-workers",
        rail: "Already accepted",
        align: "right",
        kicker: "The Government already accepts this",
        label: "Care workers who arrived before May 2025",
        bigText: { text: "keep 5 years", tone: "amber" },
        body:
          "Because after the May 2025 White Paper, in the Government's own words, people “would have been aware of the intended change”.",
        source: "CP 1707, Chapter 8",
      },
      {
        id: "skilled-workers",
        rail: "Double standard",
        label: "Skilled workers who arrived before May 2025",
        bigText: { text: "wait 10 years", tone: "coral" },
        body:
          "They did not know either. The Government's own cut-off should protect everyone who was already on a five-year route.",
      },
    ],
  },
  {
    id: "engineer",
    image: {
      alt: "A software engineer at a desk at night, a glowing thread tying the chair to a distant office tower",
      wide: wide("engineer"),
      tall: tall("engineer"),
    },
    transition: "split",
    camera: { wide: [[1.18, 4, 0], [1.04, -2, 0]], tall: [[1.2, 0, 3], [1.04, 0, 0]] },
    beats: [
      {
        id: "delay",
        rail: "Delay is not avoidance",
        title: "Delay is not avoidance.",
        body:
          "The reform aims to stop settlement becoming a gateway to welfare. But most people already here will settle eventually. A longer wait does not remove that cost. It only postpones it, while keeping people tied to a sponsor.",
      },
    ],
  },
  {
    id: "river",
    image: {
      alt: "A figure held back by a thread on the bank of a rushing river of light",
      wide: wide("river"),
      tall: tall("river"),
    },
    transition: "diagonal",
    camera: { wide: [[1.12, 5, 0], [1.12, -5, 0]], tall: [[1.2, 6, 0], [1.2, -6, 0]] },
    beats: [
      {
        id: "sponsor",
        rail: "Tied to a sponsor",
        kicker: "The Home Office's own analysis",
        title: "Tied to a sponsor: lower pay, less tax.",
        quote: {
          text: "Removing sponsorship conditions when settled can lead to an increase in salary by allowing greater labour market flexibility.",
          cite: "CP 1707, Annex B",
        },
        body:
          "Few employers will sponsor a mid-career hire, and the Immigration Skills Charge rose by 32% in December 2025. Ten more years tied to one sponsor means lower pay, older skills and less tax. In a field like AI, that is a lifetime.",
      },
    ],
  },
  {
    id: "balance",
    image: {
      alt: "A brass balance scale weighed down by stacks of gold coins",
      wide: wide("balance"),
      tall: tall("balance"),
    },
    transition: "zoom",
    camera: { wide: [[1.0, 0, 0], [1.25, -8, -3]], tall: [[1.0, 0, 0], [1.25, 0, -4]] },
    beats: [
      {
        id: "contribution",
        rail: "Not low contribution",
        label: "A skilled worker on £41,700",
        stats: [{ value: 347000, prefix: "+\u00a0£", label: "lifetime net contribution to public finances", tone: "amber" }],
        body:
          "That is the Home Office's own estimate. Earning under £50,271 is not low contribution, and protecting people already here costs little.",
        source: "Home Office estimate, CP 1707, Annex B",
      },
      {
        id: "families",
        rail: "Families count too",
        kicker: "Families count too",
        title: "Two earners pay more, and wait longer.",
        compare: {
          rows: [
            { who: "Couple, each earning £35,000", tax: 21600, wait: "waits 10 years", tone: "coral" },
            { who: "Single earner on £50,271, partner not working", tax: 17300, wait: "waits 5 years", tone: "amber" },
          ],
          note:
            "Income tax and National Insurance a year, including employer contributions. Illustrative, 2026/27 rates for England. Household income counts for the minimum test, but not for the five-year threshold.",
        },
      },
    ],
  },
  {
    id: "regions",
    image: {
      alt: "A regional city at night, a road of lights leading to a distant glow on the horizon",
      wide: wide("regions", 3024, 1296),
      tall: tall("regions"),
    },
    transition: "fade",
    camera: { wide: [[1.2, -4, 2], [1.06, 4, 0]], tall: [[1.2, 0, 2], [1.05, 0, -2]] },
    beats: [
      {
        id: "regions",
        rail: "Outside London",
        kicker: "One threshold for the whole country",
        title: "£50,271 falls hardest outside London.",
        body:
          "The threshold is the same everywhere, but pay for the same job is lower outside the capital. Respondents raised regional pay in the consultation, yet no adjustment was made.",
        source: "CP 1707, Chapter 2",
      },
    ],
  },
  {
    id: "school",
    image: {
      alt: "A young girl with a school backpack walking through a primary school gate on an autumn morning",
      wide: wide("school"),
      tall: tall("school"),
    },
    transition: "circle",
    camera: { wide: [[1.15, 0, 3], [1.02, 0, -1]], tall: [[1.15, 0, 3], [1.02, 0, -1]] },
    beats: [
      {
        id: "deal",
        rail: "Our side of the deal",
        title: "We kept our side of the deal.",
        lead: "Five years. Full tax. No public funds.",
        body:
          "We built our lives here on a published five-year route. Our daughter has spent more than half her life here. If the rules can change halfway through, who will trust the UK's promises again?",
      },
    ],
  },
  {
    id: "letter",
    image: {
      alt: "A hand writing a letter with a fountain pen at a kitchen table",
      wide: wide("letter"),
      tall: tall("letter"),
    },
    transition: "zoom",
    camera: { wide: [[1.12, 0, 0], [1.0, 0, 0]], tall: [[1.12, 0, 0], [1.0, 0, 0]] },
    beats: [
      {
        id: "act",
        rail: "Write to your MP",
        title: "Keep the promise.",
        titleTone: "amber",
        lead: "No retrospective changes. Here is what we are asking for:",
        asks: [
          "Protect everyone who was on a five-year route before the May 2025 White Paper, as the Government already does for care workers.",
          "At the very least, protect people who reach five years before, or soon after, the new rules take effect.",
          "Let families who are already here count household income towards the five-year threshold.",
        ],
        cta: true,
      },
    ],
  },
];

export const BEATS = SECTIONS.flatMap((s, si) => s.beats.map((b) => ({ ...b, section: si })));
