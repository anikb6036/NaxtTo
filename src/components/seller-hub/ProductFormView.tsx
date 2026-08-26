import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Check, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles,
  Search,
  ChevronRight,
  HelpCircle,
  PlayCircle,
  AlertCircle,
  Image as ImageIcon,
  CheckCircle2,
  X,
  RefreshCw,
  Sliders,
  Tag,
  ShieldCheck,
  Eye,
  UploadCloud,
  Upload,
  Camera,
  FileImage,
  Link,
  Star
} from 'lucide-react';
import { Product, ProductCategory, MetalType } from '../../types';

interface ProductFormViewProps {
  editingProduct: Product | null;
  onSave: (productData: any) => void;
  onCancel: () => void;
  currencySymbol: string;
}

// Category Hierarchy Definition
export interface CategoryNode {
  id: string;
  name: string;
  mappedCategory?: ProductCategory;
  categoryType?: 'necklaces' | 'rings' | 'earrings' | 'bracelets' | 'jewellery-set' | 'sarees' | 'ethnic-wear' | 'western-wear' | 'footwear' | 'accessories' | 'perfumes' | 'general';
  children?: CategoryNode[];
}

export const CATEGORY_TREE: CategoryNode[] = [
  {
    id: 'women-fashion',
    name: 'Women Fashion',
    children: [
      { 
        id: 'ethnic-wear', 
        name: 'Ethnic Wear', 
        children: [
          { id: 'sarees', name: 'Sarees', mappedCategory: 'fine-collections', categoryType: 'sarees' },
          { id: 'kurtis', name: 'Kurtis', mappedCategory: 'fine-collections', categoryType: 'ethnic-wear' },
          { id: 'lehengas', name: 'Lehengas & Cholis', mappedCategory: 'fine-collections', categoryType: 'ethnic-wear' },
          { id: 'suits', name: 'Suits & Dress Material', mappedCategory: 'fine-collections', categoryType: 'ethnic-wear' },
          { id: 'dupattas', name: 'Dupattas & Shawls', mappedCategory: 'fine-collections', categoryType: 'ethnic-wear' }
        ]
      },
      { 
        id: 'western-wear', 
        name: 'Western Wear', 
        children: [
          { id: 'dresses', name: 'Dresses & Gowns', mappedCategory: 'fine-collections', categoryType: 'western-wear' },
          { id: 'tops', name: 'Tops & Tunics', mappedCategory: 'fine-collections', categoryType: 'western-wear' },
          { id: 'jeans', name: 'Jeans & Trousers', mappedCategory: 'fine-collections', categoryType: 'western-wear' },
          { id: 'skirts', name: 'Skirts & Shorts', mappedCategory: 'fine-collections', categoryType: 'western-wear' },
          { id: 'jumpsuits', name: 'Jumpsuits & Playsuits', mappedCategory: 'fine-collections', categoryType: 'western-wear' }
        ]
      },
      {
        id: 'accessories',
        name: 'Accessories',
        children: [
          {
            id: 'jewellery',
            name: 'Jewellery',
            children: [
              { id: 'necklaces', name: 'Necklaces & Chains', mappedCategory: 'necklaces', categoryType: 'necklaces' },
              { id: 'pendants', name: 'Pendants & Lockets', mappedCategory: 'necklaces', categoryType: 'necklaces' },
              { id: 'rings', name: 'Rings', mappedCategory: 'rings', categoryType: 'rings' },
              { id: 'bracelet-bangles', name: 'Bracelet & Bangles', mappedCategory: 'bracelets', categoryType: 'bracelets' },
              { id: 'earrings', name: 'Earrings & Studs', mappedCategory: 'earrings', categoryType: 'earrings' },
              { id: 'anklets', name: 'Anklets & Toe Rings', mappedCategory: 'fine-collections', categoryType: 'bracelets' },
              { id: 'jewellery-set', name: 'Jewellery Set', mappedCategory: 'fine-collections', categoryType: 'jewellery-set' }
            ]
          },
          {
            id: 'belts',
            name: 'Belts',
            children: [
              { id: 'leather-belts', name: 'Leather Belts', categoryType: 'accessories' },
              { id: 'chain-belts', name: 'Chain & Metallic Belts', categoryType: 'accessories' },
              { id: 'corset-belts', name: 'Corset & Wide Belts', categoryType: 'accessories' }
            ]
          },
          {
            id: 'fashion-accessories',
            name: 'Fashion Accessories',
            children: [
              { id: 'brooches', name: 'Brooches & Lapel Pins', mappedCategory: 'fine-collections', categoryType: 'jewellery-set' },
              { id: 'sunglasses', name: 'Designer Sunglasses', categoryType: 'accessories' },
              { id: 'hairbands', name: 'Luxury Hairbands', categoryType: 'accessories' }
            ]
          },
          {
            id: 'caps-hats',
            name: 'Caps & Hats',
            children: [
              { id: 'sun-hats', name: 'Sun Hats', categoryType: 'accessories' },
              { id: 'beanies', name: 'Cashmere Beanies', categoryType: 'accessories' },
              { id: 'berets', name: 'Wool Berets', categoryType: 'accessories' }
            ]
          },
          {
            id: 'hair-accessories',
            name: 'Hair Accessories',
            children: [
              { id: 'hair-clips', name: 'Hair Clips & BarSubmit', categoryType: 'accessories' },
              { id: 'hair-pins', name: 'Pearl & Gold Hair Pins', categoryType: 'accessories' },
              { id: 'tiaras', name: 'Bridal Tiaras', mappedCategory: 'bespoke', categoryType: 'jewellery-set' }
            ]
          },
          {
            id: 'scarves-gloves',
            name: 'Scarves, Stoles & Gloves',
            children: [
              { id: 'silk-scarves', name: 'Pure Silk Scarves', categoryType: 'accessories' },
              { id: 'pashmina', name: 'Cashmere & Pashmina Stoles', categoryType: 'accessories' },
              { id: 'gloves', name: 'Satin & Leather Gloves', categoryType: 'accessories' }
            ]
          }
        ]
      },
      { 
        id: 'footwear', 
        name: 'Footwear', 
        children: [
          { id: 'heels', name: 'Stiletto & Block Heels', categoryType: 'footwear' },
          { id: 'flats', name: 'Pointed Mules & Flats', categoryType: 'footwear' },
          { id: 'sandals', name: 'Strappy Sandals', categoryType: 'footwear' }
        ]
      },
      { 
        id: 'inner-sleepwear', 
        name: 'Inner & Sleepwear', 
        children: [
          { id: 'silk-robes', name: 'Silk Robes & Loungewear', categoryType: 'western-wear' },
          { id: 'nightwear', name: 'Nightwear Sets', categoryType: 'western-wear' }
        ]
      },
      { 
        id: 'sports-activewear', 
        name: 'Sports & Activewear', 
        children: [
          { id: 'leggings', name: 'Sculpting Leggings', categoryType: 'western-wear' },
          { id: 'active-tops', name: 'Performance Tops', categoryType: 'western-wear' }
        ]
      },
      { 
        id: 'women-ethnic-wear', 
        name: 'Women Ethnic Wear', 
        children: [
          { id: 'anarkalis', name: 'Designer Anarkalis', categoryType: 'ethnic-wear' },
          { id: 'couture-gowns', name: 'Couture Evening Gowns', categoryType: 'western-wear' }
        ]
      }
    ]
  },
  {
    id: 'fine-jewellery',
    name: 'Fine Jewellery',
    children: [
      {
        id: 'gold-rings',
        name: 'Continuous Rings',
        children: [
          { id: 'solitaire-rings', name: 'Solitaire Diamond Rings', mappedCategory: 'rings', categoryType: 'rings' },
          { id: 'eternity-bands', name: 'Pavé Eternity Bands', mappedCategory: 'rings', categoryType: 'rings' },
          { id: 'signet-rings', name: 'Gold Signet Rings', mappedCategory: 'rings', categoryType: 'rings' },
          { id: 'sculptural-bands', name: 'Sculptural Organic Bands', mappedCategory: 'rings', categoryType: 'rings' }
        ]
      },
      {
        id: 'necklaces-pendants',
        name: 'Necklaces & Pendants',
        children: [
          { id: 'chokers', name: 'Solid Gold Chokers', mappedCategory: 'necklaces', categoryType: 'necklaces' },
          { id: 'tennis-necklaces', name: 'Diamond Tennis Collars', mappedCategory: 'necklaces', categoryType: 'necklaces' },
          { id: 'medallions', name: 'Archival Medallions', mappedCategory: 'necklaces', categoryType: 'necklaces' }
        ]
      },
      {
        id: 'earrings-cuffs',
        name: 'Earrings & Ear Cuffs',
        children: [
          { id: 'sculpted-hoops', name: 'Architectural Gold Hoops', mappedCategory: 'earrings', categoryType: 'earrings' },
          { id: 'diamond-studs', name: 'Solitaire Diamond Studs', mappedCategory: 'earrings', categoryType: 'earrings' },
          { id: 'drop-earrings', name: 'Cascading Pearl Drops', mappedCategory: 'earrings', categoryType: 'earrings' }
        ]
      },
      {
        id: 'bracelets-cuffs',
        name: 'Bracelets & Cuffs',
        children: [
          { id: 'articulated-cuffs', name: 'Articulated Gold Cuffs', mappedCategory: 'bracelets', categoryType: 'bracelets' },
          { id: 'tennis-bracelets', name: 'Diamond Tennis Bracelets', mappedCategory: 'bracelets', categoryType: 'bracelets' },
          { id: 'chain-bracelets', name: 'Heavy Link Bracelets', mappedCategory: 'bracelets', categoryType: 'bracelets' }
        ]
      },
      {
        id: 'bespoke-vault',
        name: 'Bespoke Commissions',
        children: [
          { id: 'custom-bridal', name: 'Bridal High Jewellery Sets', mappedCategory: 'bespoke', categoryType: 'jewellery-set' },
          { id: 'heirloom-redesign', name: 'Heirloom Redesign Piece', mappedCategory: 'bespoke', categoryType: 'jewellery-set' }
        ]
      }
    ]
  },
  {
    id: 'men-fashion',
    name: 'Men Fashion',
    children: [
      { 
        id: 'top-wear', 
        name: 'Top Wear', 
        children: [
          { id: 'formal-shirts', name: 'Italian Linen Shirts', categoryType: 'western-wear' },
          { id: 'jackets', name: 'Tailored Blazers & Jackets', categoryType: 'western-wear' }
        ]
      },
      {
        id: 'men-accessories',
        name: 'Accessories',
        children: [
          { id: 'men-chains', name: 'Heavy Curb Chains', mappedCategory: 'necklaces', categoryType: 'necklaces' },
          { id: 'men-kadas', name: 'Solid Gold & Platinum Kadas', mappedCategory: 'bracelets', categoryType: 'bracelets' },
          { id: 'men-rings', name: 'Signet & Sovereign Rings', mappedCategory: 'rings', categoryType: 'rings' },
          { id: 'cufflinks', name: 'Hallmarked Gold Cufflinks', mappedCategory: 'fine-collections', categoryType: 'accessories' }
        ]
      }
    ]
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    children: [
      { 
        id: 'home-decor', 
        name: 'Luxury Decor', 
        children: [
          { id: 'sculptures', name: 'Bronze & Marble Sculptures', categoryType: 'general' },
          { id: 'vases', name: 'Mouth-Blown Crystal Vases', categoryType: 'general' },
          { id: 'trinket-dishes', name: 'Gilded Jewellery Trays', categoryType: 'general' }
        ]
      }
    ]
  },
  {
    id: 'personal-care',
    name: 'Personal Care & Wellness',
    children: [
      { 
        id: 'perfumes', 
        name: 'Haute Parfumerie', 
        children: [
          { id: 'eau-de-parfum', name: 'Niche Extrait de Parfum', categoryType: 'perfumes' },
          { id: 'oud-attar', name: 'Archival Pure Oud Oil', categoryType: 'perfumes' }
        ]
      }
    ]
  }
];

