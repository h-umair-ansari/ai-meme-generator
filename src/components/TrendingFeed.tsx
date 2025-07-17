import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Download, Siren as Fire, TrendingUp, Clock, Users } from 'lucide-react';
import { fetchMemeTemplates, MemeTemplate } from '../services/memeApi';

export const TrendingFeed: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'trending' | 'recent' | 'popular'>('trending');
  const [likedMemes, setLikedMemes] = useState<Set<string>>(new Set());
  const [memes, setMemes] = useState<Array<{
    id: string;
    url: string;
    topText: string;
    bottomText: string;
    author: string;
    avatar: string;
    likes: number;
    comments: number;
    shares: number;
    timestamp: string;
    category: string;
    trending: boolean;
    templateName: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingMemes = async () => {
      try {
        setLoading(true);
        const templates = await fetchMemeTemplates();
        
        // Create realistic trending memes using real templates
        const trendingCaptions = [
          {
            topText: 'WHEN YOU FINALLY UNDERSTAND',
            bottomText: 'A COMPLEX PROGRAMMING CONCEPT',
            author: 'CodeMaster',
            category: 'Programming',
            likes: 1247,
            comments: 89,
            shares: 234,
            timestamp: '2 hours ago',
            trending: true
          },
          {
            topText: 'ME PRETENDING TO WORK',
            bottomText: 'WHILE BROWSING MEMES',
            author: 'MemeQueen',
            category: 'Relatable',
            likes: 2156,
            comments: 156,
            shares: 445,
            timestamp: '4 hours ago',
            trending: true
          },
          {
            topText: 'MONDAY MORNING MEETINGS',
            bottomText: 'VS FRIDAY AFTERNOON VIBES',
            author: 'WorkLifeBalance',
            category: 'Work',
            likes: 3421,
            comments: 234,
            shares: 567,
            timestamp: '6 hours ago',
            trending: true
          },
          {
            topText: 'WHEN THE CODE WORKS',
            bottomText: 'ON THE FIRST TRY',
            author: 'DevLife',
            category: 'Programming',
            likes: 1876,
            comments: 123,
            shares: 312,
            timestamp: '8 hours ago',
            trending: false
          },
          {
            topText: 'TRYING TO EXPLAIN MEMES',
            bottomText: 'TO YOUR PARENTS',
            author: 'GenZHumor',
            category: 'Family',
            likes: 2987,
            comments: 445,
            shares: 678,
            timestamp: '12 hours ago',
            trending: false
          },
          {
            topText: 'WEEKEND PLANS',
            bottomText: 'VS WEEKEND REALITY',
            author: 'WeekendWarrior',
            category: 'Lifestyle',
            likes: 4123,
            comments: 567,
            shares: 890,
            timestamp: '1 day ago',
            trending: false
          },
          {
            topText: 'WHEN SOMEONE SAYS',
            bottomText: 'PINEAPPLE BELONGS ON PIZZA',
            author: 'FoodieDebate',
            category: 'Food',
            likes: 1654,
            comments: 298,
            shares: 156,
            timestamp: '1 day ago',
            trending: false
          },
          {
            topText: 'TRYING TO LOOK BUSY',
            bottomText: 'WHEN THE BOSS WALKS BY',
            author: 'OfficeLife',
            category: 'Work',
            likes: 2789,
            comments: 187,
            shares: 423,
            timestamp: '2 days ago',
            trending: false
          }
        ];
        
        // Generate user avatars using a placeholder service
        const generateAvatar = (seed: string) => 
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
        
        // Combine real templates with trending captions
        const mockMemes = trendingCaptions.map((caption, index) => {
          const template = templates[index % templates.length];
          return {
            id: `trending-${index + 1}`,
            url: template.url,
            topText: caption.topText,
            bottomText: caption.bottomText,
            author: caption.author,
            avatar: generateAvatar(caption.author),
            likes: caption.likes,
            comments: caption.comments,
            shares: caption.shares,
            timestamp: caption.timestamp,
            category: caption.category,
            trending: caption.trending,
            templateName: template.name
          };
        });

        setMemes(mockMemes);
      } catch (error) {
        console.error('Error loading trending memes:', error);
        // Fallback to empty state or show error
        setMemes([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadTrendingMemes();
  }, []);

  const handleLike = (memeId: string) => {
    setLikedMemes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memeId)) {
        newSet.delete(memeId);
      } else {
        newSet.add(memeId);
      }
      return newSet;
    });

    setMemes(prev => prev.map(meme => 
      meme.id === memeId 
        ? { ...meme, likes: likedMemes.has(memeId) ? meme.likes - 1 : meme.likes + 1 }
        : meme
    ));
  };

  const filteredMemes = memes.filter(meme => {
    switch (selectedTab) {
      case 'trending':
        return meme.trending;
      case 'recent':
        return true; // Show all, sorted by timestamp
      case 'popular':
        return meme.likes > 2000;
      default:
        return true;
    }
  });

  const tabs = [
    { id: 'trending' as const, label: 'Trending', icon: Fire, count: memes.filter(m => m.trending).length },
    { id: 'recent' as const, label: 'Recent', icon: Clock, count: memes.length },
    { id: 'popular' as const, label: 'Popular', icon: TrendingUp, count: memes.filter(m => m.likes > 2000).length },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Fire className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Trending Memes</h2>
        </div>
        <p className="text-orange-100">
          Discover the hottest memes from our community of creators
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex space-x-1 mb-6">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                selectedTab === id
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{label}</span>
              <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full text-xs">
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Memes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMemes.map(meme => (
            <div key={meme.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
              {/* Author Info */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={meme.avatar}
                      alt={meme.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{meme.author}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{meme.timestamp}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                    {meme.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs">
                    {meme.templateName}
                  </span>
                </div>
              </div>

              {/* Meme Image */}
              <div className="relative">
                <img
                  src={meme.url}
                  alt="Meme"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-4">
                  <div className="text-white text-center font-bold text-lg drop-shadow-lg">
                    {meme.topText}
                  </div>
                  <div className="text-white text-center font-bold text-lg drop-shadow-lg">
                    {meme.bottomText}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(meme.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        likedMemes.has(meme.id)
                          ? 'text-red-500'
                          : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${likedMemes.has(meme.id) ? 'fill-current' : ''}`} />
                      <span>{meme.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span>{meme.comments}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span>{meme.shares}</span>
                    </button>
                  </div>
                  
                  <button className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
       </div>

        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading trending memes...</p>
          </div>
        )}
      </div>

      {/* Community Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Community Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">12.5K</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Active Users</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg">
              <Fire className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">3.2K</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Memes Today</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
              <Heart className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">45.8K</div>
              <div className="text-sm text-green-600 dark:text-green-400">Likes Given</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg">
              <TrendingUp className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">156</div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Trending Now</div>
            </div>
          </div>
        </div>
      )
    </div>
  );
};