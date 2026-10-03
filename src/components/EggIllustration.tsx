type EggIllustrationProps = { cracked?: boolean }

export default function EggIllustration({ cracked = false }: EggIllustrationProps) {
  return (
    <svg className={cracked ? 'egg-illustration cracked' : 'egg-illustration'} viewBox="0 0 180 220" role="img" aria-label="Mystery egg">
      <defs>
        <linearGradient id="egg-shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf6" /><stop offset=".55" stopColor="#f9e8c7" /><stop offset="1" stopColor="#e8bd87" /></linearGradient>
        <radialGradient id="egg-shine" cx="30%" cy="18%"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        <filter id="egg-drop" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="13" stdDeviation="8" floodColor="#a87b50" floodOpacity=".24" /></filter>
      </defs>
      <ellipse cx="90" cy="204" rx="50" ry="9" fill="#9d7956" opacity=".18" />
      <g filter="url(#egg-drop)">
        <path d="M90 12C52 12 27 61 27 116c0 52 27 84 63 84s63-32 63-84C153 61 128 12 90 12z" fill="url(#egg-shell)" stroke="#dbb27d" strokeWidth="3" />
        <ellipse cx="67" cy="61" rx="25" ry="42" fill="url(#egg-shine)" />
        <path d="M45 118c16-12 23 15 39 0s22 15 39 0 20 9 29 0" fill="none" stroke="#dcae78" strokeWidth="4" strokeLinecap="round" />
        <circle cx="53" cy="151" r="5" fill="#e8bb83" opacity=".7" /><circle cx="127" cy="72" r="4" fill="#e8bb83" opacity=".55" />
        {cracked && <path d="M90 87l-9 20 12 10-13 24 18 12 2 27" fill="none" stroke="#b97953" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
      </g>
    </svg>
  )
}
