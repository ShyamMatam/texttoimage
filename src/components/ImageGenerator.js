'use client';
import { useState } from 'react';

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);
    const [style, setStyle] = useState('realistic'); // New style selector

    // Sample images to show by default
    const defaultImages = [
        {
            url: 'https://picsum.photos/800/600?random=1',
            prompt: 'A serene landscape with mountains'
        },
        {
            url: 'https://picsum.photos/800/600?random=2',
            prompt: 'Abstract digital art'
        },
        {
            url: 'https://picsum.photos/800/600?random=3',
            prompt: 'Futuristic cityscape'
        }
    ];

    const styleOptions = [
        { value: 'realistic', label: '📷 Realistic' },
        { value: 'artistic', label: '🎨 Artistic' },
        { value: 'anime', label: '🌸 Anime' },
        { value: 'digital', label: '💻 Digital Art' }
    ];

    const generateImage = async () => {
        if (!prompt) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, style }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            if (!data.imageUrl) {
                throw new Error('No image URL received');
            }
            
            setImageUrl(data.imageUrl);
            setHistory(prev => [...prev, { prompt, url: data.imageUrl, style }]);
        } catch (err) {
            setError('Error generating image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                        AI Image Generator
                    </h1>
                    <p className="text-gray-600">Transform your ideas into stunning visuals</p>
                </div>

                {/* Input Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl space-y-6">
                    <div className="space-y-4">
                        <textarea
                            className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none transition duration-200 text-gray-700 bg-white/50 backdrop-blur-sm"
                            rows="4"
                            placeholder="Describe the image you want to create..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        
                        <div className="flex gap-4 flex-wrap">
                            {styleOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setStyle(option.value)}
                                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                                        style === option.value
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

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
                </div>

                {/* Generated Image Display */}
                {imageUrl && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Your Generated Image</h2>
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
                            </div>
                            <button
                                onClick={() => window.open(imageUrl, '_blank')}
                                className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-200"
                            >
                                Open in Full Size 🔍
                            </button>
                        </div>
                    </div>
                )}

                {/* History Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-purple-500 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Generation History</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-4 space-y-2">
                                <img src={item.url} alt={item.prompt} className="rounded-lg w-full h-48 object-cover" />
                                <p className="text-sm text-gray-600 line-clamp-2">{item.prompt}</p>
                                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                                    {item.style}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Default Images Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-purple-500 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Inspiration Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {defaultImages.map((image, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-4 space-y-2">
                                <img src={image.url} alt={image.prompt} className="rounded-lg w-full h-48 object-cover" />
                                <p className="text-sm text-gray-600">{image.prompt}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ImageGenerator;
