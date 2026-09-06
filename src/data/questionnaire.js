// =====================================================================
// PLAYER PROFILE QUESTIONNAIRE
// 24 statements in 8 groups of 3, answered on a 1–5 agreement scale.
// ---------------------------------------------------------------------
// Answers are posted to Netlify Forms and land in the site's Netlify
// dashboard, which only the account holder can open. Nothing is stored
// in the page and nothing is shown back to other players.
//
// Field names are q1…q24 and must stay stable — they are also declared
// on the hidden form in index.html that Netlify reads at build time.
// Renumbering here without updating that form silently drops answers.
// =====================================================================

export const SCALE = [
  { value: 1, label: 'Strongly disagree', short: 'Strongly disagree' },
  { value: 2, label: 'Disagree', short: 'Disagree' },
  { value: 3, label: 'Neutral', short: 'Neutral' },
  { value: 4, label: 'Agree', short: 'Agree' },
  { value: 5, label: 'Strongly agree', short: 'Strongly agree' },
]

export const SECTIONS = [
  {
    key: 'challenge',
    name: 'Challenge',
    subtitle: 'The Motor',
    items: [
      { n: 1, text: 'I train harder when the session is competitive and fast-paced.' },
      { n: 2, text: 'I get frustrated when practice feels too slow or easy.' },
      { n: 3, text: 'I love being pushed beyond what I think I can do.' },
    ],
  },
  {
    key: 'structure',
    name: 'Structure',
    subtitle: 'The Organizer',
    items: [
      { n: 4, text: 'I perform better when I know exactly what the plan is before training starts.' },
      { n: 5, text: 'I like knowing my role and responsibilities clearly before a game.' },
      { n: 6, text: 'I feel uncomfortable when things change last minute without explanation.' },
    ],
  },
  {
    key: 'safety',
    name: 'Safety',
    subtitle: '',
    items: [
      { n: 7, text: 'I prefer to receive feedback one-on-one rather than in front of the group.' },
      { n: 8, text: 'I need time to think before I respond to coaching or criticism.' },
      { n: 9, text: 'I learn best by watching first before trying something new.' },
    ],
  },
  {
    key: 'recognition',
    name: 'Recognition',
    subtitle: '',
    items: [
      { n: 10, text: 'I work harder when my effort is noticed and acknowledged publicly.' },
      { n: 11, text: 'I naturally step into leadership roles in group settings.' },
      { n: 12, text: 'I feel deflated when I put in a strong performance and no one mentions it.' },
    ],
  },
  {
    key: 'focus',
    name: 'Focus',
    subtitle: '',
    items: [
      { n: 13, text: 'I track my own progress and love seeing measurable improvement over time.' },
      { n: 14, text: 'I set personal goals beyond what my coach asks of me.' },
      { n: 15, text: 'I compare my current performance to where I was a month ago to measure growth.' },
    ],
  },
  {
    key: 'belonging',
    name: 'Belonging',
    subtitle: '',
    items: [
      { n: 16, text: 'The team’s success matters more to me than my individual performance.' },
      { n: 17, text: 'I feel most motivated when I know my teammates are counting on me.' },
      { n: 18, text: 'I stay calm and steady even when the team is struggling.' },
    ],
  },
  {
    key: 'mastery',
    name: 'Mastery',
    subtitle: '',
    items: [
      { n: 19, text: 'I enjoy repeating the same skill over and over until I get it exactly right.' },
      { n: 20, text: 'I think about the technical details of my game even outside of training.' },
      { n: 21, text: 'I get frustrated with myself when I make the same mistake twice.' },
    ],
  },
  {
    key: 'resilience',
    name: 'Resilience',
    subtitle: '',
    items: [
      { n: 22, text: 'I play my best when I have the freedom to try things and express myself.' },
      { n: 23, text: 'I come up with solutions in games that my coach did not teach me.' },
      { n: 24, text: 'I get bored when training is too structured or repetitive.' },
    ],
  },
]

export const ALL_ITEMS = SECTIONS.flatMap((s) => s.items)
