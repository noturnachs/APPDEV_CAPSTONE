import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Proxy the request to the backend server
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api'}/staff/login`, body);
    
    // Return the same status and data from the backend
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