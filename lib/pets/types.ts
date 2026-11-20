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
