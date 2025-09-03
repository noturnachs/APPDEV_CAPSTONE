import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Quotation ID is required' }, { status: 400 });
    }
    
    // Forward the request to our backend API
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api'}/custom-quotations/${id}/pdf`, {
      responseType: 'arraybuffer'
    });
    
    // Return the PDF directly
    return new Response(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Alpha_Systems_Quotation_${id}.pdf"`
      }
    });
  } catch (error) {
    console.error('Error fetching quotation PDF:', error);
    
    return NextResponse.json({ 
      error: error.response?.data?.error || 'Failed to fetch quotation PDF' 
    }, { 
      status: error.response?.status || 500 
    });
  }
}
