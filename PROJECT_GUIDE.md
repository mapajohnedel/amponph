# PawMatch - Dog Adoption Platform

A modern, responsive dog adoption marketplace built with Next.js 16, React 19, and Tailwind CSS.

## 🐾 Project Overview

PawMatch is a fully-featured dog adoption platform that connects loving families with rescue dogs. The application includes a beautiful landing page, dog browsing with advanced filtering, detailed dog profiles, user authentication UI, a user dashboard, and an admin panel for shelter management.

## 📁 Project Structure

```
/app
  /page.tsx              # Landing page with hero, featured dogs, testimonials
  /browse/page.tsx       # Dog listing page with filtering
  /browse/[id]/page.tsx  # Individual dog profile page
  /auth/page.tsx         # Authentication page (login/register)
  /dashboard/page.tsx    # User dashboard (favorites, requests, profile)
  /admin/page.tsx        # Admin panel (dog management, adoption requests)
  layout.tsx             # Root layout with navbar
  globals.css            # Global styles and design tokens

/components
  /navbar.tsx            # Navigation bar with logo and menu
  /dog-card.tsx          # Reusable dog listing card component
  /dog-filter.tsx        # Filter sidebar for dog browsing
  /dog-gallery.tsx       # Image gallery for dog profiles

/lib
  /mock-dogs.ts          # Mock dog data and utility functions
  /utils.ts              # Utility functions
```

## 🎨 Design System

### Color Palette
- **Primary**: Warm orange (#FF8A4D equivalent in oklch)
- **Secondary**: Light green (#A8D5BA equivalent in oklch)
- **Background**: Light cream (#FAFAF5 equivalent in oklch)
- **Foreground**: Deep charcoal (#2C2C2C equivalent in oklch)
- **Border**: Light gray (#E8E8E8 equivalent in oklch)

### Typography
- **Font**: Geist (sans-serif) from Next.js Google Fonts
- **Headings**: Bold weights (700+)
- **Body Text**: Regular weight (400) with 1.5 line height

### Components
All components use shadcn/ui and Tailwind CSS for consistent styling. Design uses flexbox for layouts, rounded borders, and hover effects for interactivity.

## 🚀 Key Features

### Landing Page (`/`)
- Hero section with call-to-action buttons
- Featured dogs carousel (3-4 dogs)
- "Why Adopt?" section with 3 benefit cards
- Customer testimonials
- Footer with links and contact info

### Dog Browsing (`/browse`)
- Responsive grid of dog cards (2-3 columns on desktop)
- Sidebar filters:
  - Breed (dropdown)
  - Size (radio buttons)
  - Location (search)
- Real-time filter updates
- 12 mock dogs with complete data

### Dog Profile (`/browse/[id]`)
- Image gallery with thumbnail navigation
- Detailed dog information:
  - Name, breed, age, gender, size
  - Health status (vaccinated, neutered)
  - Description and personality
- Adoption action buttons
- Related dogs section
- Shelter contact information
- Adoption process steps

### Authentication (`/auth`)
- Tab-based login/register form
- Email and password fields with icons
- Password visibility toggle
- Social login placeholders (Google, Facebook)
- Input validation and error states

### User Dashboard (`/dashboard`)
- Sidebar navigation with 3 main sections
- **Favorites Tab**: Saved dogs grid
- **Adoption Requests Tab**: Request status tracking
- **Profile Settings Tab**: User information and preferences
- Responsive layout for mobile/desktop

### Admin Panel (`/admin`)
- **Manage Dogs Tab**:
  - Table view of all dogs
  - Add, edit, delete functionality
  - Modal for adding new dogs
- **Adoption Requests Tab**:
  - Pending adoption request list
  - Approve/reject buttons
  - Applicant contact information

## 📊 Mock Data

12 dogs included in `/lib/mock-dogs.ts`:
1. Max - Golden Retriever, 3 years, Large, San Francisco
2. Luna - Husky, 2 years, Large, Seattle
3. Charlie - Labrador Mix, 5 years, Medium, Portland
4. Bella - German Shepherd, 4 years, Large, Los Angeles
5. Cooper - Corgi, 2 years, Small, Austin
6. Daisy - Dachshund, 3 years, Small, Denver
7. Rocky - Boxer, 4 years, Large, Chicago
8. Sadie - Beagle, 3 years, Small, Boston
9. Duke - German Shepherd Mix, 6 years, Large, New York
10. Bailey - Poodle Mix, 2 years, Medium, Miami
11. Scout - Golden Retriever Mix, 1 year, Medium, Nashville
12. Molly - Labrador Retriever, 4 years, Large, Phoenix

Each dog has:
- Name, breed, age, gender, size
- Location, bio/description
- Health status (vaccinated, neutered)
- Shelter name and email
- Multiple images loaded from the Dog CEO API

## 🛠️ Technologies Used

- **Next.js 16**: React framework with App Router
- **React 19**: UI component library
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Component library (pre-installed)
- **Lucide React**: Icon library
- **TypeScript**: Type safety

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 640px (sm)
  - Tablet: 768px - 1024px (md)
  - Desktop: 1024px+ (lg)
- Hamburger menu for mobile navigation
- Flexible grid layouts with `md:grid-cols-X` and `lg:grid-cols-X`

## 🎯 User Flows

### Browsing Dogs
1. User visits landing page
2. Clicks "Start Browsing" or "Browse Dogs"
3. Filters dogs by breed, size, location
4. Clicks on a dog card to view details
5. Can save to favorites or submit adoption request

### User Dashboard
1. User clicks "Sign In" or "Register"
2. Navigates to dashboard
3. Manages favorites, views adoption request status
4. Updates profile settings

### Admin Operations
1. Admin logs in and navigates to `/admin`
2. Manages dog listings (add, edit, delete)
3. Reviews and approves/rejects adoption requests

## 🔧 Customization

### Adding New Dogs
Edit `/lib/mock-dogs.ts` and add to the `mockDogs` array:
```typescript
{
  id: '13',
  name: 'Buddy',
  breed: 'Mixed',
  age: 3,
  gender: 'male',
  size: 'medium',
  location: 'Los Angeles, CA',
  image: 'https://...',
  images: ['https://...'],
  description: '...',
  vaccinated: true,
  neutered: true,
  shelterName: 'LA Rescue',
  shelterEmail: 'adopt@larescue.org',
}
```

### Changing Colors
Edit `/app/globals.css` to modify the CSS custom properties in `:root`:
```css
--primary: oklch(0.62 0.22 43);      /* Change orange */
--secondary: oklch(0.75 0.12 160);   /* Change green */
```

### Adding New Pages
Create new directories in `/app` following Next.js App Router conventions:
```
/app/about/page.tsx
/app/contact/page.tsx
```

## 🚀 Deployment

This is a static Next.js app with no backend. Deploy to Vercel:
```bash
npm install
npm run build
npm run start
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📝 Notes

- No backend authentication is implemented (UI only)
- Dogs use mock data from `/lib/mock-dogs.ts`
- Images are hydrated from the Dog CEO API with local placeholders as fallback
- Filter functionality is fully operational with real-time updates
- All components are responsive and accessible

## 🐾 Future Enhancements

- Backend integration with database
- Real user authentication
- Email notifications
- Favorite persistence
- Adoption form submission
- Chat with shelters
- Photo uploads from users
- Ratings and reviews
- Advanced search and filters
