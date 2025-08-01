import { NextRequest, NextResponse } from 'next/server';
import { enrollmentService } from '../../../../../lib/db/services';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const enrollments = await enrollmentService.getUserEnrollments(userId);

    return NextResponse.json({ enrollments });

  } catch (error) {
    console.error('Get user enrollments error:', error);
    return NextResponse.json({ error: 'Failed to get user enrollments' }, { status: 500 });
  }
} 