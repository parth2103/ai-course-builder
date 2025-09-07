import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for our API
interface GenerateOutlineRequest {
  topic: string;
  modules: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  learningStyle?: 'visual' | 'audio' | 'hands-on' | 'mixed';
  duration?: number;
  prerequisites?: string;
}

interface ModuleOutline {
  title: string;
  bulletPoints: string[];
  learningObjectives: string[];
  estimatedDuration: number; // in minutes
  resources: {
    videos: Array<{
      title: string;
      description: string;
      url?: string;
      duration?: number;
    }>;
    documents: Array<{
      title: string;
      description: string;
      type: 'pdf' | 'ppt' | 'doc';
      url?: string;
    }>;
    externalLinks: Array<{
      title: string;
      description: string;
      url?: string;
    }>;
  };
  assessment: {
    quizQuestions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
}

interface CourseOutline {
  courseTitle: string;
  description: string;
  totalDuration: number; // in hours
  modules: ModuleOutline[];
  prerequisites: string[];
  learningOutcomes: string[];
}

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Helper function to validate YouTube URL format
function validateYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+$/;
  return youtubeRegex.test(url);
}

// Helper function to get relevant videos based on topic
function getRelevantVideos(topic: string) {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('react')) {
    return [
      {
        title: "React Course - Beginner's Tutorial for React JavaScript Library",
        description: "Complete React tutorial for beginners from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        duration: 180
      },
      {
        title: "React JS Full Course 2024 | Build an App and Master React in One Video",
        description: "Complete React course with project build from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=CgkZ7MvWUAA",
        duration: 150
      },
      {
        title: "React Hooks Course - All React Hooks Explained",
        description: "Comprehensive guide to React Hooks from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=LlvBzyy-558",
        duration: 120
      }
    ];
  } else if (topicLower.includes('javascript') || topicLower.includes('js')) {
    return [
      {
        title: "JavaScript Full Course for Beginners | Complete All-in-One Tutorial",
        description: "Complete JavaScript course from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        duration: 480
      },
      {
        title: "Learn JavaScript - Full Course for Beginners",
        description: "JavaScript fundamentals and projects from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=jS4aFq5-91M",
        duration: 134
      },
      {
        title: "JavaScript ES6, ES7, ES8: Learn to Code on the Bleeding Edge",
        description: "Modern JavaScript features explained from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=nZ1DMMsyVyI",
        duration: 102
      }
    ];
  } else if (topicLower.includes('python')) {
    return [
      {
        title: "Python for Everybody - Full University Python Course",
        description: "Complete Python course for beginners from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=8DvywoWv6fI",
        duration: 810
      },
      {
        title: "Learn Python - Full Course for Beginners [Tutorial]",
        description: "Comprehensive Python tutorial from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        duration: 279
      },
      {
        title: "Python Tutorial - Python Full Course for Beginners",
        description: "Complete Python programming tutorial from Programming with Mosh",
        url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        duration: 360
      }
    ];
  } else if (topicLower.includes('aws') || topicLower.includes('cloud')) {
    return [
      {
        title: "AWS Certified Cloud Practitioner Training 2024 - Full Course",
        description: "Complete AWS Cloud Practitioner course from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=3hLmDS179YE",
        duration: 240
      },
      {
        title: "AWS Tutorial for Beginners | Full Course in 10 Hours",
        description: "Comprehensive AWS tutorial from Edureka",
        url: "https://www.youtube.com/watch?v=k1RI5locZE4",
        duration: 600
      },
      {
        title: "AWS Certified Solutions Architect - Associate 2024",
        description: "Complete AWS Solutions Architect course from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
        duration: 645
      }
    ];
  } else if (topicLower.includes('data') || topicLower.includes('machine learning') || topicLower.includes('ml')) {
    return [
      {
        title: "Machine Learning Course for Beginners",
        description: "Complete machine learning tutorial from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
        duration: 300
      },
      {
        title: "Data Science Tutorial for Beginners | Data Science Full Course",
        description: "Comprehensive data science course from Edureka",
        url: "https://www.youtube.com/watch?v=ua-CiDNNj30",
        duration: 540
      },
      {
        title: "Python for Data Science - Course for Beginners",
        description: "Python data science fundamentals from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
        duration: 720
      }
    ];
  } else if (topicLower.includes('c programming') || topicLower.includes('c language')) {
    return [
      {
        title: "C Programming Tutorial for Beginners",
        description: "Complete C programming course from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=KJgsSFOSQv0",
        duration: 240
      },
      {
        title: "C Programming Full Course for free 🕹️",
        description: "Comprehensive C programming tutorial from Bro Code",
        url: "https://www.youtube.com/watch?v=87SH2Cn0s9A",
        duration: 240
      },
      {
        title: "Learn C Programming with Dr. Chuck",
        description: "University-level C programming course from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=j-_s8f5K30I",
        duration: 360
      }
    ];
  } else if (topicLower.includes('java')) {
    return [
      {
        title: "Java Tutorial for Beginners [2023]",
        description: "Complete Java programming course from Programming with Mosh",
        url: "https://www.youtube.com/watch?v=eIrMbAQSU34",
        duration: 150
      },
      {
        title: "Java Full Course for free ☕",
        description: "Comprehensive Java tutorial from Bro Code",
        url: "https://www.youtube.com/watch?v=xk4_1vDrzzo",
        duration: 720
      },
      {
        title: "Learn Java 8 - Full Tutorial for Beginners",
        description: "Java fundamentals and features from Coding with John",
        url: "https://www.youtube.com/watch?v=grEKMHGYyns",
        duration: 540
      }
    ];
  } else if (topicLower.includes('node') || topicLower.includes('nodejs')) {
    return [
      {
        title: "Node.js Tutorial for Beginners: Learn Node in 1 Hour",
        description: "Complete Node.js tutorial from Programming with Mosh",
        url: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
        duration: 68
      },
      {
        title: "Node.js and Express.js - Full Course",
        description: "Complete Node.js and Express course from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        duration: 480
      },
      {
        title: "Node.js Crash Course 2024",
        description: "Modern Node.js fundamentals from Traversy Media",
        url: "https://www.youtube.com/watch?v=32M1al-Y6Ag",
        duration: 90
      }
    ];
  } else if (topicLower.includes('docker')) {
    return [
      {
        title: "Docker Tutorial for Beginners [FULL COURSE in 3 Hours]",
        description: "Complete Docker course from TechWorld with Nana",
        url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
        duration: 180
      },
      {
        title: "Docker Course - From BEGINNER to PRO",
        description: "Comprehensive Docker tutorial from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=RqTEHSBrYFw",
        duration: 240
      },
      {
        title: "Docker Crash Course for Absolute Beginners",
        description: "Quick Docker introduction from TechWorld with Nana",
        url: "https://www.youtube.com/watch?v=pg19Z8LL06w",
        duration: 60
      }
    ];
  } else if (topicLower.includes('kubernetes') || topicLower.includes('k8s')) {
    return [
      {
        title: "Kubernetes Course - Full Beginners Tutorial",
        description: "Complete Kubernetes course from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=d6WC5n9G_sM",
        duration: 240
      },
      {
        title: "Kubernetes Tutorial for Beginners [FULL COURSE in 4 Hours]",
        description: "Comprehensive Kubernetes tutorial from TechWorld with Nana",
        url: "https://www.youtube.com/watch?v=X48VuDVv0do",
        duration: 240
      },
      {
        title: "Kubernetes Explained in 100 Seconds",
        description: "Quick Kubernetes overview from Fireship",
        url: "https://www.youtube.com/watch?v=PziYflu8cB8",
        duration: 2
      }
    ];
  } else if (topicLower.includes('vue') || topicLower.includes('vuejs')) {
    return [
      {
        title: "Vue.js Course for Beginners [2024 Tutorial]",
        description: "Complete Vue.js course from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=FXpIoQ_rT_c",
        duration: 300
      },
      {
        title: "Vue 3 Tutorial - Full Course 2024",
        description: "Modern Vue.js development from The Net Ninja",
        url: "https://www.youtube.com/watch?v=YrxBCBibVo0",
        duration: 180
      },
      {
        title: "Vue.js Explained in 100 Seconds",
        description: "Quick Vue.js introduction from Fireship",
        url: "https://www.youtube.com/watch?v=nhBVL41-_Cw",
        duration: 2
      }
    ];
  } else if (topicLower.includes('angular')) {
    return [
      {
        title: "Angular Tutorial for Beginners: Learn Angular & TypeScript",
        description: "Complete Angular course from Programming with Mosh",
        url: "https://www.youtube.com/watch?v=k5E2AVpwsko",
        duration: 120
      },
      {
        title: "Angular Course - Beginner to Advanced",
        description: "Comprehensive Angular tutorial from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=2OHbjep_WjQ",
        duration: 540
      },
      {
        title: "Angular in 100 Seconds",
        description: "Quick Angular overview from Fireship",
        url: "https://www.youtube.com/watch?v=Ata9cSC2WpM",
        duration: 2
      }
    ];
  } else if (topicLower.includes('nextjs') || topicLower.includes('next.js')) {
    return [
      {
        title: "Next.js 13 Full Course 2024 | Build and Deploy a Full Stack App",
        description: "Complete Next.js 13 course from JavaScript Mastery",
        url: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
        duration: 300
      },
      {
        title: "Next.js Tutorial for Beginners",
        description: "Next.js fundamentals from Programming with Mosh",
        url: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA",
        duration: 75
      },
      {
        title: "Next.js in 100 Seconds // Plus Full Beginner's Tutorial",
        description: "Quick Next.js introduction and tutorial from Fireship",
        url: "https://www.youtube.com/watch?v=Sklc_fQBmcs",
        duration: 15
      }
    ];
  } else if (topicLower.includes('typescript') || topicLower.includes('ts')) {
    return [
      {
        title: "TypeScript Course for Beginners - Learn TypeScript from Scratch!",
        description: "Complete TypeScript course from Academind",
        url: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
        duration: 315
      },
      {
        title: "Learn TypeScript - Full Course for Beginners",
        description: "TypeScript fundamentals from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=30LWjhZzg50",
        duration: 81
      },
      {
        title: "TypeScript in 100 Seconds",
        description: "Quick TypeScript overview from Fireship",
        url: "https://www.youtube.com/watch?v=zQnBQ4tB3ZA",
        duration: 2
      }
    ];
  } else if (topicLower.includes('sql') || topicLower.includes('database')) {
    return [
      {
        title: "SQL Tutorial - Full Database Course for Beginners",
        description: "Complete SQL course from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        duration: 240
      },
      {
        title: "MySQL Tutorial for Beginners [Full Course]",
        description: "Comprehensive MySQL tutorial from Programming with Mosh",
        url: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
        duration: 195
      },
      {
        title: "Database Design Course - Learn how to design and plan a database",
        description: "Database design principles from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=ztHopE5Wnpc",
        duration: 300
      }
    ];
  } else if (topicLower.includes('git')) {
    return [
      {
        title: "Git and GitHub for Beginners - Crash Course",
        description: "Complete Git and GitHub tutorial from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        duration: 70
      },
      {
        title: "Git Tutorial for Beginners: Learn Git in 1 Hour",
        description: "Git fundamentals from Programming with Mosh",
        url: "https://www.youtube.com/watch?v=8JJ101D3knE",
        duration: 64
      },
      {
        title: "Git Explained in 100 Seconds",
        description: "Quick Git overview from Fireship",
        url: "https://www.youtube.com/watch?v=hwP7WQkmECE",
        duration: 2
      }
    ];
  } else if (topicLower.includes('css')) {
    return [
      {
        title: "CSS Tutorial – Full Course for Beginners",
        description: "Complete CSS course from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
        duration: 660
      },
      {
        title: "Learn CSS in 20 Minutes",
        description: "CSS fundamentals crash course from Web Dev Simplified",
        url: "https://www.youtube.com/watch?v=1PnVor36_40",
        duration: 20
      },
      {
        title: "CSS Flexbox Course",
        description: "Complete CSS Flexbox tutorial from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=-Wlt8NRtOpo",
        duration: 85
      }
    ];
  } else if (topicLower.includes('html')) {
    return [
      {
        title: "HTML Tutorial for Beginners: HTML Crash Course",
        description: "Complete HTML course from Programming with Mosh",
        url: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
        duration: 60
      },
      {
        title: "HTML Full Course - Build a Website Tutorial",
        description: "HTML fundamentals from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
        duration: 120
      },
      {
        title: "HTML in 100 Seconds",
        description: "Quick HTML overview from Fireship",
        url: "https://www.youtube.com/watch?v=ok-plXXHlWw",
        duration: 2
      }
    ];
  } else if (topicLower.includes('generative') || topicLower.includes('ai')) {
    return [
      {
        title: "Generative AI Full Course – Gemini Pro, OpenAI, Ollama, Langchain, LlamaIndex, & More",
        description: "Complete course on generative AI and large language models from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=mEsleV16qdo",
        duration: 1080
      },
      {
        title: "Introduction to Large Language Models",
        description: "Understanding LLMs and generative AI from Andrej Karpathy",
        url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
        duration: 60
      },
      {
        title: "ChatGPT API Tutorial - Build Your Own Chatbot",
        description: "Practical AI application development from freeCodeCamp",
        url: "https://www.youtube.com/watch?v=uRQH2CFvedY",
        duration: 120
      }
    ];
  } else {
    // Generic programming/education videos
    return [
      {
        title: `${topic} - Complete Tutorial for Beginners`,
        description: `Comprehensive tutorial covering ${topic} fundamentals`,
        url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", // freeCodeCamp JavaScript
        duration: 120
      },
      {
        title: `${topic} - Crash Course`,
        description: `Quick introduction to ${topic} concepts`,
        url: "https://www.youtube.com/watch?v=jS4aFq5-91M", // freeCodeCamp JS course
        duration: 60
      }
    ];
  }
}

