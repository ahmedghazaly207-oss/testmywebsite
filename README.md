# KooraLive - Professional Football Matches Web App

A modern, clean, and professional React.js web application for browsing live football matches. Built with Vite, React Router, and pure CSS modules.

## 🎯 Features

- **Modern Design**: Glassmorphism header, soft shadows, and smooth animations
- **Responsive Layout**: Fully mobile-first and responsive design
- **Dark Theme**: Professional dark theme with red accent colors (#ff4444)
- **Dynamic Match Cards**: Real-time match status with LIVE and Upcoming badges
- **Match Details Page**: Comprehensive match information with highlights section
- **React Router Navigation**: Smooth page transitions between routes
- **Pure CSS Modules**: No frameworks like Tailwind or Bootstrap
- **Optimized Performance**: Built with Vite for fast development and production builds

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── Header.module.css
│   ├── MatchCard.jsx
│   ├── MatchCard.module.css
│   ├── Footer.jsx
│   └── Footer.module.css
├── pages/
│   ├── Home.jsx
│   ├── Home.module.css
│   ├── MatchDetails.jsx
│   ├── MatchDetails.module.css
│   ├── NotFound.jsx
│   └── NotFound.module.css
├── data/
│   └── matchesData.js
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project folder:**
   ```bash
   cd "Test Live football"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will automatically open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## 📋 Pages

### 1. **Home Page** (`/`)
- Displays today's date automatically
- Shows all available matches in a responsive grid
- Each match card includes:
  - League name
  - Match time
  - Team names with visual logos
  - Live/Upcoming status badge
  - "Details" button for navigation

### 2. **Match Details Page** (`/match/:id`)
- Full match information display
- Team logos and names (larger)
- League and time information
- Match description
- Highlights section (video placeholder)
- Additional info grid (Stadium, Referee, Attendance)
- Back to home button

### 3. **Not Found Page** (`/*`)
- Custom 404 page with animations
- Back to home button
- Decorative football animation

## 🎨 Design Features

### Color Scheme
- **Background**: #0a0a0a (Deep black)
- **Card Background**: #111 (Dark gray)
- **Text Color**: #eee (Light gray)
- **Accent**: #ff4444 (Red)

### UI Elements
- **Glassmorphism**: Header with backdrop blur effect
- **Rounded Corners**: 12-16px border radius
- **Smooth Animations**: Fade-in, slide-in, pulse, and hover effects
- **Responsive Spacing**: Proper padding and margins across all devices
- **Modern Typography**: Clean, professional font stack

## 🔧 Customization

### Adding New Matches

Edit `src/data/matchesData.js` to add new matches:

```javascript
{
  id: 9,
  league: 'Your League Name',
  time: 'HH:MM',
  team1: 'Team 1 Name',
  team2: 'Team 2 Name',
  status: 'LIVE' or 'Upcoming',
  description: 'Match description...',
  stadium: 'Stadium Name',
  referee: 'Referee Name',
  attendance: 'Attendance number or TBA',
}
```

### Styling Components

All components use CSS modules. To customize styles:

1. Open the relevant `.module.css` file
2. Modify the styles as needed
3. Styles are scoped to components automatically

### Changing Colors

Update the accent color by finding `#ff4444` in CSS files and replacing it with your desired color.

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## 🌐 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Display all matches |
| `/match/:id` | MatchDetails | Show detailed match information |
| `*` | NotFound | 404 error page |

## 📦 Dependencies

- **react**: ^18.2.0 - UI library
- **react-dom**: ^18.2.0 - React DOM rendering
- **react-router-dom**: ^6.20.0 - Client-side routing

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 💡 Performance Tips

1. **Code Splitting**: React Router automatically handles code splitting
2. **CSS Modules**: Scoped styles prevent conflicts
3. **Vite**: Fast HMR and optimized builds
4. **Lazy Loading**: Images and components load efficiently

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created as a professional football matches web application.

---

**Ready to run!** Just execute `npm install` and `npm run dev` to get started.
