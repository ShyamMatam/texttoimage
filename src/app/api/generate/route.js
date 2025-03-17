import OpenAI from 'openai';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'
const client = new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: process.env.NEBIUS_API_KEY,
});

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

export async function POST(req) {
    try {
        const { prompt } = await req.json();


        const response = await client.images.generate({
            model: "black-forest-labs/flux-dev",
            response_format: "url",
            extra_body: {
                "response_extension": "webp",
                "width": 1024,
                "height": 1024,
                "num_inference_steps": 28,
                "negative_prompt": "",
                "seed": -1
            },
            prompt: prompt
        });

        // Log the response to see its structure
        console.log('API Response:', response);

        return NextResponse.json({ imageUrl: response.data[0].url });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
} 