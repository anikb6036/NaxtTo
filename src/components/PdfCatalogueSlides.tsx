import React from 'react';
import { BrandLogo } from './BrandLogo';

// Certified Sakha Pola and Bengali Bridal Images
import imgSakhaPolaStack from '../assets/images/sakha_pola_stack_1790249812700.jpg';
import imgGoldBadhanoPola from '../assets/images/gold_badhano_pola_1790249832633.jpg';
import imgMayurMukhiShankha from '../assets/images/mayur_mukhi_shankha_1790249854136.jpg';
import imgLohaBadhanoGold from '../assets/images/loha_badhano_gold_1790249869592.jpg';
import imgBengaliBridalWrist from '../assets/images/bengali_bridal_wrist_1790249886691.jpg';
import imgShankhaPolaSet from '../assets/images/shankha_pola_set_1790249913718.jpg';
import imgArtisanShankhari from '../assets/images/artisan_shankhari_1790250280309.jpg';
import imgGoldsmithBadhano from '../assets/images/goldsmith_badhano_1790250296653.jpg';
import imgBengaliWeddingRitual from '../assets/images/bengali_wedding_ritual_1790250311157.jpg';
import imgDailyModernPola from '../assets/images/daily_modern_pola_1790250330549.jpg';
import imgBengaliBridalBangles from '../assets/images/bengali_bridal_bangles_1789477964190.jpg';

export const TOTAL_PDF_PAGES = 15;

export interface PageMetadata {
  page: number;
  title: string;
  subtitle: string;
}

export const PDF_PAGES_META: PageMetadata[] = [
  { page: 1, title: "NaxtTo Sakha Pola", subtitle: "Bengali Heritage & Conch Heirlooms" },
  { page: 2, title: "The Essence of Sakha Pola", subtitle: "Sacred Conch & Auspicious Coral" },
  { page: 3, title: "Sacred Materials Matrix", subtitle: "Turbinella Conch, Coral Lac & 22K Gold" },
  { page: 4, title: "22K Gold Badhano Lines", subtitle: "Borkhi Wire Filigree & Diamond-Cut Gold" },
  { page: 5, title: "The Bengali Wedding Series", subtitle: "Sampurna Bou & Saat Paake Ghora Suites" },
  { page: 6, title: "Everyday Auspicious Wear", subtitle: "Comfort-Fit Pola & Smooth Conch Shankha" },
  { page: 7, title: "Loha Badhano Protective Bands", subtitle: "Wrought Iron Encased in Solid 22K Gold" },
  { page: 8, title: "The Signature Mukhi Line", subtitle: "Mayur Mukhi & Makara Mukhi Masterpieces" },
  { page: 9, title: "Limited Bridal Commissions", subtitle: "Royal Zamindari & Floral Jaal Openwork" },
  { page: 10, title: "Purity & Hallmarking", subtitle: "Natural Acoustic Conch & 916 BIS Hallmark" },
  { page: 11, title: "Custom Bangle Sizing", subtitle: "Traditional Hand Circumference & Tailored Badhano" },
  { page: 12, title: "Investment Overview", subtitle: "Daily Auspicious to Grand Bridal Tiers" },
  { page: 13, title: "Bengal Craft Vision", subtitle: "Preserving 1,500 Years of Conch Artisans" },
  { page: 14, title: "Our Sacred Manifesto", subtitle: "Integrity, Heritage & Marital Blessings" },
  { page: 15, title: "Bridal Atelier Concierge", subtitle: "Bowbazar Kolkata & Nabadwip Workshops" }
];

const SlideHeader = () => (
  <div className="flex items-center justify-between pb-2 border-b border-[#eeeae4] text-[#2d2a26]">
    <BrandLogo layout="horizontal" size="xs" variant="dark" />
    <span className="text-[9px] uppercase tracking-[0.25em] text-[#8C271E] font-sans font-medium">
      Lookbook · Nabadwip Conch Works & Bowbazar Goldsmith Ateliers
    </span>
  </div>
);

