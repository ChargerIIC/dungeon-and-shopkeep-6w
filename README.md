# Dungeon & Shopkeep

A fantasy RPG shop creator and inventory display tool built with Next.js, React, and Firebase. Create, customize, and share beautiful shop inventories for your tabletop RPG campaigns.

![Dungeon & Shopkeep Preview](https://via.placeholder.com/800x400/1a1a2e/eee?text=Dungeon+%26+Shopkeep)

## ✨ Features

### 🏪 **Shop Creation**
- **Interactive Shop Builder** - Create shops with custom titles and owner names
- **Item Management** - Add, edit, and remove items with categories (Weapons, Armor, Potions, Gear, Scrolls)
- **Multi-Currency Support** - Gold Pieces (GP), Silver Pieces (SP), Copper Pieces (CP)
- **Live Preview** - See your shop design update in real-time

### 🎨 **Themes & Customization**
- **5 Beautiful Themes**: Parchment, Tavern, Arcane, Forest, Dungeon
- **Print-Optimized Layouts** - Professional print formatting with proper spacing
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### 💾 **Save & Share**
- **Cloud Storage** - Save shops to Firebase with user authentication
- **Google Sign-In** - Secure authentication for saving and managing shops
- **Shop Library** - Load and manage your saved shop designs
- **Export Options** - Print or save as PDF for use in campaigns

### 🖨️ **Print Features**
- **Professional Layouts** - Optimized spacing between item names and prices
- **Theme-Aware Printing** - Colors and styles that work well in print
- **Page Break Management** - Categories stay together on printed pages

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Firebase account (for save functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChargerIIC/dungeon-and-shopkeep-6w.git
   cd dungeon-and-shopkeep-6w
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup
To enable the save functionality, you'll need to configure Firebase:

1. **Follow the complete [Firebase Setup Guide](FIREBASE_SETUP.md)**
2. **Add your configuration to `.env.local`**
3. **Configure authentication and Firestore security rules**

### Environment Variables
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

## 📚 Documentation

- **[Firebase Setup Guide](FIREBASE_SETUP.md)** - Complete Firebase configuration
- **[Testing Guide](TESTING_GUIDE.md)** - Unit testing with Jest and React Testing Library
- **[GitHub Actions Setup](docs/GITHUB_ACTIONS_SETUP.md)** - Automated deployment to Azure
- **[Azure Deployment Guide](AZURE_DEPLOYMENT.md)** - Manual Azure Container Apps deployment
- **[Print Spacing Improvements](PRINT_SPACING_IMPROVEMENTS.md)** - Print layout enhancements
- **[Save Shop Troubleshooting](SAVE_SHOP_TROUBLESHOOTING.md)** - Common issues and solutions

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Stack
- **Jest** - Test runner and assertions
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation

See the [Testing Guide](TESTING_GUIDE.md) for detailed testing documentation.

## 🚀 Deployment

### Option 1: Azure Container Apps (Recommended)
- **Automated Deployment** - GitHub Actions workflow included
- **Containerized** - Docker-based deployment
- **Scalable** - Auto-scaling based on demand

Follow the [GitHub Actions Setup Guide](docs/GITHUB_ACTIONS_SETUP.md) for automated deployment.

### Option 2: Manual Deployment
- **Vercel** - Simple Next.js deployment
- **Netlify** - Static site deployment
- **Azure Static Web Apps** - Microsoft Azure hosting

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

### Development Tools
- **[Jest](https://jestjs.io/)** - Testing framework
- **[React Testing Library](https://testing-library.com/)** - Component testing
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

## 📁 Project Structure

```
dungeon-and-shopkeep-6w/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── creator/           # Shop creator page
│   ├── home/              # Home page
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
│   ├── components/       # Component tests
│   └── lib/             # Utility tests
├── docs/                 # Documentation
└── public/              # Static assets
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new components and features
- Use semantic commit messages
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Planned Features
- **🎲 Dice Roll Integration** - Random shop generation
- **🗺️ Shop Templates** - Pre-built shop types (Blacksmith, Alchemist, etc.)
- **💰 Currency Conversion** - Automatic currency calculations
- **🖼️ Item Images** - Visual item representations
- **📊 Analytics** - Usage statistics and popular items
- **🌐 Sharing** - Public shop sharing links
- **📱 Mobile App** - Native mobile applications

### Technical Improvements
- **⚡ Performance** - Code splitting and optimization
- **🔒 Security** - Enhanced security rules and validation
- **🧪 Testing** - Increased test coverage
- **📚 Documentation** - API documentation and guides
- **♿ Accessibility** - WCAG compliance improvements

## 💡 Use Cases

### For Dungeon Masters
- **Quick Shop Creation** - Generate shop inventories on the fly
- **Campaign Management** - Save shops for different locations
- **Print Materials** - Professional handouts for players

### For Players
- **Character Shopping** - Browse available items
- **Equipment Planning** - Track potential purchases
- **Campaign Notes** - Record visited shops

### For Content Creators
- **Adventure Modules** - Include professional shop inventories
- **Streaming** - Display shops during live games
- **Community Sharing** - Share custom shop designs

## 🙏 Acknowledgments

- **Radix UI** for the excellent component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Firebase** for the backend services
- **Next.js team** for the amazing React framework
- **The D&D community** for inspiration and feedback

## 📞 Support

- **GitHub Issues** - [Report bugs or request features](https://github.com/ChargerIIC/dungeon-and-shopkeep-6w/issues)
- **Documentation** - Check the guides in this repository
- **Firebase Troubleshooting** - See [SAVE_SHOP_TROUBLESHOOTING.md](SAVE_SHOP_TROUBLESHOOTING.md)

---

**Made with ❤️ for the tabletop RPG community**