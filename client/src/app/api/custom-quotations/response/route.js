import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }
    
    // Forward the request to our backend API
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api'}/custom-quotations/response`, body);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error submitting quotation response:', error);
    
    return NextResponse.json({ 
      error: error.response?.data?.error || 'Failed to process quotation response' 
    }, { 
      status: error.response?.status || 500 
    });
  }
}