export const renderPdfSlide = (page: number) => {
  switch (page) {
    case 1:
      return (
        <div id="pdf-page-1" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          {/* Top Brand Banner */}
          <div className="flex items-center justify-between border-b border-[#eeeae4] pb-3">
            <BrandLogo layout="horizontal" size="sm" variant="dark" showSubtitle subtitleText="Sakha Pola & Gold Heirlooms" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#8C271E] font-semibold">
              Heritage Volume 01 · Bengal Ateliers
            </span>
          </div>

          {/* Center Content */}
          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center flex-1 my-2 sm:my-4">
            {/* Left Title */}
            <div className="col-span-5 pr-2 sm:pr-4 space-y-4">
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight text-[#2d2a26]">
                NaxtTo <br />
                Catalogue
              </h1>
              <p className="text-[10px] sm:text-xs text-[#8C271E] tracking-wider uppercase font-sans font-semibold">
                Authentic Sakha Pola & 22K Gold Badhano Heirlooms
              </p>
            </div>

            {/* Center Image */}
            <div className="col-span-4 h-full max-h-[220px] sm:max-h-[320px] md:max-h-[380px] flex items-center justify-center">
              <img
                src={imgSakhaPolaStack}
                alt="NaxtTo Handcrafted Shankha Pola Suite"
                className="h-full w-full object-cover object-center rounded-xs shadow-xs"
              />
            </div>

            {/* Right Description */}
            <div className="col-span-3 pl-1 sm:pl-2 flex flex-col justify-end">
              <p className="text-[9px] sm:text-xs text-[#524e48] leading-relaxed font-serif font-light">
                Sculpted from genuine natural ocean conch shells (Turbinella pyrum), lustrous vermilion coral Pola, and certified 22K (916) BIS hallmarked gold. Hand-carved and wire-bound in our Nabadwip and Bowbazar heritage ateliers with lifetime authenticity and purity certification.
              </p>
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div id="pdf-page-2" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-6 sm:gap-8 items-center flex-1 my-2">
            <div className="col-span-6 pr-4 sm:pr-6">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light leading-[1.08] text-[#2d2a26]">
                The Essence <br />
                of Sakha Pola
              </h2>
              <p className="text-[11px] sm:text-xs text-[#8C271E] tracking-widest uppercase font-sans font-semibold mt-3">
                1,500 Years of Bengali Marital Devotion
              </p>
            </div>

            <div className="col-span-6 space-y-4 sm:space-y-6">
              <div className="w-full h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
                <img
                  src={imgArtisanShankhari}
                  alt="Master Shankhari Artisan Hand-Carving Conch Shell"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <p className="text-[9px] sm:text-xs text-[#524e48] leading-relaxed font-serif font-light">
                For over fifteen centuries in Bengal, the white Shankha (chiseled from sacred ocean conch shells) and deep crimson Pola (red coral lac) have adorned married women as eternal symbols of peace, health, and auspicious marital harmony. Each piece is chiseled by hand with age-old tools.
              </p>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div id="pdf-page-3" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center my-2">
            <div className="col-span-5">
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light leading-tight text-[#2d2a26]">
                Sacred <br />
                Materials Matrix
              </h2>
              <p className="text-[10px] text-[#8C271E] uppercase tracking-wider font-sans font-semibold mt-1">
                Conch, Vermilion Lac, 22K Gold & Iron
              </p>
            </div>
            <div className="col-span-7 h-28 sm:h-36 md:h-44 overflow-hidden rounded-xs">
              <img
                src={imgMayurMukhiShankha}
                alt="Sacred Conch and Red Pola Materials"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          <div className="w-full overflow-hidden border border-[#d1ccc6] rounded-xs mt-2 font-sans text-xs">
            <div className="grid grid-cols-4 text-center font-medium text-white tracking-wider text-[9px] sm:text-[11px]">
              <div className="bg-[#8C271E] py-2 sm:py-3 uppercase">Sacred Medium</div>
              <div className="bg-[#b5aba0] py-2 sm:py-3 uppercase text-[#2d2a26]">Atelier Origin</div>
              <div className="bg-[#cfcac2] py-2 sm:py-3 uppercase text-[#2d2a26]">Vedic Symbolism</div>
              <div className="bg-[#ded7cb] py-2 sm:py-3 uppercase text-[#2d2a26]">Purity Standard</div>
            </div>
            <div className="divide-y divide-[#eeeae4] text-[#2d2a26] text-[9px] sm:text-xs">
              <div className="grid grid-cols-4 py-1.5 sm:py-2.5 px-2 sm:px-3 text-center">
                <span className="font-medium text-[#8C271E]">Natural Shankha</span>
                <span className="text-[#524e48]">Nabadwip Atelier</span>
                <span className="text-[#524e48]">Purity & Ocean Serenity</span>
                <span className="text-[#524e48]">100% Conch Shell (Acoustic)</span>
              </div>
              <div className="grid grid-cols-4 py-1.5 sm:py-2.5 px-2 sm:px-3 text-center bg-[#fbf9f6]">
                <span className="font-medium text-[#8C271E]">Auspicious Pola</span>
                <span className="text-[#524e48]">Bowbazar Lac Works</span>
                <span className="text-[#524e48]">Marital Vitality & Energy</span>
                <span className="text-[#524e48]">High-Density Mirror Vermilion</span>
              </div>
              <div className="grid grid-cols-4 py-1.5 sm:py-2.5 px-2 sm:px-3 text-center">
                <span className="font-medium text-[#8C271E]">Solid 22K Gold</span>
                <span className="text-[#524e48]">Bowbazar Goldsmiths</span>
                <span className="text-[#524e48]">Eternal Lakshmi Blessing</span>
                <span className="text-[#524e48]">BIS 916 Hallmarked Gold</span>
              </div>
              <div className="grid grid-cols-4 py-1.5 sm:py-2.5 px-2 sm:px-3 text-center bg-[#fbf9f6]">
                <span className="font-medium text-[#8C271E]">Tempered Loha</span>
                <span className="text-[#524e48]">Heritage Forge</span>
                <span className="text-[#524e48]">Protective Health Shield</span>
                <span className="text-[#524e48]">Solid Iron with 22K Casing</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div id="pdf-page-4" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-6 sm:gap-8 items-stretch flex-1 my-3">
            <div className="col-span-5 flex flex-col justify-between pr-2 sm:pr-4">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light leading-tight text-[#2d2a26]">
                22K Gold <br />
                Badhano Lines
              </h2>
              <p className="text-[9px] sm:text-xs text-[#524e48] leading-relaxed font-serif font-light mt-4 sm:mt-6">
                Engineered with master Bowbazar wire-drawing techniques, our pure 22K (916) BIS hallmarked yellow gold wire is hand-wrapped into traditional Borkhi (rhombus diamond leaf) and Naksha filigree patterns that securely encase each Pola bangle.
              </p>
            </div>

            <div className="col-span-7 grid grid-cols-2 gap-3 sm:gap-4 items-center">
              <div className="h-32 sm:h-44 md:h-56 overflow-hidden rounded-xs col-start-2">
                <img
                  src={imgGoldsmithBadhano}
                  alt="Bowbazar Goldsmith Wrapping 22K Gold Wire"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="col-span-2 bg-[#8C271E] text-white p-4 sm:p-6 md:p-7 rounded-xs text-[9px] sm:text-xs leading-relaxed font-serif font-light shadow-sm">
                Every gold-bound bangle features micro-soldered gold joints and reinforced safety clamps that ensure decades of comfortable daily wear without wire slippage or snagging on silk sarees.
              </div>
            </div>
          </div>
        </div>
      );

    case 5:
      return (
        <div id="pdf-page-5" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center flex-1 my-2">
            <div className="col-span-4 flex flex-col justify-between h-full py-2">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-[#2d2a26]">
                The Bengali <br />
                Wedding <br />
                Series
              </h2>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light mt-3 sm:mt-4">
                Sampurna Bou bridal hampers featuring coordinated 22K Gold Crown Badhano Shankha, Borkhi Pola, and Makara Loha for Saat Paake Ghora and Subho Drishti rituals.
              </p>
            </div>

            <div className="col-span-4 h-full max-h-[260px] sm:max-h-[360px] overflow-hidden rounded-xs">
              <img
                src={imgBengaliWeddingRitual}
                alt="Bengali Bride Holding Betel Leaves at Subho Drishti"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-4 flex flex-col justify-between h-full py-2 space-y-3 sm:space-y-4">
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Delivered in a crimson Banarasi silk bridal chest accompanied by a hand-beaten brass sindoor kouto, authentic alta vial, and a certified BIS hallmarking certificate.
              </p>
              <div className="h-24 sm:h-32 md:h-40 overflow-hidden rounded-xs">
                <img
                  src={imgBengaliBridalWrist}
                  alt="Bridal Wrist Adorned with Shakha Pola and Red Banarasi"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 6:
      return (
        <div id="pdf-page-6" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-6 sm:gap-8 items-center flex-1 my-2">
            <div className="col-span-4 flex flex-col justify-between h-full py-3">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light leading-tight text-[#2d2a26]">
                Everyday <br />
                Auspicious
              </h2>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Lightweight comfort-fit Pola and slender Shankha designed for contemporary life, office wear, and daily household work.
              </p>
            </div>

            <div className="col-span-4 flex flex-col justify-start h-full pt-2 sm:pt-4">
              <div className="bg-[#f7f2ea] p-4 sm:p-6 rounded-xs text-[9px] sm:text-[11px] text-[#2d2a26] leading-relaxed font-serif font-light border border-[#e5dfd7]">
                Engineered with rounded interior walls to prevent wrist fatigue, water-resistant solid resin cores that never fade under soap or cooking spices, and shatter-resistant conch profiles.
              </div>
            </div>

            <div className="col-span-4 h-full max-h-[260px] sm:max-h-[360px] overflow-hidden rounded-xs">
              <img
                src={imgDailyModernPola}
                alt="Contemporary Minimalist Daily Wear Pola and Shankha"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div id="pdf-page-7" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-6 sm:gap-8 items-center flex-1 my-2">
            <div className="col-span-4 flex flex-col justify-between h-full py-4">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light leading-tight text-[#2d2a26]">
                Sacred Loha <br />
                Badhano
              </h2>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Solid tempered iron core encased in 22K hallmarked yellow gold with sculpted Makara or Elephant terminal heads.
              </p>
            </div>

            <div className="col-span-4 h-full max-h-[260px] sm:max-h-[360px] overflow-hidden rounded-xs">
              <img
                src={imgLohaBadhanoGold}
                alt="22K Gold Encased Makara Mukhi Loha Badhano"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-4 bg-[#f8f5f0] p-4 sm:p-8 rounded-xs flex flex-col justify-center border border-[#e8e2d8]">
              <p className="text-[9px] sm:text-xs text-[#2d2a26] leading-relaxed font-serif font-light">
                According to Bengali tradition, the groom places the iron Loha on the bride’s left arm during marriage rituals as a timeless protective shield for her husband’s health and longevity.
              </p>
            </div>
          </div>
        </div>
      );

    case 8:
      return (
        <div id="pdf-page-8" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none overflow-hidden shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center flex-1 my-2 relative z-10">
            <div className="col-span-5 flex flex-col justify-between h-full py-2 sm:py-4">
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light leading-tight text-[#2d2a26]">
                The Signature <br />
                Mukhi Line
              </h2>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light mt-4 sm:mt-6">
                Our celebrated Mayur Mukhi (peacock head) Shankha and Makara Mukhi (sea dragon) Loha representing the absolute summit of Bengali ancestral relief carving.
              </p>
            </div>

            <div className="col-span-7 grid grid-cols-2 gap-3 sm:gap-4 items-center">
              <div className="h-28 sm:h-36 md:h-44 overflow-hidden rounded-xs col-start-2">
                <img
                  src={imgMayurMukhiShankha}
                  alt="Mayur Mukhi Shankha Carving Detail"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="h-28 sm:h-36 md:h-44 overflow-hidden rounded-xs">
                <img
                  src={imgLohaBadhanoGold}
                  alt="Makara Head Gold Terminal"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Every terminal head is sculpted under magnifying optics by master carvers in Nabadwip and Hooghly, preserving sacred Vedic zoomorphic proportions.
              </p>
            </div>
          </div>
        </div>
      );

    case 9:
      return (
        <div id="pdf-page-9" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center flex-1 my-2">
            <div className="col-span-5 flex flex-col justify-between h-full py-3 sm:py-4">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light leading-tight text-[#2d2a26]">
                Limited <br />
                Commissions
              </h2>
              <div className="bg-[#f7f2ea] p-4 sm:p-6 rounded-xs text-[9px] sm:text-[11px] text-[#2d2a26] leading-relaxed font-serif font-light mt-3 sm:mt-4 border border-[#e5dfd7]">
                Strictly capped editions of 25 pairs per wedding season, showcasing pierced floral jaal openwork, heavy 22K gold crown caps, and heirloom Zamindari motifs.
              </div>
            </div>

            <div className="col-span-4 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src={imgBengaliBridalBangles}
                alt="Limited Edition Zamindari Shankha Pola Stack"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-3 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src={imgShankhaPolaSet}
                alt="Full Wedding Trunk Keepsake Display"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      );

    case 10:
      return (
        <div id="pdf-page-10" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center flex-1 my-2">
            <div className="col-span-4 flex flex-col justify-between h-full py-2">
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light leading-tight text-[#2d2a26]">
                Purity & <br />
                Hallmarking
              </h2>
              <div className="h-24 sm:h-32 md:h-40 overflow-hidden rounded-xs bg-[#5c5963] p-1 mt-2 sm:mt-3">
                <img
                  src={imgGoldBadhanoPola}
                  alt="BIS 916 Hallmarked 22K Gold Pola"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="col-span-4 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src={imgMayurMukhiShankha}
                alt="100% Genuine Conch Shell Purity"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-4 flex flex-col justify-between h-full py-2 space-y-3 sm:space-y-4">
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Zero imitation gypsum or plastic compounds. Every Shankha is carved exclusively from genuine Turbinella pyrum marine conch shells, verifiable by its natural acoustic ocean resonance.
              </p>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                All gold badhano wires and caps are independently tested and certified with 6-digit BIS HUID hallmarking ensuring absolute 22K (91.6%) gold purity.
              </p>
            </div>
          </div>
        </div>
      );

    case 11:
      return (
        <div id="pdf-page-11" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center flex-1 my-2">
            <div className="col-span-4 flex flex-col justify-between h-full py-3 sm:py-4">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-[#2d2a26]">
                Custom <br />
                Bangle Sizing <br />
                Service
              </h2>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Exact sizing in standard Bengali bangle scales (2.2, 2.4, 2.6, 2.8, 2.10) with custom palm-knuckle fit calipers.
              </p>
            </div>

            <div className="col-span-4 bg-[#f7f2ea] p-4 sm:p-8 rounded-xs h-40 sm:h-56 md:h-72 flex flex-col items-center justify-center border border-[#e5dfd7]">
              <p className="text-[9px] sm:text-xs text-[#2d2a26] leading-relaxed font-serif font-light text-center">
                Have ancestral 22K gold? Our Bowbazar goldsmiths offer custom bespoke badhano binding onto new genuine Shankha and Pola with guaranteed 7-day atelier completion.
              </p>
            </div>

            <div className="col-span-4 h-40 sm:h-56 md:h-72 overflow-hidden rounded-xs">
              <img
                src={imgBengaliBridalWrist}
                alt="Custom Sized Bridal Bangles on Bride"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      );

    case 12:
      return (
        <div id="pdf-page-12" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-6 sm:gap-8 items-center flex-1 my-2">
            <div className="col-span-4 pr-2 sm:pr-4">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light leading-tight text-[#2d2a26]">
                Investment <br />
                Overview
              </h2>
              <p className="text-[10px] text-[#8C271E] uppercase tracking-wider font-sans font-semibold mt-2">
                Auspicious Tiers for Every Bengali Home
              </p>
            </div>

            <div className="col-span-8 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col rounded-xs overflow-hidden shadow-xs border border-[#eeeae4]">
                <div className="bg-[#fbf9f6] p-4 sm:p-6 flex-1 space-y-2 sm:space-y-3">
                  <h3 className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#8C271E]">
                    Daily Wear & Classics
                  </h3>
                  <p className="text-[8px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                    Hand-carved conch Shankha pairs, high-density plain crimson Pola, and traditional carved fish and floral pairs.
                  </p>
                </div>
                <div className="bg-[#8C271E] py-3 sm:py-4 px-4 sm:px-6 text-white text-center font-serif text-xl sm:text-3xl font-light">
                  ₹1,499 – ₹6,999
                </div>
              </div>

              <div className="flex flex-col rounded-xs overflow-hidden shadow-xs border border-[#eeeae4]">
                <div className="bg-[#fbf9f6] p-4 sm:p-6 flex-1 space-y-2 sm:space-y-3">
                  <h3 className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#8C271E]">
                    22K Gold Badhano & Bridal Suites
                  </h3>
                  <p className="text-[8px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                    BIS hallmarked 22K gold wire Borkhi Pola, Gold Crown Shankha, Makara Loha, and full 5-piece royal trunks.
                  </p>
                </div>
                <div className="bg-[#b38f4d] py-3 sm:py-4 px-4 sm:px-6 text-white text-center font-serif text-xl sm:text-3xl font-light">
                  ₹24,999 – ₹1,85,000+
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 13:
      return (
        <div id="pdf-page-13" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center flex-1 my-2">
            <div className="col-span-5 flex flex-col justify-between h-full py-3 sm:py-4">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light leading-tight text-[#2d2a26]">
                Bengal Craft <br />
                Vision
              </h2>
              <div className="bg-[#f7f2ea] p-4 sm:p-6 rounded-xs text-[9px] sm:text-[11px] text-[#2d2a26] leading-relaxed font-serif font-light mt-3 sm:mt-4 border border-[#e5dfd7]">
                To safeguard Bengal’s hereditary conch carvers and goldsmith guilds from vanishing, ensuring every bride receives authentic ancestral blessings.
              </div>
            </div>

            <div className="col-span-4 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src={imgArtisanShankhari}
                alt="Shankhari Guild Artisan at Work"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-3 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src={imgGoldBadhanoPola}
                alt="Generational 22K Gold Pola Heirloom"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      );

    case 14:
      return (
        <div id="pdf-page-14" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center flex-1 my-2">
            <div className="col-span-5 flex flex-col justify-between h-full py-3 sm:py-4">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light leading-tight text-[#2d2a26]">
                Our Sacred <br />
                Manifesto
              </h2>
              <div className="bg-[#f7f2ea] p-4 sm:p-6 rounded-xs text-[9px] sm:text-[11px] text-[#2d2a26] leading-relaxed font-serif font-light mt-3 sm:mt-4 border border-[#e5dfd7]">
                A Bengali wedding is a sacred spiritual milestone. We vow never to compromise on genuine conch shells, unadulterated red lacquer, and 100% certified 22K gold.
              </div>
            </div>

            <div className="col-span-4 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src={imgBengaliWeddingRitual}
                alt="Sacred Bengali Bridal Rituals"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-3 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src={imgShankhaPolaSet}
                alt="Heirloom Bengali Wedding Suite"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      );

    case 15:
      return (
        <div id="pdf-page-15" className="relative aspect-[16/9] w-full bg-[#fdfcfb] text-[#2d2a26] p-6 sm:p-12 md:p-14 flex flex-col justify-between select-none shadow-sm">
          <SlideHeader />

          <div className="grid grid-cols-12 gap-6 sm:gap-8 items-center flex-1 my-2">
            <div className="col-span-6 pr-4 sm:pr-6 space-y-4">
              <BrandLogo layout="vertical" size="xl" variant="dark" showSubtitle subtitleText="Bengal Heritage Ateliers" />
              <h2 className="font-serif text-3xl sm:text-5xl font-light leading-none text-[#2d2a26] pt-2">
                Shubho Bibaho
              </h2>
              <p className="text-xs text-[#8C271E] font-serif italic">
                Blessings for a lifelong journey of joy, harmony, and prosperity.
              </p>
            </div>

            <div className="col-span-6 grid grid-cols-2 gap-4 sm:gap-6 items-center">
              <div className="h-32 sm:h-44 md:h-56 overflow-hidden rounded-xs">
                <img
                  src={imgSakhaPolaStack}
                  alt="NaxtTo Bengali Bridal Suite"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="text-[9px] sm:text-xs text-[#524e48] leading-relaxed font-serif font-light space-y-2">
                <p className="font-semibold text-[#8C271E] font-sans text-xs">Bridal Concierge & Ateliers:</p>
                <p>Bowbazar Jewellery Quarter, Kolkata</p>
                <p>Shankhari Patti, Nabadwip, West Bengal</p>
                <p>concierge@naxtto.com</p>
                <p>+91 (033) 2235 8890 / +91 98300 24680</p>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
