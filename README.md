# AI Course Builder

**A comprehensive AI-powered course creation and learning platform built with Next.js 15, React 19, and TypeScript. Deploy with confidence on Vercel.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://ai-course-builder-bkml15u0w-parth-gohils-projects-6952869a.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.com/)

## Overview

AI Course Builder is an enterprise-grade educational platform that leverages artificial intelligence to streamline course creation and delivery. The platform serves educational institutions, corporate training departments, and independent instructors seeking to create engaging, data-driven learning experiences with seamless cloud deployment.

## Core Features

### Instructor Tools
- **AI-Powered Course Generation**: Generate comprehensive course outlines and content using OpenAI GPT-4o (primary) and Google Gemini AI (backup)
- **Advanced Course Management**: Full CRUD operations with draft/published states and version control
- **Multi-Media Upload System**: Support for PDFs, videos, documents, and external resources with verified educational URLs
- **Real-Time Content Editing**: Inline editing capabilities with auto-save functionality
- **Analytics Dashboard**: Comprehensive insights into student engagement and performance metrics
- **Role-Based Permissions**: Secure access controls with granular permission management
- **Enhanced Resource Quality**: AI-generated courses include real YouTube videos from verified educational channels

### Student Experience
- **Enhanced Course Marketplace**: Browse courses with solid pastel color themes for improved visual appeal
- **Intelligent Course Discovery**: Advanced search and filtering with personalized recommendations
- **Interactive Learning Interface**: Dynamic, responsive course navigation with progress visualization
- **Adaptive Module System**: Self-paced learning with prerequisite management
- **Multimedia Resource Access**: Seamless integration of videos, documents, and external content with working links
- **Progress Analytics**: Real-time tracking with completion certificates and achievements
- **Assessment Engine**: Interactive quizzes, assignments, and knowledge validation tools
- **Professional UI**: Clean interface with realistic instructor data and proper rating displays

### Platform Security & Architecture
- **Enterprise Authentication**: Clerk-powered secure authentication with SSO support
- **Multi-Role Authorization**: Granular role-based access control (Admin, Instructor, Student)
- **API Security**: Protected endpoints with rate limiting and request validation
- **Database Integrity**: Type-safe operations with PostgreSQL and Drizzle ORM
- **Data Privacy**: GDPR-compliant data handling and user privacy controls

### Technical Excellence
- **Cross-Platform Compatibility**: Responsive design optimized for desktop, tablet, and mobile
- **Theme Customization**: Light/dark mode with customizable branding options
- **Performance Optimization**: Server-side rendering, lazy loading, and optimized asset delivery
- **Real-Time Synchronization**: Live updates across all connected devices and sessions

## Technology Stack

### Frontend Architecture
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router | 15.x |
| **React** | UI library with concurrent features | 19.x |
| **TypeScript** | Type-safe development | 5.x |
| **Tailwind CSS** | Utility-first styling framework | Latest |
| **Vercel Analytics** | Performance monitoring and user insights | Latest |

### Backend Infrastructure
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Neon PostgreSQL** | Serverless database solution | Production-ready |
| **Drizzle ORM** | Type-safe database operations | Schema-first approach |
| **Next.js API Routes** | Serverless API endpoints | RESTful architecture |

### Integrations & Services
| Service | Purpose | Integration |
|---------|---------|-------------|
| **Clerk** | Authentication & user management | Multi-provider SSO |
| **OpenAI GPT-4o** | Primary AI course generation | Advanced NLP processing with real educational resources |
| **Google Gemini AI** | Backup AI course generation | Fallback intelligent content creation |
| **Vercel** | Serverless deployment platform | CI/CD pipeline |
| **GitHub** | Version control & collaboration | Automated workflows |

## Live Demonstration

