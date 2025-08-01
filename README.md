# 🎓 AI Course Builder

A comprehensive course creation platform powered by AI, featuring role-based authentication, database integration, and a beautiful marketplace for learners.

## ✨ Features

### 🚀 **AI-Powered Course Generation**
- Generate comprehensive course outlines using Google Gemini AI
- Customizable difficulty levels (Beginner, Intermediate, Advanced)
- Multiple learning styles (Visual, Audio, Hands-on, Mixed)
- Detailed module structure with learning objectives and assessments
- **Real URLs for resources** - YouTube videos, PDFs, and external links

### 🔐 **Authentication & Role-Based Access**
- **Clerk Authentication**: Secure login/signup system
- **Role Management**: Admin, Instructor, and Student roles
- **Protected Routes**: Role-based access control
- **User Management**: Admin can manage user roles and permissions

### 🗄️ **Database Integration**
- **Neon PostgreSQL**: Scalable serverless database
- **Drizzle ORM**: Type-safe database operations
- **Course Persistence**: Save and load generated courses
- **User Data**: Store user profiles, enrollments, and progress
- **Resource Management**: Database-driven resource library

### 🎨 **Advanced Content Management**
- **Course Generation**: AI-powered course outline creation
- **Content Curation**: Edit modules, learning objectives, and resources
- **Resource Library**: Upload files, add YouTube videos, and external links
- **Real-time Preview**: See course structure as you build

### 🛍️ **Marketplace Experience**
- Beautiful course discovery interface
- Advanced filtering by category and difficulty
- Responsive design with dark mode support
- Course cards with detailed information
- **Course Enrollment**: Students can enroll in courses

### 🔧 **Admin Dashboard**
- **Course Hub**: Unified interface for all user types
- **Role-Based Navigation**: Different menus for Admin, Instructor, Student
- **Generate Course**: AI-powered course creation
- **User Management**: Manage users and roles
- **Analytics**: Platform metrics and insights

