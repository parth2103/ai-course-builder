# AI Course Builder

**A comprehensive AI-powered course creation and learning platform built with Next.js 15, React 19, and TypeScript.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://ai-course-builder-bkml15u0w-parth-gohils-projects-6952869a.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.com/)

## Overview

AI Course Builder is an enterprise-grade educational platform that leverages artificial intelligence to streamline course creation and delivery. The platform serves educational institutions, corporate training departments, and independent instructors seeking to create engaging, data-driven learning experiences.

## Core Features

### Instructor Tools
- **AI-Powered Course Generation**: Generate comprehensive course outlines and content using Google Gemini AI
- **Advanced Course Management**: Full CRUD operations with draft/published states and version control
- **Multi-Media Upload System**: Support for PDFs, videos, documents, and external resources
- **Real-Time Content Editing**: Inline editing capabilities with auto-save functionality
- **Analytics Dashboard**: Comprehensive insights into student engagement and performance metrics
- **Role-Based Permissions**: Secure access controls with granular permission management

### Student Experience
- **Intelligent Course Discovery**: Advanced search and filtering with personalized recommendations
- **Interactive Learning Interface**: Dynamic, responsive course navigation with progress visualization
- **Adaptive Module System**: Self-paced learning with prerequisite management
- **Multimedia Resource Access**: Seamless integration of videos, documents, and external content
- **Progress Analytics**: Real-time tracking with completion certificates and achievements
- **Assessment Engine**: Interactive quizzes, assignments, and knowledge validation tools

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
| **Google Gemini AI** | Intelligent course generation | Advanced NLP processing |
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

# AI
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
| `npm run build` | Create production build | Production |
| `npm run start` | Serve production build | Production |
| `npm run db:generate` | Generate database migration files | Development |
| `npm run db:migrate` | Execute pending database migrations | All |
| `npm run db:seed` | Populate database with sample data | Development |
| `npm run db:studio` | Launch Drizzle Studio (database GUI) | Development |

## Feature Deep Dive

### Artificial Intelligence Integration
- **Natural Language Processing**: Transform simple course descriptions into comprehensive curricula
- **Automated Content Structure**: Generate learning modules with hierarchical organization
- **Resource Intelligence**: AI-suggested multimedia content and external references
- **Assessment Generation**: Automatic creation of knowledge validation questions and quizzes

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
| **Google Gemini** | AI platform | Intelligent course generation |
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
