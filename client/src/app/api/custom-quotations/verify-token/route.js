import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAuthHeaders } from '@/lib/api-middleware';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }
    
    // Forward the request to our backend API
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api'}/custom-quotations/verify-token?token=${token}`);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error verifying token:', error);
    
    return NextResponse.json({ 
      error: error.response?.data?.error || 'Failed to verify token' 
    }, { 
      status: error.response?.status || 500 
    });
  }
}
