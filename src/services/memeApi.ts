// Imgflip API service for fetching real meme templates
export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

export interface ImgflipResponse {
  success: boolean;
  data: {
    memes: MemeTemplate[];
  };
}

// Cache for meme templates
let cachedTemplates: MemeTemplate[] | null = null;

export const fetchMemeTemplates = async (): Promise<MemeTemplate[]> => {
  // Return cached templates if available
  if (cachedTemplates) {
    return cachedTemplates;
  }

  try {
    const response = await fetch('https://api.imgflip.com/get_memes');
    const data: ImgflipResponse = await response.json();
    
    if (data.success) {
      cachedTemplates = data.data.memes;
      return data.data.memes;
    } else {
      throw new Error('Failed to fetch memes from Imgflip API');
    }
  } catch (error) {
    console.error('Error fetching meme templates:', error);
    
    // Fallback to popular meme templates if API fails
    return getFallbackTemplates();
  }
};

// Fallback templates with real meme URLs (popular memes that are widely available)
const getFallbackTemplates = (): MemeTemplate[] => {
  return [
    {
      id: 'drake',
      name: 'Drake Pointing',
      url: 'https://i.imgflip.com/30b1gx.jpg',
      width: 1200,
      height: 1200,
      box_count: 2
    },
    {
      id: 'distracted_boyfriend',
      name: 'Distracted Boyfriend',
      url: 'https://i.imgflip.com/1ur9b0.jpg',
      width: 1200,
      height: 800,
      box_count: 3
    },
    {
      id: 'woman_yelling_cat',
      name: 'Woman Yelling at Cat',
      url: 'https://i.imgflip.com/345v97.jpg',
      width: 1000,
      height: 563,
      box_count: 2
    },
    {
      id: 'expanding_brain',
      name: 'Expanding Brain',
      url: 'https://i.imgflip.com/1jwhww.jpg',
      width: 857,
      height: 1202,
      box_count: 4
    },
    {
      id: 'this_is_fine',
      name: 'This is Fine',
      url: 'https://i.imgflip.com/26am.jpg',
      width: 580,
      height: 282,
      box_count: 2
    },
    {
      id: 'mocking_spongebob',
      name: 'Mocking SpongeBob',
      url: 'https://i.imgflip.com/1otk96.jpg',
      width: 502,
      height: 353,
      box_count: 1
    },
    {
      id: 'change_my_mind',
      name: 'Change My Mind',
      url: 'https://i.imgflip.com/24y43o.jpg',
      width: 482,
      height: 361,
      box_count: 1
    },
    {
      id: 'two_buttons',
      name: 'Two Buttons',
      url: 'https://i.imgflip.com/1g8my4.jpg',
      width: 600,
      height: 908,
      box_count: 3
    },
    {
      id: 'success_kid',
      name: 'Success Kid',
      url: 'https://i.imgflip.com/1bhk.jpg',
      width: 500,
      height: 500,
      box_count: 2
    },
    {
      id: 'hide_pain_harold',
      name: 'Hide the Pain Harold',
      url: 'https://i.imgflip.com/gk5el.jpg',
      width: 480,
      height: 601,
      box_count: 2
    },
    {
      id: 'pikachu_surprised',
      name: 'Surprised Pikachu',
      url: 'https://i.imgflip.com/2kbn1e.jpg',
      width: 1893,
      height: 1893,
      box_count: 1
    },
    {
      id: 'roll_safe',
      name: 'Roll Safe Think About It',
      url: 'https://i.imgflip.com/1h7in3.jpg',
      width: 702,
      height: 395,
      box_count: 1
    },
    {
      id: 'disaster_girl',
      name: 'Disaster Girl',
      url: 'https://i.imgflip.com/23ls.jpg',
      width: 500,
      height: 375,
      box_count: 2
    },
    {
      id: 'evil_kermit',
      name: 'But Thats None of My Business',
      url: 'https://i.imgflip.com/16iyn1.jpg',
      width: 600,
      height: 600,
      box_count: 2
    },
    {
      id: 'first_world_problems',
      name: 'First World Problems',
      url: 'https://i.imgflip.com/1bhf.jpg',
      width: 552,
      height: 414,
      box_count: 2
    },
    {
      id: 'ancient_aliens',
      name: 'Ancient Aliens',
      url: 'https://i.imgflip.com/26am.jpg',
      width: 500,
      height: 333,
      box_count: 1
    },
    {
      id: 'bad_luck_brian',
      name: 'Bad Luck Brian',
      url: 'https://i.imgflip.com/1bip.jpg',
      width: 475,
      height: 562,
      box_count: 2
    },
    {
      id: 'philosoraptor',
      name: 'Philosoraptor',
      url: 'https://i.imgflip.com/1bgs.jpg',
      width: 500,
      height: 500,
      box_count: 2
    },
    {
      id: 'one_does_not_simply',
      name: 'One Does Not Simply',
      url: 'https://i.imgflip.com/1bij.jpg',
      width: 568,
      height: 335,
      box_count: 2
    },
    {
      id: 'grumpy_cat',
      name: 'Grumpy Cat',
      url: 'https://i.imgflip.com/30b1gx.jpg',
      width: 500,
      height: 617,
      box_count: 2
    }
  ];
};

// Categorize memes
export const categorizeMemes = (memes: MemeTemplate[]) => {
  const categories = {
    funny: ['Drake Pointing', 'Mocking SpongeBob', 'Roll Safe Think About It', 'Surprised Pikachu'],
    reaction: ['Woman Yelling at Cat', 'Hide the Pain Harold', 'Disaster Girl', 'Grumpy Cat'],
    wholesome: ['Success Kid', 'But Thats None of My Business'],
    dark: ['This is Fine', 'Bad Luck Brian'],
    philosophical: ['Expanding Brain', 'Philosoraptor', 'Ancient Aliens'],
    relatable: ['Distracted Boyfriend', 'Two Buttons', 'First World Problems', 'Change My Mind'],
    classic: ['One Does Not Simply', 'All The Things']
  };

  const categorizedMemes: { [key: string]: MemeTemplate[] } = {
    all: memes,
    funny: [],
    reaction: [],
    wholesome: [],
    dark: [],
    philosophical: [],
    relatable: [],
    classic: []
  };

  memes.forEach(meme => {
    Object.entries(categories).forEach(([category, names]) => {
      if (names.some(name => meme.name.includes(name))) {
        categorizedMemes[category].push(meme);
      }
    });
  });

  return categorizedMemes;
};

// Search memes by name
export const searchMemes = (memes: MemeTemplate[], query: string): MemeTemplate[] => {
  if (!query.trim()) return memes;
  
  const lowercaseQuery = query.toLowerCase();
  return memes.filter(meme => 
    meme.name.toLowerCase().includes(lowercaseQuery)
  );
};