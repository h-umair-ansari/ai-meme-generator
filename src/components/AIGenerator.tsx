import React, { useState } from 'react';
import { Brain, Wand2, Lightbulb, Zap, Sparkles } from 'lucide-react';
import { fetchMemeTemplates, MemeTemplate } from '../services/memeApi';

interface AIGeneratorProps {
  onMemeGenerated: (template: string) => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ onMemeGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('funny');
  const [language, setLanguage] = useState('english');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMemes, setGeneratedMemes] = useState<Array<{
    id: string;
    url: string;
    topText: string;
    bottomText: string;
    style: string;
  }>>([]);

  const styles = [
    { id: 'funny', name: 'Funny', icon: '😂' },
    { id: 'wholesome', name: 'Wholesome', icon: '🥰' },
    { id: 'dark', name: 'Dark Humor', icon: '😈' },
    { id: 'reaction', name: 'Reaction', icon: '😤' },
    { id: 'motivational', name: 'Motivational', icon: '💪' },
    { id: 'relatable', name: 'Relatable', icon: '🤝' },
  ];

  const languages = [
    { id: 'english', name: 'English', flag: '🇺🇸' },
    { id: 'hindi', name: 'Hindi', flag: '🇮🇳' },
    { id: 'urdu', name: 'Urdu', flag: '🇵🇰' },
  ];

  const suggestions = [
    "When you finally understand a complex concept",
    "Monday morning meetings vs Friday afternoon",
    "Trying to explain code to non-technical people",
    "When the test passes on the first try",
    "Me pretending to work while browsing memes",
    "The feeling when you find the perfect solution",
    "When someone says 'it works on my machine'",
    "Debugging at 3 AM be like",
  ];

  const generateMeme = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get real meme templates
    const templates = await fetchMemeTemplates();
    const randomTemplates = templates
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    
    const generateCaptions = (prompt: string, style: string, language: string) => {
      const basePrompt = prompt.toLowerCase();
      
      // Mock AI caption generation based on style and language
      if (language === 'hindi') {
        return {
          topText: 'जब आप ' + basePrompt.split(' ').slice(0, 3).join(' '),
          bottomText: 'तब आप ' + basePrompt.split(' ').slice(3).join(' ')
        };
      } else if (language === 'urdu') {
        return {
          topText: 'جب آپ ' + basePrompt.split(' ').slice(0, 3).join(' '),
          bottomText: 'تو آپ ' + basePrompt.split(' ').slice(3).join(' ')
        };
      }
      
      // English captions
      const funnyPrefixes = ['When you', 'Me when', 'That moment when'];
      const wholesomePrefixes = ['Feeling grateful when', 'Happy because', 'Blessed when'];
      const darkPrefixes = ['Life be like', 'Reality check:', 'The truth is'];
      
      const prefixes = style === 'funny' ? funnyPrefixes : 
                      style === 'wholesome' ? wholesomePrefixes : 
                      style === 'dark' ? darkPrefixes : funnyPrefixes;
      
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      
      return {
        topText: randomPrefix.toUpperCase(),
        bottomText: prompt.toUpperCase()
      };
    };
    
    const newMemes = randomTemplates.map((template, index) => {
      const captions = generateCaptions(prompt, style, language);
      return {
        id: `generated-${Date.now()}-${index}`,
        url: template.url,
        topText: captions.topText,
        bottomText: captions.bottomText,
        style: style
      };
    });
    
    setGeneratedMemes(newMemes);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h2 className="text-2xl font-bold">AI Meme Generator</h2>
        </div>
        <p className="text-purple-100">
          Describe your meme idea and let our AI create the perfect meme for you!
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe your meme idea
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., When you finally understand a complex concept after hours of research..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                {prompt.length}/500
              </div>
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meme Style
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {styles.map(styleOption => (
                <button
                  key={styleOption.id}
                  onClick={() => setStyle(styleOption.id)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    style === styleOption.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{styleOption.icon}</div>
                  <div className="text-xs font-medium">{styleOption.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <div className="flex space-x-2">
              {languages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    language === lang.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateMeme}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-5 w-5 animate-spin" />
                <span>Generating Magic...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                <span>Generate Meme</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Need inspiration?</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setPrompt(suggestion)}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Memes */}
      {generatedMemes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Generated Memes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedMemes.map(meme => (
              <div
                key={meme.id}
                className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
                onClick={() => onMemeGenerated(meme.url)}
              >
                <img
                  src={meme.url}
                  alt="Generated meme"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-4">
                  <div className="text-white text-center font-bold text-lg drop-shadow-lg">
                    {meme.topText}
                  </div>
                  <div className="text-white text-center font-bold text-lg drop-shadow-lg">
                    {meme.bottomText}
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  {meme.style}
                </div>
                <div className="absolute inset-0 bg-purple-500 bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};