// Contextual configuration for dynamic Step 2 fields & intelligent defaults
export interface CategoryConfig {
  sampleImage: string;
  presetImages: { title: string; url: string }[];
  defaultTitle: string;
  defaultSubtitle: string;
  defaultPrice: number;
  defaultOriginalPrice: number;
  defaultSizes: string;
  defaultFeatures: string[];
  fieldGroupTitle: string;
  fieldGroupDesc: string;
  sizeLabel: string;
  sizePlaceholder: string;
  weightLabel?: string;
  customAttributes: {
    key: string;
    label: string;
    type: 'select' | 'text';
    options?: string[];
    defaultValue: string;
    placeholder?: string;
  }[];
}

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  'necklaces': {
    sampleImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Diamond Pavé Collar', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
      { title: 'Solid Gold Herringbone', url: 'https://images.unsplash.com/photo-1611591475102-4a008c2a9a7a?auto=format&fit=crop&w=800&q=80' },
      { title: 'South Sea Pearl Strand', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Aura Pavé Diamond Collar Necklace',
    defaultSubtitle: '18K Recycled Solid Gold with Precision Collet Settings',
    defaultPrice: 1850,
    defaultOriginalPrice: 2150,
    defaultSizes: '40cm (Choker), 45cm (Princess Length), 50cm (Matinee), 60cm (Opera)',
    sizeLabel: 'Available Chain Lengths',
    sizePlaceholder: '40cm, 45cm, 50cm, 60cm, Adjustable',
    weightLabel: 'Gross Gold Weight (approx. grams)',
    defaultFeatures: [
      'Engineered anti-tangle herringbone link alignment',
      'Hallmarked 750/1000 18K Solid Gold lobster lock',
      'Includes 5cm adjustable extender loop ring',
      'Vault archival presentation box & velvet pouch included'
    ],
    fieldGroupTitle: 'Necklace & Chain Specifications',
    fieldGroupDesc: 'Specify chain weave, lock mechanism, necklace length, and gemstone pavé collets.',
    customAttributes: [
      {
        key: 'chainWeave',
        label: 'Chain Weave / Link Style',
        type: 'select',
        options: ['Herringbone Flat Link', 'Classic Box Chain', 'Cuban Curb Link', 'Diamond Tennis Collet', 'Cable Link', 'Figaro Weave'],
        defaultValue: 'Herringbone Flat Link'
      },
      {
        key: 'claspType',
        label: 'Clasp & Lock Mechanism',
        type: 'select',
        options: ['Heavy Duty Lobster Clasp', 'Spring Ring with Safety Catch', 'Concealed Box Clasp', 'Fold-Over Lock', 'Toggle T-Bar'],
        defaultValue: 'Heavy Duty Lobster Clasp'
      },
      {
        key: 'gemstoneType',
        label: 'Primary Stone / Gem Accent',
        type: 'select',
        options: ['Natural VVS1 Diamond', 'Lab-Grown CVD Diamond', 'South Sea Cultured Pearl', 'Colombian Emerald', 'Ceylon Blue Sapphire', 'None (Solid Gold)'],
        defaultValue: 'Natural VVS1 Diamond'
      },
      {
        key: 'caratWeight',
        label: 'Total Diamond Carat Weight (ctw)',
        type: 'text',
        defaultValue: '0.45 ctw',
        placeholder: 'e.g. 0.45 ctw or N/A'
      },
      {
        key: 'chainThickness',
        label: 'Chain Gauge / Width',
        type: 'text',
        defaultValue: '2.5mm Gauge',
        placeholder: 'e.g. 1.8mm, 2.5mm, 4.0mm'
      }
    ]
  },
  'rings': {
    sampleImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Continuous Band', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80' },
      { title: 'Solitaire Halo Ring', url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80' },
      { title: 'Sculptural Organic Band', url: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Aethel Continuous Eternity Band',
    defaultSubtitle: '18K Recycled Solid Gold Hand-Set Micro-Pavé Band',
    defaultPrice: 1250,
    defaultOriginalPrice: 1450,
    defaultSizes: 'US 5, US 6, US 7, US 8, US 9, US 10',
    sizeLabel: 'Available Ring Sizes (US / EU)',
    sizePlaceholder: 'US 5, US 6, US 7, US 8, US 9',
    weightLabel: 'Band Net Metal Weight',
    defaultFeatures: [
      'Comfort-fit ergonomic rounded interior profile',
      'Hand-set micro-pavé optical mirror alignment',
      'Solid 18K recycled alloy with 750 laser stamp',
      'Complimentary ring sizer & lifetime complimentary re-sizing'
    ],
    fieldGroupTitle: 'Ring Architecture & Setting Details',
    fieldGroupDesc: 'Define band profile, setting geometry, stone specifications, and comfort finish.',
    customAttributes: [
      {
        key: 'ringProfile',
        label: 'Band Profile & Width',
        type: 'select',
        options: ['2.0mm Comfort-Fit Court', '1.5mm Ultra-Slim Knife Edge', '3.5mm Beveled Statement', '5.0mm Cigar Flat Band', 'Sculptural Organic Ribbon'],
        defaultValue: '2.0mm Comfort-Fit Court'
      },
      {
        key: 'settingType',
        label: 'Gemstone Setting Geometry',
        type: 'select',
        options: ['Micro-Pavé Full Eternity', '4-Prong Cathedral Solitaire', 'Bezel Full Rim Collet', 'Flush Gypsy Setting', 'Channel Set Side Stones'],
        defaultValue: 'Micro-Pavé Full Eternity'
      },
      {
        key: 'gemstoneCut',
        label: 'Center Stone Cut / Shape',
        type: 'select',
        options: ['Round Brilliant Cut', 'Oval Cut', 'Emerald Step Cut', 'Cushion Cut', 'Marquise Cut', 'None (Pure Band)'],
        defaultValue: 'Round Brilliant Cut'
      },
      {
        key: 'stoneClarity',
        label: 'Diamond Color & Clarity Grade',
        type: 'text',
        defaultValue: 'VVS1 / Colorless E-F',
        placeholder: 'e.g. VVS1 Colorless E-F'
      }
    ]
  },
  'bracelets': {
    sampleImage: 'https://images.unsplash.com/photo-1611591475102-4a008c2a9a7a?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Articulated Gold Bangle', url: 'https://images.unsplash.com/photo-1611591475102-4a008c2a9a7a?auto=format&fit=crop&w=800&q=80' },
      { title: 'Diamond Tennis Bracelet', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
      { title: 'Solid Gold Kada / Cuff', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Articulated Solid 18K Gold Bangle & Cuff',
    defaultSubtitle: 'Seamless Hidden-Hinge Precision Bangle with Safety Catch',
    defaultPrice: 2200,
    defaultOriginalPrice: 2500,
    defaultSizes: 'Small (16cm), Medium (17.5cm), Large (19cm), Free Size (Adjustable)',
    sizeLabel: 'Available Wrist Circumferences',
    sizePlaceholder: 'Small (16cm), Medium (17.5cm), Large (19cm)',
    weightLabel: 'Gross Metal Weight (grams)',
    defaultFeatures: [
      'Seamless micro-hinged closure with dual side safety clasps',
      'Solid core construction for lifelong structural resistance',
      'Hand-buffed mirror finish on 18K solid gold',
      'Certified assay hallmark seal and authenticity card'
    ],
    fieldGroupTitle: 'Bangle & Bracelet Specifications',
    fieldGroupDesc: 'Set wrist inner diameter, hinge mechanism, locking system, and metal finishing.',
    customAttributes: [
      {
        key: 'bangleStyle',
        label: 'Structure & Style',
        type: 'select',
        options: ['Hinged Solid Bangle', 'Open Spring Flex Cuff', 'Diamond Tennis Bracelet', 'Heavy Link Chain Bracelet', 'Traditional Kada'],
        defaultValue: 'Hinged Solid Bangle'
      },
      {
        key: 'closureMechanism',
        label: 'Safety Closure Mechanism',
        type: 'select',
        options: ['Concealed Snap Lock with Dual Figures of Eight', 'Push-Button Release Clasp', 'Screw-Lock Mechanism', 'Slip-on Tension Fit'],
        defaultValue: 'Concealed Snap Lock with Dual Figures of Eight'
      },
      {
        key: 'innerDiameter',
        label: 'Standard Inner Diameter',
        type: 'text',
        defaultValue: '57mm (2.4 anna / Medium)',
        placeholder: 'e.g. 57mm (2.4 anna), 60mm (2.6 anna)'
      },
      {
        key: 'finishTexture',
        label: 'Surface Finish & Texture',
        type: 'select',
        options: ['High-Gloss Mirror Polish', 'Satin Brushed Matte', 'Hand-Chiseled Texture', 'Diamond Frosted'],
        defaultValue: 'High-Gloss Mirror Polish'
      }
    ]
  },
  'earrings': {
    sampleImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Sculpted Architectural Hoops', url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80' },
      { title: 'Diamond Solitaire Studs', url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80' },
      { title: 'Cascading Pearl Drops', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Sculptural Ribbon Drop Earrings',
    defaultSubtitle: '18K Yellow Gold with South Sea Pearl Drop Collets',
    defaultPrice: 980,
    defaultOriginalPrice: 1150,
    defaultSizes: 'Standard Pierced Post, Screw Back, Clip-On (Non-Pierced)',
    sizeLabel: 'Backing / Fastener Types',
    sizePlaceholder: 'Push Back Post, Screw Back, Clip-On',
    weightLabel: 'Pair Net Weight (grams)',
    defaultFeatures: [
      'Lightweight hollow-core casting for comfortable all-day wear',
      'Hypoallergenic 18K solid gold posts and secure silicone friction backings',
      'Mirrored right and left anatomical orientation',
      'Individually checked for diamond prong stability'
    ],
    fieldGroupTitle: 'Earring Engineering & Backing Details',
    fieldGroupDesc: 'Specify post mechanism, drop length, backing fastener, and earlobe weight balance.',
    customAttributes: [
      {
        key: 'earringType',
        label: 'Earring Silhouette',
        type: 'select',
        options: ['Architectural Hoop', 'Solitaire Studs', 'Articulated Drop / Chandelier', 'Huggie Clicker', 'Ear Climber / Cuff'],
        defaultValue: 'Architectural Hoop'
      },
      {
        key: 'postBacking',
        label: 'Fastener / Post Type',
        type: 'select',
        options: ['Friction Push Back Post', 'Threaded Precision Screw Back', 'French Wire Leverback', 'Omega Clip-On Mechanism', 'Seamless Clicker Hinge'],
        defaultValue: 'Friction Push Back Post'
      },
      {
        key: 'dropLength',
        label: 'Drop Length (mm)',
        type: 'text',
        defaultValue: '32mm Drop',
        placeholder: 'e.g. 12mm Stud, 32mm Drop, 55mm Chandelier'
      }
    ]
  },
  'jewellery-set': {
    sampleImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Bridal High Jewellery Suite', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
      { title: 'Emerald & Diamond Ensemble', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Imperial Bridal High Jewellery Suite',
    defaultSubtitle: 'Handcrafted 18K Solid Gold Collar, Earrings & Maang Tikka Suite',
    defaultPrice: 5800,
    defaultOriginalPrice: 6500,
    defaultSizes: 'Complete 3-Piece Suite (Free Size Necklace + Earrings + Ring)',
    sizeLabel: 'Suite Inclusions',
    sizePlaceholder: '3-Piece Suite, 5-Piece Suite',
    weightLabel: 'Total Suite Gross Weight (approx. grams)',
    defaultFeatures: [
      'Master artisan setting with over 240 hours of handcrafting',
      'IGI Certified natural diamonds and hallmarked 18K Gold',
      'Coordinated design aesthetics across collar, studs, and ring',
      'Archival cedarwood and leather presentation box'
    ],
    fieldGroupTitle: 'Suite Composition & Certification',
    fieldGroupDesc: 'Set items included in the suite, total diamond weight, and assay certification.',
    customAttributes: [
      {
        key: 'piecesIncluded',
        label: 'Included Suite Components',
        type: 'text',
        defaultValue: 'Necklace Collar + Matching Earrings + Ring + Maang Tikka',
        placeholder: 'e.g. Necklace + Earrings + Ring'
      },
      {
        key: 'certificationBody',
        label: 'Independent Certification Body',
        type: 'select',
        options: ['IGI Diamond Laboratory Report', 'GIA High Jewellery Certificate', 'BIS Hallmark Government Assay', 'In-House Master Atelier Certificate'],
        defaultValue: 'IGI Diamond Laboratory Report'
      },
      {
        key: 'totalSuiteWeight',
        label: 'Total Suite Weight',
        type: 'text',
        defaultValue: '48.5 grams',
        placeholder: 'e.g. 48.5 grams'
      }
    ]
  },
  'sarees': {
    sampleImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Kanjivaram Pure Silk', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
      { title: 'Banarasi Zari Handloom', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Kanjivaram Handloom Pure Mulberry Silk Saree',
    defaultSubtitle: 'Pure Gold & Silver Zari Woven Temple Border with Contrast Pallu',
    defaultPrice: 850,
    defaultOriginalPrice: 1050,
    defaultSizes: 'Free Size (5.5m Saree + 0.8m Unstitched Blouse Piece)',
    sizeLabel: 'Saree Fabric Dimensions',
    sizePlaceholder: '5.5m + 0.8m Blouse Piece',
    weightLabel: 'Net Fabric Weight (grams)',
    defaultFeatures: [
      'Silk Mark certified 100% pure mulberry silk yarn',
      'Intricate Korvai handloom weaving technique with real zari threads',
      'Includes coordinated 0.8 metre unstitched blouse piece with matching border',
      'Shipped in a breathable pure cotton archival saree preservation bag'
    ],
    fieldGroupTitle: 'Handloom Saree & Fabric Specifications',
    fieldGroupDesc: 'Specify silk weave type, zari content, blouse piece inclusion, and care instructions.',
    customAttributes: [
      {
        key: 'fabricType',
        label: 'Silk / Fabric Classification',
        type: 'select',
        options: ['Pure Kanjivaram Mulberry Silk', 'Banarasi Silk Georgette', 'Chanderi Zari Silk', 'Pure Organza Silk', 'Tussar Handspun Silk', 'Patan Patola Double Ikat'],
        defaultValue: 'Pure Kanjivaram Mulberry Silk'
      },
      {
        key: 'zariType',
        label: 'Zari Metallic Thread Grade',
        type: 'select',
        options: ['Pure Silver & Gold Electroplated Zari', 'Tested High-Sheen Metallic Zari', 'Antique Copper Matte Zari', 'Resham Threadwork Only'],
        defaultValue: 'Pure Silver & Gold Electroplated Zari'
      },
      {
        key: 'blousePiece',
        label: 'Blouse Fabric Inclusion',
        type: 'select',
        options: ['Included - 0.8m Unstitched Contrast Fabric', 'Included - 1.0m Heavy Embroidered Piece', 'Stitched Readymade Blouse Included', 'No Blouse Piece Included'],
        defaultValue: 'Included - 0.8m Unstitched Contrast Fabric'
      },
      {
        key: 'occasion',
        label: 'Recommended Occasion',
        type: 'select',
        options: ['Bridal & Wedding Trousseau', 'Festive Ceremony', 'Cocktail & Evening Gala', 'Formal Reception'],
        defaultValue: 'Bridal & Wedding Trousseau'
      },
      {
        key: 'washCare',
        label: 'Fabric Care & Preservation',
        type: 'text',
        defaultValue: 'Dry Clean Only. Wrap in Muslin Cloth.',
        placeholder: 'e.g. Dry Clean Only'
      }
    ]
  },
  'ethnic-wear': {
    sampleImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Designer Anarkali Suit', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
      { title: 'Embroidered Kurti Set', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Artisanal Chikankari Hand-Embroidered Kurti Set',
    defaultSubtitle: 'Pure Mulmul Cotton with Mukaish Highlights and Organza Dupatta',
    defaultPrice: 420,
    defaultOriginalPrice: 520,
    defaultSizes: 'XS (34), S (36), M (38), L (40), XL (42), XXL (44)',
    sizeLabel: 'Available Garment Sizes',
    sizePlaceholder: 'XS, S, M, L, XL, XXL',
    weightLabel: 'Garment Set Weight',
    defaultFeatures: [
      'Authentic Lucknowi shadow chikankari hand stitches',
      'Pre-washed pure mulmul cotton base for zero shrinkage',
      'Includes handcrafted modal pants and pure organza dupatta',
      'Dry clean or gentle cold hand wash recommended'
    ],
    fieldGroupTitle: 'Ethnic Ensemble & Tailoring Details',
    fieldGroupDesc: 'Set silhouette, embroidery craft, inner lining, and sizing chart.',
    customAttributes: [
      {
        key: 'fabricMaterial',
        label: 'Fabric Material & Composition',
        type: 'select',
        options: ['100% Pure Mulmul Cotton', 'Raw Silk with Santoon Lining', 'Chanderi Silk Blend', 'Georgette with Mirror Work'],
        defaultValue: '100% Pure Mulmul Cotton'
      },
      {
        key: 'craftTechnique',
        label: 'Embroidery & Handcraft Technique',
        type: 'select',
        options: ['Lucknowi Chikankari & Mukaish', 'Zardozi & Dabka Work', 'Gota Patti Mirror Craft', 'Kashmiri Aari Threadwork'],
        defaultValue: 'Lucknowi Chikankari & Mukaish'
      },
      {
        key: 'sleeveLength',
        label: 'Sleeve Styling',
        type: 'select',
        options: ['Three-Quarter (3/4) Sleeves', 'Full Length Sleeves', 'Sleeveless with Attachments', 'Elbow Length'],
        defaultValue: 'Three-Quarter (3/4) Sleeves'
      }
    ]
  },
  'western-wear': {
    sampleImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Tailored Silk Dress', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80' },
      { title: 'Couture Evening Gown', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Tailored Silk Crepe Architectural Evening Dress',
    defaultSubtitle: '100% Mulberry Silk Crepe with Concealed Back Zip and Side Drape',
    defaultPrice: 650,
    defaultOriginalPrice: 780,
    defaultSizes: 'UK 6 / US 2, UK 8 / US 4, UK 10 / US 6, UK 12 / US 8, UK 14 / US 10',
    sizeLabel: 'Standard Dress Sizes',
    sizePlaceholder: 'UK 6 (XS), UK 8 (S), UK 10 (M), UK 12 (L)',
    weightLabel: 'Garment Weight (grams)',
    defaultFeatures: [
      '100% pure heavy silk crepe de chine with smooth fluid drape',
      'Precision French seams with bespoke inner bodice boning',
      'Concealed Japanese YKK invisible back zipper',
      'Fully lined in breathable lightweight silk habotai'
    ],
    fieldGroupTitle: 'Couture Garment & Silhouette Specifications',
    fieldGroupDesc: 'Set silhouette cut, fabric composition, lining, neckline, and dress length.',
    customAttributes: [
      {
        key: 'dressSilhouette',
        label: 'Silhouette & Cut',
        type: 'select',
        options: ['Sculpted Column Dress', 'A-Line Flowing Flare', 'Bodycon Wrap Dress', 'Tailored Blazer Dress', 'Bias-Cut Slip Dress'],
        defaultValue: 'Sculpted Column Dress'
      },
      {
        key: 'neckline',
        label: 'Neckline & Collar',
        type: 'select',
        options: ['Sweetheart Neckline', 'Deep V-Neck', 'High Cowl Neck', 'Square Architectural Neck', 'Off-The-Shoulder Bardot'],
        defaultValue: 'Sweetheart Neckline'
      },
      {
        key: 'dressLength',
        label: 'Hem Length',
        type: 'select',
        options: ['Floor-Length Maxi', 'Calf-Length Midi', 'Above-Knee Mini', 'Asymmetrical High-Low'],
        defaultValue: 'Floor-Length Maxi'
      },
      {
        key: 'fabricComposition',
        label: 'Fabric Composition',
        type: 'text',
        defaultValue: '100% Mulberry Silk Crepe (22 Momme)',
        placeholder: 'e.g. 100% Mulberry Silk'
      }
    ]
  },
  'footwear': {
    sampleImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Italian Leather Stilettos', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
      { title: 'Pointed Mules & Flats', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Pointed-Toe Italian Calfskin Stiletto Pumps',
    defaultSubtitle: 'Handcrafted Tuscan Leather with Ergonomic Arch Support',
    defaultPrice: 540,
    defaultOriginalPrice: 620,
    defaultSizes: 'EU 36 (US 5.5), EU 37 (US 6.5), EU 38 (US 7.5), EU 39 (US 8.5), EU 40 (US 9.5)',
    sizeLabel: 'Shoe Sizes (EU / US)',
    sizePlaceholder: 'EU 36, EU 37, EU 38, EU 39, EU 40, EU 41',
    weightLabel: 'Pair Weight (grams)',
    defaultFeatures: [
      'Full-grain Italian calfskin with vegetable dye treatment',
      'Ergonomic memory-foam arch bed lined in breathable goatskin',
      'Buffed Italian genuine leather sole with rubber grip insert',
      'Includes branded dust bag and spare heel tap tips'
    ],
    fieldGroupTitle: 'Footwear & Heel Engineering Specifications',
    fieldGroupDesc: 'Specify upper leather, heel height, sole construction, and arch cushioning.',
    customAttributes: [
      {
        key: 'upperMaterial',
        label: 'Upper Material & Finish',
        type: 'select',
        options: ['Full-Grain Italian Calfskin', 'Velvet Goat Suede', 'Duchess Silk Satin', 'Cruelty-Free Bio-Leather'],
        defaultValue: 'Full-Grain Italian Calfskin'
      },
      {
        key: 'heelHeight',
        label: 'Heel Height & Structure',
        type: 'select',
        options: ['3.5 inch (90mm) Stiletto', '2.0 inch (50mm) Kitten Heel', '3.0 inch (75mm) Block Heel', 'Flat (10mm Comfort Sole)'],
        defaultValue: '3.5 inch (90mm) Stiletto'
      },
      {
        key: 'soleType',
        label: 'Outsole Construction',
        type: 'select',
        options: ['Hand-Buffed Italian Leather Sole with Non-Slip Rubber Pod', 'Full Leather Sole', 'Shock-Absorbing Vibram Rubber Sole'],
        defaultValue: 'Hand-Buffed Italian Leather Sole with Non-Slip Rubber Pod'
      }
    ]
  },
  'accessories': {
    sampleImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Leather Belt & Buckle', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' },
      { title: 'Designer Sunglasses', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80' },
      { title: 'Silk Twill Scarf', url: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Full-Grain Calfskin Belt with Sculpted Solid Brass Buckle',
    defaultSubtitle: 'Hand-Stitched Italian Saddle Leather with 24K Gold-Plated Hardware',
    defaultPrice: 320,
    defaultOriginalPrice: 380,
    defaultSizes: '75cm (XS), 80cm (S), 85cm (M), 90cm (L), 95cm (XL)',
    sizeLabel: 'Available Accessory Sizes / Dimensions',
    sizePlaceholder: '75cm, 80cm, 85cm, 90cm, 95cm',
    weightLabel: 'Item Weight (grams)',
    defaultFeatures: [
      'French edge-painted and hand-burnished finishing',
      'Solid brass buckle finished with 24K micron gold plating',
      'Full-grain bridle leather that patinas beautifully over time',
      'Gift-ready packaging with travel cotton bag'
    ],
    fieldGroupTitle: 'Accessory Material & Hardware Specifications',
    fieldGroupDesc: 'Set leather grade, hardware plating, dimensions, and craft certifications.',
    customAttributes: [
      {
        key: 'materialType',
        label: 'Primary Material',
        type: 'select',
        options: ['Full-Grain Italian Calfskin Leather', 'Handwoven 100% Silk Twill', 'Cellulose Acetate with Polarized Glass', 'Cashmere & Wool Blend'],
        defaultValue: 'Full-Grain Italian Calfskin Leather'
      },
      {
        key: 'hardwarePlating',
        label: 'Hardware & Metal Finish',
        type: 'select',
        options: ['24K Micron Gold Plated Solid Brass', 'Brushed Palladium Silver', 'Polished Gunmetal Chrome', 'Matte Black Ceramic'],
        defaultValue: '24K Micron Gold Plated Solid Brass'
      },
      {
        key: 'dimensions',
        label: 'Dimensions & Width',
        type: 'text',
        defaultValue: '30mm Width (Classic Trouser Width)',
        placeholder: 'e.g. 30mm Width, 90x90cm'
      }
    ]
  },
  'perfumes': {
    sampleImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Extrait de Parfum', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80' },
      { title: 'Pure Oud Oil Flacon', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Niche Extrait de Parfum - Archival Oud & Amber',
    defaultSubtitle: '30% Master Concentration with Rare Cambodian Agarwood & Damascena Rose',
    defaultPrice: 380,
    defaultOriginalPrice: 450,
    defaultSizes: '50ml / 1.7 fl.oz, 100ml / 3.4 fl.oz',
    sizeLabel: 'Bottle Volume Sizes',
    sizePlaceholder: '50ml (1.7 fl oz), 100ml (3.4 fl oz)',
    weightLabel: 'Packaged Net Weight (grams)',
    defaultFeatures: [
      'Formulated in Grasse, France with 30% pure perfume oil concentration',
      'Aged Cambodian agarwood and sustainably harvested bourbon vanilla',
      'Heavy crystal glass flacon with magnetic gold-plated zamak cap',
      'Cruelty-free, vegan, and free from phthalates and synthetic dyes'
    ],
    fieldGroupTitle: 'Olfactory Pyramid & Perfume Specifications',
    fieldGroupDesc: 'Set fragrance concentration, olfactory family, notes, and bottle volume.',
    customAttributes: [
      {
        key: 'fragranceConcentration',
        label: 'Perfume Concentration',
        type: 'select',
        options: ['Extrait de Parfum (30% Essential Oil)', 'Eau de Parfum (20% Oil)', 'Pure Attar Oil (100% Non-Alcoholic Concentrated Oil)'],
        defaultValue: 'Extrait de Parfum (30% Essential Oil)'
      },
      {
        key: 'olfactoryFamily',
        label: 'Fragrance Olfactory Family',
        type: 'select',
        options: ['Woody Oriental & Smoky Oud', 'Floral Amber & Damascena Rose', 'Warm Spicy & Bourbon Vanilla', 'Fresh Citrus & Bergamot Aromatic'],
        defaultValue: 'Woody Oriental & Smoky Oud'
      },
      {
        key: 'topNotes',
        label: 'Top & Heart Notes',
        type: 'text',
        defaultValue: 'Saffron, Pink Pepper, Turkish Rose, Agarwood',
        placeholder: 'e.g. Saffron, Bergamot, Amber'
      },
      {
        key: 'bottleVolume',
        label: 'Bottle Volume',
        type: 'text',
        defaultValue: '50 ml / 1.7 fl. oz.',
        placeholder: 'e.g. 50ml, 100ml'
      }
    ]
  },
  'general': {
    sampleImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    presetImages: [
      { title: 'Luxury Artifact', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80' }
    ],
    defaultTitle: 'Artisanal Studio Catalog Piece',
    defaultSubtitle: 'Handcrafted Heritage Collection Object',
    defaultPrice: 450,
    defaultOriginalPrice: 550,
    defaultSizes: 'Standard Studio Dimension',
    sizeLabel: 'Available Sizes',
    sizePlaceholder: 'Standard, Small, Large',
    weightLabel: 'Net Weight (grams)',
    defaultFeatures: [
      'Master artisan handcrafted finish',
      'Certified authentic materials and non-toxic finishing',
      'Secure protective packaging for safe transit'
    ],
    fieldGroupTitle: 'Product Specifications & Attributes',
    fieldGroupDesc: 'Enter general product dimensions, materials, and artisan highlights.',
    customAttributes: [
      {
        key: 'material',
        label: 'Primary Material',
        type: 'text',
        defaultValue: 'Solid Recycled Alloy / Fine Ceramics',
        placeholder: 'e.g. Marble, Solid Brass, Ceramic'
      },
      {
        key: 'finish',
        label: 'Finishing Technique',
        type: 'text',
        defaultValue: 'Hand-buffed Satin Luster',
        placeholder: 'e.g. Polished, Glazed'
      }
    ]
  }
};

export const ProductFormView: React.FC<ProductFormViewProps> = ({
  editingProduct,
  onSave,
  onCancel,
  currencySymbol
}) => {
  // Stepper State (Step 1: Category Selection, Step 2: Product Details)
  const [currentStep, setCurrentStep] = useState<1 | 2>(editingProduct ? 2 : 1);

  // Cascading Category Browser State (4-level hierarchy)
  const [lvl1Id, setLvl1Id] = useState<string>('women-fashion');
  const [lvl2Id, setLvl2Id] = useState<string>('accessories');
  const [lvl3Id, setLvl3Id] = useState<string>('jewellery');
  const [lvl4Id, setLvl4Id] = useState<string>('necklaces');

  // Search filter query in Step 1
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

  // Modals state
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showGuidelineModal, setShowGuidelineModal] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Hidden File input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    subtitle: editingProduct?.subtitle || '',
    price: editingProduct?.price || 1850,
    originalPrice: editingProduct?.originalPrice || 2150,
    stockCount: editingProduct?.stockCount ?? 12,
    category: editingProduct?.category || 'necklaces',
    metal: editingProduct?.metal || '18k-yellow-gold',
    metalName: editingProduct?.metalName || '18K Recycled Yellow Gold',
    karatPurity: editingProduct?.karatPurity || '750/1000 (18K Solid Gold)',
    description: editingProduct?.description || '',
    features: editingProduct?.features || [],
    availableSizes: editingProduct?.availableSizes || [],
    images: editingProduct?.images || [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    sku: editingProduct?.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
    netWeight: '6.8 grams',
    customAttributeValues: {} as Record<string, string>
  });

  const [featuresText, setFeaturesText] = useState(
    (editingProduct?.features || []).join('\n')
  );
  const [sizesText, setSizesText] = useState(
    (editingProduct?.availableSizes || []).join(', ')
  );
  const [imageUrlsText, setImageUrlsText] = useState(
    (editingProduct?.images || []).join('\n')
  );
  const [isDraggingStep1, setIsDraggingStep1] = useState(false);
  const [isDraggingStep2, setIsDraggingStep2] = useState(false);
  const [showAdvancedUrlInput, setShowAdvancedUrlInput] = useState(false);

  // Level 1 Node
  const lvl1Node = useMemo(() => {
    return CATEGORY_TREE.find(n => n.id === lvl1Id) || CATEGORY_TREE[0];
  }, [lvl1Id]);

  // Level 2 Node
  const lvl2Node = useMemo(() => {
    return lvl1Node.children?.find(n => n.id === lvl2Id) || lvl1Node.children?.[0];
  }, [lvl1Node, lvl2Id]);

  // Level 3 Node
  const lvl3Node = useMemo(() => {
    return lvl2Node?.children?.find(n => n.id === lvl3Id) || lvl2Node?.children?.[0];
  }, [lvl2Node, lvl3Id]);

  // Level 4 Node (Leaf)
  const lvl4Node = useMemo(() => {
    return lvl3Node?.children?.find(n => n.id === lvl4Id) || lvl3Node?.children?.[0];
  }, [lvl3Node, lvl4Id]);

  // Current Breadcrumb Trail
  const breadcrumbTrail = useMemo(() => {
    const parts = [lvl1Node?.name, lvl2Node?.name, lvl3Node?.name, lvl4Node?.name].filter(Boolean);
    return parts.join(' / ');
  }, [lvl1Node, lvl2Node, lvl3Node, lvl4Node]);

  // Detect active category config key based on the leaf node ID or categoryType
  const activeCategoryKey = useMemo(() => {
    if (lvl4Node?.categoryType && CATEGORY_CONFIGS[lvl4Node.categoryType]) {
      return lvl4Node.categoryType;
    }
    if (lvl4Id && CATEGORY_CONFIGS[lvl4Id]) {
      return lvl4Id;
    }
    if (lvl3Id && CATEGORY_CONFIGS[lvl3Id]) {
      return lvl3Id;
    }
    if (lvl4Node?.mappedCategory && CATEGORY_CONFIGS[lvl4Node.mappedCategory]) {
      return lvl4Node.mappedCategory;
    }
    return 'general';
  }, [lvl4Node, lvl4Id, lvl3Id]);

  const activeConfig = useMemo(() => {
    return CATEGORY_CONFIGS[activeCategoryKey] || CATEGORY_CONFIGS['general'];
  }, [activeCategoryKey]);

  // When category changes in Step 1, adapt defaults IF NOT editing existing product
  const applyCategoryDefaults = (categoryKey: string, leafNode: CategoryNode | undefined) => {
    const config = CATEGORY_CONFIGS[categoryKey] || CATEGORY_CONFIGS['general'];
    if (!editingProduct) {
      const initialCustomValues: Record<string, string> = {};
      config.customAttributes.forEach(attr => {
        initialCustomValues[attr.key] = attr.defaultValue;
      });

      setFormData(prev => ({
        ...prev,
        name: config.defaultTitle,
        subtitle: config.defaultSubtitle,
        price: config.defaultPrice,
        originalPrice: config.defaultOriginalPrice,
        category: leafNode?.mappedCategory || (prev.category as ProductCategory),
        images: [config.sampleImage],
        availableSizes: config.defaultSizes.split(',').map(s => s.trim()),
        features: config.defaultFeatures,
        customAttributeValues: initialCustomValues
      }));

      setFeaturesText(config.defaultFeatures.join('\n'));
      setSizesText(config.defaultSizes);
      setImageUrlsText(config.sampleImage);
    }
  };

  // Search Results Flattening
  const searchResults = useMemo(() => {
    if (!categorySearchQuery.trim()) return [];
    const query = categorySearchQuery.toLowerCase();
    const results: { path: string; l1: string; l2: string; l3: string; l4: string; leaf: CategoryNode }[] = [];

    CATEGORY_TREE.forEach(l1 => {
      l1.children?.forEach(l2 => {
        l2.children?.forEach(l3 => {
          l3.children?.forEach(l4 => {
            const fullPath = `${l1.name} / ${l2.name} / ${l3.name} / ${l4.name}`;
            if (
              fullPath.toLowerCase().includes(query) ||
              l4.name.toLowerCase().includes(query) ||
              l3.name.toLowerCase().includes(query)
            ) {
              results.push({
                path: fullPath,
                l1: l1.id,
                l2: l2.id,
                l3: l3.id,
                l4: l4.id,
                leaf: l4
              });
            }
          });
        });
      });
    });

    return results.slice(0, 8);
  }, [categorySearchQuery]);

  const selectSearchResult = (item: { l1: string; l2: string; l3: string; l4: string; leaf: CategoryNode }) => {
    setLvl1Id(item.l1);
    setLvl2Id(item.l2);
    setLvl3Id(item.l3);
    setLvl4Id(item.l4);
    setCategorySearchQuery('');

    const configKey = item.leaf.categoryType || item.leaf.id || 'general';
    applyCategoryDefaults(configKey, item.leaf);
  };

  // Column Selection Handlers
  const handleSelectLvl1 = (node: CategoryNode) => {
    setLvl1Id(node.id);
    const firstL2 = node.children?.[0];
    if (firstL2) {
      setLvl2Id(firstL2.id);
      const firstL3 = firstL2.children?.[0];
      if (firstL3) {
        setLvl3Id(firstL3.id);
        const firstL4 = firstL3.children?.[0];
        if (firstL4) {
          setLvl4Id(firstL4.id);
          const configKey = firstL4.categoryType || firstL4.id || 'general';
          applyCategoryDefaults(configKey, firstL4);
        }
      }
    }
  };

  const handleSelectLvl2 = (node: CategoryNode) => {
    setLvl2Id(node.id);
    const firstL3 = node.children?.[0];
    if (firstL3) {
      setLvl3Id(firstL3.id);
      const firstL4 = firstL3.children?.[0];
      if (firstL4) {
        setLvl4Id(firstL4.id);
        const configKey = firstL4.categoryType || firstL4.id || 'general';
        applyCategoryDefaults(configKey, firstL4);
      }
    }
  };

  const handleSelectLvl3 = (node: CategoryNode) => {
    setLvl3Id(node.id);
    const firstL4 = node.children?.[0];
    if (firstL4) {
      setLvl4Id(firstL4.id);
      const configKey = firstL4.categoryType || firstL4.id || 'general';
      applyCategoryDefaults(configKey, firstL4);
    }
  };

  const handleSelectLvl4 = (node: CategoryNode) => {
    setLvl4Id(node.id);
    const configKey = node.categoryType || node.id || 'general';
    applyCategoryDefaults(configKey, node);
  };

  // Image Processing & Upload Handlers
  const processImageFiles = (files: FileList | File[]) => {
    const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileList.length === 0) return;

    let loadedCount = 0;
    const newImages: string[] = [];

    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          newImages.push(uploadEvent.target.result as string);
        }
        loadedCount++;
        if (loadedCount === fileList.length) {
          setFormData(prev => {
            const combined = [...newImages, ...prev.images];
            setImageUrlsText(combined.join('\n'));
            return { ...prev, images: combined };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    setFormData(prev => {
      const target = prev.images[index];
      const rest = prev.images.filter((_, i) => i !== index);
      const reordered = [target, ...rest];
      setImageUrlsText(reordered.join('\n'));
      return { ...prev, images: reordered };
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const filtered = prev.images.filter((_, i) => i !== index);
      const result = filtered.length > 0 ? filtered : [activeConfig.sampleImage];
      setImageUrlsText(result.join('\n'));
      return { ...prev, images: result };
    });
  };

  const handleApplySampleImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [url, ...prev.images.filter(img => img !== url)]
    }));
    setImageUrlsText(prev => `${url}\n${prev}`.trim());
  };

  // Proceed to Step 2
  const handleProceedToDetails = () => {
    if (!formData.images || formData.images.length === 0) {
      setFormData(prev => ({ ...prev, images: [activeConfig.sampleImage] }));
      setImageUrlsText(activeConfig.sampleImage);
    }
    // Initialize any unset custom attributes with defaults
    const currentCustom = { ...formData.customAttributeValues };
    activeConfig.customAttributes.forEach(attr => {
      if (!currentCustom[attr.key]) {
        currentCustom[attr.key] = attr.defaultValue;
      }
    });
    setFormData(prev => ({ ...prev, customAttributeValues: currentCustom }));
    setCurrentStep(2);
  };

  // Final Form Submission
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please provide a listing title for the catalog.');
      return;
    }

    const cleanedImages = imageUrlsText.split('\n').map(u => u.trim()).filter(Boolean);
    const cleanedFeatures = featuresText.split('\n').map(f => f.trim()).filter(Boolean);
    const cleanedSizes = sizesText.split(',').map(s => s.trim()).filter(Boolean);

    onSave({
      ...formData,
      images: cleanedImages.length > 0 ? cleanedImages : [activeConfig.sampleImage],
      features: cleanedFeatures.length > 0 ? cleanedFeatures : activeConfig.defaultFeatures,
      availableSizes: cleanedSizes.length > 0 ? cleanedSizes : activeConfig.defaultSizes.split(',').map(s => s.trim()),
      categoryBreadcrumbs: breadcrumbTrail,
      categoryClass: lvl4Node?.name || 'General Product'
    });
  };

  // Financial calculations
  const netPayout = Math.round(formData.price * 0.9);
  const discountPercent = formData.originalPrice > formData.price 
    ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#e5e5ea] shadow-sm font-sans text-[#212121] overflow-hidden">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        multiple 
        className="hidden" 
      />

      {/* 1. Top Bar / App Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5ea] bg-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (currentStep === 2 && !editingProduct) {
                setCurrentStep(1);
              } else {
                setShowDiscardConfirm(true);
              }
            }}
            className="p-1 text-[#212121] hover:text-[#5022c3] transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-bold text-[#212121] tracking-tight">
              {editingProduct ? `Edit Catalog: ${editingProduct.name}` : 'Add Single Catalog'}
            </h1>
            <span className="px-2 py-0.5 bg-[#f0ebf8] text-[#5022c3] rounded text-[11px] font-semibold hidden md:inline-block">
              {breadcrumbTrail}
            </span>
          </div>
        </div>

        {/* Right Tutorial & Help Tools */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="flex items-center gap-1.5 text-[#e53935] hover:text-[#c62828] transition-colors"
          >
            <PlayCircle className="w-4 h-4 fill-current text-white" />
            <span className="hidden sm:inline">Learn to upload single catalog?</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0ebf8] text-[#5022c3] rounded-full hover:bg-[#e4d8f5] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need Help?</span>
          </button>
        </div>
      </div>

      {/* 2. Stepper Tab Header */}
      <div className="px-6 border-b border-[#e5e5ea] bg-white flex items-center gap-8 text-xs font-semibold select-none">
        
        {/* Step 1 Tab */}
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`flex items-center gap-2 py-3.5 border-b-2 transition-all ${
            currentStep === 1
              ? 'border-[#5022c3] text-[#5022c3]'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
            currentStep === 1
              ? 'bg-[#5022c3] text-white'
              : currentStep === 2
              ? 'bg-emerald-600 text-white'
              : 'bg-[#e5e5ea] text-[#717478]'
          }`}>
            {currentStep === 2 ? '✓' : '1'}
          </span>
          <span>1. Select Category</span>
        </button>

        {/* Step 2 Tab */}
        <button
          type="button"
          onClick={() => handleProceedToDetails()}
          className={`flex items-center gap-2 py-3.5 border-b-2 transition-all ${
            currentStep === 2
              ? 'border-[#5022c3] text-[#5022c3]'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
            currentStep === 2 ? 'bg-[#5022c3] text-white' : 'bg-[#e5e5ea] text-[#717478]'
          }`}>
            2
          </span>
          <span>2. Add Product Details ({lvl4Node?.name || 'Custom Category'})</span>
        </button>

      </div>

      {/* 3. STEP 1: SELECT CATEGORY & UPLOAD PHOTO */}
      {currentStep === 1 && (
        <div className="p-6 space-y-6">
          
          {/* Search Category Input */}
          <div className="max-w-xl space-y-1.5 relative">
            <label className="block text-xs font-bold text-[#212121]">Search Category</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#878787]" />
              <input
                type="text"
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                placeholder="Try Sarees, Necklaces & Chains, Rings, Bangles, Kurtis, Footwear, Dresses..."
                className="w-full bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#5022c3] focus:bg-white text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all"
              />
              {categorySearchQuery && (
                <button
                  type="button"
                  onClick={() => setCategorySearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#e5e5ea] rounded-xl shadow-xl z-50 py-1 text-xs max-h-60 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#878787] uppercase tracking-wider bg-[#f5f5f7]">
                  Matching Categories
                </div>
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSearchResult(item)}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#f0ebf8] hover:text-[#5022c3] flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium text-[#212121]">{item.path}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#878787]" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cascading 4-Column Category Hierarchy Browser + Right Image Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 4-Column Browser (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-[#e5e5ea] rounded-xl overflow-hidden shadow-xs grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#e5e5ea] h-[340px]">
              
              {/* Column 1: Main Categories */}
              <div className="overflow-y-auto py-2 text-xs divide-y divide-gray-50 select-none">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#878787] uppercase tracking-wider">
                  Departments
                </div>
                {CATEGORY_TREE.map(cat => {
                  const isSelected = cat.id === lvl1Id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectLvl1(cat)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-[11px] font-medium transition-colors relative ${
                        isSelected 
                          ? 'bg-[#5022c3] text-white font-bold' 
                          : 'text-[#212121] hover:bg-[#f5f5f7]'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && (
                        <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-[#5022c3] absolute -right-[6px] z-10 hidden sm:block" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Column 2: Level 2 Subcategories */}
              <div className="overflow-y-auto py-2 text-xs divide-y divide-gray-50 select-none">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#878787] uppercase tracking-wider">
                  Type
                </div>
                {lvl1Node.children?.map(cat => {
                  const isSelected = cat.id === lvl2Id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectLvl2(cat)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-[11px] font-medium transition-colors relative ${
                        isSelected 
                          ? 'bg-[#5022c3] text-white font-bold' 
                          : 'text-[#212121] hover:bg-[#f5f5f7]'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && (
                        <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-[#5022c3] absolute -right-[6px] z-10 hidden sm:block" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Column 3: Level 3 Sub-branches */}
              <div className="overflow-y-auto py-2 text-xs divide-y divide-gray-50 select-none">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#878787] uppercase tracking-wider">
                  Subcategory
                </div>
                {lvl2Node?.children?.map(cat => {
                  const isSelected = cat.id === lvl3Id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectLvl3(cat)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-[11px] font-medium transition-colors relative ${
                        isSelected 
                          ? 'bg-[#5022c3] text-white font-bold' 
                          : 'text-[#212121] hover:bg-[#f5f5f7]'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && (
                        <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-[#5022c3] absolute -right-[6px] z-10 hidden sm:block" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Column 4: Level 4 Leaf Categories */}
              <div className="overflow-y-auto py-2 text-xs divide-y divide-gray-50 select-none">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#878787] uppercase tracking-wider">
                  Product Class
                </div>
                {lvl3Node?.children?.map(cat => {
                  const isSelected = cat.id === lvl4Id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectLvl4(cat)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-[11px] font-medium transition-colors ${
                        isSelected 
                          ? 'bg-[#5022c3] text-white font-bold' 
                          : 'text-[#212121] hover:bg-[#f5f5f7]'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Right Preview Card & Upload Trigger (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-[#e5e5ea] rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
              
              {/* Category Breadcrumb Ribbon */}
              <div className="bg-[#f0f4f9] px-4 py-2.5 text-center text-xs font-semibold text-[#1e293b] border-b border-[#e5e5ea] tracking-tight truncate">
                {breadcrumbTrail}
              </div>

              {/* Guide / Sample Image View & Direct Drag-and-Drop Zone */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDraggingStep1(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDraggingStep1(false); }}
                onDrop={(e) => { 
                  e.preventDefault(); 
                  setIsDraggingStep1(false); 
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    processImageFiles(e.dataTransfer.files);
                  }
                }}
                className={`p-6 text-center space-y-4 transition-colors ${
                  isDraggingStep1 ? 'bg-[#f0ebf8] border-2 border-dashed border-[#5022c3]' : ''
                }`}
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-36 h-36 mx-auto rounded-xl bg-[#f5f5f7] border border-[#e5e5ea] overflow-hidden flex items-center justify-center shadow-xs relative group cursor-pointer hover:border-[#5022c3] transition-all"
                >
                  <img
                    src={formData.images[0] || activeConfig.sampleImage}
                    alt="Category Preview"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {formData.images.length > 0 && formData.images[0] !== activeConfig.sampleImage ? 'UPLOADED PHOTO' : 'SAMPLE PREVIEW'}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity gap-1">
                    <Upload className="w-4 h-4" />
                    <span>Click to change</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#212121]">
                    {isDraggingStep1 ? 'Drop front photo here!' : 'Directly upload product front photo'}
                  </p>
                  <p className="text-[11px] text-[#717478] mt-0.5">
                    Drag & drop directly from your computer or phone for {lvl4Node?.name}
                  </p>
                </div>

                {/* Primary Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 bg-[#5022c3] hover:bg-[#431bb0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Choose Images from Device</span>
                </button>

                {/* Suggested Sample Photos for current Category */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-[#878787] uppercase tracking-wider mb-2">
                    Or pick an atelier sample for {lvl4Node?.name || 'this category'}:
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {activeConfig.presetImages.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplySampleImage(preset.url)}
                        title={preset.title}
                        className="w-9 h-9 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#5022c3] transition-all hover:scale-110"
                      >
                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Quality Check Guidelines link */}
              <div className="bg-[#fffbeb] p-3 border-t border-[#fef3c7] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-[#92400e]">
                  <AlertCircle className="w-4 h-4 text-[#d97706] shrink-0" />
                  <span className="font-medium">Photos Quality Check & Guidelines</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuidelineModal(true)}
                  className="text-[#5022c3] font-bold hover:underline"
                >
                  View
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Footer Actions for Step 1 */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e5e5ea]">
            <button
              type="button"
              onClick={() => setShowDiscardConfirm(true)}
              className="px-4 py-2 border border-[#dadce0] rounded-xl text-xs font-semibold text-[#5022c3] hover:bg-[#f0ebf8] transition-colors"
            >
              Discard Catalog
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-[#717478]">Selected Category Class:</span>
                <p className="text-xs font-bold text-[#5022c3]">{lvl4Node?.name}</p>
              </div>
              <button
                type="button"
                onClick={handleProceedToDetails}
                className="px-6 py-2.5 bg-[#5022c3] hover:bg-[#431bb0] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Continue to Product Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 4. STEP 2: ADD PRODUCT DETAILS - DYNAMICALLY CONFIGURED FOR SELECTED CATEGORY */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
          
          {/* Breadcrumb Info Bar with Change Category action */}
          <div className="p-3.5 bg-[#f0f4f9] rounded-xl border border-[#e5e5ea] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#5022c3] uppercase tracking-wider bg-[#f0ebf8] px-2 py-0.5 rounded">
                  Selected Taxonomy
                </span>
                <span className="text-[11px] text-[#555] font-medium">Auto-configured fields for: <strong>{lvl4Node?.name}</strong></span>
              </div>
              <p className="font-bold text-[#212121] text-sm">{breadcrumbTrail}</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-3.5 py-1.5 bg-white border border-[#dadce0] rounded-lg text-xs font-semibold text-[#5022c3] hover:bg-[#f0ebf8] transition-colors self-start sm:self-auto shadow-xs"
            >
              Change Category
            </button>
          </div>

          {/* Quick Imagery Header Bar */}
          <div className="p-4 rounded-xl border border-[#e5e5ea] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#212121]">Product Imagery & Studio Angles</h3>
                <p className="text-[11px] text-[#717478]">Upload front view, fit angles, hallmarking stamps, or close-ups for {lvl4Node?.name}.</p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#5022c3] hover:bg-[#431bb0] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New Angle</span>
              </button>
            </div>

            {/* Thumbnail Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {formData.images.map((imgUrl, imgIdx) => (
                <div 
                  key={imgIdx} 
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border bg-[#f5f5f7] group shrink-0 shadow-xs transition-all ${
                    imgIdx === 0 ? 'border-[#5022c3] ring-2 ring-[#5022c3]/20' : 'border-[#e5e5ea]'
                  }`}
                >
                  <img src={imgUrl} alt="Product Angle" className="w-full h-full object-cover" />
                  {imgIdx === 0 ? (
                    <span className="absolute bottom-0 inset-x-0 bg-[#5022c3] text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wide">
                      Main Front
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetCoverImage(imgIdx)}
                      className="absolute inset-x-0 bottom-0 bg-black/75 hover:bg-[#5022c3] text-white text-[8px] font-semibold text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Set Main
                    </button>
                  )}
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(imgIdx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add New Angle Slot */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-[#dadce0] hover:border-[#5022c3] hover:bg-[#f0ebf8] flex flex-col items-center justify-center text-[#717478] hover:text-[#5022c3] transition-all group shrink-0"
              >
                <Plus className="w-4 h-4 mb-0.5 text-gray-400 group-hover:text-[#5022c3]" />
                <span className="text-[9px] font-bold">Add Photo</span>
              </button>
            </div>
          </div>

          {/* Section A: Core Identity & Pricing */}
          <div className="border border-[#e5e5ea] rounded-xl p-4 bg-white space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <Tag className="w-4 h-4 text-[#5022c3]" />
              <h3 className="text-xs font-bold text-[#212121] uppercase tracking-wider">
                1. General Product Identification & Pricing
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* Title */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block font-bold mb-1 text-[#212121]">Listing Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder={`e.g. ${activeConfig.defaultTitle}`}
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#5022c3] focus:bg-white rounded-xl px-3.5 py-2.5 outline-none font-medium transition-all"
                />
              </div>

              {/* Subtitle / Architecture Description */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block font-bold mb-1 text-[#212121]">Subtitle / Architecture Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder={`e.g. ${activeConfig.defaultSubtitle}`}
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#5022c3] focus:bg-white rounded-xl px-3.5 py-2.5 outline-none transition-all"
                />
              </div>

              {/* Primary Category Mapping */}
              <div>
                <label className="block font-bold mb-1 text-[#212121]">Storefront Category *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#5022c3] rounded-xl px-3.5 py-2.5 outline-none font-medium"
                >
                  <option value="necklaces">Necklaces & Chains</option>
                  <option value="rings">Continuous Rings</option>
                  <option value="earrings">Sculpted Hoops & Earrings</option>
                  <option value="bracelets">Articulated Cuffs & Bangles</option>
                  <option value="fine-collections">Fine Collections / Sets</option>
                  <option value="bespoke">Bespoke Commissions</option>
                </select>
              </div>

              {/* Listing Price */}
              <div>
                <label className="block font-bold mb-1 text-[#212121]">Selling Price ({currencySymbol}) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#5022c3] focus:bg-white rounded-xl px-3.5 py-2.5 outline-none font-bold text-sm"
                />
              </div>

              {/* Original Price / MSRP */}
              <div>
                <label className="block font-bold mb-1 text-[#212121]">Original / MSRP ({currencySymbol})</label>
                <input
                  type="number"
                  min={1}
                  value={formData.originalPrice}
                  onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#5022c3] focus:bg-white rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              {/* Settlement Payout Display */}
              <div>
                <label className="block font-bold mb-1 text-[#212121]">Net Payout Settlement</label>
                <div className="w-full bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl px-3.5 py-2.5 font-bold text-emerald-700 text-sm flex items-center justify-between">
                  <span>{currencySymbol}{netPayout}</span>
                  <span className="text-[10px] text-emerald-600 font-medium">90% net (10% fees)</span>
                </div>
              </div>

              {/* Inventory Units */}
              <div>
                <label className="block font-bold mb-1 text-[#212121]">Vault Stock Units *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stockCount}
                  onChange={e => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#5022c3] focus:bg-white rounded-xl px-3.5 py-2.5 outline-none font-bold"
                />
              </div>

              {/* SKU code */}
              <div>
                <label className="block font-bold mb-1 text-[#212121]">Inventory SKU / Identifier</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#5022c3] focus:bg-white rounded-xl px-3.5 py-2.5 outline-none font-mono text-[11px]"
                />
              </div>

            </div>
          </div>

          {/* Section B: Dynamic Specific Specifications for the selected Category */}
          <div className="border border-[#e5e5ea] rounded-xl p-4 bg-[#faf9fe] space-y-4">
            <div className="flex items-center justify-between border-b border-[#ebdffc] pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#5022c3]" />
                <div>
                  <h3 className="text-xs font-bold text-[#212121] uppercase tracking-wider">
                    2. {activeConfig.fieldGroupTitle}
                  </h3>
                  <p className="text-[11px] text-[#717478]">{activeConfig.fieldGroupDesc}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-[#5022c3] text-white text-[10px] font-bold rounded-full">
                {lvl4Node?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* If jewellery-related: show Precious Metal Alloy & Hallmark */}
              {(activeCategoryKey === 'necklaces' || activeCategoryKey === 'rings' || activeCategoryKey === 'bracelets' || activeCategoryKey === 'earrings' || activeCategoryKey === 'jewellery-set') && (
                <>
                  <div>
                    <label className="block font-bold mb-1 text-[#212121]">Precious Metal Alloy *</label>
                    <select
                      value={formData.metal}
                      onChange={e => {
                        const m = e.target.value as MetalType;
                        const nameMap: Record<MetalType, string> = {
                          '18k-yellow-gold': '18K Recycled Yellow Gold',
                          '18k-white-gold': '18K Recycled White Gold',
                          '18k-rose-gold': '18K Recycled Rose Gold',
                          '925-sterling-silver': '925 Sterling Silver',
                          'platinum': 'Platinum 950',
                          'gold-vermeil': '18K Gold Vermeil'
                        };
                        setFormData({ ...formData, metal: m, metalName: nameMap[m] });
                      }}
                      className="w-full bg-white border border-[#e5e5ea] focus:border-[#5022c3] rounded-xl px-3.5 py-2.5 outline-none font-medium"
                    >
                      <option value="18k-yellow-gold">18K Recycled Yellow Gold</option>
                      <option value="18k-white-gold">18K Recycled White Gold</option>
                      <option value="18k-rose-gold">18K Recycled Rose Gold</option>
                      <option value="925-sterling-silver">925 Sterling Silver</option>
                      <option value="platinum">Platinum 950</option>
                      <option value="gold-vermeil">18K Gold Vermeil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-[#212121]">Karat Purity & Hallmark</label>
                    <input
                      type="text"
                      value={formData.karatPurity}
                      onChange={e => setFormData({ ...formData, karatPurity: e.target.value })}
                      placeholder="e.g. 750/1000 (18K Solid Gold)"
                      className="w-full bg-white border border-[#e5e5ea] focus:border-[#5022c3] rounded-xl px-3.5 py-2.5 outline-none"
                    />
                  </div>
                </>
              )}

              {/* Dynamic Category Specific Attributes */}
              {activeConfig.customAttributes.map(attr => (
                <div key={attr.key}>
                  <label className="block font-bold mb-1 text-[#212121]">{attr.label}</label>
                  {attr.type === 'select' && attr.options ? (
                    <select
                      value={formData.customAttributeValues[attr.key] || attr.defaultValue}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          customAttributeValues: {
                            ...prev.customAttributeValues,
                            [attr.key]: val
                          }
                        }));
                      }}
                      className="w-full bg-white border border-[#e5e5ea] focus:border-[#5022c3] rounded-xl px-3.5 py-2.5 outline-none font-medium"
                    >
                      {attr.options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.customAttributeValues[attr.key] ?? attr.defaultValue}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          customAttributeValues: {
                            ...prev.customAttributeValues,
                            [attr.key]: val
                          }
                        }));
                      }}
                      placeholder={attr.placeholder || ''}
                      className="w-full bg-white border border-[#e5e5ea] focus:border-[#5022c3] rounded-xl px-3.5 py-2.5 outline-none"
                    />
                  )}
                </div>
              ))}

              {/* Net Weight Field */}
              <div>
                <label className="block font-bold mb-1 text-[#212121]">
                  {activeConfig.weightLabel || 'Approximate Net Weight'}
                </label>
                <input
                  type="text"
                  value={formData.netWeight}
                  onChange={e => setFormData({ ...formData, netWeight: e.target.value })}
                  placeholder="e.g. 6.8 grams"
                  className="w-full bg-white border border-[#e5e5ea] focus:border-[#5022c3] rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              {/* Available Sizes Field (Dynamic Label) */}
              <div className="sm:col-span-2">
                <label className="block font-bold mb-1 text-[#212121]">
                  {activeConfig.sizeLabel} (comma separated)
                </label>
                <input
                  type="text"
                  value={sizesText}
                  onChange={e => setSizesText(e.target.value)}
                  placeholder={activeConfig.sizePlaceholder}
                  className="w-full bg-white border border-[#e5e5ea] focus:border-[#5022c3] rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

            </div>
          </div>

          {/* Section C: Key Features & Direct Image URLs */}
          <div className="border border-[#e5e5ea] rounded-xl p-4 bg-white space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-[#5022c3]" />
              <h3 className="text-xs font-bold text-[#212121] uppercase tracking-wider">
                3. Artisan Highlights & Description
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* Key Bullet Features */}
              <div className="sm:col-span-2 lg:col-span-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#212121]">Key Artisan Highlights (one per line)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturesText(activeConfig.defaultFeatures.join('\n'));
                    }}
                    className="text-[10px] text-[#5022c3] font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset to {lvl4Node?.name} defaults</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={e => setFeaturesText(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] focus:border-[#5022c3] focus:bg-white rounded-xl p-3 outline-none"
                  placeholder="Engineered anti-tangle herringbone link..."
                />
              </div>

              {/* Direct Image Upload Studio & Media Manager */}
              <div className="sm:col-span-2 lg:col-span-3 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-[#212121]">Product Photos & Studio Imagery</label>
                    <p className="text-[11px] text-[#717478]">Upload front view, side angles, close-ups, or hallmark certificate photos directly from your device.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-[#5022c3] hover:bg-[#431bb0] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Direct Images</span>
                    </button>
                  </div>
                </div>

                {/* Drag & Drop Upload Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingStep2(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingStep2(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingStep2(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      processImageFiles(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDraggingStep2
                      ? 'border-[#5022c3] bg-[#f0ebf8] scale-[1.01]'
                      : 'border-[#dadce0] bg-[#faf9fe] hover:border-[#5022c3] hover:bg-[#f5f2fd]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#f0ebf8] text-[#5022c3] flex items-center justify-center mb-2.5">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-[#212121]">
                    {isDraggingStep2 ? 'Drop your images here now!' : 'Click to browse or drag and drop image files directly from your computer / phone'}
                  </p>
                  <p className="text-[11px] text-[#717478] mt-0.5">
                    Supports PNG, JPG, JPEG, WEBP, HEIC • Upload multiple photos simultaneously
                  </p>
                </div>

                {/* Visual Gallery of Uploaded Angles */}
                {formData.images.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#212121]">Uploaded Product Angles ({formData.images.length})</span>
                      <span className="text-[#717478]">The first photo will be used as the catalog main thumbnail</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {formData.images.map((imgUrl, imgIdx) => (
                        <div
                          key={imgIdx}
                          className={`relative rounded-xl overflow-hidden border bg-white shadow-xs group transition-all ${
                            imgIdx === 0 ? 'border-[#5022c3] ring-2 ring-[#5022c3]/20' : 'border-[#e5e5ea]'
                          }`}
                        >
                          <div className="aspect-square bg-[#f5f5f7] overflow-hidden flex items-center justify-center">
                            <img src={imgUrl} alt={`Product Angle ${imgIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>

                          {/* Badges */}
                          {imgIdx === 0 ? (
                            <div className="absolute top-1.5 left-1.5 bg-[#5022c3] text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>COVER PHOTO</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(imgIdx)}
                              className="absolute top-1.5 left-1.5 bg-black/70 hover:bg-[#5022c3] text-white text-[9px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-xs"
                            >
                              Set as Cover
                            </button>
                          )}

                          {/* Angle Label & Delete Button Bar */}
                          <div className="p-2 flex items-center justify-between bg-white border-t border-gray-100 text-[10px]">
                            <span className="font-semibold text-[#555]">
                              {imgIdx === 0 ? 'Angle 1 (Front)' : `Angle ${imgIdx + 1}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(imgIdx)}
                              title="Remove photo"
                              className="text-gray-400 hover:text-red-600 transition-colors p-0.5 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Quick Add Card Slot */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-[#dadce0] hover:border-[#5022c3] hover:bg-[#f0ebf8] flex flex-col items-center justify-center text-center p-3 text-[#717478] hover:text-[#5022c3] transition-all group"
                      >
                        <Plus className="w-6 h-6 mb-1 text-gray-400 group-hover:text-[#5022c3] transition-colors" />
                        <span className="text-[11px] font-bold">Add Another Photo</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Category Atelier Sample Photos */}
                <div className="p-3 bg-[#f0f4f9] rounded-xl border border-[#e5e5ea] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-[#212121] text-[11px]">Need inspiration? Pick a curated studio sample photo:</span>
                    <p className="text-[10px] text-[#717478]">Click to instantly apply professional atelier photography for {lvl4Node?.name}.</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {activeConfig.presetImages.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplySampleImage(preset.url)}
                        title={preset.title}
                        className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white hover:border-[#5022c3] transition-all hover:scale-105 shadow-xs"
                      >
                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collapsible Optional Direct Image URLs (Advanced fallback) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedUrlInput(!showAdvancedUrlInput)}
                    className="text-[11px] font-semibold text-[#717478] hover:text-[#5022c3] flex items-center gap-1.5 transition-colors"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>{showAdvancedUrlInput ? 'Hide URL import options' : 'Or import from Image URLs (Advanced)'}</span>
                  </button>

                  {showAdvancedUrlInput && (
                    <div className="mt-2 p-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl space-y-1.5">
                      <label className="block font-bold text-[11px] text-[#212121]">Paste Direct Image URLs (one per line)</label>
                      <textarea
                        rows={3}
                        value={imageUrlsText}
                        onChange={e => {
                          setImageUrlsText(e.target.value);
                          const parsed = e.target.value.split('\n').map(u => u.trim()).filter(Boolean);
                          if (parsed.length > 0) {
                            setFormData(prev => ({ ...prev, images: parsed }));
                          }
                        }}
                        className="w-full bg-white border border-[#e5e5ea] focus:border-[#5022c3] rounded-lg p-2.5 outline-none font-mono text-[11px]"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e5e5ea]">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-[#dadce0] rounded-xl text-xs font-semibold text-[#717478] hover:text-[#212121] hover:bg-[#f5f5f7] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Category</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(true)}
                className="px-4 py-2 border border-[#dadce0] rounded-xl text-xs font-semibold text-[#717478] hover:text-[#212121]"
              >
                Discard
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#5022c3] hover:bg-[#431bb0] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{editingProduct ? 'Save Catalog Updates' : 'Publish Catalog'}</span>
              </button>
            </div>
          </div>

        </form>
      )}

      {/* 5. Tutorial Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea]">
              <div className="flex items-center gap-2 text-[#e53935] font-bold text-sm">
                <PlayCircle className="w-5 h-5 fill-current text-white" />
                <span>Single Catalog Upload Tutorial</span>
              </div>
              <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white p-4 text-center space-y-2">
              <PlayCircle className="w-12 h-12 text-[#5022c3]" />
              <p className="font-semibold text-sm">Interactive Walkthrough</p>
              <p className="text-[11px] text-gray-400">Step 1: Pick category &gt; Step 2: Upload studio photo &gt; Step 3: Publish with live inventory.</p>
            </div>
            <button
              onClick={() => setShowVideoModal(false)}
              className="w-full py-2 bg-[#5022c3] text-white font-bold rounded-xl"
            >
              Got it, continue uploading
            </button>
          </div>
        </div>
      )}

      {/* 6. Help Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea]">
              <div className="flex items-center gap-2 text-[#5022c3] font-bold text-sm">
                <HelpCircle className="w-5 h-5" />
                <span>Catalog Support & Assistance</span>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-[#555]">
              <p className="font-semibold text-[#212121]">Need assistance listing your inventory?</p>
              <p>• <strong>Category Mapping:</strong> Selecting {lvl4Node?.name || 'your category'} configures specific fields like chain weaves, carat weights, or silk types.</p>
              <p>• <strong>Settlement Payouts:</strong> Automatic 90% merchant settlement with armored transit coverage.</p>
              <p>• <strong>Purity Standards:</strong> All pieces receive BIS / Government assay certifications.</p>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 bg-[#5022c3] text-white font-bold rounded-xl"
            >
              Close Help
            </button>
          </div>
        </div>
      )}

      {/* 7. Image Guidelines Modal */}
      {showGuidelineModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea]">
              <div className="flex items-center gap-2 text-[#d97706] font-bold text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>Quality Check Photography Guidelines</span>
              </div>
              <button onClick={() => setShowGuidelineModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-[#444]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Front Perspective:</strong> Main image must show clean frontal perspective without harsh reflections.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Resolution:</strong> Minimum 800 x 800px on clean white or high-contrast neutral background.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No Watermarks:</strong> Avoid promotional text overlays, merchant logos, or contact details in images.</span>
              </div>
            </div>
            <button
              onClick={() => setShowGuidelineModal(false)}
              className="w-full py-2 bg-[#5022c3] text-white font-bold rounded-xl"
            >
              I Understand the Guidelines
            </button>
          </div>
        </div>
      )}

      {/* 8. Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-xs text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#212121]">Discard Catalog Draft?</h4>
              <p className="text-[#717478] mt-1">All unsaved category and product details will be discarded.</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 py-2 border border-[#dadce0] rounded-xl font-semibold text-[#212121] hover:bg-[#f5f5f7]"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onCancel();
                }}
                className="flex-1 py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
