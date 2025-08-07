# Tabletop Toolkit

A comprehensive hub for tabletop RPG tools and applications built with Next.js, React, and Firebase. Create, customize, and manage all aspects of your tabletop gaming experience from one unified platform.

![Tabletop Toolkit Preview](https://via.placeholder.com/800x400/1a1a2e/eee?text=Tabletop+Toolkit)

## ✨ Applications

### 🏪 **Dungeon & Shopkeeps** (Available)
- **Interactive Shop Builder** - Create shops with custom titles and owner names
- **Item Management** - Add, edit, and remove items with categories (Weapons, Armor, Potions, Gear, Scrolls)
- **Multi-Currency Support** - Gold Pieces (GP), Silver Pieces (SP), Copper Pieces (CP)
- **5 Beautiful Themes**: Parchment, Tavern, Arcane, Forest, Dungeon
- **Print-Optimized Layouts** - Professional print formatting with proper spacing
- **Cloud Storage** - Save shops to Firebase with user authentication

### 🛡️ **Character Forge** (Coming Soon)
- **Multi-System Support** - D&D 5e, Pathfinder, and more
- **Stat Tracking** - Comprehensive character statistics
- **Equipment Manager** - Track gear and inventory

### 📚 **Campaign Chronicles** (Coming Soon)
- **Session Management** - Track campaign progress
- **Player Management** - Organize player information
- **Story Arc Tracking** - Plan and follow narrative threads

### 🗺️ **Realm Mapper** (Coming Soon)
- **Interactive Maps** - Create detailed world maps
- **Custom Markers** - Add locations and points of interest
- **Layer System** - Organize map elements

### 🎲 **Dice Sanctum** (Coming Soon)
- **Advanced Rolling** - Custom dice formulas
- **Roll History** - Track previous rolls
- **Probability Analysis** - Statistical insights

### 📜 **Lore Keeper** (Coming Soon)
- **World Building** - Document your campaign world
- **NPC Database** - Track non-player characters
- **Timeline Management** - Organize historical events

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Firebase account (for save functionality)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/ChargerIIC/tabletop-toolkit.git
   cd tabletop-toolkit
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase configuration
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup
To enable the save functionality, you'll need to configure Firebase:

1. **Follow the complete [Firebase Setup Guide](FIREBASE_SETUP.md)**
2. **Add your configuration to `.env.local`**
3. **Configure authentication and Firestore security rules**

### Environment Variables
\`\`\`bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
\`\`\`

## 📚 Documentation

- **[Firebase Setup Guide](FIREBASE_SETUP.md)** - Complete Firebase configuration
- **[Testing Guide](TESTING_GUIDE.md)** - Unit testing with Jest and React Testing Library
- **[GitHub Actions Setup](docs/GITHUB_ACTIONS_SETUP.md)** - Automated deployment to Azure
- **[Azure Deployment Guide](AZURE_DEPLOYMENT.md)** - Manual Azure Container Apps deployment

## 🧪 Testing

### Run Tests
\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## 🚀 Deployment

### Option 1: Azure Container Apps (Recommended)
- **Automated Deployment** - GitHub Actions workflow included
- **Containerized** - Docker-based deployment
- **Scalable** - Auto-scaling based on demand

Follow the [GitHub Actions Setup Guide](docs/GITHUB_ACTIONS_SETUP.md) for automated deployment.

## 🛠️ Built With

### Core Technologies
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend Services
- **[Firebase Auth](https://firebase.google.com/products/auth)** - User authentication
- **[Cloud Firestore](https://firebase.google.com/products/firestore)** - NoSQL database
- **[Google Sign-In](https://developers.google.com/identity)** - OAuth authentication

## 📁 Project Structure

\`\`\`
tabletop-toolkit/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── shopkeeper/        # Shop creator application
│   ├── home/              # Public home page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI component library
│   ├── auth-provider.tsx # Authentication context
│   ├── print-button.tsx  # Print functionality
│   └── shop-display.tsx  # Shop preview component
├── lib/                   # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   └── utils.ts          # Helper functions
├── __tests__/            # Test files
├── docs/                 # Documentation
└── public/              # Static assets
\`\`\`

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ **Dungeon & Shopkeeps** - Complete shop creation tool
- ✅ **User Authentication** - Firebase integration
- ✅ **Responsive Design** - Mobile and desktop support

### Phase 2 (Q2 2024)
- 🔄 **Character Forge** - Character sheet builder
- 🔄 **Dice Sanctum** - Advanced dice rolling

### Phase 3 (Q3 2024)
- 📅 **Campaign Chronicles** - Campaign management
- 📅 **Realm Mapper** - Interactive map creation

### Phase 4 (Q4 2024)
- 📅 **Lore Keeper** - World building tools
- 📅 **Mobile Apps** - Native mobile applications

## 💡 Use Cases

### For Dungeon Masters
- **Unified Toolkit** - All tools in one place
- **Campaign Management** - Organize entire campaigns
- **Professional Materials** - Print-ready handouts

### For Players
- **Character Management** - Track character progression
- **Session Tools** - Dice rolling and note-taking
- **Campaign Resources** - Access shared materials

### For Content Creators
- **Adventure Modules** - Create professional content
- **Community Sharing** - Share custom creations
- **Streaming Tools** - Display materials during live games

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for the excellent component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Firebase** for the backend services
- **Next.js team** for the amazing React framework
- **The tabletop gaming community** for inspiration and feedback

---

**Made with ❤️ for the tabletop gaming community**
