import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body); 

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: body.prompt,
        max_tokens: 100, 
        model: 'text-davinci-003', 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI API response:', data); 

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error during API call:', error);
    return NextResponse.json({ error: 'Failed to generate recipe.' }, { status: 500 });
  }
}
