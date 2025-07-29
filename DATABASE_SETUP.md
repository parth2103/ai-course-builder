# Database Setup for Vercel Deployment

## 🗄️ **Recommended Database Stack**

### **Primary Choice: Vercel Postgres + Vercel Blob Storage**

#### **Why This Stack?**
- ✅ **Native Vercel Integration**: Seamless deployment
- ✅ **Automatic Scaling**: Handles traffic spikes
- ✅ **Easy Setup**: One-click database creation
- ✅ **Built-in CDN**: Fast file delivery worldwide
- ✅ **Cost Effective**: Pay only for what you use

---

## 📊 **Database Schema Design**

### **1. Courses Table**
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_duration INTEGER, -- in minutes
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  learning_style VARCHAR(20) CHECK (learning_style IN ('visual', 'audio', 'hands-on', 'mixed')),
  prerequisites TEXT[],
  learning_outcomes TEXT[],
  generated_with VARCHAR(50), -- 'OpenAI' or 'Gemini'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE,
  admin_id UUID REFERENCES admins(id)
);
```

### **2. Modules Table**
```sql
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  learning_objectives TEXT[],
  estimated_duration INTEGER, -- in minutes
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **3. Resources Table**
```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) CHECK (type IN ('video', 'document', 'link')),
  url TEXT,
  file_path TEXT, -- for uploaded files
  duration INTEGER, -- for videos
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  admin_id UUID REFERENCES admins(id)
);
```

### **4. Module Resources Table (Junction)**
```sql
CREATE TABLE module_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(module_id, resource_id)
);
```

### **5. Assessments Table**
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **6. Admins Table**
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### **7. Course Analytics Table**
```sql
CREATE TABLE course_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 **Setup Instructions**

### **Step 1: Create Vercel Postgres Database**

1. **Go to Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Create New Project**
   - Import your GitHub repository
   - Select the project

3. **Add Postgres Database**
   - Go to Storage tab
   - Click "Create Database"
   - Choose "Postgres"
   - Select region (closest to your users)
   - Click "Create"

4. **Get Connection Details**
   - Copy the connection string
   - Note the database URL format

### **Step 2: Add Environment Variables**

Add these to your `.env.local` and Vercel environment:

```env
# Database
POSTGRES_URL="postgresql://username:password@host:port/database"
POSTGRES_HOST="your-host"
POSTGRES_DATABASE="your-database"
POSTGRES_USERNAME="your-username"
POSTGRES_PASSWORD="your-password"

# File Storage
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Existing APIs
GEMINI_API_KEY="your-gemini-key"
OPENAI_API_KEY="your-openai-key"
```

### **Step 3: Install Dependencies**

```bash
npm install @vercel/postgres @vercel/blob
npm install drizzle-orm
npm install drizzle-kit --save-dev
```

### **Step 4: Create Database Schema**

Create `src/lib/db/schema.ts`:

```typescript
import { pgTable, uuid, varchar, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  totalDuration: integer('total_duration'),
  difficulty: varchar('difficulty', { length: 20 }),
  learningStyle: varchar('learning_style', { length: 20 }),
  prerequisites: text('prerequisites').array(),
  learningOutcomes: text('learning_outcomes').array(),
  generatedWith: varchar('generated_with', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  published: boolean('published').default(false),
  adminId: uuid('admin_id').references(() => admins.id)
});

// ... (other table definitions)
```

### **Step 5: Create Database Client**

Create `src/lib/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
```

### **Step 6: Create Migration Script**

Create `drizzle.config.ts`:

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
} satisfies Config;
```

---

## 📁 **File Storage Setup**

### **Step 1: Create Blob Storage**

1. **In Vercel Dashboard**
   - Go to Storage tab
   - Click "Create Store"
   - Choose "Blob"
   - Select region
   - Click "Create"

2. **Get Blob Token**
   - Copy the read/write token
   - Add to environment variables

### **Step 2: Create Upload API**

Create `src/app/api/upload/route.ts`:

```typescript
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

---

## 🔄 **Migration Strategy**

### **Phase 1: Database Setup**
1. Set up Vercel Postgres
2. Create schema and run migrations
3. Update API routes to use database

### **Phase 2: File Storage**
1. Set up Vercel Blob Storage
2. Create upload endpoints
3. Update resource management

### **Phase 3: Admin Authentication**
1. Create admin login system
2. Add session management
3. Secure admin routes

### **Phase 4: Analytics**
1. Add course analytics tracking
2. Create dashboard for insights
3. Implement user progress tracking

---

## 💰 **Cost Estimation**

### **Vercel Postgres**
- **Hobby**: $20/month (1GB storage, 10GB bandwidth)
- **Pro**: $25/month (8GB storage, 100GB bandwidth)
- **Enterprise**: Custom pricing

### **Vercel Blob Storage**
- **Storage**: $0.10/GB/month
- **Bandwidth**: $0.10/GB
- **Requests**: $0.50/million requests

### **Estimated Monthly Cost**
- **Small Scale** (< 100 courses): ~$25-30/month
- **Medium Scale** (100-1000 courses): ~$50-75/month
- **Large Scale** (1000+ courses): ~$100-200/month

---

## 🚀 **Deployment Checklist**

### **Pre-Deployment**
- [ ] Set up Vercel Postgres database
- [ ] Configure environment variables
- [ ] Set up Vercel Blob Storage
- [ ] Create database schema
- [ ] Run initial migrations

### **Post-Deployment**
- [ ] Test database connections
- [ ] Verify file uploads work
- [ ] Test course generation and storage
- [ ] Monitor performance and costs
- [ ] Set up monitoring and alerts

---

## 🔧 **Next Steps**

1. **Implement Database Integration**
   - Update API routes to use database
   - Add course persistence
   - Implement resource management

2. **Add Authentication**
   - Create admin login system
   - Secure admin routes
   - Add session management

3. **File Upload Integration**
   - Connect upload component to blob storage
   - Add file type validation
   - Implement progress tracking

4. **Analytics Dashboard**
   - Track course views and completions
   - Add admin analytics
   - Create performance insights

## ✅ **Current Admin Structure**

The admin system has been consolidated into a single comprehensive dashboard at `/admin` with:

- **🚀 Generate Course**: AI-powered course generation
- **✏️ Curate Content**: Module editing and content management
- **📚 Resource Library**: File uploads and resource management

All admin functionality is now unified in one place for better user experience.

Would you like me to start implementing any of these database features? 