**🌐 Production Environment**: [AI Course Builder Platform](https://ai-course-builder-bkml15u0w-parth-gohils-projects-6952869a.vercel.app)

### Demo Credentials

Experience the platform's full functionality with our pre-configured demonstration accounts:

| **Role** | **Email Address** | **Password** | **Access Level** |
|----------|-------------------|--------------|------------------|
| **Student** | `demo.student@aicoursebuilder.com` | `DemoStudent123!` | Course enrollment, progress tracking, assessments |
| **Instructor** | `demo.instructor@aicoursebuilder.com` | `DemoInstructor123!` | Course creation, content management, student analytics |
| **Administrator** | `demo.admin@aicoursebuilder.com` | `DemoAdmin123!` | User management, platform analytics, system configuration |

> **Quick Access**: Use the "🚀 Try Demo" button in the application header for instant authentication.

### Evaluation Guide

1. **Access the Platform**: Navigate to the live application URL
2. **Authentication**: Click "Sign In" and use any demo credentials above
3. **Role-Based Exploration**: Test different user roles to experience varied functionality
4. **Feature Testing**: Explore course creation, enrollment, and progress tracking
5. **Cross-Device Testing**: Verify responsive design across desktop, tablet, and mobile devices

---

## 🛠Local Development

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Google Gemini API key
- Clerk account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-course-builder/src
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Add your environment variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/landing

# Database
POSTGRES_URL=your_neon_database_url
POSTGRES_URL_NON_POOLING=your_neon_database_url_non_pooling

# AI Services (Primary: OpenAI, Backup: Gemini)
OPENAI_API_KEY=your_openai_api_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

4. **Set up the database**
```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Architecture Overview

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # Serverless API endpoints
│   │   ├── courses/       # Course management APIs
│   │   ├── enroll/        # Enrollment system
│   │   └── users/         # User management
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── hub/              # Core application modules
│   │   ├── admin/        # Administrative interface
│   │   ├── instructor/   # Course creation tools
│   │   └── student/      # Learning interface
│   └── lib/              # Utilities and database layer
├── lib/db/               # Database schema and services
│   ├── migrations/       # Database version control
│   └── schema.ts        # Type-safe database models
└── scripts/              # Development and deployment scripts
```

## Development Commands

| Command | Purpose | Environment |
|---------|---------|-------------|
| `npm run dev` | Start development server with hot reload | Development |
| `npm run dev:clean` | Clean cache and start development server | Development |
| `npm run build` | Create production build | Production |
| `npm run build:clean` | Clean cache and create production build | Production |
| `npm run start` | Serve production build | Production |
| `npm run db:generate` | Generate database migration files | Development |
| `npm run db:migrate` | Execute pending database migrations | All |
| `npm run db:seed` | Populate database with sample data | Development |
| `npm run db:studio` | Launch Drizzle Studio (database GUI) | Development |

## 🎉 Recent Improvements & Enhancements

### UI/UX Enhancements
- **✅ Marketplace Visual Redesign**: Replaced gradient backgrounds with elegant solid pastel colors for better readability
- **✅ Rating Display Fix**: Eliminated confusing "00" displays, now shows proper ratings or "New Course" for unrated content  
- **✅ Professional Dummy Data**: Updated with realistic instructor names, review counts, and course information
- **✅ Enhanced Course Cards**: Improved visual hierarchy and information display

### AI & Content Generation Upgrades
- **✅ OpenAI Integration**: Upgraded to GPT-4o as primary AI model for superior course generation
- **✅ Improved Resource Quality**: AI now generates real YouTube videos from verified educational channels
- **✅ Smart Fallback System**: Enhanced backup content generation with working search URLs
- **✅ JSON Parsing Robustness**: Fixed OpenAI response parsing to handle markdown formatting

### Developer Experience
- **✅ Clean Development Commands**: Added `dev:clean` and `build:clean` for cache management
- **✅ Error Prevention**: Improved error handling and fallback mechanisms
- **✅ Enhanced Debugging**: Better logging for AI service selection and content generation

### Performance & Reliability
- **✅ Reduced Cache Conflicts**: Implemented automatic cache clearing to prevent internal server errors
- **✅ Improved Build Process**: Enhanced build reliability for Vercel deployment
- **✅ Better Resource Links**: Fixed URL display in course learning resources

---

## Feature Deep Dive

### Artificial Intelligence Integration
- **Advanced AI Models**: OpenAI GPT-4o as primary AI with Google Gemini as intelligent fallback
- **Natural Language Processing**: Transform simple course descriptions into comprehensive curricula
- **Automated Content Structure**: Generate learning modules with hierarchical organization
- **Enhanced Resource Intelligence**: AI-curated real YouTube videos from verified educational channels (freeCodeCamp, Programming with Mosh, Khan Academy, etc.)
- **Smart URL Generation**: Automatic creation of working links to documentation, tutorials, and practice resources
- **Assessment Generation**: Automatic creation of knowledge validation questions and quizzes
- **Topic-Specific Content**: AI generates content tailored to specific subjects (AWS, Programming, Data Science, etc.)

### Advanced Learning Management
- **Adaptive Navigation**: Intelligent module progression based on completion status
- **Visual Progress Analytics**: Real-time dashboard with completion metrics and performance indicators
- **Multi-Modal Content**: Seamless integration of text, video, documents, and interactive elements
- **Competency Tracking**: Skills-based progress monitoring with achievement milestones

### Enterprise Course Administration
- **Complete CRUD Operations**: Full lifecycle management from draft to publication
- **Version Control**: Content versioning with rollback capabilities
- **Asset Management**: Centralized file storage with CDN optimization
- **Business Intelligence**: Comprehensive analytics with exportable reports and insights

### Identity & Access Management
- **Multi-Tier Authorization**: Hierarchical permissions with role inheritance
- **Enterprise SSO**: Single sign-on integration with popular identity providers
- **Profile Customization**: User preference management and learning path personalization
- **Audit Trail**: Comprehensive logging of user actions and system events

## Production Deployment

### Vercel Platform Integration

#### Automated Deployment Pipeline
1. **Repository Integration**: Connect your GitHub repository to Vercel dashboard
2. **Environment Configuration**: Configure all required environment variables in project settings
3. **Continuous Deployment**: Automatic deployments triggered on main branch commits
4. **Preview Deployments**: Branch-based preview environments for testing

#### Production Environment Variables
Ensure all environment variables from `.env.local` are properly configured in your Vercel project settings for production deployment.

#### Performance Optimization
- **Edge Runtime**: Leverages Vercel's global edge network for minimal latency
- **Automatic Scaling**: Serverless functions scale based on demand
- **Built-in Analytics**: Performance monitoring and user insights

## Contributing Guidelines

We welcome contributions from the development community. Please follow our established workflow:

### Development Workflow
1. **Fork Repository**: Create a personal fork of the main repository
2. **Feature Branch**: Create a descriptive feature branch (`git checkout -b feature/course-analytics`)
3. **Development Standards**: Follow established code conventions and include appropriate tests
4. **Commit Guidelines**: Use conventional commit messages for clarity
5. **Pull Request**: Submit PR with comprehensive description and testing instructions

### Code Standards
- Follow TypeScript strict mode conventions
- Implement comprehensive error handling
- Include unit tests for new features
- Maintain documentation for API changes

## License & Legal

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for complete terms and conditions.

## Technology Partners

We acknowledge the following technology partners that make this platform possible:

| Partner | Service | Contribution |
|---------|---------|--------------|
| **Next.js** | React framework | Application foundation and routing |
| **Clerk** | Authentication service | Enterprise-grade user management |
| **OpenAI** | Primary AI platform | Advanced course generation with GPT-4o |
| **Google Gemini** | Backup AI platform | Intelligent course generation fallback |
| **Neon** | Database platform | Serverless PostgreSQL infrastructure |
| **Vercel** | Deployment platform | Global edge deployment and hosting |
| **Tailwind CSS** | Styling framework | Responsive design system |

## Support & Community

### Technical Support
- **Primary Contact**: pkg@csu.fullerton.edu
- **Issue Tracking**: [GitHub Issues](../../issues)
- **Documentation**: [Project Wiki](../../wiki)

### Community Resources
- **Discussions**: [GitHub Discussions](../../discussions)
- **Feature Requests**: Submit via GitHub Issues with `enhancement` label
- **Security Reports**: Follow responsible disclosure guidelines

---

**Enterprise-Grade Educational Technology** • Built with Next.js, React, and Artificial Intelligence 
