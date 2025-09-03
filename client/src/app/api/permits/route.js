import axios from 'axios';
import { withAuth, getAuthHeaders } from '@/lib/api-middleware';

async function getPermits(request) {
  try {
    // Forward auth token to backend if available
    const headers = getAuthHeaders(request);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api'}/permits`, { headers });
    
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

// Export as public route - accessible without authentication
export const GET = withAuth(getPermits, { isPublic: true });