import React, { useState } from 'react';
import { Search, Filter, Heart, Download, Star } from 'lucide-react';
import { fetchMemeTemplates, categorizeMemes, searchMemes, MemeTemplate } from '../services/memeApi';

interface TemplateLibraryProps {
  onTemplateSelect: (template: string) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onTemplateSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [categorizedTemplates, setCategorizedTemplates] = useState<{ [key: string]: MemeTemplate[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const memeTemplates = await fetchMemeTemplates();
        setTemplates(memeTemplates);
        setCategorizedTemplates(categorizeMemes(memeTemplates));
        setError(null);
      } catch (err) {
        setError('Failed to load meme templates. Please try again.');
        console.error('Error loading templates:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'funny', name: 'Funny', count: categorizedTemplates.funny?.length || 0 },
    { id: 'reaction', name: 'Reaction', count: categorizedTemplates.reaction?.length || 0 },
    { id: 'wholesome', name: 'Wholesome', count: categorizedTemplates.wholesome?.length || 0 },
    { id: 'dark', name: 'Dark Humor', count: categorizedTemplates.dark?.length || 0 },
    { id: 'philosophical', name: 'Philosophical', count: categorizedTemplates.philosophical?.length || 0 },
    { id: 'relatable', name: 'Relatable', count: categorizedTemplates.relatable?.length || 0 },
    { id: 'classic', name: 'Classic', count: categorizedTemplates.classic?.length || 0 },
  ];

  const getFilteredTemplates = () => {
    const categoryTemplates = selectedCategory === 'all' 
      ? templates 
      : categorizedTemplates[selectedCategory] || [];
    
    return searchMemes(categoryTemplates, searchTerm);
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Template Library</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose from {templates.length}+ real meme templates
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading real meme templates...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Category Pills */}
      {!loading && !error && (
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      )}

      {/* Templates Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
              onClick={() => onTemplateSelect(template.url)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={template.url}
                  alt={template.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300/6366f1/ffffff?text=' + encodeURIComponent(template.name);
                  }}
                />
                <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {template.box_count} text{template.box_count !== 1 ? 's' : ''}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2 truncate" title={template.name}>
                  {template.name}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="text-xs">
                    {template.width} × {template.height}
                  </div>
                  
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No templates found. Try a different search term or category.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};