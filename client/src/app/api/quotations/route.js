import axios from 'axios';
import { withAuth, getAuthHeaders } from '@/lib/api-middleware';

async function getQuotations(request) {
  try {
    // Forward auth token to backend
    const headers = getAuthHeaders(request);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api'}/quotations`, { headers });
    
    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return new Response(JSON.stringify({ 
      error: error.response?.data?.error || 'Internal server error' 
    }), {
      status: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

async function createQuotation(request) {
  try {
    const body = await request.json();
    
    // Forward auth token to backend
    const headers = getAuthHeaders(request);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api'}/quotations`, body, { headers });
    
    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return new Response(JSON.stringify({ 
      error: error.response?.data?.error || 'Internal server error' 
    }), {
      status: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Export routes - GET is protected, POST is public
export const GET = withAuth(getQuotations, { isPublic: false });
export const POST = withAuth(createQuotation, { isPublic: true });