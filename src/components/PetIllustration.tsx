import type { PetSpeciesKey } from '../three/species'

type PetIllustrationProps = {
  species: PetSpeciesKey
  accessory?: string
  size?: number
}

const palette: Record<PetSpeciesKey, { body: string; shade: string; belly: string; inner: string }> = {
  cat: { body: '#d99a72', shade: '#bb7357', belly: '#f8d6b3', inner: '#efa3a2' },
  dog: { body: '#bf8057', shade: '#9a5e43', belly: '#efd0a0', inner: '#d99283' },
  monkey: { body: '#9b6b50', shade: '#704b3c', belly: '#dcb28b', inner: '#c88478' },
  crocodile: { body: '#76ad7f', shade: '#4e8969', belly: '#c4dd9f', inner: '#93c591' },
  rabbit: { body: '#d7c4bd', shade: '#b6a09a', belly: '#f5e8dc', inner: '#e7a9ad' },
  fox: { body: '#e99d70', shade: '#c26b50', belly: '#f9d4ac', inner: '#f3b39a' },
  panda: { body: '#455857', shade: '#293d3d', belly: '#f0f1e8', inner: '#6b8079' },
  frog: { body: '#75b981', shade: '#4d956b', belly: '#c7e2a4', inner: '#a2d596' },
  bear: { body: '#9b6a4c', shade: '#754939', belly: '#d9ad7e', inner: '#bd8174' },
  penguin: { body: '#466776', shade: '#2e4d5d', belly: '#f0f4ec', inner: '#718e96' },
}

export default function PetIllustration({ species, accessory, size = 220 }: PetIllustrationProps) {
  const colors = palette[species]
  const longEars = species === 'rabbit'
  const wideHead = species === 'crocodile' || species === 'frog'
  const roundEars = species === 'panda' || species === 'bear' || species === 'monkey'
  const hasWings = species === 'penguin'
  const hasSpots = species === 'dog' || species === 'crocodile' || species === 'frog'
  const hasMask = species === 'panda'
  const hasStripes = species === 'cat'

  return (
    <svg className="pet-illustration" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={`${species} pet`}>
      <defs>
        <linearGradient id={`pet-bg-${species}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".5" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></linearGradient>
        <filter id={`pet-shadow-${species}`} x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="9" stdDeviation="5" floodColor="#426a62" floodOpacity=".19" /></filter>
      </defs>
      <ellipse cx="120" cy="218" rx="72" ry="10" fill="#5b927d" opacity=".2" />
      <path d="M25 25h190v190H25z" fill={`url(#pet-bg-${species})`} opacity=".45" />
      <g filter={`url(#pet-shadow-${species})`}>
        <path d="M177 150c30-5 38-31 22-48-9-10-19 1-22 13-3 14-12 19-24 21" fill="none" stroke={colors.shade} strokeWidth="17" strokeLinecap="round" />
        <ellipse cx="120" cy="152" rx="54" ry="63" fill={colors.body} />
        <ellipse cx="120" cy="163" rx="30" ry="38" fill={colors.belly} />
        <ellipse cx="86" cy="206" rx="18" ry="23" fill={colors.shade} />
        <ellipse cx="154" cy="206" rx="18" ry="23" fill={colors.shade} />
        {hasWings && <path d="M68 147c-28 7-30 45 2 48l17-27zM172 147c28 7 30 45-2 48l-17-27z" fill={colors.shade} />}
        {roundEars ? <><circle cx="72" cy="76" r="26" fill={colors.shade} /><circle cx="168" cy="76" r="26" fill={colors.shade} /></> : null}
        <path d={longEars ? 'M78 72L64 8c-2-10 14-13 20-3l29 52z' : 'M76 74L69 35c-2-12 13-17 21-8l27 32z'} fill={colors.body} />
        <path d={longEars ? 'M162 72l14-64c2-10-14-13-20-3l-29 52z' : 'M164 74l7-39c2-12-13-17-21-8l-27 32z'} fill={colors.body} />
        <path d={longEars ? 'M78 57L72 22c0-4 5-5 8-1l18 34z' : 'M82 61l-4-20c0-5 5-6 9-2l14 20z'} fill={colors.inner} />
        <path d={longEars ? 'M162 57l6-35c0-4-5-5-8-1l-18 34z' : 'M158 61l4-20c0-5-5-6-9-2l-14 20z'} fill={colors.inner} />
        <ellipse cx="120" cy="105" rx={wideHead ? 70 : 62} ry="57" fill={colors.body} />
        {hasSpots && <><circle cx="74" cy="88" r="10" fill={colors.shade} opacity=".75" /><circle cx="163" cy="76" r="7" fill={colors.shade} opacity=".72" /><circle cx="180" cy="150" r="6" fill={colors.shade} opacity=".7" /></>}
        {hasMask && <path d="M62 102c14-24 35-27 58-12 23-15 44-12 58 12-14 21-39 19-58 5-19 14-44 16-58-5z" fill={colors.shade} opacity=".95" />}
        {hasStripes && <><path d="M74 80l20 18M166 80l-20 18M69 94l19 12M171 94l-19 12" stroke={colors.shade} strokeWidth="6" strokeLinecap="round" opacity=".7" /></>}
        <ellipse cx="96" cy="106" rx="10" ry="14" fill={colors.shade} opacity=".24" />
        <ellipse cx="144" cy="106" rx="10" ry="14" fill={colors.shade} opacity=".24" />
        <ellipse cx="96" cy="103" rx="8" ry="11" fill="#233f42" /><ellipse cx="144" cy="103" rx="8" ry="11" fill="#233f42" />
        <circle cx="93" cy="99" r="3" fill="white" /><circle cx="141" cy="99" r="3" fill="white" />
        <ellipse cx="120" cy="123" rx="11" ry="8" fill={colors.shade} />
        <path d="M120 130c-7 0-10 7-14 7M120 130c7 0 10 7 14 7" fill="none" stroke={colors.shade} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="75" cy="126" rx="13" ry="7" fill="#ed8a83" opacity=".5" /><ellipse cx="165" cy="126" rx="13" ry="7" fill="#ed8a83" opacity=".5" />
      </g>
      {accessory && <g className="illustration-accessory"><circle cx="198" cy="35" r="22" fill="white" opacity=".82" /><text x="198" y="43" textAnchor="middle" fontSize="26">{accessory}</text></g>}
      <g className="illustration-sparkles"><circle cx="35" cy="61" r="3" fill="#fff" /><circle cx="205" cy="172" r="3" fill="#fff" /><path d="M39 42v14M32 49h14M201 186v14M194 193h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" /></g>
    </svg>
  )
}
