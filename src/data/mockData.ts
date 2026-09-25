import { Product, InstagramPost, BlogPost, UserProfile } from '../types';

const imgSakhaPolaStack = '/src/assets/images/sakha_pola_stack_1790248952333.jpg';
const imgGoldBadhanoPola = '/src/assets/images/gold_badhano_pola_1790248970104.jpg';
const imgMayurMukhiShankha = '/src/assets/images/mayur_mukhi_shankha_1790248994760.jpg';
const imgLohaBadhanoGold = '/src/assets/images/loha_badhano_gold_1790249014501.jpg';
const imgBengaliBridalWrist = '/src/assets/images/bengali_bridal_wrist_1790249031176.jpg';
const imgShankhaPolaSet = '/src/assets/images/shankha_pola_set_1790249048447.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sp-001',
    name: 'Mayur Mukhi Hand-Carved Shankha (Pair)',
    subtitle: '100% Pure Natural Conch Shell with Peacock Face Carving',
    price: 1899,
    originalPrice: 2499,
    category: 'shakha',
    metal: 'pure-conch-shell',
    metalName: 'Natural Grade-A Conch Shell',
    style: 'mukhi-design',
    styleName: 'Mayur Mukhi Traditional',
    images: [
      imgMayurMukhiShankha,
      imgSakhaPolaStack,
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Authentic pair of pristine white conch shell bangles meticulously hand-carved by master Bengali shankhari artisans. Features the sacred peacock (Mayur) face motif with feather plumage etchings, signifying grace, marital harmony, and auspicious longevity.',
    story: 'Sourced from the deep waters of the Bay of Bengal, each conch shell is sliced with diamond-grit saws and carved using age-old ancestral chisels in Nabadwip. Every curve respects the natural growth spiral of the shell.',
    features: [
      '100% Genuine Natural Conch Shell (Turbinella Pyrum)',
      'Hand-carved Mayur Mukhi (peacock head) terminal design',
      'Smooth inner comfort-fit bevel to protect delicate wrists',
      'Lifetime authentic conch sound & natural luminescence guarantee'
    ],
    dimensions: 'Band width: 8.5mm | Wall thickness: 3.2mm',
    karatPurity: '100% Genuine Certified Natural Conch Shell',
    origin: 'Hand-carved in Nabadwip & Bishnupur, West Bengal',
    inStock: true,
    stockCount: 28,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewsCount: 64,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: 'Pure White Conch Shell', type: 'pure-conch-shell', colorHex: '#FDFBF7' }
    ],
    reviews: [
      {
        id: 'rev-sp-1',
        author: 'Debolina Banerjee',
        location: 'Kolkata, West Bengal',
        rating: 5,
        date: 'September 02, 2026',
        title: 'Breathtaking peacock detailing & perfect fit',
        comment: 'The Mayur Mukhi carving is sharp, detailed and so elegant. Being genuine conch shell, it has that beautiful cool feel on the wrist and resonates so sweetly.',
        verified: true,
        itemPurchased: 'Mayur Mukhi Shankha (Pair) - Size 2.4',
        helpfulCount: 22
      },
      {
        id: 'rev-sp-2',
        author: 'Poulomi Sen',
        location: 'Bengaluru, Karnataka',
        rating: 5,
        date: 'August 24, 2026',
        title: 'Authentic Bengali craftsmanship delivered fast',
        comment: 'Living outside Bengal it is hard to find genuine high-grade shankha. The sizing 2.6 fits like a dream and does not bite the wrist at all.',
        verified: true,
        itemPurchased: 'Mayur Mukhi Shankha (Pair) - Size 2.6',
        helpfulCount: 14
      }
    ]
  },
  {
    id: 'sp-002',
    name: 'Raktim Premium Glossy Pola (Pair)',
    subtitle: 'Classic Vermilion Crimson Red Daily Wear Pola Bangles',
    price: 699,
    originalPrice: 999,
    category: 'pola',
    metal: 'crimson-coral-acrylic',
    metalName: 'High-Density Crimson Pola',
    style: 'daily-wear',
    styleName: 'Classic Daily Comfort',
    images: [
      imgGoldBadhanoPola,
      imgSakhaPolaStack,
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'The definitive traditional crimson red pola pair, polished to a glass-like luster. Engineered with high-density break-resistant material, rounded comfort inner walls, and unfading vermilion color for daily household and festive wear.',
    story: 'Pola is the sacred emblem of Bengali bridal marital bliss. Crafted using high-purity coral acrylic polymer that resists water, turmeric, and soaps without losing its mirror-gloss finish.',
    features: [
      'Deep unfading vermilion coral red tone',
      'Seamless rounded inner edge for round-the-clock comfort',
      'Waterproof, sweat-proof, and tarnish-free formulation',
      'Auspicious daily blessing pair for married women'
    ],
    dimensions: 'Band width: 6.8mm | Thickness: 2.8mm',
    karatPurity: 'High-Purity Traditional Coral-Tone Resin',
    origin: 'Bowbazar Craft Guild, Kolkata',
    inStock: true,
    stockCount: 45,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 88,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: 'Glossy Vermilion Red', type: 'crimson-coral-acrylic', colorHex: '#C01A27' }
    ],
    reviews: [
      {
        id: 'rev-sp-3',
        author: 'Ananya Chatterjee',
        location: 'Siliguri, West Bengal',
        rating: 5,
        date: 'August 18, 2026',
        title: 'Sturdy, lightweight and very radiant red',
        comment: 'I wear these daily while doing kitchen chores and work. The color stays bright crimson without dulling or scratching easily.',
        verified: true,
        itemPurchased: 'Raktim Glossy Pola (Pair) - Size 2.4',
        helpfulCount: 19
      }
    ]
  },
  {
    id: 'sp-003',
    name: '22K Hallmarked Gold Borkhi Badhano Pola (Pair)',
    subtitle: 'Solid 22K (916) Gold Diamond-Leaf Wire Work Bound Red Pola',
    price: 19800,
    originalPrice: 22500,
    category: 'gold-badhano',
    metal: '22k-yellow-gold',
    metalName: '22K BIS Hallmarked Solid Gold',
    style: 'filigree-badhano',
    styleName: 'Borkhi Diamond Wire Work',
    images: [
      imgGoldBadhanoPola,
      imgSakhaPolaStack,
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Masterpiece Bengali bridal jewellery. Lustrous vermilion red pola bangles bound in pure 22K (916) BIS hallmarked yellow gold wire, handcrafted in the traditional geometric borkhi (rhombus diamond-cut) pattern with reinforced gold locks.',
    story: 'Gold badhano is a time-honored tradition where fine goldsmiths hand-draw gold wire through diminishing steel dies, shaping each filigree diamond leaf around the curvature of the pola with pinpoint heat welding.',
    features: [
      'Approx 4.80 grams net 22K BIS Hallmarked Solid Gold',
      'Laser engraved with official Government BIS Hallmark & HUID',
      'Reinforced internal anchoring to prevent wire lifting',
      'Comes with official gold purity certificate and valuation report'
    ],
    dimensions: 'Band width: 7.5mm | Gold thickness: 1.8mm',
    karatPurity: '22K (916/1000 BIS Hallmarked Gold)',
    weightGrams: '4.80g Net Gold Weight',
    origin: 'Handcrafted in Bowbazar, Kolkata',
    inStock: true,
    stockCount: 12,
    isBestSeller: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 43,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: '22K Solid Yellow Gold', type: '22k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: [
      {
        id: 'rev-sp-4',
        author: 'Sreemoyee Dasgupta',
        location: 'Kolkata, West Bengal',
        rating: 5,
        date: 'August 30, 2026',
        title: 'Heirloom quality gold badhano for my wedding',
        comment: 'Ordered this for my wedding reception. The gold wire finish is flawless, tested at my family jeweller and 22K hallmarking was 100% verified. Pure elegance!',
        verified: true,
        itemPurchased: '22K Gold Borkhi Badhano Pola - Size 2.6',
        helpfulCount: 31
      }
    ]
  },
  {
    id: 'sp-004',
    name: '22K Gold Crown Badhano Shankha (Pair)',
    subtitle: 'Four-Corner Embossed 22K Gold Filigree Caps on Pure Conch Shell',
    price: 26500,
    originalPrice: 29900,
    category: 'gold-badhano',
    metal: '22k-yellow-gold',
    metalName: '22K Gold & Pure Natural Conch',
    style: 'filigree-badhano',
    styleName: 'Royal Crown Badhano',
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611591475155-4284ec9c0e7f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Regal bridal Shankha bangles crowned with four hand-chased 22K solid gold embossed caps on each bangle. The contrast of brilliant white sea conch shell against glowing 22K gold represents pure marital nobility.',
    story: 'Each conch shell is hand-selected for density, uniform thickness, and clean white resonance before being fitted with custom-measured 22K gold corner crowns welded with flush safety rivets.',
    features: [
      'Approx 6.20 grams net 22K BIS Hallmarked Solid Gold',
      'Four hand-chased lotus petal gold crowns per bangle',
      'Natural white conch shell base with high-luster finish',
      'Individually inspected and stamped with BIS 916 mark'
    ],
    dimensions: 'Band width: 9.2mm | Gold crown height: 12mm',
    karatPurity: '22K (916 BIS Gold - 6.20g Net)',
    weightGrams: '6.20g Net Gold Weight',
    origin: 'Nabadwip & Bowbazar Goldsmith Guild',
    inStock: true,
    stockCount: 8,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 37,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: '22K Solid Gold & White Conch', type: '22k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: [
      {
        id: 'rev-sp-5',
        author: 'Riya Mukherjee',
        location: 'Mumbai, Maharashtra',
        rating: 5,
        date: 'July 19, 2026',
        title: 'Royal look, feels so sacred and gorgeous',
        comment: 'The gold crowns are firm and securely riveted into the shankha. Absolutely regal on the wedding day and pairs magically with red Benarasi.',
        verified: true,
        itemPurchased: '22K Gold Crown Badhano Shankha - Size 2.4',
        helpfulCount: 27
      }
    ]
  },
  {
    id: 'sp-005',
    name: 'Royal Makara Mukhi 22K Gold Loha Badhano',
    subtitle: 'Sacred Iron Core Encased in Hand-Engraved 22K Yellow Gold',
    price: 14200,
    originalPrice: 16500,
    category: 'loha-badhano',
    metal: 'iron-gold',
    metalName: '22K Gold & Sacred Iron Core',
    style: 'mukhi-design',
    styleName: 'Makara Mukhi Heritage',
    images: [
      imgLohaBadhanoGold,
      imgBengaliBridalWrist,
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'The sacred Bengali Loha (iron bangle), an indispensable protector for married women, masterfully encased in 22K hallmarked gold. Featuring dual mythical Makara (sea creature) terminal heads with ruby crystal accents.',
    story: 'In Bengali tradition, the groom slips the Loha onto the bride’s left wrist as a shield of health and prosperity. We preserve the sacred pure iron core while wrapping it in warm 22K gold for lifetime beauty.',
    features: [
      'Approx 3.50 grams 22K Solid Gold casing with iron core',
      'Auspicious Makara Mukhi terminals symbolizing resilience and good fortune',
      'Curved comfort ergonomics designed for non-stop daily wear',
      'BIS Hallmarked 916 gold guarantee'
    ],
    dimensions: 'Wire thickness: 3.8mm | Terminal breadth: 6.5mm',
    karatPurity: '22K BIS Hallmarked Gold (3.50g) + Iron Core',
    weightGrams: '3.50g Gold + Sacred Iron Core',
    origin: 'Artisanal Gold Quarter, Kolkata',
    inStock: true,
    stockCount: 15,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 52,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: '22K Gold with Iron Core', type: 'iron-gold', colorHex: '#D4AF37' }
    ],
    reviews: [
      {
        id: 'rev-sp-6',
        author: 'Soumita Ghosh',
        location: 'Delhi NCR',
        rating: 5,
        date: 'August 11, 2026',
        title: 'Perfect weight and meaningful traditional piece',
        comment: 'Very solid and heavy feeling. The Makara face is exquisitely sculpted without sharp edges that catch onto dupattas.',
        verified: true,
        itemPurchased: 'Royal Makara Mukhi Loha Badhano - Size 2.6',
        helpfulCount: 18
      }
    ]
  },
  {
    id: 'sp-006',
    name: 'Sampurna Bengali Bou Bridal Set (Shakha + Pola + Loha)',
    subtitle: 'Complete 5-Piece Ceremonial Bridal Ensemble in Keepsake Trunk',
    price: 48900,
    originalPrice: 56000,
    category: 'bridal-combos',
    metal: '22k-yellow-gold',
    metalName: '22K Gold, Pure Shankha & Loha',
    style: 'bridal-heritage',
    styleName: 'Sampurna Bridal Heirloom',
    images: [
      imgBengaliBridalWrist,
      imgShankhaPolaSet,
      imgSakhaPolaStack,
      imgGoldBadhanoPola
    ],
    description: 'The ultimate royal Bengali bridal heirloom set. Includes 1 Pair 22K Gold Crown Badhano Shankha, 1 Pair 22K Gold Borkhi Badhano Pola, and 1 Piece 22K Gold Makara Loha Badhano, packed in a red Banarasi silk bridal box.',
    story: 'Created for the modern bride who treasures generational sanctity. Every element of this 5-piece bridal suite is coordinated for uniform bangle sizing, gold color match, and aesthetic harmony on the wedding altar.',
    features: [
      'Complete 5-piece suite: 2 Shankha + 2 Pola + 1 Loha Badhano',
      'Approx 14.50 grams total 22K BIS Hallmarked Solid Gold',
      'Presented in a red velvet and brocade bridal memory trunk',
      'Complimentary pure vermilion sindoor pot & conch cleansing oil',
      'Free insured express air delivery with security seal'
    ],
    dimensions: 'Uniform bridal matching across size selection',
    karatPurity: '22K (916 BIS Gold - 14.50g Total Gold)',
    weightGrams: '14.50g Net Gold Total',
    origin: 'Heritage Master Atelier, Kolkata',
    inStock: true,
    stockCount: 2,
    isBestSeller: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 29,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: '22K Gold & Natural Bridal Suite', type: '22k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: [
      {
        id: 'rev-sp-7',
        author: 'Barnali Roychowdhury',
        location: 'London, UK',
        rating: 5,
        date: 'September 05, 2026',
        title: 'Exceeded all expectations for my London wedding',
        comment: 'Ordered this for my daughter’s wedding in the UK. The packaging is magnificent, the conch shell is snowy white and the gold work is stunning. Everyone at the reception was asking where we bought it.',
        verified: true,
        itemPurchased: 'Sampurna Bengali Bou Bridal Set - Size 2.4',
        helpfulCount: 45
      }
    ]
  },
  {
    id: 'sp-007',
    name: 'Shankholipi Floral Jaal Carved Shankha (Pair)',
    subtitle: 'Intricate All-Over Openwork Floral Vines in Natural White Conch',
    price: 2250,
    originalPrice: 2800,
    category: 'shakha',
    metal: 'pure-conch-shell',
    metalName: '100% Grade-A Sea Conch Shell',
    style: 'hand-carved',
    styleName: 'Floral Jaal Engraving',
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611591475155-4284ec9c0e7f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'An ethereal expression of Bengali folk art. Continuous floral jaal (netting) and vine scrollwork hand-engraved into thick-walled conch shell by master artisans, letting skin tones peek through delicately.',
    story: 'Taking over 8 hours of patient hand carving per bangle, the artisan uses micro-chisels to hollow out delicate floral perforations without compromising the structural hoop strength of the shell.',
    features: [
      'Intricate openwork floral jaal cutwork',
      'Thick-walled shell selected to withstand daily movement',
      'Natural porcelain-like white luster with smooth buffed edges',
      'Hypoallergenic, cool against the skin during hot weather'
    ],
    dimensions: 'Band width: 9.8mm | Wall thickness: 3.4mm',
    karatPurity: '100% Natural Organic Marine Conch Shell',
    origin: 'Bishnupur Artisanal Cluster, West Bengal',
    inStock: true,
    stockCount: 20,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 31,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: 'Natural White Conch Shell', type: 'pure-conch-shell', colorHex: '#FDFBF7' }
    ],
    reviews: []
  },
  {
    id: 'sp-008',
    name: 'Mayur Mukhi 22K Gold Cap Pola (Pair)',
    subtitle: 'Sculpted 22K Gold Peacock Heads Meeting on Crimson Pola',
    price: 21900,
    originalPrice: 24500,
    category: 'gold-badhano',
    metal: '22k-yellow-gold',
    metalName: '22K Gold on Vermilion Base',
    style: 'mukhi-design',
    styleName: 'Mayur Mukhi Royal Caps',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'A regal twist on the traditional pola. Sculpted 22K yellow gold peacock heads meet face-to-face at the top apex with emerald stone eyes, transitioning into micro-filigree gold wire wrapping along the red body.',
    story: 'The peacock represents sacred royalty in Vedic iconography. Hand-cast and hand-finished in Bowbazar with high-temperature precision solder.',
    features: [
      'Approx 5.10 grams 22K BIS Hallmarked Solid Gold',
      'Dual sculpted Mayur Mukhi terminal caps with gemstone accents',
      'Rich vermilion coral base that will not peel or fade',
      'Sturdy tension fit for secure daily wear'
    ],
    dimensions: 'Band width: 7.2mm | Peacock crest: 11mm',
    karatPurity: '22K (916 BIS Gold - 5.10g Net)',
    weightGrams: '5.10g Net Gold Weight',
    origin: 'Bowbazar Gold Atelier, Kolkata',
    inStock: true,
    stockCount: 11,
    isActive: false,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 39,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: '22K Gold on Crimson Red', type: '22k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: []
  },
  {
    id: 'sp-009',
    name: 'Kalka Embossed Textured Pola (Pair)',
    subtitle: 'Classic Paisley Motif Rich Vermilion Daily Wear Bangles',
    price: 799,
    originalPrice: 1199,
    category: 'pola',
    metal: 'crimson-coral-acrylic',
    metalName: 'Textured Red Coral Acrylic',
    style: 'traditional-bengali',
    styleName: 'Traditional Kalka Relief',
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Features a raised relief of traditional Bengali kalka (paisley) and leafy geometric borders encircling the bangle. Provides an ornate designer appearance while remaining lightweight and effortless for daily routines.',
    story: 'Inspired by traditional Nakshi Kantha textiles of Bengal, this pattern brings antique bridal tapestry motifs to everyday wrist adornment.',
    features: [
      'Embossed non-slip tactile kalka relief pattern',
      'Deep scarlet red coral hue that retains gloss after wash',
      'Gentle internal radius for painless slip-on application',
      'Anti-breakage reinforced acrylic matrix'
    ],
    dimensions: 'Band width: 7.0mm | Wall thickness: 3.0mm',
    karatPurity: 'High-Strength Coral-Tone Polymer',
    origin: 'Kolkata Artisanal Guild',
    inStock: true,
    stockCount: 50,
    rating: 4.7,
    reviewsCount: 61,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: 'Embossed Vermilion Red', type: 'crimson-coral-acrylic', colorHex: '#C01A27' }
    ],
    reviews: []
  },
  {
    id: 'sp-010',
    name: 'Chata Pola Broad Bengali Bangle (Pair)',
    subtitle: '14mm Broad Statement Red Pola with Antique Lattice Work',
    price: 1150,
    originalPrice: 1599,
    category: 'pola',
    metal: 'crimson-coral-acrylic',
    metalName: 'Heavy Gauge Crimson Pola',
    style: 'statement',
    styleName: 'Broad Chata Pola',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'A traditional broad 14mm royal Bengali bridal bangle pair known as "Chata Pola". Delivers unmistakable festive presence with hand-etched criss-cross lattice and diamond highlights.',
    story: 'Favored by Bengali aristocratic families (Zamindari gharana) during Durga Puja and wedding ceremonies, broad Chata Pola represents abundance and marital pride.',
    features: [
      'Broad 14mm dramatic wrist silhouette',
      'Precision lathe-cut faceted lattice etchings',
      'Featherlight hollow core engineering prevents wrist fatigue',
      'Pairs dramatically with broad gold bangles (bala)'
    ],
    dimensions: 'Band width: 14.0mm | Wall thickness: 3.5mm',
    karatPurity: 'Premium Heavy-Gauge Pola Acrylic',
    origin: 'Kolkata Artisanal Guild',
    inStock: false,
    stockCount: 0,
    rating: 4.9,
    reviewsCount: 41,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: 'Glossy Crimson Red', type: 'crimson-coral-acrylic', colorHex: '#B2182B' }
    ],
    reviews: []
  },
  {
    id: 'sp-011',
    name: 'Full Strip Ribbon 22K Gold Badhano Shankha (Pair)',
    subtitle: 'Continuous 360-Degree 22K Gold Mirror Ribbon Encasing White Conch Shell',
    price: 31500,
    originalPrice: 35000,
    category: 'gold-badhano',
    metal: '22k-yellow-gold',
    metalName: '22K Gold & Natural Conch Shell',
    style: 'filigree-badhano',
    styleName: 'Continuous Gold Ribbon Strip',
    images: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611591475155-4284ec9c0e7f?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'An unbroken, highly polished continuous 22K yellow gold ribbon encases the center circumference of genuine white conch shell bangles. Modern clean lines meet sacred Vedic matrimony.',
    story: 'Representing an unbroken cycle of marital affection, the continuous gold band requires immaculate metallurgical bending to adhere flush against the natural variations of genuine conch shell.',
    features: [
      'Approx 7.40 grams net 22K BIS Hallmarked Solid Gold',
      '360-degree seamless solid gold band casing',
      'Triple reinforced gold rivets with flush safety joints',
      'Comes with BIS Hallmark Certificate & Luxury Leatherette Box'
    ],
    dimensions: 'Band width: 10.2mm | Gold ribbon width: 5.5mm',
    karatPurity: '22K (916 BIS Gold - 7.40g Net)',
    weightGrams: '7.40g Net Gold Weight',
    origin: 'Bowbazar Gold Atelier, Kolkata',
    inStock: true,
    stockCount: 7,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 26,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: '22K Solid Gold & White Conch', type: '22k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: []
  },
  {
    id: 'sp-012',
    name: 'Floral Wire Sleek 22K Gold Loha Badhano',
    subtitle: 'Contemporary Minimalist 22K Gold Wrapped Sacred Iron Bangle',
    price: 9800,
    originalPrice: 11500,
    category: 'loha-badhano',
    metal: 'iron-gold',
    metalName: '22K Gold & Sacred Iron Wire',
    style: 'daily-wear',
    styleName: 'Modern Minimalist Loha',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Designed for the modern professional Bengali woman. A sleek 3.2mm round sacred iron core wound with a spiral of solid 22K gold wire and topped with a tiny embossed 6-petal gold floral crest.',
    story: 'Lightweight, ultra-durable, and snag-free—designed to slide easily underneath laptop sleeves, blazers, and saree pallus without catching or clinking.',
    features: [
      'Approx 2.10 grams 22K BIS Hallmarked Solid Gold wire & crest',
      'Sacred pure iron inner core for marital blessings',
      'Smooth micro-polished surface prevents friction against fabrics',
      'Official BIS 916 purity hallmark'
    ],
    dimensions: 'Core diameter: 3.2mm | Floral crest: 5.8mm',
    karatPurity: '22K BIS Hallmarked Gold (2.10g) + Iron Core',
    weightGrams: '2.10g Net Gold Weight',
    origin: 'Bengal Heritage Atelier',
    inStock: true,
    stockCount: 18,
    rating: 4.8,
    reviewsCount: 34,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: '22K Gold & Sacred Iron', type: 'iron-gold', colorHex: '#D4AF37' }
    ],
    reviews: []
  },
  {
    id: 'sp-013',
    name: 'Sleek Flat-Cut Daily Wear Shankha (Pair)',
    subtitle: 'Plain Polished Minimalist Conch Shell Bangles for Work & Home',
    price: 1299,
    originalPrice: 1699,
    category: 'shakha',
    metal: 'pure-conch-shell',
    metalName: '100% Pure Natural Conch Shell',
    style: 'daily-wear',
    styleName: 'Minimalist Plain Polished',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611591475155-4284ec9c0e7f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Clean, unembellished pure white conch shell bangles finished with a silky satin-smooth polish. Perfect for everyday wear, light cooking, and modern office styling.',
    story: 'Highlights the untouched purity of natural sea conch shell. Sliced evenly and buffed across seven grades of emery paper for maximum tactile gentleness.',
    features: [
      'Featherlight ergonomic profile for 24/7 wear',
      'Sleek flat-cut 6.5mm width',
      'Zero sharp points; will not snag delicate silks or lace',
      'Pure organic conch shell with cool healing energy'
    ],
    dimensions: 'Band width: 6.5mm | Wall thickness: 3.0mm',
    karatPurity: '100% Certified Natural Conch Shell',
    origin: 'Nabadwip Artisanal Guild, West Bengal',
    inStock: true,
    stockCount: 35,
    rating: 4.9,
    reviewsCount: 57,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: 'Pure Natural White Conch', type: 'pure-conch-shell', colorHex: '#FDFBF7' }
    ],
    reviews: []
  },
  {
    id: 'sp-014',
    name: 'Subho Bibaha Gold Badhano Bridal Hamper',
    subtitle: '22K Gold Crown Shankha & 22K Gold Borkhi Pola Luxury Gift Box',
    price: 42000,
    originalPrice: 48000,
    category: 'bridal-combos',
    metal: '22k-yellow-gold',
    metalName: '22K Gold, Pure Conch & Red Pola',
    style: 'bridal-heritage',
    styleName: 'Subho Bibaha Bridal Hamper',
    images: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611591475155-4284ec9c0e7f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'The definitive wedding gift for a Bengali bride. Pairs our best-selling 22K Gold Crown Badhano Shankha Pair with the matching 22K Gold Borkhi Badhano Pola Pair in an ornate crimson velvet gift trunk.',
    story: 'Prepared as an auspicious blessing package, this bridal hamper brings together the two most revered markers of Bengali womanhood with over 11 grams of certified 22K gold craft.',
    features: [
      '1 Pair 22K Gold Crown Shankha + 1 Pair 22K Gold Borkhi Pola',
      'Approx 11.00 grams total 22K BIS Hallmarked Solid Gold',
      'Includes authentic 10g 999 Silver Coin with Lakshmi Ganesh emblem',
      'Luxury velvet keepsake box with mirror and lock',
      'All-India insured express delivery with tamper-proof seal'
    ],
    dimensions: 'Customized matched pair sizes (2.2, 2.4, 2.6, 2.8, 2.10)',
    karatPurity: '22K (916 BIS Gold - 11.00g Total Gold)',
    weightGrams: '11.00g Net Gold Total',
    origin: 'Bowbazar Master Guild, Kolkata',
    inStock: true,
    stockCount: 9,
    isBestSeller: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 38,
    availableSizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    availableFinishes: [
      { name: '22K Solid Gold Bridal Suite', type: '22k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: []
  },
  {
    id: 'sp-015',
    name: 'Shyama 22K Gold Filigree Ring (Angti)',
    subtitle: 'Intricate Bengali Jali Filigree Craft with 916 BIS Hallmark',
    price: 18500,
    originalPrice: 21999,
    category: 'rings',
    metal: '22k-yellow-gold',
    metalName: '22K Solid Gold (916 BIS Hallmarked)',
    style: 'filigree-badhano',
    styleName: 'Bengali Jali Tarakasi',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611591475155-4284ec9c0e7f?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'An iconic Bengali statement ring (Angti) forged in certified 22K hallmarked gold. Showcases radiant floral filigree (Tarakasi) lace-work meticulously hand-woven by Bowbazar goldsmiths, radiating regal charm for weddings and festive occasions.',
    story: 'Bengali filigree has been celebrated across royal courts since the 17th century. Each gold wire is drawn thin as a thread, crimped, and soldered onto a gold petal frame.',
    features: [
      '100% Solid 22K Gold with Government-certified BIS Hallmark',
      'Intricate dome filigree floral lattice terminal',
      'Comfort-fit adjustable band fitting ring sizes 10 to 18',
      'Tamper-proof security blister pack with certification card'
    ],
    dimensions: 'Top diameter: 22mm | Band width: 3.5mm',
    karatPurity: '22K (916 Solid Gold - 3.85g)',
    weightGrams: '3.85g Net Gold',
    origin: 'Bowbazar Goldsmith Guild, Kolkata',
    inStock: true,
    stockCount: 16,
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.95,
    reviewsCount: 42,
    availableSizes: ['12', '14', '16', '18'],
    availableFinishes: [
      { name: '22K Solid Yellow Gold', type: '22k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: []
  },
  {
    id: 'sp-016',
    name: 'Royal Mayur Mukhi 22K Gold Ring',
    subtitle: 'Twin Peacock Terminal Design in 22K Solid Gold',
    price: 24500,
    originalPrice: 28000,
    category: 'rings',
    metal: '22k-yellow-gold',
    metalName: '22K Solid Gold (916 BIS Hallmarked)',
    style: 'mukhi-design',
    styleName: 'Mayur Mukhi Royal',
    images: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'A timeless heirloom ring adorned with dual sculpted peacock (Mayur) heads facing a central faceted synthetic ruby cabochon. Hand-engraved plumage lines bring auspicious splendour and royal grace.',
    story: 'Inspired by the royal courts of Murshidabad, the peacock motif represents eternal beauty, pride, and marital bliss in Bengali folklore.',
    features: [
      'Sculpted 3D Mayur Mukhi terminals with hand-chiseled feathers',
      '916 BIS Hallmarked 22K Gold purity guarantee',
      'High-polish mirror gold finish with micro-textured accents'
    ],
    dimensions: 'Crown width: 18mm | Band thickness: 2.8mm',
    karatPurity: '22K (916 Solid Gold - 5.10g)',
    weightGrams: '5.10g Net Gold',
    origin: 'Bowbazar Craft Guild, Kolkata',
    inStock: true,
    stockCount: 12,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 29,
    availableSizes: ['12', '14', '16', '18'],
    availableFinishes: [
      { name: '22K Solid Yellow Gold', type: '22k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: []
  },
  {
    id: 'sp-017',
    name: 'Subarna Chandan Haar 22K Gold Choker',
    subtitle: 'Solid 22K Gold Traditional Bengali Collar Choker',
    price: 85000,
    originalPrice: 96000,
    category: 'necklaces',
    metal: '22k-yellow-gold',
    metalName: '22K Solid Gold (916 BIS Hallmarked)',
    style: 'bridal-heritage',
    styleName: 'Zamindari Bridal Choker',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'An aristocrat bridal collar choker crafted in certified 22K hallmarked yellow gold. Alternating sandalwood leaf (Chandan Pata) motifs with delicate gold bead droplets.',
    story: 'Chandan Haar is an indispensable element of the traditional Saat Paake Ghora bridal attire, representing divine blessings and family legacy.',
    features: [
      'Pure 22K Solid Gold with BIS Hallmark stamping',
      'Adjustable pure silk zari dori cord fitting any neck circumference',
      'Weight: 17.50g Net Hallmarked Gold'
    ],
    dimensions: 'Width: 32mm | Length: 180mm plus adjustable dori',
    karatPurity: '22K (916 Solid Gold - 17.50g)',
    weightGrams: '17.50g Net Gold',
    origin: 'Bowbazar Craft Guild, Kolkata',
    inStock: true,
    stockCount: 5,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 19,
    availableSizes: ['Free Size (Adjustable Dori)'],
    availableFinishes: [
      { name: '22K Solid Yellow Gold', type: '22k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: []
  },
  {
    id: 'sp-018',
    name: 'Jhumka Mahal 22K Gold Kaner Dul',
    subtitle: 'Three-Tier Royal Bengali Gold Jhumka with Gold Hanging Droplets',
    price: 38000,
    originalPrice: 44000,
    category: 'earrings',
    metal: '22k-yellow-gold',
    metalName: '22K Solid Gold (916 BIS Hallmarked)',
    style: 'traditional-bengali',
    styleName: 'Royal Jhumka Heritage',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Majestic three-tier bell jhumkas in solid 22K gold. Features a floral sunburst stud top, filigree dome bells, and dancing gold pearl droplets that chime with every movement.',
    story: 'Classic Bengali wedding earrings made to pair harmoniously with shakha and pola during wedding rituals.',
    features: [
      'Full 22K BIS Hallmarked Solid Gold (8.20g Net)',
      'Comfort screw back closures for secure all-day wear',
      'Featherweight balanced hollow interior prevents earlobe strain'
    ],
    dimensions: 'Length: 48mm | Bell Diameter: 18mm',
    karatPurity: '22K (916 Solid Gold - 8.20g)',
    weightGrams: '8.20g Net Gold',
    origin: 'Bowbazar Craft Guild, Kolkata',
    inStock: true,
    stockCount: 8,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 34,
    availableSizes: ['Standard Pair'],
    availableFinishes: [
      { name: '22K Solid Yellow Gold', type: '22k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: []
  }
];

export const INSTAGRAM_FEED: InstagramPost[] = [
  {
    id: 'ig-01',
    username: 'debolina.banerjee',
    handle: '@debolina_b',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: imgSakhaPolaStack,
    caption: 'Pure white Mayur Mukhi Shankha and 22K gold-bound Pola stack on my wedding morning with traditional red alta. The conch feels so cool and pure on the wrist! #SakhaPola #BengaliBride #NaxtTo',
    likes: 2450,
    commentsCount: 68,
    timestamp: '2 hours ago',
    taggedProductIds: ['sp-001', 'sp-003'],
    location: 'Kolkata, West Bengal'
  },
  {
    id: 'ig-02',
    username: 'subhasree.weddings',
    handle: '@subhasree_weddings',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    image: imgGoldBadhanoPola,
    caption: 'Macro beauty: 22K BIS hallmarked solid gold Borkhi wire work meticulously wrapped around deep crimson Pola. Heirloom craftsmanship by Bowbazar goldsmiths. #GoldBadhano #Pola #22kGold',
    likes: 3820,
    commentsCount: 112,
    timestamp: '1 day ago',
    taggedProductIds: ['sp-003'],
    location: 'Bowbazar, Kolkata'
  },
  {
    id: 'ig-03',
    username: 'ananya.ghosh',
    handle: '@ananya_ghosh_',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: imgMayurMukhiShankha,
    caption: 'Authentic conch shell hand-carved in Nabadwip. The Mayur Mukhi peacock terminals and chiseled plumage have that sacred natural conch acoustic resonance. #PureShankha #NabadwipCraft',
    likes: 1940,
    commentsCount: 45,
    timestamp: '2 days ago',
    taggedProductIds: ['sp-001'],
    location: 'Nabadwip, West Bengal'
  },
  {
    id: 'ig-04',
    username: 'rituparna_roy',
    handle: '@rituparna_roy',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    image: imgLohaBadhanoGold,
    caption: 'Makara Mukhi 22K Gold Loha Badhano: Solid wrought iron encased in certified 22K gold with dual sea-dragon terminal heads. The timeless protective shield of Bengali married women. #LohaBadhano',
    likes: 4120,
    commentsCount: 129,
    timestamp: '4 days ago',
    taggedProductIds: ['sp-005'],
    location: 'Salt Lake, Kolkata'
  },
  {
    id: 'ig-05',
    username: 'poulomi_sen',
    handle: '@poulomi_sen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    image: imgBengaliBridalWrist,
    caption: 'Saat Paake Ghora ready! Stacked my NaxtTo Shakha, Pola, and 22K gold badhano bangles with my heirloom red Banarasi saree. Received endless compliments on the intricate carving! #BengaliBou #ShakhaPolaStack',
    likes: 2890,
    commentsCount: 73,
    timestamp: '5 days ago',
    taggedProductIds: ['sp-006', 'sp-001', 'sp-002'],
    location: 'Ballygunge, Kolkata'
  },
  {
    id: 'ig-06',
    username: 'madhumita_pal',
    handle: '@madhumita_pal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    image: imgShankhaPolaSet,
    caption: 'The complete Sampurna Bou bridal hamper arrived in a red silk trunk with brass vermilion thali. Certified BIS hallmarked 22K gold, genuine conch shell, and lustrous crimson pola. #AuspiciousBlessing #NaxtToAtelier',
    likes: 3100,
    commentsCount: 88,
    timestamp: '1 week ago',
    taggedProductIds: ['sp-006'],
    location: 'Burdwan, West Bengal'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-01',
    slug: 'sacred-symbolism-of-bengali-shakha-pola-loha',
    title: 'The Sacred Triad: Symbolism, Origin & Cultural Importance of Shakha, Pola & Loha',
    subtitle: 'Why the conch shell, crimson coral, and sacred iron define the soul of the Bengali bride.',
    excerpt: 'Explore the 1,500-year history of Bengali marital jewellery. How natural conch shell, coral-hued pola, and protective iron ward off negativity and symbolize enduring love.',
    category: 'Heritage & Rituals',
    readTime: '4 min read',
    publishedAt: 'September 10, 2026',
    coverImage: 'https://images.unsplash.com/photo-1611591475155-4284ec9c0e7f?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Dr. Sarmistha Sengupta',
      role: 'Professor of Cultural Anthropology & Folklore',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    tableOfContents: [
      { id: 'shakha-purity', title: '1. Shankha: The Sea Conch of Purity & Calm' },
      { id: 'pola-vitality', title: '2. Pola: The Vermilion Fire of Health & Passion' },
      { id: 'loha-strength', title: '3. Loha: The Iron Armor of Martial Protection' },
      { id: 'gold-badhano-tradition', title: '4. Gold Badhano: Aristocratic Heirlooms' }
    ],
    contentSections: [
      {
        heading: '1. Shankha: The Sea Conch of Purity & Calm',
        body: [
          'The Shankha (conch shell) is harvested from pristine sea reefs and has been worn in Bengal since the Pala empire. Symbolizing purity, mental composure, and the cosmic resonance of Om, it cools the bride’s pulse points and anchors emotional balance during the sacred ritual of Saat Paake Ghora.',
          'Authentic Shankha must be carved from genuine marine shell (Turbinella Pyrum), distinguishable by its natural porcelain luster and cooling resonance.'
        ],
        quote: 'Shakha and Pola are not mere adornments; they are the living breath of Vedic blessing, worn unbroken across generations of Bengali mothers and daughters.'
      },
      {
        heading: '2. Pola: The Vermilion Fire of Health & Passion',
        body: [
          'The radiant red Pola symbolizes Shakti, creative life energy, and fertility. Handcrafted in intense vermilion coral hues, it balances the pristine white of the Shankha to create the sacred red-and-white visual harmony synonymous with the Bengali bride.',
          'Daily wear Pola bangles are specifically engineered with rounded inner bevels to ensure comfort throughout domestic life, festive rituals, and professional careers.'
        ]
      },
      {
        heading: '3. Loha: The Iron Armor of Martial Protection',
        body: [
          'The Loha (iron bangle) is traditionally gifted by the mother-in-law on the wedding night. Iron represents grounding energy, strength against negative forces, and enduring longevity for the husband and household.',
          'In modern bespoke ateliers like NaxtTo, the sacred iron core is elegantly wrapped in solid 22K hallmarked gold with peacock or Makara terminals for timeless luxury.'
        ]
      },
      {
        heading: '4. Gold Badhano: Aristocratic Heirlooms',
        body: [
          'Gold Badhano (binding in gold) originated among the Zamindari and aristocratic households of Kolkata and Bowbazar. Goldsmiths shape 22K hallmarked gold filigree wire, embossed crowns, and delicate borkhi leaves around the shell, elevating everyday sacred bangles into certified family heirlooms.'
        ]
      }
    ],
    seoKeywords: ['sakha pola meaning', 'bengali bridal bangles', 'gold badhano pola', 'shakha pola gold design', 'loha badhano importance'],
    metaDescription: 'Discover the rich Vedic history, symbolism, and artisanal craftsmanship behind authentic Bengali Shakha, Pola, and Gold Badhano bangles at NaxtTo Atelier.',
    relatedProductIds: ['sp-001', 'sp-003', 'sp-005', 'sp-006']
  },
  {
    id: 'blog-02',
    slug: 'bengali-bangle-sizing-guide-sakha-pola',
    title: 'How to Measure Your Bangle Size for Sakha Pola: The Complete 2.2 to 2.10 Chart',
    subtitle: 'Step-by-step wrist circumference and inner diameter measurement guide for flawless fit.',
    excerpt: 'Ensure your handcrafted Shankha and Pola slide on effortlessly. Learn how to convert your hand span into standard Indian bangle sizes from 2.2 up to 2.10.',
    category: 'Sizing & Fit',
    readTime: '3 min read',
    publishedAt: 'September 04, 2026',
    coverImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Subhashish Karmakar',
      role: 'Master Craftsman & Sizing Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    tableOfContents: [
      { id: 'bangle-matrix', title: '1. Standard Indian Bangle Size Matrix' },
      { id: 'measuring-hand', title: '2. Measuring Your Hand Knuckle Span' },
      { id: 'shankha-fit-tips', title: '3. Why Shankha Requires a Snug Fit' }
    ],
    contentSections: [
      {
        heading: '1. Standard Indian Bangle Size Matrix',
        body: [
          'Unlike open-ended bracelets, traditional Shakha and Pola are closed hoops. Indian bangle sizing is expressed in inches and sixteenths: Size 2.2 (2-2/16" or 54.0mm inner diameter), Size 2.4 (2-4/16" or 57.2mm), Size 2.6 (2-6/16" or 60.3mm - most common), Size 2.8 (2-8/16" or 63.5mm), and Size 2.10 (2-10/16" or 66.7mm).',
          'Review your size against our detailed millimeter inner diameter table before selecting your pair.'
        ],
        quote: 'A well-fitted Shankha should glide past the thumb knuckle with slight soap water lubrication and rest weightlessly on the lower wrist.'
      },
      {
        heading: '2. Measuring Your Hand Knuckle Span',
        body: [
          'Bring your thumb and little finger together as if sliding on a bangle. Wrap a flexible string tightly around the widest part of your hand across the knuckles. Measure that length on a ruler to find your exact circumference.'
        ]
      }
    ],
    seoKeywords: ['sakha pola size guide', 'bengali bangle size 2.4 2.6', 'how to measure bangle size', 'indian bangle sizing chart'],
    metaDescription: 'Find your exact Indian bangle size for Shakha and Pola bangles using our inner diameter chart and knuckle measuring technique.',
    relatedProductIds: ['sp-001', 'sp-002', 'sp-004']
  },
  {
    id: 'blog-03',
    slug: 'caring-for-pure-conch-shell-and-gold-badhano',
    title: 'Caring for Natural Conch Shell & 22K Gold Badhano: Atelier Maintenance Secrets',
    subtitle: 'Preserve snowy white luster and prevent yellowing or wire loosening over decades.',
    excerpt: 'Authentic conch shell is a natural marine gem that breathes. Discover simple ancestral methods using pure mustard oil and mild cleansing to preserve your bridal heirlooms.',
    category: 'Care & Maintenance',
    readTime: '3 min read',
    publishedAt: 'August 28, 2026',
    coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Anindita Bose',
      role: 'Atelier Head of Quality & Restoration',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80'
    },
    tableOfContents: [
      { id: 'oil-massage', title: '1. Periodic Mustard / Coconut Oil Nourishment' },
      { id: 'avoiding-chemicals', title: '2. Keeping Away from Bleach & Harsh Acids' },
      { id: 'gold-wire-safety', title: '3. Protecting 22K Gold Filigree Wire' }
    ],
    contentSections: [
      {
        heading: '1. Periodic Mustard / Coconut Oil Nourishment',
        body: [
          'Natural conch shell is composed of calcium carbonate and micro-crystalline proteins. Once a month, apply two drops of pure mustard oil or coconut oil with a soft cotton pad over the carved Shankha. This seals natural hydration, repels turmeric stains, and enhances the porcelain-white glow.',
          'Let the oil absorb for 30 minutes, then gently wipe dry with a clean microfiber cloth.'
        ]
      },
      {
        heading: '2. Keeping Away from Bleach & Harsh Acids',
        body: [
          'Never use chlorine bleach, toilet cleaning acids, or abrasive scrub pads on pure conch shell or gold badhano. If turmeric stains occur, simple lukewarm water with mild baby soap will safely lift discoloration.'
        ]
      }
    ],
    seoKeywords: ['how to clean shankha', 'how to maintain gold badhano pola', 'cleaning conch shell bangles', 'sakha pola care tips'],
    metaDescription: 'Atelier secrets on cleaning and preserving 100% natural conch shell Shankha, 22K gold badhano wire, and vermilion Pola bangles.',
    relatedProductIds: ['sp-001', 'sp-003', 'sp-004']
  }
];

export const DEMO_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatar: undefined,
  isLoggedIn: false,
  memberTier: 'NaxtTo Circle',
  memberSince: '',
  savedAddresses: [],
  orderHistory: [],
  preferences: {
    metalPreferences: ['22K BIS Hallmarked Solid Gold', 'Pure Natural Conch Shell'],
    ringSize: '2.6 (Indian Bangle)',
    newsletterSubscribed: false
  }
};
