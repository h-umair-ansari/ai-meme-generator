import React, { useState } from 'react';
import { X, Share2, Download, Copy, MessageCircle, Instagram, Twitter, Facebook } from 'lucide-react';

interface ShareModalProps {
  onClose: () => void;
  memeUrl?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose, memeUrl }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl] = useState(`https://memeforge.ai/meme/${Math.random().toString(36).substr(2, 9)}`);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`Check out this meme: ${shareUrl}`)}`
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this hilarious meme!`)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600',
      url: shareUrl // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
    }
  ];

  const handleShare = (option: typeof shareOptions[0]) => {
    if (option.id === 'instagram') {
      copyToClipboard(shareUrl);
      alert('Link copied! You can now paste it in your Instagram post or story.');
    } else {
      window.open(option.url, '_blank', 'width=600,height=400');
    }
  };

  const downloadMeme = () => {
    if (memeUrl) {
      const link = document.createElement('a');
      link.href = memeUrl;
      link.download = `meme-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Share Your Meme</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Share your creation with the world!
          </p>
        </div>

        {/* Share URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Share Link
          </label>
          <div className="flex">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={() => copyToClipboard(shareUrl)}
              className={`px-4 py-2 rounded-r-lg transition-colors ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Social Media Options */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Share on Social Media
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleShare(option)}
                className={`flex items-center space-x-3 p-3 rounded-lg text-white transition-colors ${option.color}`}
              >
                <option.icon className="h-5 w-5" />
                <span className="font-medium">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Download Option */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={downloadMeme}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Download Meme</span>
          </button>
        </div>

        {/* Share Stats */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Share2 className="h-4 w-4" />
              <span>247 shares</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="h-4 w-4" />
              <span>1.2K downloads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};