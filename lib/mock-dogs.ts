export interface Dog {
  id: string
  name: string
  breed: string
  age: number
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  location: string
  image: string
  images: string[]
  description: string
  vaccinated: boolean
  neutered: boolean
  shelterName: string
  shelterEmail: string
  shelterPhone?: string
  price?: number
}

function createDogPlaceholder(label: string, accent: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#f8fafc" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bg)" />
      <circle cx="400" cy="310" r="140" fill="#ffffff" fill-opacity="0.92" />
      <path d="M275 235c-34-48-9-111 55-124-7 69 36 128 70 150-51 4-92-1-125-26Z" fill="#ffffff" fill-opacity="0.88" />
      <path d="M525 235c34-48 9-111-55-124 7 69-36 128-70 150 51 4 92-1 125-26Z" fill="#ffffff" fill-opacity="0.88" />
      <circle cx="350" cy="305" r="14" fill="#1f2937" />
      <circle cx="450" cy="305" r="14" fill="#1f2937" />
      <ellipse cx="400" cy="360" rx="34" ry="24" fill="#1f2937" />
      <path d="M360 394c20 18 59 18 79 0" fill="none" stroke="#1f2937" stroke-width="14" stroke-linecap="round" />
      <text x="400" y="610" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#0f172a">${label}</text>
      <text x="400" y="668" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#334155">Loading photos from Dog CEO</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const dogImages = [
  createDogPlaceholder('Playful pup', '#fde68a'),
  createDogPlaceholder('Ready to adopt', '#bfdbfe'),
  createDogPlaceholder('Gentle friend', '#fecaca'),
  createDogPlaceholder('Happy tail wags', '#ddd6fe'),
  createDogPlaceholder('Loves adventures', '#bbf7d0'),
  createDogPlaceholder('Sweet companion', '#fecdd3'),
  createDogPlaceholder('Rescue favorite', '#bae6fd'),
  createDogPlaceholder('Looking for home', '#fed7aa'),
  createDogPlaceholder('Cuddle expert', '#f5d0fe'),
  createDogPlaceholder('Best friend energy', '#c7d2fe'),
]

