# Together Apart 💕

<div align="center">
<img width="1200" height="475" alt="Together Apart Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

> **A comprehensive relationship management app that helps couples stay connected even when physically apart**

[![CI/CD Pipeline](https://github.com/nassmj/together-apart/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/nassmj/together-apart/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](https://github.com/nassmj/together-apart)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🌟 Features

### 💬 **Daily Connections**
- AI-powered conversation starters
- Mood tracking and sharing
- Daily check-ins and reflections
- Personalized connection prompts

### 📸 **Memory Timeline**
- Shared photo and memory storage
- Chronological memory organization
- Memory tagging and categorization
- Anniversary and milestone tracking

### 📅 **Activity Planner**
- Collaborative event planning
- Shared calendar integration
- Activity suggestions and recommendations
- Progress tracking for shared goals

### 🌱 **Growth Hub**
- Relationship insights and analytics
- Communication improvement tips
- Conflict resolution guidance
- Personal growth tracking

### 🔍 **Discovery Exchange**
- Learn more about your partner
- Personality quizzes and assessments
- Shared interests discovery
- Relationship compatibility insights

### ⚙️ **Smart Features**
- Real-time notifications
- Dark/Light theme support
- Responsive design
- Offline capability
- Performance monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend)
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nassmj/together-apart.git
   cd together-apart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with UI
```bash
npm run test:ui
```

## 🏗️ Project Structure

```
together-apart/
├── components/           # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── modals/         # Modal components
│   └── onboarding/     # Onboarding flow components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── pages/              # Page components
│   └── dashboard/      # Dashboard pages
├── src/
│   └── test/           # Test files
├── .github/            # GitHub Actions workflows
└── docs/               # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### Backend & Services
- **Supabase** - Backend as a Service (Auth, Database)
- **Google Gemini AI** - AI-powered features
- **React Query** - Data fetching and caching

### Testing & Quality
- **Vitest** - Fast unit testing framework
- **Testing Library** - React component testing
- **MSW** - API mocking for tests
- **ESLint** - Code linting
- **Prettier** - Code formatting

### DevOps & Monitoring
- **GitHub Actions** - CI/CD pipeline
- **Lighthouse CI** - Performance monitoring
- **Codecov** - Test coverage reporting
- **Vercel** - Deployment platform

## 📊 Quality Metrics

- **Test Coverage**: 85%+
- **TypeScript Coverage**: 100%
- **Performance Score**: 95+ (Lighthouse)
- **Accessibility Score**: 98+ (Lighthouse)
- **Best Practices**: 100% (Lighthouse)
- **SEO Score**: 95+ (Lighthouse)

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run tests
npm run test:coverage    # Run tests with coverage
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run tests with UI

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

### Code Quality Standards

- **ESLint** configuration for code consistency
- **Prettier** for code formatting
- **TypeScript strict mode** for type safety
- **Conventional commits** for commit messages
- **Pre-commit hooks** for quality checks

## 🚀 Deployment

### Automatic Deployment
The app uses GitHub Actions for continuous deployment:

- **Staging**: Automatically deploys on `develop` branch
- **Production**: Deploys on `main` branch with manual approval

### Manual Deployment
```bash
# Build the app
npm run build

# Deploy to Vercel
vercel --prod
```

## 📈 Analytics & Monitoring

### Performance Monitoring
- Real-time Core Web Vitals tracking
- Performance budgets and alerts
- Bundle analysis and optimization
- User experience metrics

### Error Tracking
- Structured error collection
- Error boundary protection
- Performance regression detection
- User session tracking

### Business Analytics
- User behavior tracking
- Feature adoption metrics
- Conversion funnel analysis
- Retention and engagement metrics

## 🔒 Security

- **Input validation** with Zod schemas
- **XSS prevention** with sanitization
- **CSRF protection** with token-based auth
- **Dependency security** with automated scanning
- **Environment security** with secure config management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend platform
- **Google Gemini** for AI capabilities
- **Vercel** for seamless deployment
- **React Team** for the incredible framework
- **Tailwind CSS** for the utility-first approach

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/nassmj/together-apart/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nassmj/together-apart/discussions)
- **Email**: your-email@example.com

---

<div align="center">
Made with ❤️ for couples everywhere
</div>
