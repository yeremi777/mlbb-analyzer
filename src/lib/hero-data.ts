export interface Hero {
  id: string
  name: string
  role: HeroRole
  portrait: string
  tags?: string[]
}

export interface CounterHero extends Hero {
  rank: number
  counterScore: number
  reason: string
  tags: string[]
}

export type HeroRole = 'Tank' | 'Fighter' | 'Assassin' | 'Mage' | 'Marksman' | 'Support'

export const HERO_ROLES: HeroRole[] = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support']

// Mock hero data - easy to replace with real data later
export const HEROES: Hero[] = [
  // Tanks
  { id: 'tigreal', name: 'Tigreal', role: 'Tank', portrait: '/heroes/tigreal.png' },
  { id: 'akai', name: 'Akai', role: 'Tank', portrait: '/heroes/akai.png' },
  { id: 'grock', name: 'Grock', role: 'Tank', portrait: '/heroes/grock.png' },
  { id: 'khufra', name: 'Khufra', role: 'Tank', portrait: '/heroes/khufra.png' },
  { id: 'atlas', name: 'Atlas', role: 'Tank', portrait: '/heroes/atlas.png' },
  { id: 'hylos', name: 'Hylos', role: 'Tank', portrait: '/heroes/hylos.png' },
  
  // Fighters
  { id: 'chou', name: 'Chou', role: 'Fighter', portrait: '/heroes/chou.png' },
  { id: 'yu-zhong', name: 'Yu Zhong', role: 'Fighter', portrait: '/heroes/yu-zhong.png' },
  { id: 'paquito', name: 'Paquito', role: 'Fighter', portrait: '/heroes/paquito.png' },
  { id: 'esmeralda', name: 'Esmeralda', role: 'Fighter', portrait: '/heroes/esmeralda.png' },
  { id: 'xborg', name: 'X.Borg', role: 'Fighter', portrait: '/heroes/xborg.png' },
  { id: 'jawhead', name: 'Jawhead', role: 'Fighter', portrait: '/heroes/jawhead.png' },
  
  // Assassins
  { id: 'lancelot', name: 'Lancelot', role: 'Assassin', portrait: '/heroes/lancelot.png' },
  { id: 'ling', name: 'Ling', role: 'Assassin', portrait: '/heroes/ling.png' },
  { id: 'fanny', name: 'Fanny', role: 'Assassin', portrait: '/heroes/fanny.png' },
  { id: 'hayabusa', name: 'Hayabusa', role: 'Assassin', portrait: '/heroes/hayabusa.png' },
  { id: 'gusion', name: 'Gusion', role: 'Assassin', portrait: '/heroes/gusion.png' },
  { id: 'benedetta', name: 'Benedetta', role: 'Assassin', portrait: '/heroes/benedetta.png' },
  
  // Mages
  { id: 'lunox', name: 'Lunox', role: 'Mage', portrait: '/heroes/lunox.png' },
  { id: 'kagura', name: 'Kagura', role: 'Mage', portrait: '/heroes/kagura.png' },
  { id: 'yve', name: 'Yve', role: 'Mage', portrait: '/heroes/yve.png' },
  { id: 'valentina', name: 'Valentina', role: 'Mage', portrait: '/heroes/valentina.png' },
  { id: 'pharsa', name: 'Pharsa', role: 'Mage', portrait: '/heroes/pharsa.png' },
  { id: 'cecilion', name: 'Cecilion', role: 'Mage', portrait: '/heroes/cecilion.png' },
  
  // Marksmen
  { id: 'wanwan', name: 'Wanwan', role: 'Marksman', portrait: '/heroes/wanwan.png' },
  { id: 'beatrix', name: 'Beatrix', role: 'Marksman', portrait: '/heroes/beatrix.png' },
  { id: 'brody', name: 'Brody', role: 'Marksman', portrait: '/heroes/brody.png' },
  { id: 'clint', name: 'Clint', role: 'Marksman', portrait: '/heroes/clint.png' },
  { id: 'moskov', name: 'Moskov', role: 'Marksman', portrait: '/heroes/moskov.png' },
  { id: 'karrie', name: 'Karrie', role: 'Marksman', portrait: '/heroes/karrie.png' },
  
  // Supports
  { id: 'angela', name: 'Angela', role: 'Support', portrait: '/heroes/angela.png' },
  { id: 'estes', name: 'Estes', role: 'Support', portrait: '/heroes/estes.png' },
  { id: 'rafaela', name: 'Rafaela', role: 'Support', portrait: '/heroes/rafaela.png' },
  { id: 'mathilda', name: 'Mathilda', role: 'Support', portrait: '/heroes/mathilda.png' },
  { id: 'floryn', name: 'Floryn', role: 'Support', portrait: '/heroes/floryn.png' },
  { id: 'diggie', name: 'Diggie', role: 'Support', portrait: '/heroes/diggie.png' },
]

