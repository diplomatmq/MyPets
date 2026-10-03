import { useEffect, useState } from 'react'
import PetIllustration from './components/PetIllustration'
import { authenticateTelegram, createPartnershipInvite, haptic, initTelegramWebApp, submitPetAction, type TelegramWebApp } from './telegram'
import type { PetSpeciesKey } from './three/species'
import {
  Bath,
  BedDouble,
  Bell,
  Bone,
  Check,
  ChevronRight,
  CircleHelp,
  Coins,
  Droplets,
  Flame,
  Footprints,
  Gamepad2,
  Gift,
  Heart,
  Home,
  MapPin,
  MoreHorizontal,
  PawPrint,
  Plus,
  Shirt,
  Sparkles,
  Star,
  Store,
  Trophy,
  Utensils,
  Waves,
  Zap,
} from 'lucide-react'

type StatKey = 'hunger' | 'thirst' | 'energy' | 'mood' | 'cleanliness'
type Tab = 'home' | 'pet' | 'room' | 'shop' | 'more'
type Flow = 'closed' | 'invite' | 'egg'

type Activity = {
  id: number
  icon: string
  text: string
  time: string
  accent?: string
}

const initialStats: Record<StatKey, number> = {
  hunger: 82,
  thirst: 74,
  energy: 67,
  mood: 91,
  cleanliness: 76,
}

const actions: Array<{
  key: StatKey
  label: string
  value: number
  icon: typeof Utensils
  className: string
}> = [
  { key: 'hunger', label: 'Feed', value: 18, icon: Utensils, className: 'action-peach' },
  { key: 'thirst', label: 'Drink', value: 24, icon: Droplets, className: 'action-blue' },
  { key: 'mood', label: 'Play', value: 14, icon: Gamepad2, className: 'action-blue' },
  { key: 'cleanliness', label: 'Bath', value: 20, icon: Bath, className: 'action-mint' },
  { key: 'energy', label: 'Sleep', value: 22, icon: BedDouble, className: 'action-lilac' },
]

