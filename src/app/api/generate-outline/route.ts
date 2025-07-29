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

2. **Multimedia Resources**:
   - 2-3 relevant YouTube video suggestions with titles and descriptions
   - 1-2 document suggestions (PDFs, PowerPoints) with descriptions
   - 2-3 external resource links (documentation, articles, tools)

3. **Assessment**:
   - 3 quiz questions with multiple choice options and explanations

Format your response as a JSON object with this structure:
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
            "title": "Video Title",
            "description": "Video description",
            "duration": 15
          }
        ],
        "documents": [
          {
            "title": "Document Title",
            "description": "Document description",
            "type": "pdf"
          }
        ],
        "externalLinks": [
          {
            "title": "External Resource",
            "description": "Resource description"
          }
        ]
      },
      "assessment": {
        "quizQuestions": [
          {
            "question": "Quiz question?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Explanation of the correct answer"
          }
        ]
      }
    }
  ]
}

Ensure the content is educational, well-structured, and progresses logically from basic to advanced concepts. The difficulty level should be consistently ${difficultyText} throughout the course. Include practical, real-world examples and resources that would be valuable for ${difficultyText} learners.`;
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
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert curriculum designer who creates well-structured, educational course outlines. Always respond with valid JSON only."
      },
      {
        role: "user",
        content: createPrompt(topic, modules, difficulty, learningStyle, duration, prerequisites)
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');

  try {
    return JSON.parse(content);
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

  try {
    // Clean up the response in case it has markdown formatting
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanContent);
  } catch (error) {
    console.error('Failed to parse Gemini response:', content);
    throw new Error('Invalid JSON response from Gemini');
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

    // Try to generate with available AI service
    let outline: CourseOutline;

    if (openai) {
      console.log('Generating outline with OpenAI...');
      outline = await generateWithOpenAI(topic, modules, difficulty, learningStyle, duration, prerequisites);
    } else if (genAI) {
      console.log('Generating outline with Gemini...');
      outline = await generateWithGemini(topic, modules, difficulty, learningStyle, duration, prerequisites);
    } else {
      return NextResponse.json(
        { error: 'No AI service configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in your environment variables.' },
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
      generatedWith: openai ? 'OpenAI' : 'Gemini'
    });

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