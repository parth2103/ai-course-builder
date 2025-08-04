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

2. **Multimedia Resources** (CRITICAL: Provide HIGH-QUALITY, VERIFIED URLs):
   
   **VIDEO REQUIREMENTS:**
   - 2-3 relevant YouTube videos from TOP educational channels:
     * Khan Academy, MIT OpenCourseWare, Harvard, Stanford, Coursera, edX
     * TED-Ed, Crash Course, freeCodeCamp, The Net Ninja, Traversy Media
     * Channels with 500K+ subscribers and 4.5+ star ratings
   - Videos must have 100,000+ views and be published within last 2 years
   - Duration: 5-30 minutes (optimal learning length)
   - Must be directly relevant to the specific topic
   - Provide REAL, accessible YouTube URLs (https://www.youtube.com/watch?v=...)
   
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
            videos: [
              {
                title: `${topic} Introduction Video`,
                description: `Comprehensive introduction to ${topic}`,
                duration: 15
              }
            ],
            documents: [
              {
                title: `${topic} Study Guide`,
                description: `Complete study materials for ${topic}`,
                type: 'pdf'
              }
            ],
            externalLinks: [
              {
                title: `${topic} Documentation`,
                description: `Official documentation and resources`
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

    // Try to generate with available AI service
    let outline: CourseOutline;
    let generatedWith: string;

    try {
    if (openai) {
      console.log('Generating outline with OpenAI...');
        outline = await generateWithOpenAI(topic, modules, difficulty, learningStyle, duration, prerequisites);
        generatedWith = 'OpenAI';
    } else if (genAI) {
      console.log('Generating outline with Gemini...');
        outline = await generateWithGemini(topic, modules, difficulty, learningStyle, duration, prerequisites);
        generatedWith = 'Gemini';
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
              videos: [
                {
                  title: `${topic} Introduction Video`,
                  description: `Comprehensive introduction to ${topic}`,
                  duration: 15
                }
              ],
              documents: [
                {
                  title: `${topic} Study Guide`,
                  description: `Complete study materials for ${topic}`,
                  type: 'pdf'
                }
              ],
              externalLinks: [
                {
                  title: `${topic} Documentation`,
                  description: `Official documentation and resources`
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