export const mockDogs: Dog[] = [
  {
    id: '1',
    name: 'Max',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    size: 'large',
    location: 'Quezon City, Metro Manila',
    image: dogImages[0],
    images: [dogImages[0], dogImages[3], dogImages[6]],
    description: 'Max is a friendly and energetic Golden Retriever who loves to play fetch and swim. He\'s great with kids and other dogs.',
    vaccinated: true,
    neutered: true,
    shelterName: 'Bay Area Dog Rescue',
    shelterEmail: 'info@bayareadog.org',
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Husky',
    age: 2,
    gender: 'female',
    size: 'large',
    location: 'Makati, Metro Manila',
    image: dogImages[1],
    images: [dogImages[1], dogImages[4], dogImages[7]],
    description: 'Luna is a beautiful Husky with striking blue eyes. She\'s active, intelligent, and needs regular exercise. Perfect for an active family.',
    vaccinated: true,
    neutered: false,
    shelterName: 'Seattle Animal Shelter',
    shelterEmail: 'adopt@seattleanimal.org',
  },
  {
    id: '3',
    name: 'Charlie',
    breed: 'Labrador Mix',
    age: 5,
    gender: 'male',
    size: 'medium',
    location: 'Cebu City, Cebu',
    image: dogImages[2],
    images: [dogImages[2], dogImages[5], dogImages[8]],
    description: 'Charlie is a sweet and calm Labrador mix. He\'s perfect for families looking for a loyal companion. Good with kids and loves cuddles.',
    vaccinated: true,
    neutered: true,
    shelterName: 'Portland Rescue Dogs',
    shelterEmail: 'contact@portlandrescue.org',
  },
  {
    id: '4',
    name: 'Bella',
    breed: 'German Shepherd',
    age: 4,
    gender: 'female',
    size: 'large',
    location: 'Davao City, Davao del Sur',
    image: dogImages[3],
    images: [dogImages[3], dogImages[6], dogImages[9]],
    description: 'Bella is an intelligent and protective German Shepherd. She\'s well-trained and would be perfect as a family guardian.',
    vaccinated: true,
    neutered: true,
    shelterName: 'LA Dog Sanctuary',
    shelterEmail: 'help@ladogsanctuary.org',
  },
  {
    id: '5',
    name: 'Cooper',
    breed: 'Corgi',
    age: 2,
    gender: 'male',
    size: 'small',
    location: 'Baguio City, Benguet',
    image: dogImages[4],
    images: [dogImages[4], dogImages[7], dogImages[0]],
    description: 'Cooper is an adorable Corgi with tons of personality. He loves to play and is great for apartment living. Very food motivated!',
    vaccinated: true,
    neutered: true,
    shelterName: 'Austin Paws',
    shelterEmail: 'adopt@austinpaws.org',
  },
  {
    id: '6',
    name: 'Daisy',
    breed: 'Dachshund',
    age: 3,
    gender: 'female',
    size: 'small',
    location: 'Iloilo City, Iloilo',
    image: dogImages[5],
    images: [dogImages[5], dogImages[8], dogImages[1]],
    description: 'Daisy is a cute little Dachshund with a big personality. She loves to cuddle and would be perfect for someone looking for a small companion.',
    vaccinated: true,
    neutered: false,
    shelterName: 'Denver Dog Rescue',
    shelterEmail: 'info@denverdog.org',
  },
  {
    id: '7',
    name: 'Rocky',
    breed: 'Boxer',
    age: 4,
    gender: 'male',
    size: 'large',
    location: 'Cagayan de Oro, Misamis Oriental',
    image: dogImages[6],
    images: [dogImages[6], dogImages[9], dogImages[2]],
    description: 'Rocky is a muscular and playful Boxer. He\'s extremely loyal and protective of his family. Needs an experienced dog owner.',
    vaccinated: true,
    neutered: true,
    shelterName: 'Chicago Dog Alliance',
    shelterEmail: 'support@chicagodog.org',
  },
  {
    id: '8',
    name: 'Sadie',
    breed: 'Beagle',
    age: 3,
    gender: 'female',
    size: 'small',
    location: 'Pasig, Metro Manila',
    image: dogImages[7],
    images: [dogImages[7], dogImages[0], dogImages[3]],
    description: 'Sadie is a curious and loving Beagle. She has tons of energy and loves going on adventures. Great with families!',
    vaccinated: true,
    neutered: true,
    shelterName: 'Boston Animal Care',
    shelterEmail: 'hello@bostonanimal.org',
  },
  {
    id: '9',
    name: 'Duke',
    breed: 'German Shepherd Mix',
    age: 6,
    gender: 'male',
    size: 'large',
    location: 'Taguig, Metro Manila',
    image: dogImages[8],
    images: [dogImages[8], dogImages[1], dogImages[4]],
    description: 'Duke is a gentle giant and senior dog looking for a comfortable home. He\'s calm, well-behaved, and would love a quiet household.',
    vaccinated: true,
    neutered: true,
    shelterName: 'NYC Rescue Network',
    shelterEmail: 'contact@nycrescue.org',
  },
  {
    id: '10',
    name: 'Bailey',
    breed: 'Poodle Mix',
    age: 2,
    gender: 'female',
    size: 'medium',
    location: 'Bacolod City, Negros Occidental',
    image: dogImages[9],
    images: [dogImages[9], dogImages[2], dogImages[5]],
    description: 'Bailey is a smart and friendly Poodle mix. She\'s hypoallergenic and loves to learn new tricks. Perfect for active families!',
    vaccinated: true,
    neutered: true,
    shelterName: 'Miami Dog Friends',
    shelterEmail: 'adopt@miamidogfriends.org',
  },
  {
    id: '11',
    name: 'Scout',
    breed: 'Golden Retriever Mix',
    age: 1,
    gender: 'female',
    size: 'medium',
    location: 'Antipolo, Rizal',
    image: dogImages[0],
    images: [dogImages[0], dogImages[3], dogImages[6]],
    description: 'Scout is a young, energetic Golden Retriever mix. She\'s in training and would benefit from an active family with experience.',
    vaccinated: true,
    neutered: false,
    shelterName: 'Nashville Rescue',
    shelterEmail: 'help@nashvillerescue.org',
  },
  {
    id: '12',
    name: 'Molly',
    breed: 'Labrador Retriever',
    age: 4,
    gender: 'female',
    size: 'large',
    location: 'Santa Rosa, Laguna',
    image: dogImages[1],
    images: [dogImages[1], dogImages[4], dogImages[7]],
    description: 'Molly is a sweet Lab looking for her forever home. She\'s great with kids, loves swimming, and is very food motivated.',
    vaccinated: true,
    neutered: true,
    shelterName: 'Phoenix Animal Control',
    shelterEmail: 'info@phoenixanimal.org',
  },
]

export function getDogById(id: string, dogs: Dog[] = mockDogs): Dog | undefined {
  return dogs.find(dog => dog.id === id)
}

export function filterDogs(filters: {
  breed?: string
  minAge?: number
  maxAge?: number
  size?: string
  location?: string
}, dogs: Dog[] = mockDogs): Dog[] {
  return dogs.filter(dog => {
    if (filters.breed && !dog.breed.toLowerCase().includes(filters.breed.toLowerCase())) {
      return false
    }
    if (filters.minAge !== undefined && dog.age < filters.minAge) {
      return false
    }
    if (filters.maxAge !== undefined && dog.age > filters.maxAge) {
      return false
    }
    if (filters.size && dog.size !== filters.size) {
      return false
    }
    if (filters.location && !dog.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }
    return true
  })
}
