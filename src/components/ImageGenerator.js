'use client';
import { useState } from 'react';

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    const generateImage = async () => {
        if (!prompt) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            console.log('Frontend received:', data);
            if (!data.imageUrl) {
                throw new Error('No image URL received');
            }
            setImageUrl(data.imageUrl);
        } catch (err) {
            setError('Error generating image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 p-8">
            <div className="max-w-3xl mx-auto space-y-8 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                    AI Image Generator
                </h1>

                <div className="space-y-6">
                    <textarea
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none transition duration-200 text-gray-700 bg-white/50 backdrop-blur-sm"
                        rows="4"
                        placeholder="Describe the image you want to create..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />

                    <button
                        className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl hover:from-purple-700 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        onClick={generateImage}
                        disabled={!prompt || loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                <span>Creating Magic...</span>
                            </div>
                        ) : (
                            'Generate Image ✨'
                        )}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                        <p className="font-medium">Oops! Something went wrong</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {imageUrl && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <img
                                src={imageUrl}
                                alt="Generated image"
                                className="max-w-full rounded-xl shadow-2xl transform transition-all duration-300 group-hover:scale-[1.02]"
                                onError={(e) => {
                                    console.error('Image failed to load:', imageUrl);
                                    setError('Failed to load the generated image');
                                }}
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <button
                            onClick={() => window.open(imageUrl, '_blank')}
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition duration-200 text-sm font-medium"
                        >
                            Open in Full Size 🔍
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ImageGenerator;
