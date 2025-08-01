# 🎓 AI Course Builder

A comprehensive course creation platform powered by AI, featuring an intuitive admin dashboard and a beautiful marketplace for learners.

## ✨ Features

### 🚀 **AI-Powered Course Generation**
- Generate comprehensive course outlines using Google Gemini AI
- Customizable difficulty levels (Beginner, Intermediate, Advanced)
- Multiple learning styles (Visual, Audio, Hands-on, Mixed)
- Detailed module structure with learning objectives and assessments

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

### 🔧 **Admin Dashboard**
- Unified admin interface with three main sections:
  - **Generate Course**: AI-powered course creation
  - **Curate Content**: Module editing and content management
  - **Resource Library**: File uploads and resource management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 3
- **AI Services**: Google Gemini API, OpenAI API
- **Authentication**: Clerk
- **Deployment**: Vercel (planned)
- **Database**: Vercel Postgres (planned)
- **File Storage**: Vercel Blob Storage (planned)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
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
   cp .env.example .env.local
   ```

   Add your API keys to `.env.local`:
   ```env
   # AI API Keys
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   
   # Clerk URLs (for development)
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Set up Clerk Authentication**
   - Create a free account at [Clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable key and secret key
   - Add them to your `.env.local` file

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard
│   │   └── page.tsx     # Main admin interface
│   ├── api/             # API routes
│   │   └── generate-outline/
│   │       └── route.ts # Course generation API
│   ├── components/      # Reusable components
│   │   ├── CourseForm.tsx
│   │   ├── EnhancedCourseDisplay.tsx
│   │   ├── ResourceUpload.tsx
│   │   ├── ResourceLibrary.tsx
│   │   ├── ContentCurator.tsx
│   │   └── DarkModeToggle.tsx
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Marketplace home page
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Usage

### **For Admins (Course Creators)**

1. **Navigate to Admin Dashboard**
   - Go to `/admin` or click "Admin" in the marketplace header

2. **Generate a Course**
   - Click "🚀 Generate Course" tab
   - Fill in course details (topic, modules, difficulty, etc.)
   - Click "Generate Course" to create with AI

3. **Curate Content**
   - Click "✏️ Curate Content" tab
   - Select modules to edit
   - Modify learning objectives, resources, and assessments

4. **Manage Resources**
   - Click "📚 Resource Library" tab
   - Upload files, add YouTube videos, or external links
   - Organize resources for reuse across courses

### **For Learners (Marketplace)**

1. **Browse Courses**
   - Visit the homepage to see featured courses
   - Use search and filters to find specific topics

2. **Filter and Search**
   - Filter by category (Programming, Design, Business, etc.)
   - Filter by difficulty (Beginner, Intermediate, Advanced)
   - Use the search bar for specific topics

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database (when implemented)
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema changes to database
```

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `OPENAI_API_KEY` | OpenAI API key (fallback) | No |
| `POSTGRES_URL` | Database connection (future) | No |
| `BLOB_READ_WRITE_TOKEN` | File storage token (future) | No |

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

1. **Connect to Vercel**
   - Push code to GitHub
   - Connect repository to Vercel
   - Add environment variables in Vercel dashboard

2. **Set up Database** (Future)
   - Create Vercel Postgres database
   - Add database connection string to environment variables

3. **Set up File Storage** (Future)
   - Create Vercel Blob Storage
   - Add blob token to environment variables

## 🔮 Roadmap

### **Phase 1: Database Integration** ✅
- [x] Enhanced AI course generation
- [x] Advanced content management
- [x] Resource library system
- [ ] Database schema design
- [ ] Course persistence
- [ ] Resource storage

### **Phase 2: Authentication & Security**
- [ ] Admin authentication system
- [ ] Session management
- [ ] Secure admin routes
- [ ] User role management

### **Phase 3: Advanced Features**
- [ ] Course publishing system
- [ ] Analytics dashboard
- [ ] User progress tracking
- [ ] Course completion certificates

### **Phase 4: Marketplace Enhancement**
- [ ] User registration/login
- [ ] Course enrollment system
- [ ] Payment integration
- [ ] Course reviews and ratings

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
- **Next.js Team** for the amazing framework
- **Tailwind CSS** for beautiful styling
- **Vercel** for seamless deployment

---

**Built with ❤️ for better education** 