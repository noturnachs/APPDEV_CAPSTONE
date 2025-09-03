import axios from 'axios';
import { withAuth, getAuthHeaders } from '@/lib/api-middleware';

async function getQuotationById(request, { params }) {
  try {
    const { id } = params;
    // Forward auth token to backend
    const headers = getAuthHeaders(request);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api'}/quotations/${id}`, { headers });
    
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

// Export protected route
export const GET = withAuth(getQuotationById, { isPublic: false });