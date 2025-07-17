import React from 'react';
import { Type, Palette, Move, Trash2, Bold, Italic, Eye } from 'lucide-react';

interface TextEditorProps {
  selectedText: string | null;
  texts: Array<{
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
    bold: boolean;
    italic: boolean;
    outline: boolean;
  }>;
  onUpdateText: (id: string, updates: any) => void;
  onDeleteText: (id: string) => void;
  onSelectText: (id: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  selectedText,
  texts,
  onUpdateText,
  onDeleteText,
  onSelectText
}) => {
  const currentText = texts.find(t => t.id === selectedText);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Text Editor</h3>
      
      {/* Text List */}
      <div className="space-y-2 mb-6">
        {texts.map((text) => (
          <div
            key={text.id}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedText === text.id 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => onSelectText(text.id)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {text.text || 'Empty text'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteText(text.id);
                }}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {currentText && (
        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Text Content
            </label>
            <textarea
              value={currentText.text}
              onChange={(e) => onUpdateText(currentText.id, { text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          
          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Font Family
            </label>
            <select
              value={currentText.fontFamily}
              onChange={(e) => onUpdateText(currentText.id, { fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Impact">Impact</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>
          
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Font Size: {currentText.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="60"
              value={currentText.fontSize}
              onChange={(e) => onUpdateText(currentText.id, { fontSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          
          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={currentText.color}
                onChange={(e) => onUpdateText(currentText.id, { color: e.target.value })}
                className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={currentText.color}
                onChange={(e) => onUpdateText(currentText.id, { color: e.target.value })}
                className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                X Position: {currentText.x}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={currentText.x}
                onChange={(e) => onUpdateText(currentText.id, { x: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Y Position: {currentText.y}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={currentText.y}
                onChange={(e) => onUpdateText(currentText.id, { y: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Style Options */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onUpdateText(currentText.id, { bold: !currentText.bold })}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                currentText.bold 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Bold className="h-4 w-4" />
              <span>Bold</span>
            </button>
            
            <button
              onClick={() => onUpdateText(currentText.id, { italic: !currentText.italic })}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                currentText.italic 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Italic className="h-4 w-4" />
              <span>Italic</span>
            </button>
            
            <button
              onClick={() => onUpdateText(currentText.id, { outline: !currentText.outline })}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                currentText.outline 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Outline</span>
            </button>
          </div>
        </div>
      )}
      
      {!currentText && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Type className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Select a text element to edit its properties</p>
        </div>
      )}
    </div>
  );
};