// Mock counter data - maps hero id to their counter heroes
export const COUNTER_DATA: Record<string, CounterHero[]> = {
  'ling': [
    { id: 'khufra', name: 'Khufra', role: 'Tank', portrait: '/heroes/khufra.png', rank: 1, counterScore: 95, reason: 'Bouncing Ball interrupts all dash abilities', tags: ['CC', 'Anti-Dive'] },
    { id: 'chou', name: 'Chou', role: 'Fighter', portrait: '/heroes/chou.png', rank: 2, counterScore: 88, reason: 'Can kick Ling out of walls and lock him down', tags: ['CC', 'Burst'] },
    { id: 'aurora', name: 'Aurora', role: 'Mage', portrait: '/heroes/aurora.png', rank: 3, counterScore: 82, reason: 'Freeze prevents Ling from escaping', tags: ['CC', 'Burst'] },
    { id: 'franco', name: 'Franco', role: 'Tank', portrait: '/heroes/franco.png', rank: 4, counterScore: 78, reason: 'Hook can pull Ling from walls', tags: ['CC', 'Lane Pressure'] },
    { id: 'saber', name: 'Saber', role: 'Assassin', portrait: '/heroes/saber.png', rank: 5, counterScore: 74, reason: 'Ultimate locks Ling in place for burst', tags: ['Burst', 'CC'] },
  ],
  'lancelot': [
    { id: 'khufra', name: 'Khufra', role: 'Tank', portrait: '/heroes/khufra.png', rank: 1, counterScore: 96, reason: 'Bouncing Ball completely shuts down dashes', tags: ['CC', 'Anti-Dive'] },
    { id: 'paquito', name: 'Paquito', role: 'Fighter', portrait: '/heroes/paquito.png', rank: 2, counterScore: 89, reason: 'Out-trades in close combat with CC chain', tags: ['Burst', 'CC'] },
    { id: 'kaja', name: 'Kaja', role: 'Fighter', portrait: '/heroes/kaja.png', rank: 3, counterScore: 84, reason: 'Suppression prevents immunity frames', tags: ['CC', 'Burst'] },
    { id: 'helcurt', name: 'Helcurt', role: 'Assassin', portrait: '/heroes/helcurt.png', rank: 4, counterScore: 79, reason: 'Silence stops skill spam', tags: ['CC', 'Burst'] },
    { id: 'ruby', name: 'Ruby', role: 'Fighter', portrait: '/heroes/ruby.png', rank: 5, counterScore: 75, reason: 'Lifesteal and CC sustain against burst', tags: ['Sustain', 'CC'] },
  ],
  'fanny': [
    { id: 'khufra', name: 'Khufra', role: 'Tank', portrait: '/heroes/khufra.png', rank: 1, counterScore: 98, reason: 'Hard counter to all cable movement', tags: ['CC', 'Anti-Dive'] },
    { id: 'franco', name: 'Franco', role: 'Tank', portrait: '/heroes/franco.png', rank: 2, counterScore: 90, reason: 'Hook and suppress stops cables', tags: ['CC', 'Lane Pressure'] },
    { id: 'akai', name: 'Akai', role: 'Tank', portrait: '/heroes/akai.png', rank: 3, counterScore: 85, reason: 'Pin prevents cable escape', tags: ['CC', 'Anti-Dive'] },
    { id: 'kaja', name: 'Kaja', role: 'Fighter', portrait: '/heroes/kaja.png', rank: 4, counterScore: 80, reason: 'Suppression grounds Fanny', tags: ['CC', 'Burst'] },
    { id: 'saber', name: 'Saber', role: 'Assassin', portrait: '/heroes/saber.png', rank: 5, counterScore: 76, reason: 'Ultimate locks and bursts squishy Fanny', tags: ['Burst', 'CC'] },
  ],
  'gusion': [
    { id: 'khufra', name: 'Khufra', role: 'Tank', portrait: '/heroes/khufra.png', rank: 1, counterScore: 94, reason: 'Interrupts dagger dash combo', tags: ['CC', 'Anti-Dive'] },
    { id: 'helcurt', name: 'Helcurt', role: 'Assassin', portrait: '/heroes/helcurt.png', rank: 2, counterScore: 87, reason: 'Silence prevents skill combo execution', tags: ['CC', 'Burst'] },
    { id: 'chou', name: 'Chou', role: 'Fighter', portrait: '/heroes/chou.png', rank: 3, counterScore: 83, reason: 'Immune to burst and can lock down', tags: ['CC', 'Anti-Dive'] },
    { id: 'lolita', name: 'Lolita', role: 'Tank', portrait: '/heroes/lolita.png', rank: 4, counterScore: 78, reason: 'Shield blocks daggers completely', tags: ['Anti-Dive', 'CC'] },
    { id: 'aurora', name: 'Aurora', role: 'Mage', portrait: '/heroes/aurora.png', rank: 5, counterScore: 73, reason: 'Freeze before Gusion can engage', tags: ['CC', 'Burst'] },
  ],
  'wanwan': [
    { id: 'phoveus', name: 'Phoveus', role: 'Fighter', portrait: '/heroes/phoveus.png', rank: 1, counterScore: 97, reason: 'Ultimate triggers on every Wanwan dash', tags: ['Anti-Dive', 'Burst'] },
    { id: 'khufra', name: 'Khufra', role: 'Tank', portrait: '/heroes/khufra.png', rank: 2, counterScore: 91, reason: 'Stops dash spam with bouncing ball', tags: ['CC', 'Anti-Dive'] },
    { id: 'chou', name: 'Chou', role: 'Fighter', portrait: '/heroes/chou.png', rank: 3, counterScore: 86, reason: 'Can catch Wanwan and burst down', tags: ['CC', 'Burst'] },
    { id: 'saber', name: 'Saber', role: 'Assassin', portrait: '/heroes/saber.png', rank: 4, counterScore: 81, reason: 'Ultimate locks Wanwan for team', tags: ['Burst', 'CC'] },
    { id: 'franco', name: 'Franco', role: 'Tank', portrait: '/heroes/franco.png', rank: 5, counterScore: 77, reason: 'Suppress prevents ultimate activation', tags: ['CC', 'Lane Pressure'] },
  ],
  'beatrix': [
    { id: 'lancelot', name: 'Lancelot', role: 'Assassin', portrait: '/heroes/lancelot.png', rank: 1, counterScore: 93, reason: 'Immune frames avoid burst, can dive safely', tags: ['Burst', 'Anti-Dive'] },
    { id: 'ling', name: 'Ling', role: 'Assassin', portrait: '/heroes/ling.png', rank: 2, counterScore: 88, reason: 'Wall mobility avoids sniper shots', tags: ['Burst', 'Anti-Dive'] },
    { id: 'gusion', name: 'Gusion', role: 'Assassin', portrait: '/heroes/gusion.png', rank: 3, counterScore: 84, reason: 'Fast burst before Beatrix can react', tags: ['Burst', 'Anti-Dive'] },
    { id: 'fanny', name: 'Fanny', role: 'Assassin', portrait: '/heroes/fanny.png', rank: 4, counterScore: 80, reason: 'Cable speed too fast to hit', tags: ['Burst', 'Anti-Dive'] },
    { id: 'hayabusa', name: 'Hayabusa', role: 'Assassin', portrait: '/heroes/hayabusa.png', rank: 5, counterScore: 76, reason: 'Shadow split dodges shotgun burst', tags: ['Burst', 'Anti-Dive'] },
  ],
  'esmeralda': [
    { id: 'baxia', name: 'Baxia', role: 'Tank', portrait: '/heroes/baxia.png', rank: 1, counterScore: 96, reason: 'Passive reduces all shield generation', tags: ['Anti-Dive', 'Sustain'] },
    { id: 'lunox', name: 'Lunox', role: 'Mage', portrait: '/heroes/lunox.png', rank: 2, counterScore: 89, reason: 'Chaos mode ignores shield completely', tags: ['Burst', 'Sustain'] },
    { id: 'karrie', name: 'Karrie', role: 'Marksman', portrait: '/heroes/karrie.png', rank: 3, counterScore: 85, reason: 'True damage ignores shield', tags: ['Burst', 'Lane Pressure'] },
    { id: 'valir', name: 'Valir', role: 'Mage', portrait: '/heroes/valir.png', rank: 4, counterScore: 81, reason: 'Knockback prevents Esme from engaging', tags: ['CC', 'Lane Pressure'] },
    { id: 'xborg', name: 'X.Borg', role: 'Fighter', portrait: '/heroes/xborg.png', rank: 5, counterScore: 77, reason: 'True damage burns through shields', tags: ['Burst', 'Lane Pressure'] },
  ],
  'yu-zhong': [
    { id: 'baxia', name: 'Baxia', role: 'Tank', portrait: '/heroes/baxia.png', rank: 1, counterScore: 95, reason: 'Passive hard counters all lifesteal', tags: ['Anti-Dive', 'Sustain'] },
    { id: 'esmeralda', name: 'Esmeralda', role: 'Fighter', portrait: '/heroes/esmeralda.png', rank: 2, counterScore: 88, reason: 'Steals shields from dragon form', tags: ['Sustain', 'Lane Pressure'] },
    { id: 'lunox', name: 'Lunox', role: 'Mage', portrait: '/heroes/lunox.png', rank: 3, counterScore: 84, reason: 'Dark ultimate shreds through sustain', tags: ['Burst', 'Lane Pressure'] },
    { id: 'karrie', name: 'Karrie', role: 'Marksman', portrait: '/heroes/karrie.png', rank: 4, counterScore: 80, reason: 'True damage melts high HP pool', tags: ['Burst', 'Lane Pressure'] },
    { id: 'xborg', name: 'X.Borg', role: 'Fighter', portrait: '/heroes/xborg.png', rank: 5, counterScore: 76, reason: 'True damage ignores defenses', tags: ['Burst', 'Lane Pressure'] },
  ],
}

