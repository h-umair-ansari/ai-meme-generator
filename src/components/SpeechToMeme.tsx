import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Wand2, Play, Pause, RefreshCw } from 'lucide-react';
import { fetchMemeTemplates } from '../services/memeApi';

interface SpeechToMemeProps {
  onMemeGenerated: (template: string) => void;
}

export const SpeechToMeme: React.FC<SpeechToMemeProps> = ({ onMemeGenerated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [generatedMeme, setGeneratedMeme] = useState<{
    url: string;
    topText: string;
    bottomText: string;
  } | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
    { code: 'ur-PK', name: 'Urdu (Pakistan)', flag: '🇵🇰' },
  ];

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          
          // Auto-stop after 3 seconds of silence
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            stopRecording();
          }, 3000);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }
    
    setTranscript('');
    setIsRecording(true);
    recognitionRef.current?.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current?.stop();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const generateMemeFromSpeech = async () => {
    if (!transcript.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get real meme templates
    const templates = await fetchMemeTemplates();
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Generate captions from speech
    const words = transcript.trim().split(' ');
    const midPoint = Math.ceil(words.length / 2);
    
    const meme = {
      url: randomTemplate.url,
      topText: words.slice(0, midPoint).join(' ').toUpperCase(),
      bottomText: words.slice(midPoint).join(' ').toUpperCase()
    };
    
    setGeneratedMeme(meme);
    setIsProcessing(false);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    speechSynthesis.speak(utterance);
  };

  const clearTranscript = () => {
    setTranscript('');
    setGeneratedMeme(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Mic className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Speech-to-Meme Generator</h2>
        </div>
        <p className="text-green-100">
          Speak your meme idea and watch it come to life instantly!
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Speech Language
            </label>
            <div className="flex space-x-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    language === lang.code
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recording Interface */}
          <div className="text-center">
            <div className="relative inline-block">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </button>
              
              {isRecording && (
                <div className="absolute inset-0 border-4 border-red-300 rounded-full animate-ping"></div>
              )}
            </div>
            
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {isRecording ? 'Listening... Speak your meme idea!' : 'Click to start recording'}
            </p>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transcript
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => speakText(transcript)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={clearTranscript}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200">{transcript}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateMemeFromSpeech}
            disabled={!transcript.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Wand2 className="h-5 w-5 animate-spin" />
                <span>Creating Meme...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                <span>Generate Meme from Speech</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Meme */}
      {generatedMeme && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Generated from Speech
          </h3>
          <div
            className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
            onClick={() => onMemeGenerated(generatedMeme.url)}
          >
            <img
              src={generatedMeme.url}
              alt="Generated meme"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-4">
              <div className="text-white text-center font-bold text-xl drop-shadow-lg">
                {generatedMeme.topText}
              </div>
              <div className="text-white text-center font-bold text-xl drop-shadow-lg">
                {generatedMeme.bottomText}
              </div>
            </div>
            <div className="absolute inset-0 bg-green-500 bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
              <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      )}

      {/* Speech Recognition Support Check */}
      {!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.
          </p>
        </div>
      )}
    </div>
  );
};