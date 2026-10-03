export type PetSpeciesKey = 'cat' | 'dog' | 'monkey' | 'crocodile' | 'rabbit' | 'fox' | 'panda' | 'frog' | 'bear' | 'penguin'

export type PetSpeciesConfig = {
  key: PetSpeciesKey
  body: string
  belly: string
  innerEar: string
  headScale: [number, number, number]
  earScale: [number, number, number]
  eyeScale: number
  asset?: string
}

export const petSpecies3d: Record<PetSpeciesKey, PetSpeciesConfig> = {
  cat: { key: 'cat', body: '#c99778', belly: '#f1d0ac', innerEar: '#eaa7a1', headScale: [1.02, 1, .86], earScale: [1, 1.12, 1], eyeScale: 1 },
  dog: { key: 'dog', body: '#b77a51', belly: '#e8c39a', innerEar: '#d99283', headScale: [1.08, .98, .88], earScale: [1.18, .86, 1], eyeScale: 1 },
  monkey: { key: 'monkey', body: '#9a6b50', belly: '#d9ae82', innerEar: '#c98276', headScale: [1.08, 1.02, .9], earScale: [1.3, .75, 1], eyeScale: 1.05 },
  crocodile: { key: 'crocodile', body: '#6fa579', belly: '#b8d49e', innerEar: '#83b88a', headScale: [1.15, .82, .94], earScale: [.9, .8, 1], eyeScale: .9 },
  rabbit: { key: 'rabbit', body: '#d9c7bb', belly: '#f2e7dc', innerEar: '#e7a9ad', headScale: [1, 1.02, .85], earScale: [.72, 1.75, 1], eyeScale: 1.05 },
  fox: { key: 'fox', body: '#e99d70', belly: '#f9d4ac', innerEar: '#f3b39a', headScale: [1.04, .98, .88], earScale: [1, 1, 1], eyeScale: 1 },
  panda: { key: 'panda', body: '#3b5150', belly: '#edf0e8', innerEar: '#293e3e', headScale: [1.06, 1, .9], earScale: [1.1, .95, 1], eyeScale: 1 },
  frog: { key: 'frog', body: '#75b981', belly: '#c3e0a2', innerEar: '#9ad395', headScale: [1.12, .9, .92], earScale: [.8, .7, 1], eyeScale: 1.12 },
  bear: { key: 'bear', body: '#9a694a', belly: '#d5aa7e', innerEar: '#bd8174', headScale: [1.12, 1.04, .94], earScale: [1.14, .9, 1], eyeScale: 1 },
  penguin: { key: 'penguin', body: '#385666', belly: '#edf4ee', innerEar: '#526f7c', headScale: [1.02, 1.08, .9], earScale: [.75, .75, 1], eyeScale: .95 },
}