// Generate default counter data for heroes without specific data
export function getCountersForHero(heroId: string): CounterHero[] {
  if (COUNTER_DATA[heroId]) {
    return COUNTER_DATA[heroId]
  }
  
  // Default counters for heroes without specific data
  const defaultCounters: CounterHero[] = [
    { id: 'khufra', name: 'Khufra', role: 'Tank', portrait: '/heroes/khufra.png', rank: 1, counterScore: 85, reason: 'Strong CC disrupts most heroes', tags: ['CC', 'Anti-Dive'] },
    { id: 'chou', name: 'Chou', role: 'Fighter', portrait: '/heroes/chou.png', rank: 2, counterScore: 80, reason: 'Versatile lockdown and burst', tags: ['CC', 'Burst'] },
    { id: 'franco', name: 'Franco', role: 'Tank', portrait: '/heroes/franco.png', rank: 3, counterScore: 75, reason: 'Hook and suppress combo', tags: ['CC', 'Lane Pressure'] },
    { id: 'saber', name: 'Saber', role: 'Assassin', portrait: '/heroes/saber.png', rank: 4, counterScore: 70, reason: 'Point-and-click lockdown', tags: ['Burst', 'CC'] },
    { id: 'aurora', name: 'Aurora', role: 'Mage', portrait: '/heroes/aurora.png', rank: 5, counterScore: 65, reason: 'Instant freeze for team follow-up', tags: ['CC', 'Burst'] },
  ]
  
  return defaultCounters
}
