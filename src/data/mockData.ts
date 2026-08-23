import { Product, InstagramPost, BlogPost, UserProfile } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'naxtto-001',
    name: 'Aethel Continuous Band',
    subtitle: '18K Solid Gold Minimalist Sculptural Ring',
    price: 680,
    originalPrice: 750,
    category: 'rings',
    metal: '18k-yellow-gold',
    metalName: '18K Recycled Yellow Gold',
    style: 'minimalist',
    styleName: 'Minimalist Architecture',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'A seamless, hand-forged circular contour sculpted in mirror-polished 18k solid gold. Designed with comfort-fit geometry to be worn daily as an intimate modern totem.',
    story: 'Conceived at our Milanese partner atelier, the Aethel Band celebrates unbroken continuity. Every curve is hand-planished by third-generation goldsmiths using certified 100% recycled precious bullion.',
    features: [
      'Cast in 100% Certified Recycled 18K Solid Gold',
      'Comfort-fit domed interior profile',
      'Individual hallmarking stamp with serial number',
      'Hypoallergenic & lifetime tarnish-resistant warranty'
    ],
    dimensions: 'Band width: 3.8mm | Thickness: 1.9mm',
    karatPurity: '750/1000 (18K Fine Solid Gold)',
    origin: 'Hand-finished in Milan, Italy',
    inStock: true,
    stockCount: 14,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 38,
    availableSizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9'],
    availableFinishes: [
      { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' },
      { name: '18K White Gold', type: '18k-white-gold', colorHex: '#E5E4E2' },
      { name: '18K Rose Gold', type: '18k-rose-gold', colorHex: '#E0A899' }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Eleanor Vance',
        location: 'London, UK',
        rating: 5,
        date: 'August 12, 2026',
        title: 'Exquisite weight and pure craftsmanship',
        comment: 'The weight of solid gold feels substantial yet so gentle on the finger. The high-polish finish catches morning sunlight like nothing else I own.',
        verified: true,
        itemPurchased: 'Aethel Continuous Band - US 6 / 18K Yellow Gold',
        helpfulCount: 12
      },
      {
        id: 'rev-2',
        author: 'Soren Lindqvist',
        location: 'Stockholm, Sweden',
        rating: 5,
        date: 'July 28, 2026',
        title: 'Minimalist perfection for daily wear',
        comment: 'Never take it off. Works effortlessly when stacked with my heirloom signet or worn solo for clean architectural clarity.',
        verified: true,
        itemPurchased: 'Aethel Continuous Band - US 8 / 18K White Gold',
        helpfulCount: 8
      }
    ]
  },
  {
    id: 'naxtto-002',
    name: 'Luminary Pavé Solitaire Ring',
    subtitle: 'Brilliant Cut Lab-Grown Diamond in Floating 18K Bezel',
    price: 1450,
    category: 'rings',
    metal: '18k-yellow-gold',
    metalName: '18K Yellow Gold & VVS+ Diamond',
    style: 'bridal',
    styleName: 'Bridal & Ceremonial',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'An ethereal 0.85ct F/VVS1 brilliant diamond secured within our signature low-profile floating bezel setting, suspended on a micro-pavé whisper band.',
    story: 'Engineered for modern romance, the Luminary sits flush with companion wedding bands without requiring a notched ring silhouette.',
    features: [
      '0.85ct Certified Lab-Grown Diamond (F Color, VVS1 Clarity, Ideal Cut)',
      '14 micro-pavé round brilliant accent stones (0.16ctw)',
      'Low-profile protective bezel setting',
      'Includes IGI Gemological Certificate'
    ],
    dimensions: 'Bezel diameter: 6.2mm | Band width: 1.6mm',
    caratWeight: '1.01 ctw Total Weight',
    karatPurity: '18K Solid Gold (750 Fine)',
    origin: 'Antwerp & Milan Atelier',
    inStock: true,
    stockCount: 6,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 19,
    availableSizes: ['US 5', 'US 6', 'US 7', 'US 8'],
    availableFinishes: [
      { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' },
      { name: 'Platinum 950', type: 'platinum', colorHex: '#E5E4E2' },
      { name: '18K Rose Gold', type: '18k-rose-gold', colorHex: '#E0A899' }
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Camille Dubois',
        location: 'Paris, France',
        rating: 5,
        date: 'August 4, 2026',
        title: 'Breathtaking light refraction',
        comment: 'We chose this as an engagement ring. The floating bezel gives it a timeless, modern architectural feel without any snagging on delicate fabrics.',
        verified: true,
        itemPurchased: 'Luminary Pavé Solitaire - US 6',
        helpfulCount: 15
      }
    ]
  },
  {
    id: 'naxtto-003',
    name: 'Soleil Droplet Pendant Necklace',
    subtitle: 'Hand-Selected Natural Baroque Pearl & Gold Snake Chain',
    price: 520,
    originalPrice: 580,
    category: 'necklaces',
    metal: '18k-yellow-gold',
    metalName: '18K Gold Vermeil on Sterling Silver',
    style: 'everyday-luxe',
    styleName: 'Everyday Luxe',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611591475102-468ae701548e?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'An organic freshwater baroque pearl with soft champagne iridescence, suspended from a fluid 18k gold snake link chain.',
    story: 'No two organic pearls are identical. Each piece is hand-selected in the South Seas for singular luster, naturally contoured form, and creamy undertones.',
    features: [
      'Natural AAA Grade Organic Freshwater Baroque Pearl (~14-16mm)',
      '18K Thick Micro-Layered Gold Vermeil (3.0 microns)',
      'Liquid-smooth 45cm + 5cm extension herringbone chain',
      'Lobster claw clasp with engraved logo tag'
    ],
    dimensions: 'Pendant length: 22mm | Chain length: 45cm - 50cm adjustable',
    karatPurity: '18K Gold Vermeil over 925 Sterling Silver',
    origin: 'Crafted in Florence, Italy',
    inStock: true,
    stockCount: 22,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 44,
    availableSizes: ['Adjustable 45-50cm'],
    availableFinishes: [
      { name: '18K Gold Vermeil', type: 'gold-vermeil', colorHex: '#D4AF37' },
      { name: '925 Sterling Silver', type: '925-sterling-silver', colorHex: '#DCDCDC' }
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Aria Thorne',
        location: 'New York, NY',
        rating: 5,
        date: 'July 15, 2026',
        title: 'Such a conversation starter',
        comment: 'The pearl has this dreamy sculptural silhouette. It elevates an unbuttoned crisp white shirt instantly.',
        verified: true,
        itemPurchased: 'Soleil Droplet Pendant',
        helpfulCount: 9
      }
    ]
  },
  {
    id: 'naxtto-004',
    name: 'Aura Herringbone Collar',
    subtitle: 'Fluid 18K Solid Gold Woven Choker',
    price: 890,
    category: 'necklaces',
    metal: '18k-yellow-gold',
    metalName: '18K Solid Yellow Gold',
    style: 'statement',
    styleName: 'Statement Luxury',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611591475102-468ae701548e?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Precision interlocking gold chevron links that drape over the collarbone with liquid fluidity. Highly reflective satin-polish mirror surface.',
    story: 'Woven using classical Vicenza goldsmith techniques, this collar glides seamlessly against the skin like golden fabric.',
    features: [
      'Hand-assembled flexible herringbone links',
      'Custom concealed safety box clasp',
      'Reinforced anti-kink flex internal core',
      'Includes protective velvet travel case'
    ],
    dimensions: 'Length: 42cm | Width: 4.2mm',
    karatPurity: '18K Solid Gold (750 Hallmark)',
    origin: 'Vicenza, Italy',
    inStock: true,
    stockCount: 8,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 27,
    availableSizes: ['40cm Collar', '45cm Princess'],
    availableFinishes: [
      { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' },
      { name: '18K White Gold', type: '18k-white-gold', colorHex: '#E5E4E2' }
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Margot Laurent',
        location: 'Geneva, Switzerland',
        rating: 5,
        date: 'August 1, 2026',
        title: 'Golden silk around the neck',
        comment: 'Lays completely flat and has never kinked. The quality of the solid 18k gold is second to none.',
        verified: true,
        itemPurchased: 'Aura Herringbone Collar - 42cm',
        helpfulCount: 19
      }
    ]
  },
  {
    id: 'naxtto-005',
    name: 'Arcadia Sculpted Hoop Earrings',
    subtitle: 'Tapered Hollow-Cast 18K Gold Daily Hoops',
    price: 460,
    category: 'earrings',
    metal: '18k-yellow-gold',
    metalName: '18K Recycled Solid Gold',
    style: 'sculptural',
    styleName: 'Sculptural Art',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'An architectural crescent hoop with a featherlight hollow core. Designed for 24/7 all-day comfort without lobe fatigue.',
    story: 'Cast using advanced electroforming to achieve bold dimensional volume with an imperceptible, featherlight weight.',
    features: [
      'Ultra-lightweight ergonomic hollow geometry',
      'Secure click-latch post closure with audible lock',
      '100% Nickel-free and hypoallergenic',
      'Subtle brushed inner chamfer'
    ],
    dimensions: 'Diameter: 24mm | Outer thickness: 5.5mm',
    karatPurity: '18K Fine Solid Gold (750)',
    origin: 'Arezzo, Italy',
    inStock: true,
    stockCount: 18,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 31,
    availableSizes: ['Standard 24mm', 'Petite 18mm'],
    availableFinishes: [
      { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' },
      { name: '18K White Gold', type: '18k-white-gold', colorHex: '#E5E4E2' },
      { name: '925 Sterling Silver', type: '925-sterling-silver', colorHex: '#DCDCDC' }
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Isla Bennett',
        location: 'Melbourne, Australia',
        rating: 5,
        date: 'July 19, 2026',
        title: 'Literally weightless',
        comment: 'I can sleep in these. They give the bold chunky hoop aesthetic without any dragging. The snap clasp is very secure.',
        verified: true,
        itemPurchased: 'Arcadia Sculpted Hoops - 24mm',
        helpfulCount: 14
      }
    ]
  },
  {
    id: 'naxtto-006',
    name: 'Cygnus Diamond Studs',
    subtitle: '0.60ctw Lab Diamond Trillion Cut Studs in 3-Prong Platinum',
    price: 790,
    category: 'earrings',
    metal: 'platinum',
    metalName: 'Platinum 950 & Lab Diamonds',
    style: 'minimalist',
    styleName: 'Minimalist Fine',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Rare trillion-cut lab-grown diamonds held in minimalist three-prong claw settings crafted in dense, eternal Platinum 950.',
    story: 'Geometric sharpness meets incandescent brilliance. The trillion cut amplifies facet fire for dynamic sparkle in ambient room light.',
    features: [
      '0.60 ctw Match-Paired Trillion Cut Diamonds (E Color, VS1 Clarity)',
      'Hypoallergenic Platinum 950 posts with double-notched security backings',
      'Hand-set micro claw prongs',
      'Accompanied by authenticity grading cards'
    ],
    dimensions: 'Width: 5.1mm | Post length: 11mm',
    caratWeight: '0.60 ctw',
    karatPurity: '950 Platinum / 1000',
    origin: 'Antwerp Atelier',
    inStock: true,
    stockCount: 11,
    rating: 5.0,
    reviewsCount: 16,
    availableFinishes: [
      { name: 'Platinum 950', type: 'platinum', colorHex: '#E5E4E2' },
      { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: [
      {
        id: 'rev-7',
        author: 'Vivian Zhao',
        location: 'San Francisco, CA',
        rating: 5,
        date: 'June 30, 2026',
        title: 'Modern diamond brilliance',
        comment: 'The trillion shape makes these look so much more bespoke than generic round studs. Platinum backing is super secure.',
        verified: true,
        itemPurchased: 'Cygnus Diamond Studs',
        helpfulCount: 7
      }
    ]
  },
  {
    id: 'naxtto-007',
    name: 'Kallisto Hinged Bangle',
    subtitle: 'Oval Contour 18K Solid Gold Minimalist Cuff',
    price: 1180,
    originalPrice: 1290,
    category: 'bracelets',
    metal: '18k-yellow-gold',
    metalName: '18K Recycled Solid Gold',
    style: 'minimalist',
    styleName: 'Minimalist Architecture',
    images: [
      'https://images.unsplash.com/photo-1611591475102-468ae701548e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'An ergonomic oval bangle forged to rest against the wrist bone with tailored precision. Concealed spring hinge and double-lock closure.',
    story: 'Engineered over 14 iterations to ensure the contour never rolls or creates pressure points during keyboard work or fine dining.',
    features: [
      'Precision internal hidden spring hinge mechanism',
      'Concealed double-tongue safety clasp',
      'Cast in 100% recycled 18K solid gold (18.4 grams)',
      'Hand-satin polished interior'
    ],
    dimensions: 'Inside circumference: Small (16cm), Medium (17.5cm) | Width: 4mm',
    karatPurity: '18K Solid Gold (750 Fine)',
    origin: 'Milan, Italy',
    inStock: true,
    stockCount: 7,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 22,
    availableSizes: ['Small (16cm)', 'Medium (17.5cm)', 'Large (19cm)'],
    availableFinishes: [
      { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' },
      { name: '18K Rose Gold', type: '18k-rose-gold', colorHex: '#E0A899' },
      { name: '18K White Gold', type: '18k-white-gold', colorHex: '#E5E4E2' }
    ],
    reviews: [
      {
        id: 'rev-8',
        author: 'Hannah Sterling',
        location: 'Toronto, Canada',
        rating: 5,
        date: 'July 11, 2026',
        title: 'Worth every single penny',
        comment: 'I wear this alongside my luxury watch. It never pinches and has a gorgeous, hefty gold feel.',
        verified: true,
        itemPurchased: 'Kallisto Hinged Bangle - Medium',
        helpfulCount: 16
      }
    ]
  },
  {
    id: 'naxtto-008',
    name: 'Nyx Tennis Bracelet',
    subtitle: 'Bezel-Set Lab Diamond Line Bracelet in 18K White Gold',
    price: 1850,
    category: 'bracelets',
    metal: '18k-white-gold',
    metalName: '18K White Gold & 2.2ctw Diamonds',
    style: 'everyday-luxe',
    styleName: 'Everyday Luxe',
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611591475102-468ae701548e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'A contemporary reimagining of the classic tennis bracelet featuring bezel-framed diamonds that will never catch on knitwear or lace.',
    story: 'Individual bezel cups linked with articulated joints allow full serpentine movement across the wrist with zero stiffness.',
    features: [
      '2.20 ctw Brilliant Lab-Grown Diamonds (DEF Color, VS+ Clarity)',
      'Protective smooth round bezel rims',
      'Double safety clasp with hidden release latch',
      'Laser-welded continuous articulation'
    ],
    dimensions: 'Length: 17cm (6.7 in) | Bezel width: 2.8mm',
    caratWeight: '2.20 ctw',
    karatPurity: '18K Solid White Gold',
    origin: 'Hand-assembled in Antwerp',
    inStock: true,
    stockCount: 5,
    rating: 5.0,
    reviewsCount: 15,
    availableSizes: ['16cm (6.3")', '17.5cm (6.9")', '19cm (7.5")'],
    availableFinishes: [
      { name: '18K White Gold', type: '18k-white-gold', colorHex: '#E5E4E2' },
      { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' }
    ],
    reviews: [
      {
        id: 'rev-9',
        author: 'Chloe Dupont',
        location: 'Brussels, Belgium',
        rating: 5,
        date: 'August 10, 2026',
        title: 'Modern luxury icon',
        comment: 'Finally a diamond tennis bracelet that does not snag on my cashmere sweaters! The sparkle is mesmerizing.',
        verified: true,
        itemPurchased: 'Nyx Tennis Bracelet - 17.5cm',
        helpfulCount: 21
      }
    ]
  },
  {
    id: 'naxtto-009',
    name: 'Vesper Signet Crest',
    subtitle: 'Fluted Brushed 18K Solid Gold Heritage Signet',
    price: 920,
    category: 'fine-collections',
    metal: '18k-yellow-gold',
    metalName: '18K Yellow Gold',
    style: 'vintage-modern',
    styleName: 'Vintage Modern',
    images: [
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'A solid gold signet ring featuring hand-carved lateral fluting and a satin-brushed crest face ready for complimentary bespoke monogramming.',
    story: 'Inspired by 1920s Bauhaus watch cases, the Vesper pairs sharp industrial symmetry with organic warmth.',
    features: [
      'Solid heavy gold build (approx 12.5g)',
      'Complimentary laser or hand engraving service',
      'Architectural fluted side detailing',
      'Hand-satin matte face finish'
    ],
    dimensions: 'Top face: 11mm x 9mm | Band taper: 4.2mm',
    karatPurity: '18K Solid Gold',
    origin: 'Florence Atelier',
    inStock: true,
    stockCount: 9,
    rating: 4.9,
    reviewsCount: 18,
    availableSizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10'],
    availableFinishes: [
      { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' },
      { name: '18K White Gold', type: '18k-white-gold', colorHex: '#E5E4E2' }
    ],
    reviews: [
      {
        id: 'rev-10',
        author: 'Julian Mercer',
        location: 'Boston, MA',
        rating: 5,
        date: 'July 5, 2026',
        title: 'Substantial, heavy heirloom',
        comment: 'The fluted sides give it such character. Custom monogram came out crisp and flawless.',
        verified: true,
        itemPurchased: 'Vesper Signet Crest - US 9',
        helpfulCount: 11
      }
    ]
  },
  {
    id: 'naxtto-010',
    name: 'Bespoke Atelier Commission',
    subtitle: 'Private Custom Jewellery Consultation & Tailored Fabrication',
    price: 2500,
    category: 'bespoke',
    metal: '18k-yellow-gold',
    metalName: '18K Gold or Platinum',
    style: 'sculptural',
    styleName: 'Bespoke Haute Joaillerie',
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Direct creative collaboration with our Principal Master Jeweller. Includes 3D CAD renders, wax model trial fitting, and ethical stone sourcing.',
    story: 'Whether re-imagining a family heirloom or designing an anniversary statement piece, our bespoke service crafts a one-of-a-kind treasure.',
    features: [
      '1-on-1 virtual or atelier design consultation',
      'Photo-realistic 3D renders & physical wax prototype',
      'Hand-sourced ethical rare gems and diamonds',
      'Exclusive archival sketch signed by the artisan'
    ],
    dimensions: 'Custom tailored to client specifications',
    karatPurity: '18K / Platinum / 24K Custom',
    origin: 'NaxtTo Private Studio, Milan',
    inStock: true,
    stockCount: 3,
    rating: 5.0,
    reviewsCount: 12,
    availableSizes: ['Custom Sized'],
    reviews: [
      {
        id: 'rev-11',
        author: 'Beatrice Rossi',
        location: 'Milan, Italy',
        rating: 5,
        date: 'June 18, 2026',
        title: 'A transformative bespoke experience',
        comment: 'The atelier re-imagined my grandmother’s sapphire into the most striking modern ring. Exceptional attention to detail throughout.',
        verified: true,
        itemPurchased: 'Bespoke Atelier Commission',
        helpfulCount: 29
      }
    ]
  },
  {
    id: 'naxtto-011',
    name: 'Elysian Diamond Threader Earrings',
    subtitle: 'Fluid 18K Solid Gold Box Chain & Bezel Diamond Droplets',
    price: 540,
    category: 'earrings',
    metal: '18k-yellow-gold',
    metalName: '18K Solid Yellow Gold',
    style: 'minimalist',
    styleName: 'Minimalist Architecture',
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Delicate box chains that thread smoothly through the lobe to create an adjustable cascading drop tipped with bezel-set lab diamonds.',
    story: 'Engineered with a smooth curved post guide for comfortable insertion and customizable asymmetrical drop lengths.',
    features: [
      '0.25 ctw Round Brilliant Lab Diamonds',
      'Silky smooth box chain construction',
      'Adjustable hanging drop length up to 60mm',
      'Featherlight weight for effortless evening movement'
    ],
    dimensions: 'Total chain length: 85mm | Bezel drop: 3.5mm',
    karatPurity: '18K Solid Gold (750)',
    origin: 'Arezzo, Italy',
    inStock: true,
    stockCount: 16,
    rating: 4.8,
    reviewsCount: 14,
    availableFinishes: [
      { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' },
      { name: '18K White Gold', type: '18k-white-gold', colorHex: '#E5E4E2' }
    ],
    reviews: []
  },
  {
    id: 'naxtto-012',
    name: 'Serena Sculpted Wave Cuff',
    subtitle: 'Sterling Silver 925 with 18K Heavy Vermeil Dip',
    price: 340,
    category: 'bracelets',
    metal: '925-sterling-silver',
    metalName: '925 Sterling Silver / Rhodium',
    style: 'sculptural',
    styleName: 'Sculptural Art',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611591475102-468ae701548e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'A dynamic undulating wrist band mimicking natural tidal currents. Forged from high-grade recycled 925 sterling silver with a protective rhodium mirror coating.',
    story: 'Sculpted by hand in clay before being scanned and investment-cast into precious metal.',
    features: [
      'Certified 925 Solid Sterling Silver',
      'Anti-tarnish mirror rhodium barrier finish',
      'Adjustable malleable cuff structure for universal fit',
      'Engraved atelier hallmark'
    ],
    dimensions: 'Band height: 18mm at peak | Adjustable gap',
    karatPurity: '925 Sterling Silver',
    origin: 'Florence, Italy',
    inStock: true,
    stockCount: 20,
    rating: 4.9,
    reviewsCount: 11,
    availableFinishes: [
      { name: '925 Sterling Silver', type: '925-sterling-silver', colorHex: '#DCDCDC' },
      { name: '18K Gold Vermeil', type: 'gold-vermeil', colorHex: '#D4AF37' }
    ],
    reviews: []
  }
];

export const INSTAGRAM_FEED: InstagramPost[] = [
  {
    id: 'ig-01',
    username: 'naxtto.jewels',
    handle: '@naxtto.jewels',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
    caption: 'Quiet luxury in its purest element. The Aethel Continuous Band stacked alongside morning espresso in Mayfair. #NaxtTo #18kGold #QuietLuxury #EverydayFine',
    likes: 1840,
    commentsCount: 42,
    timestamp: '2 hours ago',
    taggedProductIds: ['naxtto-001'],
    location: 'Mayfair, London'
  },
  {
    id: 'ig-02',
    username: 'claire.vogue',
    handle: '@claire.vogue',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85',
    caption: 'When modern craftsmanship meets organic natural forms. Wearing the Soleil Droplet necklace with a structured linen blazer. @naxtto.jewels #NaxtToCollective',
    likes: 2950,
    commentsCount: 78,
    timestamp: '1 day ago',
    taggedProductIds: ['naxtto-003', 'naxtto-004'],
    location: 'Paris Fashion Week'
  },
  {
    id: 'ig-03',
    username: 'naxtto.jewels',
    handle: '@naxtto.jewels',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=85',
    caption: 'Sculptural elegance that catches golden hour light. The Arcadia Hoops are completely hollow-formed for featherweight all-day comfort.',
    likes: 3410,
    commentsCount: 91,
    timestamp: '2 days ago',
    taggedProductIds: ['naxtto-005'],
    location: 'Milan Atelier'
  },
  {
    id: 'ig-04',
    username: 'elena_arch',
    handle: '@elena_arch',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1611591475102-468ae701548e?auto=format&fit=crop&w=800&q=85',
    caption: 'My everyday armor: Kallisto hinged cuff + Nyx tennis bracelet in recycled 18k gold. Understated, architectural, eternal. @naxtto.jewels #FineJewellery',
    likes: 1620,
    commentsCount: 35,
    timestamp: '4 days ago',
    taggedProductIds: ['naxtto-007', 'naxtto-008'],
    location: 'Zürich, Switzerland'
  },
  {
    id: 'ig-05',
    username: 'naxtto.jewels',
    handle: '@naxtto.jewels',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85',
    caption: 'A modern promise. The Luminary Solitaire in our floating bezel design. Ethically grown, certified VVS1 clarity. #NaxtToBridal #EthicalDiamonds',
    likes: 4200,
    commentsCount: 114,
    timestamp: '5 days ago',
    taggedProductIds: ['naxtto-002'],
    location: 'Lake Como, Italy'
  },
  {
    id: 'ig-06',
    username: 'marcus_design',
    handle: '@marcus_design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=85',
    caption: 'The fluting on this Vesper Signet ring is razor sharp yet soft to the touch. NaxtTo proves minimalism is all about micro-proportions. #SignetRing',
    likes: 1890,
    commentsCount: 29,
    timestamp: '1 week ago',
    taggedProductIds: ['naxtto-009'],
    location: 'Stockholm, Sweden'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-01',
    slug: 'the-art-of-ring-stacking-minimalist-guide',
    title: 'The Architecture of Ring Stacking: A Connoisseur’s Guide to Proportion & Harmony',
    subtitle: 'How to balance varying widths, metal finishes, and bezel profiles for effortless daily wear.',
    excerpt: 'Mastering the curated ring stack is a study in tension and balance. Learn how to mix textured bands, floating gemstones, and architectural silhouettes without visual clutter.',
    category: 'Style & Stacking',
    readTime: '4 min read',
    publishedAt: 'August 14, 2026',
    coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Genevieve Moreau',
      role: 'Head of Design & Atelier Director',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    tableOfContents: [
      { id: 'foundational-anchor', title: '1. Choosing the Anchor Band' },
      { id: 'balancing-proportions', title: '2. The Rule of Varying Gauges' },
      { id: 'mixing-metals', title: '3. Mixing Warm Yellow Gold & Cool Platinum' },
      { id: 'negative-space', title: '4. The Vital Role of Negative Space' }
    ],
    contentSections: [
      {
        heading: '1. Choosing the Anchor Band',
        body: [
          'Every captivating ring stack starts with a singular focal foundation. This is typically a piece with structural presence—such as our Aethel Continuous Band or a domed cigar band. The anchor anchors the hand and dictates the tonal palette for accompanying accents.',
          'When selecting your base, prioritize ergonomic contouring. A ring with a rounded comfort-fit interior ensures that adding subsequent companion bands will not pinch or restrict joint articulation throughout a busy workday.'
        ],
        quote: 'True luxury in jewellery lies not in excess, but in the intentional dialogue between metal, gemstone, and the skin beneath.'
      },
      {
        heading: '2. The Rule of Varying Gauges',
        body: [
          'A common styling misstep is pairing three identical 2mm bands together, which often flattens the silhouette. Instead, practice the 3:1 ratio: combine one substantial band (3.5mm – 4.5mm) with a whisper-thin pavé band (1.2mm – 1.6mm) and a sculpted geometric accent.',
          'This variation in depth invites the eye to explore subtle textural transitions, contrasting high-mirror polishes against diamond pavé or satin-brushed gold.'
        ],
        image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
        imageCaption: 'The Luminary Bezel Solitaire stacked effortlessly with the Aethel 18K Solid Band.'
      },
      {
        heading: '3. Mixing Warm Yellow Gold & Cool Platinum',
        body: [
          'The historical convention against mixing yellow gold with white gold or platinum is thoroughly obsolete in contemporary aesthetics. In fact, a bi-color stack accentuates the unique warmth of 18k yellow gold when contrasted against the icy brilliance of 950 platinum.',
          'To achieve deliberate coherence rather than accidental mismatch, ensure that at least one piece in the stack incorporates both tones, or repeat the cool metal in an earring or wrist cuff.'
        ]
      },
      {
        heading: '4. The Vital Role of Negative Space',
        body: [
          'Allowing your knuckles and skin to breathe is essential. Rather than loading five rings onto a single finger, distribute them organically across your index, middle, and pinky fingers.',
          'An open-ended cuff ring or a floating bezel solitaire naturally introduces negative space, giving each precious element its rightful moment to shine.'
        ]
      }
    ],
    seoKeywords: ['ring stacking guide', 'minimalist gold rings', '18k solid gold stack', 'how to mix metals jewellery', 'sustainable diamond rings'],
    metaDescription: 'Discover expert tips on how to curate the perfect minimalist ring stack using 18k solid gold, bezel stones, and architectural bands from NaxtTo Atelier.',
    relatedProductIds: ['naxtto-001', 'naxtto-002', 'naxtto-009']
  },
  {
    id: 'blog-02',
    slug: '18k-gold-vs-14k-gold-investment-guide',
    title: '18K Gold vs. 14K Gold: The Connoisseur’s Guide to Purity, Color & Longevity',
    subtitle: 'Understanding metallurgy, color saturation, and why 18k remains the gold standard of fine European jewellery.',
    excerpt: 'Is 18k gold worth the investment over 14k? We break down gold karat purity, skin hypoallergenic compatibility, and why heirloom pieces demand higher precious bullion concentration.',
    category: 'Gemology',
    readTime: '5 min read',
    publishedAt: 'August 08, 2026',
    coverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Dr. Alistair Sterling',
      role: 'Master Metallurgist & Gemologist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    tableOfContents: [
      { id: 'karat-science', title: '1. The Science of Karats' },
      { id: 'visual-difference', title: '2. Richness of Color & Tone' },
      { id: 'durability-hypoallergenic', title: '3. Durability & Skin Sensitivity' },
      { id: 'heirloom-value', title: '4. Resale & Generational Value' }
    ],
    contentSections: [
      {
        heading: '1. The Science of Karats',
        body: [
          'Pure 24K gold is elemental gold (99.9% pure). However, pure gold is too malleable for intricate daily jewellery settings. To provide structural rigidity and enhance resilience, gold is alloyed with noble metals such as silver, copper, and palladium.',
          '18K Gold comprises 75% pure solid gold (marked 750), while 14K Gold contains 58.3% gold (marked 585). That remaining difference accounts for significant differences in tactile heft, color richness, and long-term prestige.'
        ],
        quote: '18K Gold represents the golden mean of fine jewellery: maximum gold purity with uncompromised daily resilience.'
      },
      {
        heading: '2. Richness of Color & Tone',
        body: [
          'Because 18K gold contains a full 75% pure gold, its visual signature has a deep, buttery, opulent warmth that cannot be replicated in lower alloys. In contrast, 14K gold can sometimes appear paler or slightly brassy due to higher zinc and nickel content.',
          'Under natural daylight, an 18K solid piece glows with an unmistakable golden luminosity that stands out across the room.'
        ]
      },
      {
        heading: '3. Durability & Skin Sensitivity',
        body: [
          'A pervasive myth suggests that 18K gold is too soft for everyday wear. In reality, modern precision heat-tempering and cold-rolling techniques give 18K gold superior structural integrity while preventing the brittleness that can affect lower karats.',
          'Furthermore, because 18K gold minimizes non-precious base metals, it is inherently hypoallergenic and will never cause dermatitis or green discoloration on sensitive skin.'
        ]
      }
    ],
    seoKeywords: ['18k vs 14k gold', 'gold karat guide', 'solid gold jewellery investment', 'hypoallergenic gold rings', 'recycled 18k gold'],
    metaDescription: 'Learn why 18K solid gold is the ultimate standard for minimalist fine jewellery. Compare durability, color warmth, and hypoallergenic qualities with NaxtTo.',
    relatedProductIds: ['naxtto-001', 'naxtto-004', 'naxtto-007']
  },
  {
    id: 'blog-03',
    slug: 'caring-for-organic-baroque-pearls',
    title: 'Caring for Organic Pearls & Fine Gemstones: Atelier Preservation Secrets',
    subtitle: 'How to clean, store, and preserve natural luster across decades of wear.',
    excerpt: 'Organic baroque pearls and bezel-set gemstones require delicate reverence. Discover the simple rituals that keep your fine jewellery glowing for generations.',
    category: 'Care Guides',
    readTime: '3 min read',
    publishedAt: 'July 29, 2026',
    coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Genevieve Moreau',
      role: 'Head of Design & Atelier Director',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    tableOfContents: [
      { id: 'last-on-first-off', title: '1. The Golden Rule: Last On, First Off' },
      { id: 'cleaning-ritual', title: '2. Gentle Ultrasonic & Microfiber Care' },
      { id: 'proper-storage', title: '3. Storing Without Scratches' }
    ],
    contentSections: [
      {
        heading: '1. The Golden Rule: Last On, First Off',
        body: [
          'Organic gems like baroque pearls and emeralds are naturally porous and interact with atmospheric conditions. Perfumes, hairsprays, and skincare acids can degrade the delicate calcium nacre over time.',
          'Always make your jewellery the final touch of your dressing ritual after perfumes have completely evaporated, and the first piece removed before evening routines.'
        ]
      },
      {
        heading: '2. Gentle Ultrasonic & Microfiber Care',
        body: [
          'While diamonds and solid 18k gold can be periodically cleaned with warm water, mild Castile soap, and a soft-bristled baby toothbrush, never place pearls in ultrasonic cleaners.',
          'Simply wipe your pearls with a slightly dampened chamois or ultra-soft microfiber cloth after wear to remove skin lipids and preserve natural iridescence.'
        ]
      }
    ],
    seoKeywords: ['how to clean pearl jewellery', 'baroque pearl care', 'fine jewellery maintenance', 'protect gold necklace'],
    metaDescription: 'Atelier preservation secrets for caring for organic freshwater baroque pearls, solid gold chains, and bezel lab diamonds.',
    relatedProductIds: ['naxtto-003', 'naxtto-005', 'naxtto-008']
  },
  {
    id: 'blog-04',
    slug: 'sustainable-metallurgy-ethical-diamonds-future',
    title: 'The Circular Atelier: 100% Recycled Gold and Conflict-Free Lab Metallurgy',
    subtitle: 'Why ethical transparency is the only true modern definition of luxury.',
    excerpt: 'Explore how NaxtTo eliminates destructive mining through closed-loop recycled precious bullion and solar-powered diamond synthesis.',
    category: 'Sustainability',
    readTime: '6 min read',
    publishedAt: 'July 12, 2026',
    coverImage: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Elena Rostova',
      role: 'Head of Ethical Sourcing & Sustainability',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80'
    },
    tableOfContents: [
      { id: 'recycled-gold-impact', title: '1. The Zero-Extraction Gold Standard' },
      { id: 'lab-diamonds-vs-mined', title: '2. Solar-Powered Diamond Crystallization' },
      { id: 'carbon-neutral-craft', title: '3. Carbon-Neutral Crafting & Packaging' }
    ],
    contentSections: [
      {
        heading: '1. The Zero-Extraction Gold Standard',
        body: [
          'Gold is inherently infinite: it can be melted, purified, and re-refined indefinitely without degrading its atomic purity or crystalline structure. All NaxtTo pieces utilize 100% certified recycled gold derived from ethically audited secondary sources.',
          'This closed-loop system reduces carbon emissions by over 99.7% compared to traditional open-pit mining, protecting fragile ecosystems and watersheds.'
        ],
        quote: 'True beauty should never come at the cost of the Earth. Modern fine jewellery must be as pure in its origin as it is in its form.'
      },
      {
        heading: '2. Solar-Powered Diamond Crystallization',
        body: [
          'Our lab-grown diamonds are created using Chemical Vapor Deposition (CVD) powered by 100% renewable solar energy in state-of-the-art European laboratories.',
          'They possess the exact same physical, optical, and chemical matrix (10 on the Mohs hardness scale, refractive index of 2.42) as mined stones, but without conflict, habitat destruction, or opaque supply chains.'
        ]
      }
    ],
    seoKeywords: ['recycled gold jewellery', 'ethical lab grown diamonds', 'sustainable luxury jewellery', 'eco friendly fine jewellery brand'],
    metaDescription: 'Learn about NaxtTo circular metallurgy, 100% certified recycled 18k solid gold, and solar-crystallized ethical diamonds.',
    relatedProductIds: ['naxtto-001', 'naxtto-002', 'naxtto-006']
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
    metalPreferences: ['18K Recycled Yellow Gold'],
    ringSize: 'US 6',
    newsletterSubscribed: false
  }
};
