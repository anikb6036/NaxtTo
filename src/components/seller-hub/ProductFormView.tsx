import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  PlayCircle, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  Image as ImageIcon, 
  Camera, 
  Sparkles, 
  Bookmark, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { Product, ProductCategory, MetalType, JewelleryStyle, ProductSizeVariation } from '../../types';

interface ProductFormViewProps {
  editingProduct: Product | null;
  onSave: (productData: any) => void;
  onCancel: () => void;
  currencySymbol: string;
}

// All standard catalog sizes available for selection (matching Meesho / Indian jewellery standard)
const ALL_CATALOG_SIZES = [
  '2.2',
  '2.3',
  '2.4',
  '2.5',
  '2.6',
  '2.8',
  '2.10',
  'Free Size',
  '2.12',
  '2.14',
  '3',
  'Adjustable'
];

// Quick pre-fill catalog templates (standard Meesho / Bengali Jewellery configurations)
const PRESET_TEMPLATES = [
  {
    name: 'Bengali Bridal Sakha Pola (Gold Badhano)',
    genericName: 'Sakha Pola',
    productName: 'Traditional Bengali Bridal Conch Shell & Red Pola Bangle Pair (Gold Badhano)',
    netWeight: '28.5',
    sizes: ['2.2', '2.4', '2.6'],
    closure: 'Slip-On',
    color: 'White & Red',
    netQuantity: 'Set of 2',
    occasion: 'Bridal / Wedding',
    plating: 'Micron Gold Plated',
    diameter: '64 mm',
    dimensionMm: '6 mm',
    sizing: 'Non-Adjustable',
    stoneType: 'No Stone',
    trend: 'Traditional Bengali Bridal',
    type: 'Bengali Sakha Pola',
    countryOfOrigin: 'India',
    manufacturerName: 'NaxtTo Bengali Heritage Karigar Guild',
    manufacturerAddress: '14/2 Shankar Ghosh Lane, Bowbazar, Kolkata, West Bengal',
    manufacturerPincode: '700012',
    baseMetal: 'Conch Shell (Shankha)',
    brand: 'NAXTTO',
    description: 'Authentic handcrafted Bengali bridal Sakha and Pola set. Crafted from natural pure conch shell and coral-red acrylic with 24K micron gold badhano wire filigree work. Blessed for traditional Bengali wedding rituals and daily matrimonial elegance. Hypoallergenic and BIS quality certified.',
    price: 3850,
    returnPrice: 3465,
    mrp: 4800,
    stockCount: 15,
    images: [
      '/src/assets/images/shankha_pola_set_1790249913718.jpg',
      '/src/assets/images/sakha_pola_stack_1790249812700.jpg',
      '/src/assets/images/bengali_bridal_bangles_1789477964190.jpg'
    ]
  },
  {
    name: 'Pure Iron Loha Badhano (18K Gold Clad)',
    genericName: 'Loha Badhano',
    productName: 'Authentic Bengali Bridal Loha Badhano Bangle with 18K Solid Gold Wire Badhano',
    netWeight: '22.0',
    sizes: ['2.4', '2.6', '2.8'],
    closure: 'Slip-On',
    color: 'Gold',
    netQuantity: '1',
    occasion: 'Dailywear',
    plating: '18K Gold Plated',
    diameter: '60 mm',
    dimensionMm: '4 mm',
    sizing: 'Non-Adjustable',
    stoneType: 'No Stone',
    trend: 'Traditional Bengali Bridal',
    type: 'Loha Badhano',
    countryOfOrigin: 'India',
    manufacturerName: 'NaxtTo Swarna Shilpi Guild',
    manufacturerAddress: '38 Raja Rammohan Roy Sarani, Bowbazar, Kolkata, West Bengal',
    manufacturerPincode: '700009',
    baseMetal: 'Iron (Loha)',
    brand: 'NAXTTO',
    description: 'Sacred Bengali matrimonial Loha Badhano crafted with natural energized wrought iron encased in premium solid gold filigree wire. Auspicious daily wear piece ensuring marital longevity and prosperity.',
    price: 4950,
    returnPrice: 4455,
    mrp: 6200,
    stockCount: 10,
    images: [
      '/src/assets/images/loha_badhano_gold_1790249869592.jpg',
      '/src/assets/images/bengali_bridal_wrist_1790249886691.jpg'
    ]
  },
  {
    name: 'Mayur Mukhi Shankha Pair (Peacock Carved)',
    genericName: 'Sakha Pola',
    productName: 'Exquisite Mayur Mukhi Pure Conch Shell Bridal Shankha (Set of 2)',
    netWeight: '32.0',
    sizes: ['2.4', '2.6', '2.8'],
    closure: 'Slip-On',
    color: 'White',
    netQuantity: 'Set of 2',
    occasion: 'Festive',
    plating: 'No Plating',
    diameter: '68 mm',
    dimensionMm: '8 mm',
    sizing: 'Non-Adjustable',
    stoneType: 'No Stone',
    trend: 'Handcrafted Artisan',
    type: 'Mukhi Shankha',
    countryOfOrigin: 'India',
    manufacturerName: 'Shankhari Artisan Cooperative',
    manufacturerAddress: 'Shankhari Bazar Karigar Quarter, Kolkata, West Bengal',
    manufacturerPincode: '700006',
    baseMetal: 'Conch Shell (Shankha)',
    brand: 'NAXTTO',
    description: 'Master artisan hand-carved natural sea conch shell bangles depicting traditional Bengali Mayur (peacock) motifs. Sourced from natural sanctified sea shells, carved with precision jeweler chisels.',
    price: 4200,
    returnPrice: 3780,
    mrp: 5500,
    stockCount: 8,
    images: [
      '/src/assets/images/mayur_mukhi_shankha_1790249854136.jpg',
      '/src/assets/images/artisan_shankhari_1790250280309.jpg'
    ]
  },
  {
    name: 'Daily Modern Pola (Crimson Coral Red)',
    genericName: 'Bangles',
    productName: 'Sleek Crimson Pola Bangle with Floral Gold Inlay Work',
    netWeight: '18.5',
    sizes: ['2.2', '2.4', '2.6', '2.8'],
    closure: 'Slip-On',
    color: 'Red',
    netQuantity: 'Set of 2',
    occasion: 'Dailywear',
    plating: 'Micron Gold Plated',
    diameter: '64 mm',
    dimensionMm: '5 mm',
    sizing: 'Non-Adjustable',
    stoneType: 'No Stone',
    trend: 'Contemporary',
    type: 'Chunri Pola',
    countryOfOrigin: 'India',
    manufacturerName: 'NaxtTo Contemporary Karigar Studio',
    manufacturerAddress: 'Sector 5, Salt Lake City, Kolkata, West Bengal',
    manufacturerPincode: '700091',
    baseMetal: 'Acrylic / Resin (Pola)',
    brand: 'NAXTTO',
    description: 'Vibrant crimson red pola bangles accented with micro floral motifs in gold leaf plating. Lightweight, smooth comfort finish designed for modern daily professional and festive wear.',
    price: 2499,
    returnPrice: 2249,
    mrp: 3200,
    stockCount: 20,
    images: [
      '/src/assets/images/daily_modern_pola_1790250330549.jpg',
      '/src/assets/images/gold_badhano_pola_1790249832633.jpg'
    ]
  }
];

