import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Forward the request to the backend
    const backendUrl = process.env.API_URL || 'http://backend:3001';
    const response = await fetch(`${backendUrl}/api/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend upload error:', errorText);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
