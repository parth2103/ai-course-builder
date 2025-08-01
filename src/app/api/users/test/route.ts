import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../lib/db/services';

export async function GET(request: NextRequest) {
  try {
    // Test if the database connection is working
    const users = await userService.getAllUsers();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection working',
      userCount: users.length,
      users: users.map((u: any) => ({ id: u.id, email: u.email, role: u.role }))
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 