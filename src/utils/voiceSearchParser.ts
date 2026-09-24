import { ProductCategory, MetalType, JewelleryStyle } from '../types';

export interface VoiceParseResult {
  rawTranscript: string;
  category?: ProductCategory;
  categoryLabel?: string;
  metals: MetalType[];
  metalLabels: string[];
  styles: JewelleryStyle[];
  styleLabels: string[];
  maxPrice?: number;
  gender?: 'men' | 'women';
  cleanedQuery: string;
  displayTranscript: string;
  hasFiltersApplied: boolean;
  feedbackText: string;
}

// Category keyword mappings
interface CategoryRule {
  id: ProductCategory;
  label: string;
  keywords: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    id: 'rings',
    label: 'Rings & Bands (Angti)',
    keywords: [
      'rings', 'ring', 'angti', 'finger ring', 'finger rings', 
      'solitaire ring', 'solitaire rings', 'gold ring', 'gold rings', 
      'diamond ring', 'diamond rings', 'band', 'bands', 'wedding ring', 'wedding rings'
    ]
  },
  {
    id: 'necklaces',
    label: 'Necklaces & Chokers',
    keywords: [
      'necklace', 'necklaces', 'haar', 'choker', 'chokers', 'sitahaar', 
      'sita haar', 'chandan haar', 'hasli', 'hansuli', 'pendant', 
      'pendants', 'chain', 'chains', 'collar', 'locket'
    ]
  },
  {
    id: 'earrings',
    label: 'Earrings & Jhumkas',
    keywords: [
      'earrings', 'earring', 'jhumka', 'jhumkas', 'jhumko', 'kaner dul', 
      'dul', 'tops', 'studs', 'stud', 'pasha', 'bali', 'balis', 
      'drop earrings', 'danglers'
    ]
  },
  {
    id: 'bracelets',
    label: 'Bangles & Bracelets',
    keywords: [
      'bracelets', 'bracelet', 'bangles', 'bangle', 'bala', 'balas', 
      'churi', 'churis', 'kada', 'kadas', 'ratanchur', 'wristband'
    ]
  },
  {
    id: 'shakha',
    label: 'Shankha (Pure Conch Shell)',
    keywords: [
      'pure shankha', 'pure sakha', 'shakha', 'shankha', 'sankha', 
      'sakha', 'conch shell', 'conch bangles', 'shell bangles', 'white shankha'
    ]
  },
  {
    id: 'pola',
    label: 'Pola (Crimson Coral Red)',
    keywords: [
      'pola', 'pola bangles', 'coral pola', 'red pola', 'crimson pola', 
      'coral bangles', 'red bangles', 'chata pola', 'plain pola'
    ]
  },
  {
    id: 'gold-badhano',
    label: 'Gold Badhano (22K Solid Gold)',
    keywords: [
      'gold badhano', 'badhano shankha', 'badhano pola', 'shakha badhano', 
      'pola badhano', 'gold mounted', 'gold bound', 'gold wrap', 'gold edged',
      'gold covered'
    ]
  },
  {
    id: 'loha-badhano',
    label: 'Loha Badhano (Sacred Iron & Gold)',
    keywords: [
      'loha badhano', 'mukhi loha', 'protective loha', 'iron badhano', 
      'iron bangle', 'iron bangles', 'bengali loha', 'loha', 'iron'
    ]
  },
  {
    id: 'bridal-combos',
    label: 'Bridal Combos & Sets',
    keywords: [
      'bridal combos', 'bridal combo', 'bridal set', 'bridal sets', 
      'wedding combo', 'wedding set', 'marriage combo', 'biye set', 
      'bridal package', 'wedding collection', 'bridal hamper', 'subho bibaha combo'
    ]
  },
  {
    id: 'fine-collections',
    label: 'Fine Collections',
    keywords: [
      'fine collections', 'fine collection', 'luxury collection', 
      'haute joaillerie', 'fine jewellery', 'fine jewelry', 'signature collection'
    ]
  },
  {
    id: 'bespoke',
    label: 'Bespoke Atelier Craft',
    keywords: [
      'bespoke', 'custom', 'customized', 'custom made', 'made to order', 
      'personalized', 'tailored jewellery'
    ]
  }
];

// Metal keyword mappings
interface MetalRule {
  id: MetalType;
  label: string;
  keywords: string[];
}

