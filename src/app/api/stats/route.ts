import { NextRequest, NextResponse } from 'next/server';
import { statsService } from '../../../lib/db/services';

export async function GET(request: NextRequest) {
  try {
    const stats = await statsService.getStats();
    
    return NextResponse.json(stats);

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
} 