export const ProductFormView: React.FC<ProductFormViewProps> = ({
  editingProduct,
  onSave,
  onCancel,
  currencySymbol
}) => {
  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceImgIndexRef = useRef<number | null>(null);
  const sizeDropdownRef = useRef<HTMLDivElement | null>(null);

  // Modals & UI toggles
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saveTemplateSuccess, setSaveTemplateSuccess] = useState(false);

  // Multiple Size selection states (matching user screenshot image.png)
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  
  // Initial selected sizes (defaults to ['2.2', '2.4', '2.6'] as seen in user's image.png)
  const initialSizes = useMemo(() => {
    if (editingProduct?.availableSizes && editingProduct.availableSizes.length > 0) {
      return editingProduct.availableSizes;
    }
    if (editingProduct?.size && editingProduct.size.includes(',')) {
      return editingProduct.size.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (editingProduct?.size) {
      return [editingProduct.size];
    }
    return ['2.2', '2.4', '2.6'];
  }, [editingProduct]);

  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes);
  
  // Copy price details to all sizes checkbox (defaults to true as shown in user screenshot)
  const [copyPriceToAll, setCopyPriceToAll] = useState<boolean>(true);

  // Size Variations state (one row per selected size with Meesho Price, Return Price, MRP, Stock)
  const [sizeVariations, setSizeVariations] = useState<ProductSizeVariation[]>(() => {
    const basePrice = editingProduct?.price || 3850;
    const baseMrp = editingProduct?.originalPrice || 4800;
    const baseReturn = Math.round(basePrice * 0.9);
    const baseStock = editingProduct?.stockCount ?? 15;

    if (editingProduct?.sizeVariations && editingProduct.sizeVariations.length > 0) {
      return editingProduct.sizeVariations;
    }

    return initialSizes.map(sz => ({
      size: sz,
      price: basePrice,
      returnPrice: baseReturn,
      mrp: baseMrp,
      stockCount: baseStock
    }));
  });

  // "Same as Manufacturer Details" checkbox
  const [sameAsManufacturer, setSameAsManufacturer] = useState<boolean>(true);

  // Default initial form state
  const [formData, setFormData] = useState({
    netWeightGrams: editingProduct?.netWeightGrams || editingProduct?.weightGrams || '28.5',
    productId: editingProduct?.productId || editingProduct?.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
    name: editingProduct?.name || '',
    
    // Product Details
    closure: editingProduct?.closure || 'Slip-On',
    color: editingProduct?.color || 'White & Red',
    genericName: editingProduct?.genericName || 'Sakha Pola',
    netQuantity: editingProduct?.netQuantity || 'Set of 2',
    occasion: editingProduct?.occasion || 'Bridal / Wedding',
    plating: editingProduct?.plating || 'Micron Gold Plated',
    diameter: editingProduct?.diameter || '64 mm',
    dimensionMm: editingProduct?.dimensionMm || '6 mm',
    sizing: editingProduct?.sizing || 'Non-Adjustable',
    stoneType: editingProduct?.stoneType || 'No Stone',
    trend: editingProduct?.trend || 'Traditional Bengali Bridal',
    productType: editingProduct?.productType || 'Bengali Sakha Pola',
    countryOfOrigin: editingProduct?.countryOfOrigin || editingProduct?.origin || 'India',
    
    // Manufacturer
    manufacturerName: editingProduct?.manufacturerName || 'NaxtTo Bengali Heritage Karigar Guild',
    manufacturerAddress: editingProduct?.manufacturerAddress || '14/2 Shankar Ghosh Lane, Bowbazar, Kolkata, West Bengal',
    manufacturerPincode: editingProduct?.manufacturerPincode || '700012',
    
    // Packer
    packerName: editingProduct?.packerName || 'NaxtTo Bengali Heritage Karigar Guild',
    packerAddress: editingProduct?.packerAddress || '14/2 Shankar Ghosh Lane, Bowbazar, Kolkata, West Bengal',
    packerPincode: editingProduct?.packerPincode || '700012',
    
    // Importer
    importerName: editingProduct?.importerName || 'NA (Domestic Sourced India)',
    importerAddress: editingProduct?.importerAddress || 'NA',
    importerPincode: editingProduct?.importerPincode || '700012',
    
    // Other Attributes
    baseMetal: editingProduct?.baseMetal || 'Conch Shell (Shankha)',
    brand: editingProduct?.brand || 'NAXTTO',
    description: editingProduct?.description || '',

    // Pricing & Inventory base
    price: editingProduct?.price || 3850,
    originalPrice: editingProduct?.originalPrice || 4800,
    stockCount: editingProduct?.stockCount ?? 15,
    
    // Images
    images: editingProduct?.images && editingProduct.images.length > 0 
      ? editingProduct.images 
      : [
          '/src/assets/images/shankha_pola_set_1790249913718.jpg',
          '/src/assets/images/sakha_pola_stack_1790249812700.jpg'
        ]
  });

  // Close size dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(e.target as Node)) {
        setIsSizeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keep Packer synchronized when checkbox is checked
  useEffect(() => {
    if (sameAsManufacturer) {
      setFormData(prev => ({
        ...prev,
        packerName: prev.manufacturerName,
        packerAddress: prev.manufacturerAddress,
        packerPincode: prev.manufacturerPincode
      }));
    }
  }, [sameAsManufacturer, formData.manufacturerName, formData.manufacturerAddress, formData.manufacturerPincode]);

  // Synchronize size variations when selectedSizes changes
  const handleToggleSize = (size: string) => {
    setSelectedSizes(prev => {
      const isSelected = prev.includes(size);
      let updatedSizes: string[];
      if (isSelected) {
        updatedSizes = prev.filter(s => s !== size);
      } else {
        // Keep order consistent with ALL_CATALOG_SIZES
        updatedSizes = ALL_CATALOG_SIZES.filter(s => prev.includes(s) || s === size);
      }

      // Sync variations
      setSizeVariations(currVariations => {
        const firstVar = currVariations[0] || {
          price: formData.price,
          returnPrice: Math.round(formData.price * 0.9),
          mrp: formData.originalPrice,
          stockCount: formData.stockCount
        };

        return updatedSizes.map(sz => {
          const existing = currVariations.find(v => v.size === sz);
          if (existing) return existing;
          return {
            size: sz,
            price: firstVar.price,
            returnPrice: firstVar.returnPrice,
            mrp: firstVar.mrp,
            stockCount: firstVar.stockCount
          };
        });
      });

      return updatedSizes;
    });
  };

  const handleClearAllSizes = () => {
    setSelectedSizes([]);
    setSizeVariations([]);
  };

  // Update a single field in the size variation table
  const handleUpdateVariationField = (
    size: string, 
    field: 'price' | 'returnPrice' | 'mrp' | 'stockCount', 
    value: number
  ) => {
    setSizeVariations(prev => {
      if (copyPriceToAll) {
        // Apply to all rows simultaneously!
        return prev.map(item => ({
          ...item,
          [field]: value,
          // Auto-calculate return price if price changed and returnPrice wasn't manually set
          ...(field === 'price' ? { returnPrice: Math.round(value * 0.9) } : {})
        }));
      } else {
        // Apply only to this specific size variation
        return prev.map(item => {
          if (item.size === size) {
            return {
              ...item,
              [field]: value,
              ...(field === 'price' ? { returnPrice: Math.round(value * 0.9) } : {})
            };
          }
          return item;
        });
      }
    });

    // Also update base formData
    if (field === 'price') {
      setFormData(prev => ({ ...prev, price: value }));
    } else if (field === 'mrp') {
      setFormData(prev => ({ ...prev, originalPrice: value }));
    } else if (field === 'stockCount') {
      setFormData(prev => ({ ...prev, stockCount: value }));
    }
  };

  // Available Studio Stock Media Assets for quick angle picker
  const studioPresetImages = [
    { title: 'Bengali Bridal Shankha Pola Set', url: '/src/assets/images/shankha_pola_set_1790249913718.jpg' },
    { title: 'Sakha Pola Stack Detail', url: '/src/assets/images/sakha_pola_stack_1790249812700.jpg' },
    { title: 'Pure Gold Badhano Loha', url: '/src/assets/images/loha_badhano_gold_1790249869592.jpg' },
    { title: 'Hand-carved Mayur Mukhi Shankha', url: '/src/assets/images/mayur_mukhi_shankha_1790249854136.jpg' },
    { title: 'Gold Badhano Crimson Pola', url: '/src/assets/images/gold_badhano_pola_1790249832633.jpg' },
    { title: 'Bridal Bangle Stack Model', url: '/src/assets/images/bengali_bridal_bangles_1789477964190.jpg' },
    { title: 'Daily Modern Pola Pair', url: '/src/assets/images/daily_modern_pola_1790250330549.jpg' },
    { title: 'Bridal Wrist Ritual Angle', url: '/src/assets/images/bengali_bridal_wrist_1790249886691.jpg' },
    { title: 'Artisan Goldsmith Badhano', url: '/src/assets/images/goldsmith_badhano_1790250296653.jpg' }
  ];

  // Handle image upload from computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        if (resultUrl) {
          if (replaceImgIndexRef.current !== null) {
            // Replace specific image
            setFormData(prev => {
              const updated = [...prev.images];
              updated[replaceImgIndexRef.current!] = resultUrl;
              return { ...prev, images: updated };
            });
            replaceImgIndexRef.current = null;
          } else {
            // Add to end
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, resultUrl]
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const triggerAddImage = () => {
    replaceImgIndexRef.current = null;
    fileInputRef.current?.click();
  };

  const triggerChangeImage = (index: number) => {
    replaceImgIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    if (formData.images.length <= 1) {
      alert('At least 1 product image is required for catalog verification.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSelectPresetImage = (url: string) => {
    if (replaceImgIndexRef.current !== null) {
      setFormData(prev => {
        const updated = [...prev.images];
        updated[replaceImgIndexRef.current!] = url;
        return { ...prev, images: updated };
      });
      replaceImgIndexRef.current = null;
    } else {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
    setShowImagePickerModal(false);
  };

  // Apply a pre-built template
  const applyTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    const tplSizes = template.sizes || ['2.2', '2.4', '2.6'];
    setSelectedSizes(tplSizes);
    
    const tplVariations = tplSizes.map(sz => ({
      size: sz,
      price: template.price,
      returnPrice: template.returnPrice || Math.round(template.price * 0.9),
      mrp: template.mrp,
      stockCount: template.stockCount
    }));
    setSizeVariations(tplVariations);

    setFormData(prev => ({
      ...prev,
      genericName: template.genericName,
      name: template.productName,
      netWeightGrams: template.netWeight,
      closure: template.closure,
      color: template.color,
      netQuantity: template.netQuantity,
      occasion: template.occasion,
      plating: template.plating,
      diameter: template.diameter,
      dimensionMm: template.dimensionMm,
      sizing: template.sizing,
      stoneType: template.stoneType,
      trend: template.trend,
      productType: template.type,
      countryOfOrigin: template.countryOfOrigin,
      manufacturerName: template.manufacturerName,
      manufacturerAddress: template.manufacturerAddress,
      manufacturerPincode: template.manufacturerPincode,
      packerName: template.manufacturerName,
      packerAddress: template.manufacturerAddress,
      packerPincode: template.manufacturerPincode,
      baseMetal: template.baseMetal,
      brand: template.brand,
      description: template.description,
      price: template.price,
      originalPrice: template.mrp,
      stockCount: template.stockCount,
      images: template.images && template.images.length > 0 ? template.images : prev.images
    }));
    setShowTemplateMenu(false);
    setValidationErrors([]);
  };

  // Save current form values as custom template
  const handleSaveAsCustomTemplate = () => {
    try {
      const customTemplate = {
        name: formData.name ? `${formData.name.slice(0, 30)}...` : `Template ${new Date().toLocaleDateString()}`,
        genericName: formData.genericName,
        productName: formData.name,
        netWeight: formData.netWeightGrams,
        sizes: selectedSizes,
        closure: formData.closure,
        color: formData.color,
        netQuantity: formData.netQuantity,
        occasion: formData.occasion,
        plating: formData.plating,
        diameter: formData.diameter,
        dimensionMm: formData.dimensionMm,
        sizing: formData.sizing,
        stoneType: formData.stoneType,
        trend: formData.trend,
        type: formData.productType,
        countryOfOrigin: formData.countryOfOrigin,
        manufacturerName: formData.manufacturerName,
        manufacturerAddress: formData.manufacturerAddress,
        manufacturerPincode: formData.manufacturerPincode,
        baseMetal: formData.baseMetal,
        brand: formData.brand,
        description: formData.description,
        price: sizeVariations[0]?.price || formData.price,
        returnPrice: sizeVariations[0]?.returnPrice,
        mrp: sizeVariations[0]?.mrp || formData.originalPrice,
        stockCount: sizeVariations[0]?.stockCount || formData.stockCount,
        images: formData.images
      };

      const existing = JSON.parse(localStorage.getItem('naxtto_seller_catalog_templates') || '[]');
      existing.unshift(customTemplate);
      localStorage.setItem('naxtto_seller_catalog_templates', JSON.stringify(existing.slice(0, 10)));
      
      setSaveTemplateSuccess(true);
      setTimeout(() => setSaveTemplateSuccess(false), 3000);
      setShowTemplateMenu(false);
    } catch (err) {
      console.warn('Failed to save custom template:', err);
    }
  };

  // Get user's saved custom templates
  const savedCustomTemplates = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('naxtto_seller_catalog_templates') || '[]');
    } catch {
      return [];
    }
  }, [saveTemplateSuccess]);

  // Form submission validation & handling
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push('Product Name is required');
    if (!formData.netWeightGrams) errors.push('Net Weight (gms) is required');
    if (selectedSizes.length === 0) errors.push('Please select at least one Size option');
    if (!formData.genericName) errors.push('Generic Name is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.images || formData.images.length === 0) errors.push('At least one catalog image is required');

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const firstVar = sizeVariations[0];
    const totalInventory = sizeVariations.reduce((sum, v) => sum + (v.stockCount || 0), 0);

    // Map into complete Product format
    const productPayload: Partial<Product> = {
      ...(editingProduct || {}),
      name: formData.name.trim(),
      subtitle: `${formData.baseMetal} • ${formData.plating} • ${formData.genericName}`,
      price: firstVar?.price || Number(formData.price) || 2999,
      originalPrice: firstVar?.mrp || Number(formData.originalPrice) || (firstVar?.price || 2999) * 1.25,
      stockCount: totalInventory > 0 ? totalInventory : (Number(formData.stockCount) || 10),
      inStock: totalInventory > 0,
      images: formData.images,
      description: formData.description.trim(),
      category: (
        formData.genericName.toLowerCase().includes('sakha') || formData.genericName.toLowerCase().includes('shankha')
          ? 'shakha'
          : formData.genericName.toLowerCase().includes('pola')
          ? 'pola'
          : formData.genericName.toLowerCase().includes('loha')
          ? 'loha-badhano'
          : formData.genericName.toLowerCase().includes('bangle') || formData.genericName.toLowerCase().includes('bracelet')
          ? 'bracelets'
          : formData.genericName.toLowerCase().includes('necklace')
          ? 'necklaces'
          : formData.genericName.toLowerCase().includes('ring')
          ? 'rings'
          : 'bridal-combos'
      ) as ProductCategory,
      metal: (
        formData.baseMetal.toLowerCase().includes('conch')
          ? 'pure-conch-shell'
          : formData.baseMetal.toLowerCase().includes('acrylic') || formData.baseMetal.toLowerCase().includes('pola')
          ? 'crimson-coral-acrylic'
          : formData.baseMetal.toLowerCase().includes('iron')
          ? 'iron-gold'
          : formData.plating.toLowerCase().includes('22k')
          ? '22k-yellow-gold'
          : '18k-yellow-gold'
      ) as MetalType,
      metalName: `${formData.baseMetal} (${formData.plating})`,
      style: (
        formData.trend.toLowerCase().includes('bridal')
          ? 'bridal-heritage'
          : formData.trend.toLowerCase().includes('artisan')
          ? 'hand-carved'
          : 'traditional-bengali'
      ) as JewelleryStyle,
      styleName: formData.trend,
      dimensions: `${formData.diameter} (Width: ${formData.dimensionMm})`,
      weightGrams: formData.netWeightGrams,
      karatPurity: formData.plating.includes('Gold') ? 'BIS Hallmarked 916 / 22K Micron Gold' : 'Guaranteed Authentic Sourced Shell & Alloy',
      origin: formData.countryOfOrigin,
      sku: formData.productId,
      
      // MULTI-SIZE SUPPORT: All selected sizes & variations
      availableSizes: selectedSizes,
      size: selectedSizes.join(', '),
      sizeVariations: sizeVariations,

      features: [
        `Available Sizes: ${selectedSizes.join(', ')}`,
        `Generic Name: ${formData.genericName}`,
        `Closure: ${formData.closure}`,
        `Color: ${formData.color}`,
        `Net Quantity: ${formData.netQuantity}`,
        `Plating: ${formData.plating}`,
        `Diameter: ${formData.diameter}`,
        `Base Metal: ${formData.baseMetal}`,
        `BIS Hallmarking & Quality Assay Assured`
      ],
      // Supplier Portal catalog fields
      netWeightGrams: formData.netWeightGrams,
      productId: formData.productId,
      closure: formData.closure,
      color: formData.color,
      genericName: formData.genericName,
      netQuantity: formData.netQuantity,
      occasion: formData.occasion,
      plating: formData.plating,
      diameter: formData.diameter,
      dimensionMm: formData.dimensionMm,
      sizing: formData.sizing,
      stoneType: formData.stoneType,
      trend: formData.trend,
      productType: formData.productType,
      countryOfOrigin: formData.countryOfOrigin,
      manufacturerName: formData.manufacturerName,
      manufacturerAddress: formData.manufacturerAddress,
      manufacturerPincode: formData.manufacturerPincode,
      packerName: formData.packerName,
      packerAddress: formData.packerAddress,
      packerPincode: formData.packerPincode,
      importerName: formData.importerName,
      importerAddress: formData.importerAddress,
      importerPincode: formData.importerPincode,
      baseMetal: formData.baseMetal,
      brand: formData.brand
    };

    onSave(productPayload);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#212121] pb-24 font-sans antialiased">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 1. TOP HEADER - EXACT MATCH TO VIDEO */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        {/* Left: Back Arrow + Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDiscardConfirm(true)}
            className="p-1 rounded-full hover:bg-gray-100 text-[#212121] transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-[#212121] tracking-tight">
            {editingProduct ? 'Edit Single Catalog' : 'Add Single Catalog'}
          </h1>
        </div>

        {/* Right: Learn to upload single catalog video link */}
        <button
          type="button"
          onClick={() => setShowVideoModal(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#212121] hover:text-[#5022c3] transition-colors py-1 px-2.5 rounded-lg hover:bg-purple-50 cursor-pointer"
        >
          <div className="w-5 h-4 bg-[#ff0000] rounded-xs flex items-center justify-center text-white shrink-0 shadow-xs">
            <div className="w-0 h-0 border-y-[3.5px] border-y-transparent border-l-[5.5px] border-l-white ml-0.5" />
          </div>
          <span>Learn to upload single catalog</span>
        </button>
      </div>

      {/* Validation Banner if errors */}
      {validationErrors.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>Please fill in the required catalog fields:</span>
            </div>
            <ul className="list-disc list-inside text-[11px] pl-2 space-y-0.5">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 2. MAIN 2-COLUMN CATALOG CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: FORM DETAILS (70-75% WIDTH / 8-9 COLS)       */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-lg border border-[#e0e0e0] p-5 sm:p-7 shadow-xs space-y-7">
            
            {/* TOP ROW: Net Weight & Product ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">
                  Enter Net Weight (gms) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.netWeightGrams}
                  onChange={e => setFormData({ ...formData, netWeightGrams: e.target.value })}
                  placeholder="Enter Net Weight (gms)"
                  className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] focus:ring-1 focus:ring-[#5022c3] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">
                  Product Id (Optional)
                </label>
                <input
                  type="text"
                  value={formData.productId}
                  onChange={e => setFormData({ ...formData, productId: e.target.value })}
                  placeholder="Enter Style code/ Product ID (opt)"
                  className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] focus:ring-1 focus:ring-[#5022c3] outline-none transition-all"
                />
              </div>
            </div>

            {/* SECOND ROW: Product Name & Multiple Size Selector (EXACT MATCH TO USER SCREENSHOT image.png) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Product Name with Sparkle Icon */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#555] flex items-center gap-1">
                    <span>Product Name</span>
                    <span className="text-red-500">*</span>
                    <span title="Listing title as visible to customers on catalog">
                      <Info className="w-3 h-3 text-gray-400" />
                    </span>
                  </label>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter Product Name"
                    className="w-full h-10 pl-3 pr-10 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] focus:ring-1 focus:ring-[#5022c3] outline-none transition-all"
                  />
                  <div 
                    className="absolute right-2.5 p-1 bg-purple-50 text-[#5022c3] rounded-xs cursor-pointer hover:bg-purple-100 transition-colors"
                    title="AI Auto-Title Suggestion"
                    onClick={() => {
                      if (!formData.name) {
                        setFormData({ 
                          ...formData, 
                          name: `Authentic Bengali ${formData.genericName} (${formData.plating})` 
                        });
                      }
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Multi-Select Size Dropdown (Exact Match to user screenshot) */}
              <div className="relative" ref={sizeDropdownRef}>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">
                  Size <span className="text-red-500">*</span>
                </label>

                {/* Dropdown Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                  className={`w-full h-10 px-3 text-xs bg-white border rounded-md flex items-center justify-between transition-all cursor-pointer ${
                    isSizeDropdownOpen ? 'border-[#5022c3] ring-1 ring-[#5022c3]' : 'border-[#d2d2d2] hover:border-gray-400'
                  }`}
                >
                  <span className={`truncate ${selectedSizes.length > 0 ? 'text-[#212121] font-medium' : 'text-gray-400'}`}>
                    {selectedSizes.length > 0 ? selectedSizes.join(', ') : 'Select Sizes'}
                  </span>
                  {isSizeDropdownOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 shrink-0 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 ml-1" />
                  )}
                </button>

                {/* Dropdown Menu Overlay (Matching screenshot checkboxes & buttons) */}
                {isSizeDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#d2d2d2] rounded-lg shadow-xl z-50 p-3 animate-fadeIn">
                    <div className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                      Select Available Sizes:
                    </div>

                    {/* Scrollable Checkbox Grid */}
                    <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1 py-1">
                      {ALL_CATALOG_SIZES.map(sz => {
                        const isChecked = selectedSizes.includes(sz);
                        return (
                          <label
                            key={sz}
                            className={`flex items-center gap-2 p-1.5 rounded-md text-xs cursor-pointer select-none transition-colors ${
                              isChecked ? 'bg-purple-50 text-[#5022c3] font-semibold' : 'text-[#333] hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSize(sz)}
                              className="w-4 h-4 rounded text-[#5022c3] accent-[#5022c3] cursor-pointer"
                            />
                            <span>{sz}</span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Footer Actions: Clear Filter & Apply */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleClearAllSizes}
                        className="text-xs font-semibold text-[#5022c3] hover:underline cursor-pointer"
                      >
                        Clear Filter
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSizeDropdownOpen(false)}
                        className="px-4 py-1.5 bg-[#5022c3] hover:bg-[#431bb0] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MULTI-SIZE VARIATIONS PRICING TABLE (EXACT MATCH TO USER SCREENSHOT image.png) */}
            {selectedSizes.length > 0 && (
              <div className="space-y-3 pt-1">
                {/* Copy Price Details to all sizes Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#212121]">
                  <input
                    type="checkbox"
                    checked={copyPriceToAll}
                    onChange={e => setCopyPriceToAll(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5022c3] accent-[#5022c3] cursor-pointer"
                  />
                  <span>Copy price details to all sizes</span>
                  <span className="text-[11px] text-gray-500 font-normal">
                    (Editing any row updates all {selectedSizes.length} sizes automatically)
                  </span>
                </label>

                {/* Variations Table */}
                <div className="border border-[#e0e0e0] rounded-lg overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#f0f4f9] text-[#212121] border-b border-[#e0e0e0] text-[11px] font-bold">
                        <th className="py-3 px-4 w-28">Size</th>
                        <th className="py-3 px-4 min-w-[160px]">
                          <div className="flex items-center gap-1">
                            <span>Meesho Price*</span>
                            <span title="Final selling price shown to the customer">
                              <Info className="w-3 h-3 text-gray-400" />
                            </span>
                          </div>
                        </th>
                        <th className="py-3 px-4 min-w-[180px]">
                          <div className="flex items-center gap-1">
                            <span>Wrong/Defective Returns Price</span>
                            <span title="Payout settlement after returns & logistics protection">
                              <Info className="w-3 h-3 text-gray-400" />
                            </span>
                          </div>
                        </th>
                        <th className="py-3 px-4 min-w-[150px]">
                          <div className="flex items-center gap-1">
                            <span>MRP*</span>
                            <span title="Maximum Retail Price printed on packaging">
                              <Info className="w-3 h-3 text-gray-400" />
                            </span>
                          </div>
                        </th>
                        <th className="py-3 px-4 min-w-[120px]">
                          <div className="flex items-center gap-1">
                            <span>Stock (Units)</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5ea] bg-white">
                      {sizeVariations.map((vRow, rIdx) => (
                        <tr key={vRow.size} className="hover:bg-[#fafafa] transition-colors">
                          {/* Size label */}
                          <td className="py-3 px-4 font-bold text-[#212121]">
                            <span className="px-2.5 py-1 bg-gray-100 rounded text-xs font-semibold text-[#333]">
                              {vRow.size}
                            </span>
                          </td>

                          {/* Meesho Price Input */}
                          <td className="py-2.5 px-4">
                            <div className="relative flex items-center">
                              <span className="absolute left-2.5 text-gray-400 font-medium text-xs">
                                {currencySymbol}
                              </span>
                              <input
                                type="number"
                                min={1}
                                required
                                value={vRow.price}
                                onChange={e => handleUpdateVariationField(vRow.size, 'price', Number(e.target.value))}
                                className="w-full h-9 pl-7 pr-2 text-xs font-semibold text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                              />
                            </div>
                          </td>

                          {/* Wrong/Defective Returns Price Input */}
                          <td className="py-2.5 px-4">
                            <div className="relative flex items-center">
                              <span className="absolute left-2.5 text-gray-400 font-medium text-xs">
                                {currencySymbol}
                              </span>
                              <input
                                type="number"
                                min={1}
                                value={vRow.returnPrice || Math.round(vRow.price * 0.9)}
                                onChange={e => handleUpdateVariationField(vRow.size, 'returnPrice', Number(e.target.value))}
                                className="w-full h-9 pl-7 pr-2 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                              />
                            </div>
                          </td>

                          {/* MRP Input */}
                          <td className="py-2.5 px-4">
                            <div className="relative flex items-center">
                              <span className="absolute left-2.5 text-gray-400 font-medium text-xs">
                                {currencySymbol}
                              </span>
                              <input
                                type="number"
                                min={1}
                                required
                                value={vRow.mrp || Math.round(vRow.price * 1.25)}
                                onChange={e => handleUpdateVariationField(vRow.size, 'mrp', Number(e.target.value))}
                                className="w-full h-9 pl-7 pr-2 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                              />
                            </div>
                          </td>

                          {/* Stock Inventory Units */}
                          <td className="py-2.5 px-4">
                            <input
                              type="number"
                              min={0}
                              required
                              value={vRow.stockCount ?? 15}
                              onChange={e => handleUpdateVariationField(vRow.size, 'stockCount', Number(e.target.value))}
                              className="w-full h-9 px-2 text-xs text-center font-bold text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 1: PRODUCT DETAILS */}
            <div className="pt-2">
              <h2 className="text-sm font-bold text-[#212121] mb-4 pb-2 border-b border-[#f0f0f0]">
                Product Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                
                {/* Closure */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Closure <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.closure}
                    onChange={e => setFormData({ ...formData, closure: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Slip-On">Slip-On</option>
                    <option value="Openable">Openable</option>
                    <option value="Screw">Screw</option>
                    <option value="Interlock">Interlock</option>
                    <option value="Lobster Claw">Lobster Claw</option>
                    <option value="S-Hook">S-Hook</option>
                    <option value="Drawstring">Drawstring</option>
                    <option value="Spring Ring">Spring Ring</option>
                    <option value="None">None</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="White & Red">White &amp; Red</option>
                    <option value="Red">Red</option>
                    <option value="White">White</option>
                    <option value="Gold">Gold</option>
                    <option value="Maroon">Maroon</option>
                    <option value="Silver">Silver</option>
                    <option value="Multicolor">Multicolor</option>
                    <option value="Black">Black</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Coral">Coral</option>
                  </select>
                </div>

                {/* Generic Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Generic Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.genericName}
                    onChange={e => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none font-medium"
                  >
                    <option value="">Select</option>
                    <option value="Sakha Pola">Sakha Pola</option>
                    <option value="Bangles">Bangles</option>
                    <option value="Loha Badhano">Loha Badhano</option>
                    <option value="Bracelet">Bracelet</option>
                    <option value="Kada">Kada</option>
                    <option value="Churi">Churi</option>
                    <option value="Chunri Pola">Chunri Pola</option>
                    <option value="Necklace">Necklace</option>
                    <option value="Jewellery Set">Jewellery Set</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Ring">Ring</option>
                    <option value="Mangalsutra">Mangalsutra</option>
                  </select>
                </div>

                {/* Net Quantity (N) */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Net Quantity (N) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.netQuantity}
                    onChange={e => setFormData({ ...formData, netQuantity: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Set of 2">Set of 2</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="Set of 4">Set of 4</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="12">12</option>
                  </select>
                </div>

                {/* Occasion */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Occasion <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={e => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Bridal / Wedding">Bridal / Wedding</option>
                    <option value="Festive">Festive</option>
                    <option value="Dailywear">Dailywear</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Party">Party</option>
                    <option value="Puja">Puja</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>

                {/* Plating */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Plating <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.plating}
                    onChange={e => setFormData({ ...formData, plating: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Micron Gold Plated">Micron Gold Plated</option>
                    <option value="Gold Plated">Gold Plated</option>
                    <option value="18K Gold Plated">18K Gold Plated</option>
                    <option value="22K Gold Plated">22K Gold Plated</option>
                    <option value="Silver Plated">Silver Plated</option>
                    <option value="Copper Plated">Copper Plated</option>
                    <option value="Rhodium Plated">Rhodium Plated</option>
                    <option value="No Plating">No Plating</option>
                  </select>
                </div>

                {/* Product Dimension (Diameter) */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Product Dimension (Diameter)
                  </label>
                  <input
                    type="text"
                    value={formData.diameter}
                    onChange={e => setFormData({ ...formData, diameter: e.target.value })}
                    placeholder="Enter Product Diameter"
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  />
                </div>

                {/* Product Dimension (mm) */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Product Dimension (mm)
                  </label>
                  <select
                    value={formData.dimensionMm}
                    onChange={e => setFormData({ ...formData, dimensionMm: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="2 mm">2 mm</option>
                    <option value="3 mm">3 mm</option>
                    <option value="4 mm">4 mm</option>
                    <option value="5 mm">5 mm</option>
                    <option value="6 mm">6 mm</option>
                    <option value="8 mm">8 mm</option>
                    <option value="10 mm">10 mm</option>
                    <option value="12 mm">12 mm</option>
                    <option value="15 mm">15 mm</option>
                    <option value="20 mm">20 mm</option>
                  </select>
                </div>

                {/* Sizing */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Sizing <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.sizing}
                    onChange={e => setFormData({ ...formData, sizing: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Non-Adjustable">Non-Adjustable</option>
                    <option value="Adjustable">Adjustable</option>
                    <option value="Choot / Openable">Choot / Openable</option>
                  </select>
                </div>

                {/* Stone Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Stone Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.stoneType}
                    onChange={e => setFormData({ ...formData, stoneType: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="No Stone">No Stone</option>
                    <option value="American Diamond (AD)">American Diamond (AD)</option>
                    <option value="Cubic Zirconia (CZ)">Cubic Zirconia (CZ)</option>
                    <option value="Pearl">Pearl</option>
                    <option value="Ruby">Ruby</option>
                    <option value="Emerald">Emerald</option>
                    <option value="Kundan">Kundan</option>
                    <option value="Polki">Polki</option>
                    <option value="Coral">Coral</option>
                  </select>
                </div>

                {/* Trend */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Trend <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.trend}
                    onChange={e => setFormData({ ...formData, trend: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Traditional Bengali Bridal">Traditional Bengali Bridal</option>
                    <option value="Handcrafted Artisan">Handcrafted Artisan</option>
                    <option value="Temple Jewellery">Temple Jewellery</option>
                    <option value="Antique">Antique</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Filigree Badhano">Filigree Badhano</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.productType}
                    onChange={e => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Bengali Sakha Pola">Bengali Sakha Pola</option>
                    <option value="Loha Badhano">Loha Badhano</option>
                    <option value="Chunri Pola">Chunri Pola</option>
                    <option value="Mukhi Shankha">Mukhi Shankha</option>
                    <option value="Kada">Kada</option>
                    <option value="Bangle Set">Bangle Set</option>
                    <option value="Single Bangle">Single Bangle</option>
                  </select>
                </div>

                {/* Country of Origin */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    COUNTRY OF ORIGIN <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.countryOfOrigin}
                    onChange={e => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none font-medium"
                  >
                    <option value="India">India</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Nepal">Nepal</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>

                {/* Manufacturer Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Manufacturer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.manufacturerName}
                    onChange={e => setFormData({ ...formData, manufacturerName: e.target.value })}
                    placeholder="Enter Manufacturer Name"
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  />
                </div>

                {/* Manufacturer Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Manufacturer Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.manufacturerAddress}
                    onChange={e => setFormData({ ...formData, manufacturerAddress: e.target.value })}
                    placeholder="Enter Manufacturer Address"
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  />
                </div>

                {/* Manufacturer Pincode */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Manufacturer Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.manufacturerPincode}
                    onChange={e => setFormData({ ...formData, manufacturerPincode: e.target.value })}
                    placeholder="Enter Manufacturer Pincode"
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  />
                </div>

                {/* Packer Name + Same as Manufacturer Checkbox */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Packer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={sameAsManufacturer}
                    value={formData.packerName}
                    onChange={e => setFormData({ ...formData, packerName: e.target.value })}
                    placeholder="Enter Packer Name"
                    className={`w-full h-10 px-3 text-xs text-[#212121] border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none ${
                      sameAsManufacturer ? 'bg-[#f5f5f5] text-gray-600' : 'bg-white'
                    }`}
                  />
                  <label className="mt-2 flex items-center gap-2 cursor-pointer select-none text-xs text-[#444]">
                    <input
                      type="checkbox"
                      checked={sameAsManufacturer}
                      onChange={e => setSameAsManufacturer(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5022c3] accent-[#5022c3] cursor-pointer"
                    />
                    <span>Same as Manufacturer Details</span>
                  </label>
                </div>

                {/* Packer Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Packer Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={sameAsManufacturer}
                    value={formData.packerAddress}
                    onChange={e => setFormData({ ...formData, packerAddress: e.target.value })}
                    placeholder="Enter Packer Address"
                    className={`w-full h-10 px-3 text-xs text-[#212121] border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none ${
                      sameAsManufacturer ? 'bg-[#f5f5f5] text-gray-600' : 'bg-white'
                    }`}
                  />
                </div>

                {/* Packer Pincode */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Packer Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={sameAsManufacturer}
                    value={formData.packerPincode}
                    onChange={e => setFormData({ ...formData, packerPincode: e.target.value })}
                    placeholder="Enter Packer Pincode"
                    className={`w-full h-10 px-3 text-xs text-[#212121] border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none ${
                      sameAsManufacturer ? 'bg-[#f5f5f5] text-gray-600' : 'bg-white'
                    }`}
                  />
                </div>

                {/* Importer Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Importer Name
                  </label>
                  <input
                    type="text"
                    value={formData.importerName}
                    onChange={e => setFormData({ ...formData, importerName: e.target.value })}
                    placeholder="Enter Importer Name"
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  />
                </div>

                {/* Importer Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Importer Address
                  </label>
                  <input
                    type="text"
                    value={formData.importerAddress}
                    onChange={e => setFormData({ ...formData, importerAddress: e.target.value })}
                    placeholder="Enter Importer Address"
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  />
                </div>

                {/* Importer Pincode */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Importer Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.importerPincode}
                    onChange={e => setFormData({ ...formData, importerPincode: e.target.value })}
                    placeholder="Enter Importer Pincode"
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none"
                  />
                </div>

              </div>
            </div>

            {/* SECTION 2: OTHER ATTRIBUTES */}
            <div className="pt-2">
              <h2 className="text-sm font-bold text-[#212121] mb-4 pb-2 border-b border-[#f0f0f0]">
                Other Attributes
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Base Metal */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Base Metal
                  </label>
                  <select
                    value={formData.baseMetal}
                    onChange={e => setFormData({ ...formData, baseMetal: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none font-medium"
                  >
                    <option value="">Select</option>
                    <option value="Conch Shell (Shankha)">Conch Shell (Shankha)</option>
                    <option value="Acrylic / Resin (Pola)">Acrylic / Resin (Pola)</option>
                    <option value="Iron (Loha)">Iron (Loha)</option>
                    <option value="Brass">Brass</option>
                    <option value="Copper">Copper</option>
                    <option value="Alloy">Alloy</option>
                    <option value="925 Sterling Silver">925 Sterling Silver</option>
                    <option value="18K Gold">18K Gold</option>
                    <option value="22K Gold">22K Gold</option>
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Brand
                  </label>
                  <select
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full h-10 px-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] outline-none font-medium"
                  >
                    <option value="NAXTTO">NAXTTO</option>
                    <option value="NAXTTO Fine Jewellery">NAXTTO Fine Jewellery</option>
                    <option value="Bengali Heritage Karigar">Bengali Heritage Karigar</option>
                    <option value="Swarna Shilpi">Swarna Shilpi</option>
                    <option value="Generic">Generic / Unbranded</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#555] mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter Description"
                  className="w-full p-3 text-xs text-[#212121] bg-white border border-[#d2d2d2] rounded-md focus:border-[#5022c3] focus:ring-1 focus:ring-[#5022c3] outline-none transition-all leading-relaxed"
                />
              </div>
            </div>

            {/* LEGAL DISCLAIMER AT BOTTOM - EXACT TEXT AS IN VIDEO */}
            <div className="pt-2 text-[10px] text-[#787878] leading-relaxed border-t border-[#f0f0f0]">
              <p>
                By listing your product(s) on Meesho/NaxtTo platform, you agree to comply with the applicable T&amp;C of the platform, as updated from time to time. You confirm that the product information (including labels, claim and packaging etc.) uploaded/shared, complies with Legal Metrology Act, 2009, Bureau of Indian Standards Act, 2016 (with applicable Quality Control Orders) and all other applicable rules and regulations. You also confirm that you are authorized to list and sell the product and have necessary licenses, brand approvals and permits as required under applicable law. In respect of each product listed within the category of Gold and Silver Jewellery, Bullion, Coins and other applicable products, you agree that you are BIS certified and each product complies with Bureau of Indian Standards (Hallmarking) Regulations, 2018. If your product is found to be non-compliant or violating any applicable law, your catalog may be delisted and penal action may be taken.
              </p>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: PHOTO GUIDELINES & UPLOADED IMAGES          */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-5 lg:sticky lg:top-20">
            
            {/* 1. PHOTO GUIDELINES CARD */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 shadow-xs space-y-3.5">
              
              {/* Item 1: Front View */}
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded border border-[#e0e0e0] overflow-hidden bg-[#fafafa] shrink-0">
                  <img
                    src="/src/assets/images/shankha_pola_set_1790249913718.jpg"
                    alt="Upload Front View"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#212121]">Upload Front View Image</h4>
                  <p className="text-[10px] text-[#757575]">Primary clear straight frontal perspective</p>
                </div>
              </div>

              {/* Item 2: Zoomed In View */}
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded border border-[#e0e0e0] overflow-hidden bg-[#fafafa] shrink-0">
                  <img
                    src="/src/assets/images/sakha_pola_stack_1790249812700.jpg"
                    alt="Zoomed In Image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#212121]">Zoomed In Image</h4>
                  <p className="text-[10px] text-[#757575]">Upload Close Up View of carving &amp; wire work</p>
                </div>
              </div>

              {/* Item 3: Top View */}
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded border border-[#e0e0e0] overflow-hidden bg-[#fafafa] shrink-0">
                  <img
                    src="/src/assets/images/loha_badhano_gold_1790249869592.jpg"
                    alt="Seller Top Image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#212121]">Seller Top Image</h4>
                  <p className="text-[10px] text-[#757575]">Add Top View showing circular curvature</p>
                </div>
              </div>

              {/* Item 4: Size Chart */}
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded border border-[#e0e0e0] overflow-hidden bg-purple-50 flex items-center justify-center shrink-0 text-[#5022c3]">
                  <FileCheck className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#212121]">Size Chart *</h4>
                  <p className="text-[10px] text-[#757575] leading-tight">
                    Size chart size wise body measurements should be given.
                  </p>
                </div>
              </div>

            </div>

            {/* 2. UPLOADED IMAGES CARD - EXACT MATCH TO VIDEO */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#212121]">Uploaded Images</h3>
                <span className="text-[11px] text-[#757575] font-medium">{formData.images.length} added</span>
              </div>

              {/* Image Grid with Red Border around Thumbnails + CHANGE button */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Thumbnail Box with Red border as seen in video! */}
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded border-2 border-[#e53935] overflow-hidden bg-[#fafafa] shadow-xs group">
                      <img
                        src={imgUrl}
                        alt={`Angle ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Delete button on hover */}
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-red-600/90 text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wide">
                          Front Image *
                        </span>
                      )}
                    </div>

                    {/* CHANGE Button Link right below thumbnail */}
                    <button
                      type="button"
                      onClick={() => triggerChangeImage(idx)}
                      className="mt-1 text-[10px] font-semibold text-[#5022c3] hover:underline uppercase tracking-wide cursor-pointer"
                    >
                      CHANGE
                    </button>
                  </div>
                ))}

                {/* "+ Add Images" Dotted Box Button */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setShowImagePickerModal(true)}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded border-2 border-dashed border-[#5022c3] bg-purple-50/40 hover:bg-purple-50 text-[#5022c3] flex flex-col items-center justify-center transition-all cursor-pointer group"
                    title="Add more photos"
                  >
                    <Plus className="w-5 h-5 text-[#5022c3] group-hover:scale-110 transition-transform mb-0.5" />
                    <span className="text-[10px] font-bold text-[#5022c3]">Add Images</span>
                  </button>
                  <span className="mt-1 text-[10px] text-transparent select-none">-</span>
                </div>
              </div>

              {/* Upload Assistance hint */}
              <p className="text-[10px] text-[#757575] pt-1">
                Upload up to 6 studio views: Front, Zoomed In, Top angle &amp; size reference.
              </p>
            </div>

          </div>

        </form>
      </div>

      {/* 3. STICKY BOTTOM BAR - EXACT MATCH TO VIDEO */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#e0e0e0] px-4 sm:px-8 py-3 z-40 flex items-center justify-between shadow-lg">
        {/* Left: Discard Catalog Button */}
        <button
          type="button"
          onClick={() => setShowDiscardConfirm(true)}
          className="px-4 py-2 border border-[#d2d2d2] rounded-md text-xs font-semibold text-[#555] hover:text-[#212121] hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Discard Catalog
        </button>

        {/* Center/Right: [Fill] Save Template + Save and Go Back + Submit Catalog */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          
          {/* [Fill] Save Template Button with Green Fill Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTemplateMenu(!showTemplateMenu)}
              className="px-3.5 py-2 border border-[#d2d2d2] rounded-md text-xs font-semibold text-[#212121] hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span className="bg-[#2e7d32] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-xs tracking-wider uppercase">
                Fill
              </span>
              <span>Save Template</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {/* Template Dropdown Menu */}
            {showTemplateMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-80 bg-white border border-[#e0e0e0] rounded-xl shadow-xl z-50 p-2 text-xs divide-y divide-gray-100 animate-scaleUp">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[#212121] text-[11px] uppercase tracking-wider">
                      Catalog Presets (1-Click Fill)
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#5022c3]" />
                  </div>
                  <div className="space-y-1">
                    {PRESET_TEMPLATES.map((tmpl, tIdx) => (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => applyTemplate(tmpl)}
                        className="w-full text-left p-2 rounded-lg hover:bg-purple-50 hover:text-[#5022c3] text-[#333] transition-colors cursor-pointer"
                      >
                        <p className="font-semibold text-xs">{tmpl.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {tmpl.genericName} • Sizes: {(tmpl.sizes || []).join(', ')} • {tmpl.netWeight}g
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* User's custom saved templates */}
                {savedCustomTemplates.length > 0 && (
                  <div className="p-2 space-y-1">
                    <span className="font-bold text-[#212121] text-[10px] uppercase tracking-wider text-gray-500">
                      My Saved Templates
                    </span>
                    {savedCustomTemplates.map((tmpl: any, sIdx: number) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => applyTemplate(tmpl)}
                        className="w-full text-left p-1.5 rounded-md hover:bg-gray-100 text-xs text-[#212121] truncate cursor-pointer"
                      >
                        ★ {tmpl.name} ({tmpl.sizes?.join(', ') || 'Variations'})
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-2 pt-2.5">
                  <button
                    type="button"
                    onClick={handleSaveAsCustomTemplate}
                    className="w-full py-1.5 bg-[#f0ebf8] hover:bg-[#e4dbf5] text-[#5022c3] font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Current Values as My Template</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Save and Go Back Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-4 py-2 border border-[#d2d2d2] rounded-md text-xs font-semibold text-[#212121] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
          >
            Save and Go Back
          </button>

          {/* Submit Catalog Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-6 py-2 bg-[#5022c3] hover:bg-[#431bb0] text-white text-xs font-bold rounded-md shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Submit Catalog</span>
          </button>
        </div>
      </div>

      {/* 4. LEARN TO UPLOAD SINGLE CATALOG VIDEO TUTORIAL MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea]">
              <div className="flex items-center gap-2 text-[#ff0000] font-bold text-sm">
                <div className="w-5 h-4 bg-[#ff0000] rounded-xs flex items-center justify-center text-white">
                  <div className="w-0 h-0 border-y-[3.5px] border-y-transparent border-l-[5.5px] border-l-white ml-0.5" />
                </div>
                <span className="text-[#212121]">Learn to Upload Single Catalog</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video preview container */}
            <div className="aspect-video bg-gradient-to-br from-neutral-900 via-neutral-800 to-purple-950 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white p-6 text-center relative group">
              <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                <PlayCircle className="w-8 h-8" />
              </div>
              <p className="font-bold text-sm mt-3">Single Catalog Upload &amp; Multi-Size Variations</p>
              <p className="text-[11px] text-gray-300 mt-1 max-w-sm">
                1. Select all available sizes (2.2, 2.4, 2.6) &gt; 2. Enter prices with &quot;Copy to all sizes&quot; &gt; 3. Add front and zoom angles &gt; 4. Publish catalog.
              </p>
            </div>

            {/* Checklist guide */}
            <div className="space-y-2 text-xs text-[#444] bg-[#f9fafb] p-3.5 rounded-xl border border-gray-100">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Multiple Size Variations:</strong> List all stock sizes in one catalog so customers can pick their perfect fit.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Front View Mandatory:</strong> Front perspective on a seamless pure white backdrop.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Legal Compliance:</strong> BIS Hallmarking registration details apply to all gold/silver items.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowVideoModal(false)}
              className="w-full py-2.5 bg-[#5022c3] hover:bg-[#431bb0] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Understood, Return to Catalog
            </button>
          </div>
        </div>
      )}

      {/* 5. ADD / CHANGE IMAGES MODAL */}
      {showImagePickerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea]">
              <div className="flex items-center gap-2 text-[#5022c3] font-bold text-sm">
                <ImageIcon className="w-5 h-5" />
                <span>Add / Replace Product Images</span>
              </div>
              <button
                type="button"
                onClick={() => setShowImagePickerModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Upload from Device Button */}
            <div className="p-4 border-2 border-dashed border-[#5022c3] rounded-xl bg-purple-50/30 text-center space-y-2">
              <Upload className="w-8 h-8 text-[#5022c3] mx-auto" />
              <p className="text-xs font-bold text-[#212121]">Upload from your Computer or Phone</p>
              <p className="text-[11px] text-[#666]">Supports high-resolution JPG, PNG, WebP studio photos.</p>
              <button
                type="button"
                onClick={() => {
                  setShowImagePickerModal(false);
                  triggerAddImage();
                }}
                className="px-4 py-2 bg-[#5022c3] hover:bg-[#431bb0] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Browse Files</span>
              </button>
            </div>

            {/* Studio Bengali Jewellery Presets */}
            <div className="space-y-2">
              <span className="block text-[11px] font-bold text-[#555] uppercase tracking-wider">
                Or Pick from High-Resolution Studio Gallery:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                {studioPresetImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectPresetImage(img.url)}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#5022c3] transition-all hover:scale-105 cursor-pointer"
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[8px] font-medium p-0.5 truncate text-center">
                      {img.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Web URL */}
            <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={e => setCustomImageUrl(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="flex-1 h-9 px-3 text-xs border border-gray-300 rounded-lg outline-none focus:border-[#5022c3]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customImageUrl.trim()) {
                    handleSelectPresetImage(customImageUrl.trim());
                    setCustomImageUrl('');
                  }
                }}
                className="px-3.5 py-2 bg-[#5022c3] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Add URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DISCARD CONFIRMATION MODAL */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#212121]">Discard Catalog?</h3>
              <p className="text-xs text-[#757575] mt-1">
                Any unsaved changes will be lost and you will return to the listings table.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 py-2 border border-[#d2d2d2] rounded-lg text-xs font-semibold text-[#212121] hover:bg-gray-50 cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onCancel();
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast feedback when custom template is saved */}
      {saveTemplateSuccess && (
        <div className="fixed bottom-20 right-8 bg-[#2e7d32] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-bold flex items-center gap-2 z-50 animate-bounce">
          <Check className="w-4 h-4" />
          <span>Template saved successfully! Use [Fill] to apply anytime.</span>
        </div>
      )}

    </div>
  );
};