const METAL_RULES: MetalRule[] = [
  {
    id: '22k-yellow-gold',
    label: '22K Solid Gold',
    keywords: [
      '22k gold', '22k yellow gold', '22 karat gold', '22kt gold', 
      'solid gold', 'yellow gold', 'gold', 'shona', 'sona', '22k'
    ]
  },
  {
    id: '18k-yellow-gold',
    label: '18K Gold',
    keywords: ['18k gold', '18k yellow gold', '18 karat gold', '18kt gold', '18k']
  },
  {
    id: '18k-white-gold',
    label: '18K White Gold',
    keywords: ['white gold', '18k white gold']
  },
  {
    id: '18k-rose-gold',
    label: '18K Rose Gold',
    keywords: ['rose gold', 'pink gold', '18k rose gold']
  },
  {
    id: '925-sterling-silver',
    label: '925 Sterling Silver',
    keywords: ['sterling silver', '925 silver', 'silver', 'rupa', 'chandi']
  },
  {
    id: 'platinum',
    label: 'Platinum',
    keywords: ['platinum']
  },
  {
    id: 'pure-conch-shell',
    label: 'Pure Conch Shell',
    keywords: ['pure conch', 'natural conch', 'conch shell', 'shankha shell']
  },
  {
    id: 'crimson-coral-acrylic',
    label: 'Crimson Coral Red',
    keywords: ['coral red', 'crimson coral', 'coral acrylic', 'red coral']
  },
  {
    id: 'iron-gold',
    label: 'Sacred Iron & Gold',
    keywords: ['iron and gold', 'iron gold', 'sacred iron', 'protective iron']
  }
];

// Style keyword mappings
interface StyleRule {
  id: JewelleryStyle;
  label: string;
  keywords: string[];
}

const STYLE_RULES: StyleRule[] = [
  {
    id: 'mukhi-design',
    label: 'Mukhi Motifs',
    keywords: ['mukhi', 'mayur mukhi', 'peacock face', 'makara mukhi', 'elephant mukhi', 'terminal heads']
  },
  {
    id: 'bridal-heritage',
    label: 'Bridal Heritage',
    keywords: ['bridal heritage', 'bridal', 'wedding style', 'biye', 'zamindari', 'subho bibaha']
  },
  {
    id: 'traditional-bengali',
    label: 'Traditional Bengali Classic',
    keywords: ['traditional', 'traditional bengali', 'classic bengali', 'ancestral']
  },
  {
    id: 'filigree-badhano',
    label: 'Filigree Craft',
    keywords: ['filigree', 'tarakasi', 'jali work', 'wire craft']
  },
  {
    id: 'daily-wear',
    label: 'Daily Wear Comfort',
    keywords: ['daily wear', 'everyday wear', 'casual', 'regular wear', 'lightweight', 'waterproof']
  },
  {
    id: 'minimalist',
    label: 'Minimalist & Sleek',
    keywords: ['minimalist', 'sleek', 'modern', 'simple']
  },
  {
    id: 'hand-carved',
    label: 'Hand-Carved',
    keywords: ['hand carved', 'hand-carved', 'chiseled', 'engraved']
  }
];

// Stop phrases to clean from conversational voice input
const STOP_PHRASES = [
  'can you please show me',
  'could you please show me',
  'can you show me',
  'could you show me',
  'please show me',
  'i want to see',
  'i want to buy',
  'i would like to see',
  'i would like to buy',
  'i am looking for',
  'show me all the',
  'show me the',
  'show me some',
  'show me',
  'let me see',
  'search for',
  'look for',
  'find me',
  'find',
  'display',
  'bring up',
  'open',
  'explore',
  'get me',
  'give me',
  'search',
  'please show',
  'browse',
  'show'
];

/**
 * Parses conversational voice search transcripts (e.g. "show me gold rings")
 * into structured categories, metal filters, style filters, price limits, and clean keywords.
 */
