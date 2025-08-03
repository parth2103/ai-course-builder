# AI Course Builder 🚀

A comprehensive AI-powered course creation and learning platform built with Next.js 15, React 19, and TypeScript.

## ✨ Features

### 🎓 **For Instructors**
- **AI-Powered Course Generation** - Create comprehensive course outlines using Google Gemini AI
- **Course Management** - Edit, save, and publish courses with full content control
- **File Upload System** - Upload course materials (PDFs, videos, documents)
- **Real-time Editing** - Inline editing of course content, modules, and resources
- **Course Analytics** - Track student enrollment and engagement
- **Role-Based Access** - Secure instructor dashboard with permissions

### 📚 **For Students**
- **Course Discovery** - Browse and enroll in published courses
- **Interactive Learning** - Dynamic course interface with progress tracking
- **Module Navigation** - Easy navigation through course modules
- **Resource Access** - View videos, documents, and external links
- **Progress Tracking** - Real-time progress updates and completion tracking
- **Knowledge Checks** - Interactive quizzes and assessments

### 🔐 **Authentication & Security**
- **Clerk Integration** - Secure user authentication and management
- **Role-Based Access Control** - Admin, Instructor, and Student roles
- **Protected Routes** - Secure API endpoints and page access
- **Database Security** - Type-safe database operations with Drizzle ORM

### 🎨 **User Experience**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support** - Toggle between light and dark themes
- **Modern UI** - Clean, intuitive interface with Tailwind CSS
- **Real-time Updates** - Live progress tracking and course updates

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel Analytics** - Performance and user analytics

### **Backend & Database**
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Drizzle ORM** - Type-safe database operations
- **Next.js API Routes** - Serverless API endpoints

### **Authentication & AI**
- **Clerk** - User authentication and management
- **Google Gemini AI** - AI-powered course generation

### **Deployment**
- **Vercel** - Serverless deployment platform
- **GitHub** - Version control and CI/CD

## 🚀 Live Demo

**🌐 Live Application:** [https://ai-course-builder-bkml15u0w-parth-gohils-projects-6952869a.vercel.app](https://ai-course-builder-bkml15u0w-parth-gohils-projects-6952869a.vercel.app)

### 🎯 Demo Accounts

We've set up demo accounts for you to test all features:

| Role | Email | Password | Features |
|------|-------|----------|----------|
| **Student** | `demo.student@aicoursebuilder.com` | `DemoStudent123!` | Browse courses, enroll, track progress |
| **Instructor** | `demo.instructor@aicoursebuilder.com` | `DemoInstructor123!` | Create courses, manage content, view analytics |
| **Admin** | `demo.admin@aicoursebuilder.com` | `DemoAdmin123!` | Manage users, view platform analytics |

**Quick Access:** Click the "🚀 Try Demo" button in the header for one-click login!

### 🧪 How to Test

1. **Visit the live application**
2. **Click "Sign In"** in the header
3. **Use any demo credentials** above
4. **Explore the platform** with full functionality
5. **Try different roles** to see different features

---

## 🛠️ Local Development

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

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── hub/              # Main application pages
│   ├── lib/              # Database and utilities
│   └── globals.css       # Global styles
├── scripts/              # Database scripts
└── drizzle.config.ts     # Drizzle configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio

## 🌟 Key Features in Detail

### **AI Course Generation**
- Generate comprehensive course outlines using natural language
- Automatic module creation with learning objectives
- Resource suggestions (videos, documents, external links)
- Assessment question generation

### **Dynamic Learning Interface**
- Module-based navigation
- Progress tracking with visual indicators
- Interactive resource access
- Knowledge check assessments
- Real-time progress updates

### **Course Management**
- Full CRUD operations for courses
- Draft and published states
- File upload and management
- Course analytics and insights

### **User Management**
- Role-based access control
- Secure authentication flow
- User profile management
- Enrollment tracking

## 🚀 Deployment

### **Deploy to Vercel**

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### **Environment Variables for Production**
Make sure to set all required environment variables in your Vercel project settings.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Clerk** - Authentication service
- **Google Gemini** - AI course generation
- **Neon** - Serverless PostgreSQL
- **Vercel** - Deployment platform
- **Tailwind CSS** - Styling framework

## 📞 Support

For support, email support@aicoursebuilder.com or create an issue in this repository.

---

**Built with ❤️ using Next.js, React, and AI** 