export interface Option {
  value: string
  label: string
}

export const CATEGORIES: Option[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home', label: 'Home' },
  { value: 'sports', label: 'Sports' },
]

export const CONDITIONS: Option[] = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like new' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
]

export const STATUSES: Option[] = [
  { value: 'active', label: 'Active' },
  { value: 'sold', label: 'Sold' },
  { value: 'hidden', label: 'Hidden' },
]

export const STATES: Option[] = [
  { value: 'johor', label: 'Johor' },
  { value: 'kedah', label: 'Kedah' },
  { value: 'kelantan', label: 'Kelantan' },
  { value: 'kuala_lumpur', label: 'Kuala Lumpur' },
  { value: 'labuan', label: 'Labuan' },
  { value: 'melaka', label: 'Melaka' },
  { value: 'negeri_sembilan', label: 'Negeri Sembilan' },
  { value: 'pahang', label: 'Pahang' },
  { value: 'penang', label: 'Penang' },
  { value: 'perak', label: 'Perak' },
  { value: 'perlis', label: 'Perlis' },
  { value: 'putrajaya', label: 'Putrajaya' },
  { value: 'sabah', label: 'Sabah' },
  { value: 'sarawak', label: 'Sarawak' },
  { value: 'selangor', label: 'Selangor' },
  { value: 'terengganu', label: 'Terengganu' },
]

export const labelFor = (options: Option[], value: string): string =>
  options.find((o) => o.value === value)?.label ?? value
