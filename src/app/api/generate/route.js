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
        const { prompt, style } = await req.json();

        // Enhance prompt based on style
        let enhancedPrompt = prompt;
        switch (style) {
            case 'realistic':
                enhancedPrompt += ', photorealistic, high detail, 8k resolution';
                break;
            case 'artistic':
                enhancedPrompt += ', artistic style, oil painting, vibrant colors';
                break;
            case 'anime':
                enhancedPrompt += ', anime style, manga art, cel shaded';
                break;
            case 'digital':
                enhancedPrompt += ', digital art, concept art, detailed';
                break;
        }

        const response = await client.images.generate({
            model: "black-forest-labs/flux-dev",
            response_format: "url",
            extra_body: {
                "response_extension": "webp",
                "width": 1024,
                "height": 1024,
                "num_inference_steps": 28,
                "negative_prompt": "low quality, blurry, distorted",
                "seed": -1
            },
            prompt: enhancedPrompt
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