// Function to ensure all videos have valid URLs
function ensureValidVideoUrls(videos: any[]) {
  return videos.map(video => {
    if (!video.url || !validateYouTubeUrl(video.url)) {
      // Fallback to a generic educational video if URL is invalid
      return {
        ...video,
        url: "https://www.youtube.com/watch?v=PkZNo7MFNFg"
      };
    }
    return video;
  });
}

function createPrompt(
  topic: string, 
  modules: number, 
  difficulty: string = 'beginner',
  learningStyle: string = 'mixed',
  duration: number = 20,
  prerequisites: string = ''
): string {
  const difficultyText = {
    beginner: 'beginner-friendly',
    intermediate: 'intermediate level',
    advanced: 'advanced level'
  }[difficulty] || 'beginner-friendly';

  const learningStyleText = {
    visual: 'with a focus on visual learning methods including videos and diagrams',
    audio: 'with a focus on audio and verbal learning methods including podcasts and discussions',
    'hands-on': 'with a focus on hands-on, practical learning methods including exercises and projects',
    mixed: 'with a balanced mix of learning methods including videos, documents, and interactive content'
  }[learningStyle] || 'with a balanced mix of learning methods';

  const prerequisitesText = prerequisites ? `\nPrerequisites: ${prerequisites}` : '';

  return `Create a comprehensive ${modules}-module course outline on "${topic}" at ${difficultyText} level ${learningStyleText}.

Course Duration: Approximately ${duration} hours${prerequisitesText}

For each module, provide detailed content including:

1. **Module Structure**:
   - Clear, descriptive module title
   - 4-5 detailed learning objectives
   - Estimated duration (in minutes)
   - 4 bullet points covering key topics

2. **Multimedia Resources** (CRITICAL: Use REAL, WORKING YouTube URLs):
   
   **VIDEO REQUIREMENTS:**
   - 2-3 relevant YouTube videos from VERIFIED educational channels
   - Use these REAL, WORKING YouTube video examples based on topic:
     * Programming/Web Dev: https://www.youtube.com/watch?v=PkZNo7MFNFg (freeCodeCamp JavaScript)
     * React: https://www.youtube.com/watch?v=bMknfKXIFA8 (React Course)
     * Python: https://www.youtube.com/watch?v=rfscVS0vtbw (Python Full Course)
     * Data Science: https://www.youtube.com/watch?v=ua-CiDNNj30 (Data Science Course)
     * AWS: https://www.youtube.com/watch?v=3hLmDS179YE (AWS Certified Course)
     * Machine Learning: https://www.youtube.com/watch?v=GwIo3gDZCVQ (ML Course)
   - MUST use actual YouTube video IDs that exist and work
   - Duration: 8-25 minutes (optimal learning length)
   - Videos must be embeddable and not restricted
   - Format: https://www.youtube.com/watch?v=VIDEO_ID
   
   **DOCUMENT REQUIREMENTS:**
   - 1-2 high-quality document suggestions with REAL URLs
   - Official documentation, research papers, or educational PDFs
   - From reputable sources (universities, official documentation, research institutions)
   
   **EXTERNAL RESOURCE REQUIREMENTS:**
   - 2-3 external resource links with REAL URLs
   - Official documentation, tools, articles from reputable sources
   - Must be currently accessible and relevant

3. **Assessment**:
   - 3 quiz questions with multiple choice options and explanations

CRITICAL REQUIREMENTS:
- ALL videos must be from reputable educational channels with proven track records
- ALL documents must have real URLs from authoritative sources  
- ALL external links must be real, accessible URLs from trusted websites
- Use only high-quality, currently accessible content
- Ensure all URLs are relevant to the specific topic and difficulty level
- Verify that all suggested content is appropriate for the target audience
- IMPORTANT: Focus on providing content that directly teaches the module topic, not general overviews
- For programming topics, prioritize hands-on coding tutorials
- For theoretical topics, prioritize explanatory videos with visual aids

IMPORTANT: Respond ONLY with valid JSON. Do not include any markdown formatting, explanations, or additional text. The response must be parseable JSON.

Format your response as a JSON object with this exact structure:
{
  "courseTitle": "Complete course title here",
  "description": "Comprehensive course description",
  "totalDuration": ${duration},
  "prerequisites": ["prerequisite 1", "prerequisite 2"],
  "learningOutcomes": ["outcome 1", "outcome 2", "outcome 3"],
  "modules": [
    {
      "title": "Module 1 Title",
      "bulletPoints": [
        "First key learning objective",
        "Second key learning objective", 
        "Third key learning objective",
        "Fourth key learning objective"
      ],
      "learningObjectives": [
        "Detailed learning objective 1",
        "Detailed learning objective 2",
        "Detailed learning objective 3"
      ],
      "estimatedDuration": 45,
      "resources": {
        "videos": [
          {
            "title": "Exact Video Title from YouTube",
            "description": "Brief description of video content and relevance to topic",
            "url": "https://www.youtube.com/watch?v=ACTUAL_VIDEO_ID",
            "duration": 15
          }
        ],
        "documents": [
          {
            "title": "Document Title",
            "description": "Document description",
            "type": "pdf",
            "url": "https://actual-document-url.com/document.pdf"
          }
        ],
        "externalLinks": [
          {
            "title": "External Resource",
            "description": "Resource description",
            "url": "https://actual-external-url.com"
          }
        ]
      },
      "assessment": {
        "quizQuestions": [
          {
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Explanation of the correct answer"
          }
        ]
      }
    }
  ]
}`;
}

