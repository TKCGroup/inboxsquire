import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema matching the form
const prospectIntakeSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().min(2),
  jobTitle: z.string().min(2),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"]),
  industry: z.string().min(2),
  website: z.string().url().optional().or(z.literal("")),
  currentEmailVolume: z.enum(["under-50", "50-100", "100-200", "200-500", "500+"]),
  timeSpentOnEmail: z.enum(["under-1h", "1-2h", "2-4h", "4-6h", "6h+"]),
  biggestPainPoints: z.array(z.string()).min(1),
  currentSolutions: z.string().optional(),
  primaryGoals: z.array(z.string()).min(1),
  timeline: z.enum(["immediate", "1-month", "3-months", "6-months", "exploring"]),
  budget: z.enum(["under-1k", "1k-5k", "5k-15k", "15k-50k", "50k+", "no-budget"]),
  decisionMakers: z.enum(["me-only", "me-plus-1", "small-team", "large-committee"]),
  technicalRequirements: z.string().optional(),
  integrationNeeds: z.array(z.string()),
  securityRequirements: z.string().optional(),
  additionalNotes: z.string().optional(),
  preferredContactMethod: z.enum(["email", "phone", "video-call", "in-person"]),
  bestTimeToContact: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Validate the request body
    const body = await request.json();
    const validatedData = prospectIntakeSchema.parse(body);
    
    // For now, return success without database storage
    // TODO: Implement prospect_intake table when needed
    console.log('Prospect intake form submitted:', validatedData.email, validatedData.company);
    
         return NextResponse.json({
       success: true,
       message: 'Prospect intake form submitted successfully',
       leadScore: 75, // Mock lead score
       id: crypto.randomUUID(),
     });
    
  } catch (error) {
    console.error('Prospect intake submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid form data',
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Prospect intake API endpoint - POST only' },
    { status: 405 }
  );
} 