export function parseVoiceSearch(rawInput: string): VoiceParseResult {
  const original = rawInput.trim();
  let normalized = original.toLowerCase();

  // 1. Detect max price (e.g. "under 20000", "below 50,000", "less than 15000")
  let maxPrice: number | undefined;
  const priceRegex = /(?:under|below|less than|within|upto|up to)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)*)/i;
  const priceMatch = normalized.match(priceRegex);
  if (priceMatch && priceMatch[1]) {
    const rawVal = priceMatch[1].replace(/,/g, '');
    const parsedVal = parseInt(rawVal, 10);
    if (!isNaN(parsedVal) && parsedVal > 0) {
      maxPrice = parsedVal;
    }
  }

  // 2. Detect gender
  let gender: 'men' | 'women' | undefined;
  if (/\b(?:men|for men|groom|mens)\b/i.test(normalized)) {
    gender = 'men';
  } else if (/\b(?:women|for women|bride|bridal|womens|ladies)\b/i.test(normalized)) {
    gender = 'women';
  }

  // 3. Strip conversational stop phrases
  let workingText = normalized;
  for (const phrase of STOP_PHRASES) {
    if (workingText.startsWith(phrase)) {
      workingText = workingText.slice(phrase.length).trim();
      break;
    }
  }

  // 4. Also remove price clause from remaining text so it doesn't pollute product search
  if (priceMatch) {
    workingText = workingText.replace(priceMatch[0], '').trim();
  }

  // 5. Match Category (prioritize multi-word matches like "gold badhano", "bridal combo", "pure shankha")
  let matchedCategory: ProductCategory | undefined;
  let matchedCategoryLabel: string | undefined;
  let categoryKeywordMatched = '';

  // Flatten and sort all category keywords by length descending (longest phrase match first)
  const allCategoryEntries: { kw: string; id: ProductCategory; label: string }[] = [];
  CATEGORY_RULES.forEach(r => {
    r.keywords.forEach(kw => {
      allCategoryEntries.push({ kw, id: r.id, label: r.label });
    });
  });
  allCategoryEntries.sort((a, b) => b.kw.length - a.kw.length);

  for (const entry of allCategoryEntries) {
    const regex = new RegExp(`(^|\\s)${entry.kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'i');
    if (regex.test(workingText)) {
      matchedCategory = entry.id;
      matchedCategoryLabel = entry.label;
      categoryKeywordMatched = entry.kw;
      break;
    }
  }

  // 6. Match Metals
  const matchedMetals: MetalType[] = [];
  const matchedMetalLabels: string[] = [];
  const metalKeywordsMatched: string[] = [];

  // Sort metal rules with longest keywords first (e.g. "22k yellow gold" before "gold")
  const sortedMetals = [...METAL_RULES].sort((a, b) => {
    const maxA = Math.max(...a.keywords.map(k => k.length));
    const maxB = Math.max(...b.keywords.map(k => k.length));
    return maxB - maxA;
  });

  for (const rule of sortedMetals) {
    for (const kw of rule.keywords) {
      const regex = new RegExp(`(^|\\s)${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'i');
      if (regex.test(workingText)) {
        if (!matchedMetals.includes(rule.id)) {
          matchedMetals.push(rule.id);
          matchedMetalLabels.push(rule.label);
          metalKeywordsMatched.push(kw);
        }
        break;
      }
    }
  }

  // 7. Match Styles
  const matchedStyles: JewelleryStyle[] = [];
  const matchedStyleLabels: string[] = [];
  const styleKeywordsMatched: string[] = [];

  for (const rule of STYLE_RULES) {
    for (const kw of rule.keywords) {
      const regex = new RegExp(`(^|\\s)${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'i');
      if (regex.test(workingText)) {
        if (!matchedStyles.includes(rule.id)) {
          matchedStyles.push(rule.id);
          matchedStyleLabels.push(rule.label);
          styleKeywordsMatched.push(kw);
        }
        break;
      }
    }
  }

  // 8. Clean leftover keywords for `searchQuery`
  // We remove matched category/metal/style keywords, plus filler words ("for", "with", "and", "the", "a", "in")
  let residualQuery = workingText;

  // Remove matched keyword tokens from residual query
  const allMatched = [
    categoryKeywordMatched,
    ...metalKeywordsMatched,
    ...styleKeywordsMatched
  ].filter(Boolean);

  for (const match of allMatched) {
    const regex = new RegExp(`(^|\\s)${match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'gi');
    residualQuery = residualQuery.replace(regex, ' ').trim();
  }

  // Remove small conjunctions/prepositions
  residualQuery = residualQuery
    .replace(/\b(for|with|in|of|the|a|an|and|all|some|pair|pairs)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If user only searched category and metal (e.g. "show me gold rings"),
  // residualQuery becomes empty string so it doesn't choke product matching!
  // But if user said "show me peacock gold rings", residualQuery will be "peacock".

  // Determine feedback labels
  const detectedLabels: string[] = [];
  if (matchedCategoryLabel) {
    detectedLabels.push(matchedCategoryLabel);
  }
  if (matchedMetalLabels.length > 0) {
    detectedLabels.push(matchedMetalLabels.join(', '));
  }
  if (matchedStyleLabels.length > 0) {
    detectedLabels.push(matchedStyleLabels.join(', '));
  }
  if (maxPrice) {
    detectedLabels.push(`Under ₹${maxPrice.toLocaleString('en-IN')}`);
  }
  if (gender) {
    detectedLabels.push(gender === 'men' ? 'Men’s Collection' : 'Women’s Collection');
  }

  const hasFiltersApplied = Boolean(
    matchedCategory ||
    matchedMetals.length > 0 ||
    matchedStyles.length > 0 ||
    maxPrice !== undefined ||
    gender !== undefined
  );

  const feedbackText = hasFiltersApplied
    ? `Applied Filters: ${detectedLabels.join(' • ')}`
    : `Searching for: "${original}"`;

  return {
    rawTranscript: original,
    category: matchedCategory,
    categoryLabel: matchedCategoryLabel,
    metals: matchedMetals,
    metalLabels: matchedMetalLabels,
    styles: matchedStyles,
    styleLabels: matchedStyleLabels,
    maxPrice,
    gender,
    cleanedQuery: residualQuery,
    displayTranscript: original,
    hasFiltersApplied,
    feedbackText
  };
}