const statLabels: Record<StatKey, string> = {
  hunger: 'Hunger',
  thirst: 'Thirst',
  energy: 'Energy',
  mood: 'Mood',
  cleanliness: 'Clean',
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

const wardrobe = [
  { name: 'Sunset hoodie', slot: 'Top', color: 'peach', icon: '🧥' },
  { name: 'Tiny crown', slot: 'Head', color: 'gold', icon: '👑' },
  { name: 'Cloud sneakers', slot: 'Shoes', color: 'blue', icon: '👟' },
  { name: 'Starry scarf', slot: 'Neck', color: 'lilac', icon: '🧣' },
]

const petSpecies = [
  { name: 'Cat', native: 'Кошка', emoji: '🐱', found: 6, total: 20, rarity: 'Common', color: 'peach' },
  { name: 'Dog', native: 'Собака', emoji: '🐶', found: 3, total: 18, rarity: 'Uncommon', color: 'blue' },
  { name: 'Monkey', native: 'Обезьяна', emoji: '🐵', found: 8, total: 15, rarity: 'Rare', color: 'mint' },
  { name: 'Crocodile', native: 'Крокодил', emoji: '🐊', found: 2, total: 12, rarity: 'Epic', color: 'green' },
  { name: 'Rabbit', native: 'Кролик', emoji: '🐰', found: 4, total: 14, rarity: 'Common', color: 'lilac' },
  { name: 'Fox', native: 'Лиса', emoji: '🦊', found: 1, total: 10, rarity: 'Uncommon', color: 'sun' },
  { name: 'Panda', native: 'Панда', emoji: '🐼', found: 0, total: 9, rarity: 'Rare', color: 'ink' },
  { name: 'Frog', native: 'Лягушка', emoji: '🐸', found: 2, total: 11, rarity: 'Epic', color: 'green' },
  { name: 'Bear', native: 'Медведь', emoji: '🐻', found: 0, total: 8, rarity: 'Legendary', color: 'peach' },
  { name: 'Penguin', native: 'Пингвин', emoji: '🐧', found: 0, total: 7, rarity: 'Mythic', color: 'blue' },
]

function PetDetail({ stats, action, showToast }: { stats: Record<StatKey, number>; action: 'idle' | 'feed' | 'drink' | 'play' | 'bath' | 'sleep'; showToast: (message: string) => void }) {
  const [selectedItem, setSelectedItem] = useState(0)
  const [activeSlot, setActiveSlot] = useState('Top')
  const slots = ['Top', 'Head', 'Shoes', 'Neck']
  const equipped = wardrobe[selectedItem]

  return (
    <div className="pet-detail-page">
      <div className="detail-heading"><div><p className="eyebrow">YOUR COMPANION</p><h1>Miso's closet</h1><p className="detail-subtitle">A little style for a little life.</p></div><span className="rarity-pill"><Sparkles size={14} /> Uncommon</span></div>
      <div className="pet-detail-grid">
        <section className="detail-portrait"><div className={`portrait-scene illustration-scene action-${action}`}><PetIllustration species="fox" accessory={equipped.icon} size={270} /></div><div className="portrait-footer"><div><p className="eyebrow">FOX · LEVEL 08</p><h2>Miso</h2><p>{action === 'idle' ? 'Growing together since today' : `Miso is ${action === 'bath' ? 'getting clean' : `${action}ing`}`}</p></div><button className="round-arrow" aria-label="Celebrate" onClick={() => showToast('Miso is feeling fabulous')}>✦</button></div></section>
        <section className="detail-panel"><div className="section-heading"><div><p className="eyebrow">WELLBEING</p><h2>How Miso feels</h2></div><button className="link-button" onClick={() => showToast('Stats are healthy today')}>History <ChevronRight size={15} /></button></div><div className="detail-stat-list">{(Object.keys(stats) as StatKey[]).map((key) => <div className="detail-stat" key={key}><span>{statLabels[key]}</span><div className="detail-stat-track"><i className={`fill-${key}`} style={{ width: `${stats[key]}%` }} /></div><strong>{stats[key]}%</strong></div>)}</div><div className="personality"><span className="personality-icon">♡</span><div><p className="eyebrow">EMERGING PERSONALITY</p><strong>Playful</strong><p>Miso loves a good game and a little attention.</p></div></div></section>
      </div>
      <section className="wardrobe-section"><div className="section-heading"><div><p className="eyebrow">CUSTOMIZATION</p><h2>Dress Miso up</h2></div><button className="link-button" onClick={() => showToast('More items are coming soon')}>Collection <ChevronRight size={15} /></button></div><div className="slot-tabs">{slots.map((slot) => <button className={activeSlot === slot ? 'slot-tab active' : 'slot-tab'} key={slot} onClick={() => setActiveSlot(slot)}>{slot}</button>)}</div><div className="wardrobe-grid">{wardrobe.map((item, index) => <button className={selectedItem === index ? `wardrobe-item selected item-${item.color}` : `wardrobe-item item-${item.color}`} key={item.name} onClick={() => { setSelectedItem(index); setActiveSlot(item.slot); showToast(`${item.name} equipped`) }}><span className="item-art">{item.icon}</span><span><strong>{item.name}</strong><small>{item.slot} · owned</small></span>{selectedItem === index && <Check size={16} />}</button>)}</div><div className="equipped-bar"><span>Currently wearing</span><strong>{equipped.name}</strong><button onClick={() => showToast('Miso is ready for the day')}>View on Miso <ChevronRight size={15} /></button></div></section>
    </div>
  )
}

function RoomDetail({ showToast }: { showToast: (message: string) => void }) {
  const [theme, setTheme] = useState('Sunlit loft')
  const themes = ['Sunlit loft', 'Forest nook', 'Moon room']
  const furniture = [{ icon: '🛋️', name: 'Sage sofa' }, { icon: '🪴', name: 'Leafy friend' }, { icon: '🖼️', name: 'Duo memory' }, { icon: '🧸', name: 'Miso toy' }]
  return <div className="space-page"><div className="detail-heading"><div><p className="eyebrow">SHARED SPACE</p><h1>Make room for joy.</h1><p className="detail-subtitle">A home that grows with both of you.</p></div><button className="primary-small" onClick={() => showToast('Room changes saved')}>Save room</button></div><section className="room-board"><div className="room-board-window" /><div className="room-board-sun" /><div className="room-board-plant">🌿</div><div className="room-board-picture">🖼️</div><div className="room-board-sofa">🛋️</div><div className="room-board-rug" /><div className="room-board-pet">🦊</div><span className="room-board-label">Miso's happy place</span></section><section className="room-tools"><div><p className="eyebrow">ROOM THEME</p><div className="theme-row">{themes.map((item) => <button className={theme === item ? 'theme-chip active' : 'theme-chip'} key={item} onClick={() => { setTheme(item); showToast(`${item} selected`) }}>{item}</button>)}</div></div><div><p className="eyebrow">FURNITURE & DECOR</p><div className="furniture-row">{furniture.map((item) => <button className="furniture-item" key={item.name} onClick={() => showToast(`${item.name} added to room`)}><span>{item.icon}</span><small>{item.name}</small></button>)}</div></div></section></div>
}

function ShopDetail({ coins, onPurchase, showToast }: { coins: number; onPurchase: (price: number, name: string) => void; showToast: (message: string) => void }) {
  const products = [{ icon: '🧢', name: 'Cloud cap', rarity: 'Rare', price: 850, color: 'blue' }, { icon: '🕶️', name: 'Cool shades', rarity: 'Uncommon', price: 420, color: 'peach' }, { icon: '✨', name: 'Star aura', rarity: 'Epic', price: 1200, color: 'lilac' }, { icon: '🎒', name: 'Tiny backpack', rarity: 'Common', price: 260, color: 'mint' }]
  return <div className="space-page"><div className="detail-heading"><div><p className="eyebrow">DUO SHOP</p><h1>Little things, big smiles.</h1><p className="detail-subtitle">Cosmetics for the life you are building together.</p></div><span className="coins shop-balance"><Coins size={16} /> {coins.toLocaleString()}</span></div><div className="shop-tabs"><button className="shop-tab active">Featured</button><button className="shop-tab">Owned</button><button className="shop-tab">Cases</button></div><div className="shop-grid">{products.map((item) => <article className="shop-item" key={item.name}><div className={`shop-art shop-${item.color}`}>{item.icon}<span>{item.rarity}</span></div><div className="shop-item-copy"><div><h3>{item.name}</h3><p>{item.rarity} cosmetic</p></div><button className="buy-button" disabled={coins < item.price} onClick={() => onPurchase(item.price, item.name)}><Coins size={13} /> {item.price}</button></div></article>)}</div></div>
}

function CollectionDetail({ showToast }: { showToast: (message: string) => void }) {
  const [filter, setFilter] = useState('All')
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpeciesKey>('fox')
  const filters = ['All', 'Found', 'Missing']
  const visibleSpecies = petSpecies.filter((pet) => filter === 'All' || (filter === 'Found' ? pet.found > 0 : pet.found === 0))
  const selected = petSpecies.find((pet) => pet.name.toLowerCase() === selectedSpecies) ?? petSpecies[5]
  return <div className="space-page"><div className="detail-heading"><div><p className="eyebrow">YOUR COLLECTION</p><h1>Every little friend.</h1><p className="detail-subtitle">Find them all, one shared adventure at a time.</p></div><div className="collection-total"><strong>26</strong><span>/ 124 variants</span></div></div><div className="collection-banner"><div><p className="eyebrow">COLLECTION PROGRESS</p><h2>10 species in the wild</h2><p>Complete the set to unlock the Forest Room.</p></div><div className="collection-progress"><strong>21%</strong><div><span style={{ width: '21%' }} /></div></div></div><section className="collection-preview"><div className={`collection-preview-art species-${selected.color}`}><PetIllustration species={selectedSpecies} size={245} /></div><div><p className="eyebrow">SELECTED SPECIES</p><h2>{selected.name}</h2><p>{selected.native} · {selected.rarity}</p><div className="preview-meta"><span>{selected.found} found</span><span>{selected.total - selected.found} to discover</span></div><button className="primary-small" onClick={() => showToast(`${selected.name} selected for your duo`)}>Choose this friend <ChevronRight size={14} /></button></div></section><div className="collection-toolbar"><div className="collection-filters">{filters.map((item) => <button className={filter === item ? 'collection-filter active' : 'collection-filter'} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="link-button" onClick={() => showToast('Collection is sorted by rarity')}>Rarity <ChevronRight size={15} /></button></div><div className="species-grid">{visibleSpecies.map((pet) => <button className={selectedSpecies === pet.name.toLowerCase() ? 'species-card active' : 'species-card'} key={pet.name} onClick={() => { setSelectedSpecies(pet.name.toLowerCase() as PetSpeciesKey); showToast(`${pet.name} model loaded`) }}><div className={`species-art species-${pet.color}`}><PetIllustration species={pet.name.toLowerCase() as PetSpeciesKey} size={125} /><small>{pet.rarity}</small></div><div className="species-copy"><div><h3>{pet.name}</h3><p>{pet.native}</p></div><strong>{pet.found}<small>/{pet.total}</small></strong></div><div className="species-track"><span style={{ width: `${(pet.found / pet.total) * 100}%` }} /></div></button>)}</div></div>
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [stats, setStats] = useState<Record<StatKey, number>>(() => {
    const saved = localStorage.getItem('duo-pet-stats')
    return saved ? { ...initialStats, ...(JSON.parse(saved) as Record<StatKey, number>) } : initialStats
  })
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('duo-pet-coins')) || 12450)
  const [toast, setToast] = useState('')
  const [flow, setFlow] = useState<Flow>('closed')
  const [eggProgress, setEggProgress] = useState(0)
  const [petAction, setPetAction] = useState<'idle' | 'feed' | 'drink' | 'play' | 'bath' | 'sleep'>('idle')
  const [activity, setActivity] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('duo-pet-activity')
    return saved ? (JSON.parse(saved) as Activity[]) : [
      { id: 1, icon: '🎾', text: 'You played with Miso', time: '12 min ago', accent: 'blue' },
      { id: 2, icon: '🍗', text: 'Maya gave Miso a snack', time: '1 hr ago', accent: 'peach' },
      { id: 3, icon: '✨', text: 'Miso reached a new mood streak', time: '3 hrs ago', accent: 'yellow' },
    ]
  })
  const [telegram, setTelegram] = useState<TelegramWebApp | null>(null)

  useEffect(() => {
    let mounted = true
    initTelegramWebApp().then((webApp) => {
      if (!mounted) return
      setTelegram(webApp)
      if (webApp) void authenticateTelegram(webApp)
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    localStorage.setItem('duo-pet-stats', JSON.stringify(stats))
    localStorage.setItem('duo-pet-coins', String(coins))
    localStorage.setItem('duo-pet-activity', JSON.stringify(activity))
  }, [activity, coins, stats])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const performAction = async (key: StatKey, label: string, value: number, icon: string) => {
    haptic(telegram, 'light')
    const action = label.toLowerCase() as 'feed' | 'drink' | 'play' | 'bath' | 'sleep'
    setPetAction(action)
    window.setTimeout(() => setPetAction('idle'), action === 'sleep' ? 2600 : 1500)
    const partnershipId = localStorage.getItem('duo-pet-partnership-id')
    const actionKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const serverAccepted = telegram && partnershipId ? await submitPetAction(telegram, partnershipId, label.toLowerCase(), actionKey) : false
    setStats((current) => ({ ...current, [key]: clamp(current[key] + value) }))
    setCoins((current) => current + 25)
    setActivity((current) => [
      { id: Date.now(), icon, text: `You helped Miso ${label.toLowerCase()}`, time: 'just now', accent: 'green' },
      ...current.slice(0, 2),
    ])
    showToast(serverAccepted ? `Miso loved that! Server saved +25 coins` : `Miso loved that! +25 coins`)
  }

  const openEgg = () => {
    if (eggProgress === 0) {
      setEggProgress(1)
      showToast('Your side is ready')
      return
    }

    if (eggProgress === 1) {
      setEggProgress(2)
      showToast('Maya is ready too')
      return
    }

    setFlow('closed')
    setEggProgress(0)
    showToast('Miso joined your duo!')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><PawPrint size={19} strokeWidth={2.8} /></div>
          <div>
            <p className="brand-name">duo<span>pet</span></p>
            <p className="brand-caption">two hearts. one little life.</p>
          </div>
        </div>
        <div className="top-actions">
          <button className="icon-button" aria-label="Help" onClick={() => showToast('Your shared space is looking good')}><CircleHelp size={19} /></button>
          <button className="icon-button notification-button" aria-label="Notifications" onClick={() => showToast('No new notifications')}><Bell size={19} /><span /></button>
          <div className="avatar-group"><span className="avatar avatar-a">D</span><span className="avatar avatar-b">M</span></div>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'pet' ? <PetDetail stats={stats} action={petAction} showToast={showToast} /> : activeTab === 'room' ? <RoomDetail showToast={showToast} /> : activeTab === 'shop' ? <ShopDetail coins={coins} onPurchase={(price, name) => { setCoins((current) => current - price); showToast(`${name} purchased`) }} showToast={showToast} /> : activeTab === 'more' ? <CollectionDetail showToast={showToast} /> : <>
        <section className="welcome-row">
          <div>
            <p className="eyebrow"><span className="live-dot" /> YOUR SHARED SPACE</p>
            <h1>Good afternoon,<br /><em>Diplomat.</em></h1>
          </div>
          <button className="streak-pill" onClick={() => showToast('You are on a 7 day care streak')}><Flame size={16} fill="currentColor" /> 7 day streak</button>
        </section>

        <section className="hero-grid">
          <div className="pet-card">
            <div className="pet-card-top"><span className="status-tag"><span className="online-dot" /> Miso is happy</span><button className="more-button" aria-label="More options"><MoreHorizontal size={21} /></button></div>
            <div className="pet-scene">
              <div className="scene-sun" />
              <div className="cloud cloud-one" /><div className="cloud cloud-two" />
              <div className="hill hill-back" /><div className="hill hill-front" />
              <div className="sparkle sparkle-one">✦</div><div className="sparkle sparkle-two">✦</div>
              <div className="pet-character" aria-label="Miso the fox">
                <div className="tail"><span /></div>
                <div className="pet-body"><div className="belly" /><div className="leg leg-left" /><div className="leg leg-right" /></div>
                <div className="pet-head"><div className="ear ear-left" /><div className="ear ear-right" /><div className="face"><span className="eye eye-left" /><span className="eye eye-right" /><span className="blush blush-left" /><span className="blush blush-right" /><span className="nose" /><span className="smile" /></div></div>
              </div>
              <div className="pet-shadow" />
              <div className="scene-label"><span>LEVEL 08</span><strong>Miso</strong><small>Fox · Uncommon</small></div>
            </div>
            <div className="pet-card-footer"><div className="xp-copy"><span>Growing together</span><strong>1,240 <small>/ 1,600 XP</small></strong></div><div className="xp-bar"><span style={{ width: '77%' }} /></div><button className="round-arrow" aria-label="View pet" onClick={() => setActiveTab('pet')}><ChevronRight size={18} /></button></div>
          </div>

          <div className="side-stack">
            <div className="duo-card">
              <div className="section-heading"><div><p className="eyebrow">YOUR DUO</p><h2>Care together</h2></div><div className="duo-avatars"><span className="avatar avatar-a">D</span><span className="avatar avatar-b">M</span></div></div>
              <p className="duo-copy">Every small moment adds up to a happy little life.</p>
              <div className="duo-progress"><div><span>This week</span><strong>14 / 20 actions</strong></div><div className="progress-track"><span style={{ width: '70%' }} /></div></div>
              <button className="text-button" onClick={() => { setFlow('invite'); haptic(telegram) }}>Invite Maya <Plus size={15} /></button>
            </div>
            <div className="daily-card"><div className="daily-icon"><Sparkles size={18} /></div><div><p className="eyebrow">DAILY QUEST</p><h3>Make Miso smile</h3><p>Complete 2 care actions</p></div><div className="quest-check"><Check size={15} /></div></div>
          </div>
        </section>

        <section className="section-block stats-block"><div className="section-heading"><div><p className="eyebrow">RIGHT NOW</p><h2>Miso's wellbeing</h2></div><button className="link-button" onClick={() => setActiveTab('pet')}>Details <ChevronRight size={15} /></button></div><div className="stats-grid">{(Object.keys(stats) as StatKey[]).map((key) => <div className="stat-card" key={key}><div className={`stat-icon stat-${key}`}>{key === 'hunger' ? <Utensils size={17} /> : key === 'thirst' ? <Droplets size={17} /> : key === 'energy' ? <Zap size={17} /> : key === 'mood' ? <Heart size={17} fill="currentColor" /> : <Waves size={17} />}</div><div className="stat-info"><div><span>{statLabels[key]}</span><strong>{stats[key]}%</strong></div><div className="stat-track"><span className={`fill-${key}`} style={{ width: `${stats[key]}%` }} /></div></div></div>)}</div></section>

        <section className="section-block actions-block"><div className="section-heading"><div><p className="eyebrow">QUICK CARE</p><h2>Make a moment</h2></div><span className="coins"><Coins size={16} /> {coins.toLocaleString()}</span></div><div className="action-grid">{actions.map(({ key, label, value, icon: Icon, className }) => <button className={`care-action ${className}`} key={key} onClick={() => performAction(key, label, value, label === 'Feed' ? '🍗' : label === 'Drink' ? '💧' : label === 'Play' ? '🎾' : label === 'Bath' ? '🛁' : '💤')}><span className="action-icon"><Icon size={20} /></span><span><strong>{label}</strong><small>+{value} {statLabels[key]}</small></span><ChevronRight size={16} /></button>)}</div></section>

        <section className="lower-grid"><div className="section-block activity-block"><div className="section-heading"><div><p className="eyebrow">THE STORY SO FAR</p><h2>Recent moments</h2></div><button className="dots-button" aria-label="More activity"><MoreHorizontal size={19} /></button></div><div className="activity-list">{activity.map((item) => <div className="activity-item" key={item.id}><div className={`activity-icon activity-${item.accent}`}>{item.icon}</div><div><strong>{item.text}</strong><span>{item.time}</span></div><Check size={15} className="activity-check" /></div>)}</div></div><div className="section-block room-preview"><div className="room-art"><div className="room-window"><span /><span /></div><div className="room-plant">🌿</div><div className="room-lamp">◒</div><div className="room-rug" /><div className="room-sofa" /><div className="room-pet">🐕</div></div><div className="room-copy"><div><p className="eyebrow">YOUR ROOM</p><h2>Make it yours</h2></div><button className="round-arrow" aria-label="Open room" onClick={() => setActiveTab('room')}><ChevronRight size={18} /></button></div></div></section>
        </>}
      </main>

      <nav className="bottom-nav">{([{ id: 'home', label: 'Home', icon: Home }, { id: 'pet', label: 'Miso', icon: PawPrint }, { id: 'room', label: 'Room', icon: MapPin }, { id: 'shop', label: 'Shop', icon: Store }, { id: 'more', label: 'More', icon: MoreHorizontal }] as const).map(({ id, label, icon: Icon }) => <button className={activeTab === id ? 'nav-item active' : 'nav-item'} key={id} onClick={() => setActiveTab(id)}><Icon size={19} strokeWidth={activeTab === id ? 2.5 : 2} /><span>{label}</span>{id === 'shop' && <i />}</button>)}</nav>
      {flow === 'invite' && <div className="modal-backdrop" role="presentation" onClick={() => setFlow('closed')}><section className="modal-card invite-modal" role="dialog" aria-modal="true" aria-labelledby="invite-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={() => setFlow('closed')}>×</button><div className="modal-kicker">A LITTLE LIFE, TOGETHER</div><div className="invite-orbit"><span className="invite-star">✦</span><div className="invite-egg">🥚</div><span className="invite-heart">♡</span></div><h2 id="invite-title">Invite Maya<br /><em>to meet Miso.</em></h2><p>Send a private invite and open your first egg together. No rush, just one tiny beginning.</p><div className="invite-people"><div><span className="avatar avatar-a">D</span><strong>You</strong></div><div className="invite-line" /><div><span className="avatar avatar-b">M</span><strong>Maya</strong></div></div><button className="primary-button" onClick={async () => { const invite = telegram ? await createPartnershipInvite(telegram) : null; setFlow('egg'); showToast(invite ? 'Secure invite link created' : 'Demo invite ready') }}>Send invite <ChevronRight size={17} /></button><button className="modal-secondary" onClick={() => setFlow('closed')}>Maybe later</button></section></div>}
      {flow === 'egg' && <div className="modal-backdrop" role="presentation"><section className={`modal-card egg-modal egg-step-${eggProgress}`} role="dialog" aria-modal="true" aria-labelledby="egg-title"><button className="modal-close" aria-label="Close" onClick={() => setFlow('closed')}>×</button><div className="modal-kicker">YOUR FIRST MOMENT</div><div className="egg-stage"><div className="egg-glow" /><div className="hatch-egg">🥚</div>{eggProgress === 2 && <div className="hatch-sparkles">✦ ✦ ✦</div>}</div><p className="egg-count">{eggProgress} / 2 READY</p><h2 id="egg-title">{eggProgress === 2 ? <>Something wonderful<br /><em>is hatching.</em></> : <>Wait for your<br /><em>other half.</em></>}</h2><p>{eggProgress === 0 ? 'Tap in first. Maya will join you before the egg opens.' : eggProgress === 1 ? 'Your side is done. Maya needs to tap in too.' : 'Both of you are here. Open the egg and meet your new companion.'}</p><div className="egg-progress"><span className={eggProgress >= 1 ? 'ready' : ''}>D</span><i className={eggProgress === 2 ? 'ready' : ''} /><span className={eggProgress === 2 ? 'ready' : ''}>M</span></div><button className="primary-button" onClick={openEgg}>{eggProgress === 0 ? 'Open my side' : eggProgress === 1 ? 'Maya is ready' : 'Open together'} <Sparkles size={16} /></button></section></div>}
      {toast && <div className="toast"><Sparkles size={16} /> {toast}</div>}
    </div>
  )
}

export default App
