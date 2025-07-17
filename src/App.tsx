import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MemeEditor } from './components/MemeEditor';
import { TemplateLibrary } from './components/TemplateLibrary';
import { TrendingFeed } from './components/TrendingFeed';
import { AIGenerator } from './components/AIGenerator';
import { SpeechToMeme } from './components/SpeechToMeme';
import { Footer } from './components/Footer';

export type Page = 'home' | 'templates' | 'trending' | 'ai-generator' | 'speech-to-meme';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'templates':
        return <TemplateLibrary onTemplateSelect={handleTemplateSelect} />;
      case 'trending':
        return <TrendingFeed />;
      case 'ai-generator':
        return <AIGenerator onMemeGenerated={handleTemplateSelect} />;
      case 'speech-to-meme':
        return <SpeechToMeme onMemeGenerated={handleTemplateSelect} />;
      default:
        return <MemeEditor selectedTemplate={selectedTemplate} />;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;