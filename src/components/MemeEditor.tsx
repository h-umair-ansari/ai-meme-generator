import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Share2, Type, Palette, Move, RotateCcw } from 'lucide-react';
import { TextEditor } from './TextEditor';
import { ShareModal } from './ShareModal';

interface MemeEditorProps {
  selectedTemplate: string | null;
}

export const MemeEditor: React.FC<MemeEditorProps> = ({ selectedTemplate }) => {
  const [image, setImage] = useState<string | null>(selectedTemplate);
  const [texts, setTexts] = useState<Array<{
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
  }>>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [language, setLanguage] = useState('english');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedTemplate) {
      setImage(selectedTemplate);
      // Generate AI captions for the template
      generateAICaptions(selectedTemplate);
    }
  }, [selectedTemplate]);

  const generateAICaptions = (imageUrl: string) => {
    // Mock AI caption generation
    const captions = [
      "When you realize it's Monday tomorrow",
      "That feeling when you find the perfect meme template",
      "Me trying to explain why I need this feature",
      "The face you make when the code actually works",
      "When someone asks if you're ready for the weekend"
    ];
    
    const randomCaption = captions[Math.floor(Math.random() * captions.length)];
    
    // Add default text elements
    const newTexts = [
      {
        id: 'top-text',
        text: randomCaption.split(' ').slice(0, 3).join(' ').toUpperCase(),
        x: 50,
        y: 20,
        fontSize: 32,
        color: '#ffffff',
        fontFamily: 'Impact',
        bold: true,
        italic: false,
        outline: true
      },
      {
        id: 'bottom-text',
        text: randomCaption.split(' ').slice(3).join(' ').toUpperCase(),
        x: 50,
        y: 80,
        fontSize: 32,
        color: '#ffffff',
        fontFamily: 'Impact',
        bold: true,
        italic: false,
        outline: true
      }
    ];
    
    setTexts(newTexts);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImage(imageUrl);
        generateAICaptions(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const addText = () => {
    const newText = {
      id: `text-${Date.now()}`,
      text: 'Double click to edit',
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'Arial',
      bold: false,
      italic: false,
      outline: true
    };
    setTexts([...texts, newText]);
    setSelectedText(newText.id);
  };

  const updateText = (id: string, updates: Partial<typeof texts[0]>) => {
    setTexts(texts.map(text => text.id === id ? { ...text, ...updates } : text));
  };

  const deleteText = (id: string) => {
    setTexts(texts.filter(text => text.id !== id));
    setSelectedText(null);
  };

  const downloadMeme = () => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx!.drawImage(img, 0, 0);
      
      // Draw texts
      texts.forEach(text => {
        ctx!.font = `${text.bold ? 'bold ' : ''}${text.italic ? 'italic ' : ''}${text.fontSize}px ${text.fontFamily}`;
        ctx!.fillStyle = text.color;
        ctx!.textAlign = 'center';
        
        const x = (text.x / 100) * canvas.width;
        const y = (text.y / 100) * canvas.height;
        
        if (text.outline) {
          ctx!.strokeStyle = '#000000';
          ctx!.lineWidth = 2;
          ctx!.strokeText(text.text, x, y);
        }
        
        ctx!.fillText(text.text, x, y);
      });
      
      // Download the image
      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = image;
  };

  const clearCanvas = () => {
    setImage(null);
    setTexts([]);
    setSelectedText(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Canvas Area */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Meme Editor</h2>
            <div className="flex items-center space-x-2">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="urdu">Urdu</option>
              </select>
            </div>
          </div>
          
          <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg min-h-[400px] flex items-center justify-center">
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Meme template" 
                  className="max-w-full max-h-[500px] object-contain rounded-lg"
                />
                {texts.map(text => (
                  <div
                    key={text.id}
                    className={`absolute cursor-pointer select-none transform -translate-x-1/2 -translate-y-1/2 ${
                      selectedText === text.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    style={{
                      left: `${text.x}%`,
                      top: `${text.y}%`,
                      fontSize: `${text.fontSize}px`,
                      color: text.color,
                      fontFamily: text.fontFamily,
                      fontWeight: text.bold ? 'bold' : 'normal',
                      fontStyle: text.italic ? 'italic' : 'normal',
                      textShadow: text.outline ? '2px 2px 0px #000000, -2px -2px 0px #000000, 2px -2px 0px #000000, -2px 2px 0px #000000' : 'none'
                    }}
                    onClick={() => setSelectedText(text.id)}
                    onDoubleClick={() => {
                      const newText = prompt('Edit text:', text.text);
                      if (newText !== null) {
                        updateText(text.id, { text: newText });
                      }
                    }}
                  >
                    {text.text}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">Upload an image or select a template</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upload Image
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
            
            <button
              onClick={addText}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Type className="h-4 w-4" />
              <span>Add Text</span>
            </button>
            
            <button
              onClick={downloadMeme}
              disabled={!image}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            
            <button
              onClick={() => setShowShareModal(true)}
              disabled={!image}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            
            <button
              onClick={clearCanvas}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Text Editor Panel */}
      <div className="lg:col-span-1">
        <TextEditor 
          selectedText={selectedText}
          texts={texts}
          onUpdateText={updateText}
          onDeleteText={deleteText}
          onSelectText={setSelectedText}
        />
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};