async function generateWithOpenAI(
  topic: string, 
  modules: number, 
  difficulty: string = 'beginner',
  learningStyle: string = 'mixed',
  duration: number = 20,
  prerequisites: string = ''
): Promise<CourseOutline> {
  if (!openai) throw new Error('OpenAI not configured');
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert curriculum designer who creates well-structured, educational course outlines with REAL, verified educational resources. You have extensive knowledge of educational YouTube channels and their content. Always respond with valid JSON only and provide ACTUAL, WORKING YouTube URLs from verified educational channels."
      },
      {
        role: "user",
        content: createPrompt(topic, modules, difficulty, learningStyle, duration, prerequisites)
      }
    ],
    temperature: 0.3,
    max_tokens: 6000,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');

  try {
    // Clean up the response - remove markdown formatting
    let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to find JSON content if it's wrapped in other text
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }

    return JSON.parse(cleanContent);
  } catch (error) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Invalid JSON response from OpenAI');
  }
}

async function generateWithGemini(
  topic: string, 
  modules: number, 
  difficulty: string = 'beginner',
  learningStyle: string = 'mixed',
  duration: number = 20,
  prerequisites: string = ''
): Promise<CourseOutline> {
  if (!genAI) throw new Error('Gemini not configured');
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const result = await model.generateContent(createPrompt(topic, modules, difficulty, learningStyle, duration, prerequisites));
  const response = await result.response;
  const content = response.text();

  console.log('Raw Gemini response:', content);

  try {
    // Clean up the response in case it has markdown formatting
    let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to find JSON content if it's wrapped in other text
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }

    // Try to parse the JSON
    const parsed = JSON.parse(cleanContent);
    
    // Validate the structure
    if (!parsed.courseTitle || !parsed.modules || !Array.isArray(parsed.modules)) {
      throw new Error('Invalid outline structure in response');
    }

    return parsed;
  } catch (error) {
    console.error('Failed to parse Gemini response:', content);
    console.error('Parse error:', error);
    
    // Try to create a fallback response
    try {
      const fallbackOutline: CourseOutline = {
        courseTitle: `Complete ${topic} Course`,
        description: `A comprehensive course on ${topic} designed for ${difficulty} learners using ${learningStyle} learning methods.`,
        totalDuration: duration,
        prerequisites: prerequisites ? [prerequisites] : [],
        learningOutcomes: [
          `Understand the fundamentals of ${topic}`,
          `Apply ${topic} concepts in practical scenarios`,
          `Develop skills for advanced ${topic} applications`
        ],
        modules: Array.from({ length: modules }, (_, i) => ({
          title: `Module ${i + 1}: ${topic} Fundamentals`,
          bulletPoints: [
            `Introduction to ${topic} concepts`,
            `Key principles and methodologies`,
            `Practical applications and examples`,
            `Assessment and evaluation`
          ],
          learningObjectives: [
            `Understand basic ${topic} concepts`,
            `Apply ${topic} principles`,
            `Evaluate ${topic} applications`
          ],
          estimatedDuration: Math.round(duration * 60 / modules),
          resources: {
            videos: ensureValidVideoUrls(getRelevantVideos(topic)),
            documents: [
              {
                title: `${topic} Official Documentation`,
                description: `Official documentation and study materials for ${topic}`,
                type: 'pdf',
                url: `https://www.google.com/search?q=${encodeURIComponent(topic + ' official documentation PDF')}`
              }
            ],
            externalLinks: [
              {
                title: `${topic} Learning Resources`,
                description: `Curated learning resources and tutorials for ${topic}`,
                url: `https://www.google.com/search?q=${encodeURIComponent(topic + ' learning resources tutorial')}`
              },
              {
                title: `${topic} GitHub Resources`,
                description: `Open source projects and examples for ${topic}`,
                url: `https://github.com/search?q=${encodeURIComponent(topic)}`
              }
            ]
          },
          assessment: {
            quizQuestions: [
              {
                question: `What is the primary focus of ${topic}?`,
                options: [
                  `Understanding basic concepts`,
                  `Advanced applications only`,
                  `Theoretical knowledge only`,
                  `None of the above`
                ],
                correctAnswer: 0,
                explanation: `${topic} focuses on understanding basic concepts before moving to advanced applications.`
              }
            ]
          }
        }))
      };
      
      console.log('Using fallback outline due to parsing error');
      return fallbackOutline;
    } catch (fallbackError) {
      console.error('Fallback creation failed:', fallbackError);
      throw new Error('Failed to generate course outline. Please try again with a different topic or settings.');
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateOutlineRequest = await request.json();
    const { 
      topic, 
      modules, 
      difficulty = 'beginner', 
      learningStyle = 'mixed', 
      duration = 20, 
      prerequisites = '' 
    } = body;

    // Validate input
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!modules || typeof modules !== 'number' || modules < 1 || modules > 10) {
      return NextResponse.json(
        { error: 'Modules must be a number between 1 and 10' },
        { status: 400 }
      );
    }

    // Content moderation check for inappropriate content
    const inappropriateKeywords = [
      'adult', 'explicit', 'nsfw', 'mature', 'xxx', 'sexual', 'dating', 'romance',
      'gambling', 'betting', 'casino', 'alcohol', 'drugs', 'violence', 'weapon',
      'harm', 'suicide', 'self-harm', 'hate', 'discrimination', 'pornography',
      'escort', 'strip', 'naked', 'nude', '18+', 'erotic', 'fetish'
    ];
    
    const contentToCheck = `${topic} ${prerequisites}`.toLowerCase();
    const hasInappropriateContent = inappropriateKeywords.some(keyword => 
      contentToCheck.includes(keyword)
    );
    
    if (hasInappropriateContent) {
      return NextResponse.json({ 
        error: 'Content cannot be generated. This application is designed for educational purposes only. Please ensure your course topic is appropriate for educational content and does not include adult or inappropriate material.' 
      }, { status: 400 });
    }

    // Try to generate with available AI service
    let outline: CourseOutline;
    let generatedWith: string;

    try {
    if (openai) {
      console.log('Generating outline with OpenAI...');
        outline = await generateWithOpenAI(topic, modules, difficulty, learningStyle, duration, prerequisites);
        generatedWith = 'OpenAI';
    } else {
      return NextResponse.json(
        { error: 'OpenAI API service not configured. Please set OPENAI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    // Validate the generated outline
    if (!outline.courseTitle || !outline.modules || !Array.isArray(outline.modules)) {
      throw new Error('Invalid outline structure generated');
    }

    return NextResponse.json({
      success: true,
      outline,
        generatedWith
      });

    } catch (aiError) {
      console.error('AI generation error:', aiError);
      
      // If AI generation fails, try to create a basic fallback
      try {
        console.log('Creating fallback outline...');
        const fallbackOutline: CourseOutline = {
          courseTitle: `Complete ${topic} Course`,
          description: `A comprehensive course on ${topic} designed for ${difficulty} learners using ${learningStyle} learning methods.`,
          totalDuration: duration,
          prerequisites: prerequisites ? [prerequisites] : [],
          learningOutcomes: [
            `Understand the fundamentals of ${topic}`,
            `Apply ${topic} concepts in practical scenarios`,
            `Develop skills for advanced ${topic} applications`
          ],
          modules: Array.from({ length: modules }, (_, i) => ({
            title: `Module ${i + 1}: ${topic} Fundamentals`,
            bulletPoints: [
              `Introduction to ${topic} concepts`,
              `Key principles and methodologies`,
              `Practical applications and examples`,
              `Assessment and evaluation`
            ],
            learningObjectives: [
              `Understand basic ${topic} concepts`,
              `Apply ${topic} principles`,
              `Evaluate ${topic} applications`
            ],
            estimatedDuration: Math.round(duration * 60 / modules),
            resources: {
              videos: ensureValidVideoUrls(getRelevantVideos(topic)),
              documents: [
                {
                  title: `${topic} Official Guide`,
                  description: `Official guide and documentation for ${topic}`,
                  type: 'pdf',
                  url: `https://www.google.com/search?q=${encodeURIComponent(topic + ' official guide PDF download')}`
                }
              ],
              externalLinks: [
                {
                  title: `${topic} Community Resources`,
                  description: `Community-driven resources and tutorials for ${topic}`,
                  url: `https://www.reddit.com/search/?q=${encodeURIComponent(topic + ' learning resources')}`
                },
                {
                  title: `${topic} Practice Projects`,
                  description: `Hands-on projects and examples for ${topic}`,
                  url: `https://github.com/search?q=${encodeURIComponent(topic + ' projects examples')}`
                }
              ]
            },
            assessment: {
              quizQuestions: [
                {
                  question: `What is the primary focus of ${topic}?`,
                  options: [
                    `Understanding basic concepts`,
                    `Advanced applications only`,
                    `Theoretical knowledge only`,
                    `None of the above`
                  ],
                  correctAnswer: 0,
                  explanation: `${topic} focuses on understanding basic concepts before moving to advanced applications.`
                }
              ]
            }
          }))
        };

        return NextResponse.json({
          success: true,
          outline: fallbackOutline,
          generatedWith: 'Fallback (AI service unavailable)'
    });

      } catch (fallbackError) {
        console.error('Fallback creation failed:', fallbackError);
        throw new Error('Failed to generate course outline. Please try again with a different topic or check your API configuration.');
      }
    }

  } catch (error) {
    console.error('Error generating outline:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate course outline',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}