### 👨‍🎓 **Student Features**
- **Course Enrollment**: Browse and enroll in courses
- **Learning Dashboard**: Track enrolled courses and progress
- **Progress Tracking**: Monitor learning progress
- **Course History**: View completed and ongoing courses

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 3 with dark mode
- **AI Services**: Google Gemini API (gemini-1.5-flash)
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Deployment**: Vercel
- **State Management**: React hooks and context

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key
- Clerk account
- Neon PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/parth2103/ai-course-builder.git
   cd ai-course-builder
   ```

2. **Install dependencies**
   ```bash
   cd src
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local in the src directory
   cp env.example .env.local
   ```

   Add your API keys to `.env.local`:
   ```env
   # Google Gemini API Configuration
   GEMINI_API_KEY=your_gemini_api_key_here

   # Clerk Authentication Configuration
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Clerk URLs (for development)
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/landing

   # Neon Database Configuration
   POSTGRES_URL=your_neon_database_url
   POSTGRES_URL_NON_POOLING=your_neon_database_non_pooling_url
   ```

4. **Set up the database**
   ```bash
   # Generate and run migrations
   npm run db:generate
   npm run db:migrate:run
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Set up Clerk Authentication**
   - Create a free account at [Clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable key and secret key
   - Add them to your `.env.local` file
   - Configure user roles in Clerk dashboard

7. **Set up Neon Database**
   - Create a free account at [Neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection strings
   - Add them to your `.env.local` file

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   │   ├── enroll/              # Course enrollment
│   │   ├── generate-outline/    # AI course generation
│   │   └── users/               # User management
│   ├── components/              # Reusable components
│   │   ├── AccountSettings.tsx
│   │   ├── AuthHeader.tsx
│   │   ├── CourseForm.tsx
│   │   ├── EnhancedCourseDisplay.tsx
│   │   ├── RoleBasedNavigation.tsx
│   │   ├── RoleManager.tsx
│   │   └── UserRoleBadge.tsx
│   ├── dashboard/               # User dashboard
│   ├── hub/                     # Course Hub (main interface)
│   │   ├── admin/              # Admin features
│   │   ├── analytics/          # Platform analytics
│   │   ├── generate/           # Course generation
│   │   ├── student/            # Student features
│   │   └── users/              # User management
│   ├── hooks/                  # Custom React hooks
│   ├── landing/                # Landing page
│   ├── lib/                    # Database and utilities
│   │   └── db/                 # Database configuration
│   │       ├── index.ts        # Database connection
│   │       ├── schema.ts       # Database schema
│   │       ├── services.ts     # Database services
│   │       └── migrations/     # Database migrations
│   ├── marketplace/            # Course marketplace
│   ├── scripts/                # Database scripts
│   ├── sign-in/                # Authentication pages
│   ├── sign-up/                # Authentication pages
│   └── student/                # Student dashboard
├── lib/                        # Shared utilities
├── package.json
├── drizzle.config.ts           # Database configuration
└── vercel.json                 # Deployment configuration
```

## 🎯 Usage

### **For Admins**

1. **Sign in with admin account**
   - Use an email configured as admin in Clerk

2. **Access Course Hub**
   - Navigate to the Course Hub after login
   - Access admin-specific features from the sidebar

3. **Generate Courses**
   - Use the "Generate Course" feature
   - AI will create detailed course outlines with real resources

4. **Manage Users**
   - Access user management from the sidebar
   - Change user roles and permissions

5. **View Analytics**
   - Monitor platform usage and course statistics

### **For Instructors**

1. **Sign in with instructor account**
   - Use an email configured as instructor in Clerk

2. **Access Course Hub**
   - Navigate to the Course Hub after login
   - Access instructor-specific features

3. **Create and Manage Courses**
   - Generate courses using AI
   - Edit and curate course content
   - Manage course resources

### **For Students**

1. **Sign up/Sign in**
   - Create an account or sign in with existing credentials

2. **Browse Courses**
   - Visit the marketplace to see available courses
   - Use filters to find specific topics or difficulty levels

3. **Enroll in Courses**
   - Click "Enroll" on courses you're interested in
   - Track your enrolled courses in the student dashboard

4. **Track Progress**
   - Monitor your learning progress
   - View course completion status

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate database migrations
npm run db:migrate:run   # Run database migrations
npm run db:seed          # Seed database with initial data
npm run db:studio        # Open Drizzle Studio
```

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `POSTGRES_URL` | Neon database connection | Yes |
| `POSTGRES_URL_NON_POOLING` | Neon database non-pooling connection | Yes |

## 🚀 Deployment

### **Vercel Deployment**

1. **Connect to Vercel**
   - Push code to GitHub
   - Connect repository to Vercel
   - Set root directory to `src` in Vercel settings

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure they're available for Production, Preview, and Development

3. **Deploy**
   - Vercel will automatically deploy on git push
   - Or use `npx vercel --prod` for manual deployment

## 🔮 Current Status

### **✅ Completed Features**
- [x] AI-powered course generation with real resource URLs
- [x] Clerk authentication with role-based access
- [x] Neon PostgreSQL database integration
- [x] Course enrollment system
- [x] User management and role assignment
- [x] Responsive UI with dark mode
- [x] Course Hub with role-based navigation
- [x] Student dashboard and progress tracking
- [x] Admin analytics and user management
- [x] Vercel deployment

### **🚧 In Progress**
- [ ] Instructor-specific features
- [ ] Advanced course analytics
- [ ] Course completion certificates
- [ ] Payment integration
- [ ] Course reviews and ratings

### **📋 Planned Features**
- [ ] Advanced search and filtering
- [ ] Course recommendations
- [ ] Learning path creation
- [ ] Mobile app development
- [ ] Integration with LMS platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful course generation
- **Clerk** for seamless authentication
- **Neon** for serverless PostgreSQL
- **Next.js Team** for the amazing framework
- **Tailwind CSS** for beautiful styling
- **Vercel** for seamless deployment

---

**Built with ❤️ for better education**

**Live Demo**: [https://ai-course-builder-2xnxlgsqn-parth-gohils-projects-6952869a.vercel.app](https://ai-course-builder-2xnxlgsqn-parth-gohils-projects-6952869a.vercel.app) 