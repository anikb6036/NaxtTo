import React from 'react';
import { BrandLogo } from './BrandLogo';

export const TOTAL_PDF_PAGES = 15;

export interface PageMetadata {
  page: number;
  title: string;
  subtitle: string;
}

export const PDF_PAGES_META: PageMetadata[] = [
  { page: 1, title: "NaxtTo Lookbook", subtitle: "Cover & Archival Heirlooms" },
  { page: 2, title: "The Essence of Design", subtitle: "Minimalist Philosophy" },
  { page: 3, title: "Gemstone Collection", subtitle: "Origin & Symbolism Matrix" },
  { page: 4, title: "Gold & Silver Lines", subtitle: "Continuous Metallurgy" },
  { page: 5, title: "The Wedding Series", subtitle: "Bridal & Heirlooms" },
  { page: 6, title: "Everyday Luxury", subtitle: "Daily Wear Archetypes" },
  { page: 7, title: "Men’s Collection", subtitle: "Architectural Cuffs & Links" },
  { page: 8, title: "The Signature Line", subtitle: "Curated Statement Pieces" },
  { page: 9, title: "Limited Edition", subtitle: "Seasonal High Jewellery" },
  { page: 10, title: "Sustainability Commitment", subtitle: "100% Recycled Bullion" },
  { page: 11, title: "Custom Design Service", subtitle: "Bespoke Commissions" },
  { page: 12, title: "Price Range Overview", subtitle: "Investment Tiers" },
  { page: 13, title: "Brand Vision", subtitle: "Milanese Craft Heritage" },
  { page: 14, title: "Conclusion", subtitle: "Ethical Craft Manifesto" },
  { page: 15, title: "Atelier Client Inquiries", subtitle: "Via Montenapoleone Privé" }
];

const SlideHeader = () => (
  <div className="flex items-center justify-between pb-2 border-b border-[#eeeae4] text-[#2d2a26]">
    <BrandLogo layout="horizontal" size="xs" variant="dark" />
    <span className="text-[9px] uppercase tracking-[0.25em] text-[#86868b] font-sans font-medium">
      Lookbook · Milan & Antwerp
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
            <BrandLogo layout="horizontal" size="sm" variant="dark" showSubtitle subtitleText="High Jewellery" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#a39d96]">
              Volume 01 · 2026
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
              <p className="text-[10px] sm:text-xs text-[#86868b] tracking-wider uppercase font-sans">
                Fine Jewellery & Archival Heirlooms
              </p>
            </div>

            {/* Center Image */}
            <div className="col-span-4 h-full max-h-[220px] sm:max-h-[320px] md:max-h-[380px] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85"
                alt="NaxtTo High Jewellery Pedestal"
                className="h-full w-full object-cover object-center rounded-xs shadow-xs"
              />
            </div>

            {/* Right Description */}
            <div className="col-span-3 pl-1 sm:pl-2 flex flex-col justify-end">
              <p className="text-[9px] sm:text-xs text-[#524e48] leading-relaxed font-serif font-light">
                Sculpted from certified 100% recycled 18k solid gold, solar-crystallized lab diamonds, and natural saltwater baroque pearls. Handcrafted in our Milan and Antwerp ateliers with lifetime provenance certification.
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
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.08] text-[#2d2a26]">
                The Essence <br />
                of Design
              </h2>
            </div>

            <div className="col-span-6 space-y-4 sm:space-y-6">
              <div className="w-full h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85"
                  alt="The Essence of Design"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <p className="text-[9px] sm:text-xs text-[#524e48] leading-relaxed font-serif font-light">
                Every NaxtTo creation begins as a tribute to organic geometry and structural balance. We eliminate superfluous embellishments to highlight purest metallurgy and light refractions.
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
                Gemstone <br />
                Collection
              </h2>
            </div>
            <div className="col-span-7 h-28 sm:h-36 md:h-44 overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85"
                alt="Gemstone Collection Box"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          <div className="w-full overflow-hidden border border-[#d1ccc6] rounded-xs mt-2 font-sans text-xs">
            <div className="grid grid-cols-4 text-center font-medium text-white tracking-wider text-[9px] sm:text-[11px]">
              <div className="bg-[#64616b] py-2 sm:py-3 uppercase">Gemstone</div>
              <div className="bg-[#b5aba0] py-2 sm:py-3 uppercase">Origin</div>
              <div className="bg-[#cfcac2] py-2 sm:py-3 uppercase text-[#2d2a26]">Symbolism</div>
              <div className="bg-[#ded7cb] py-2 sm:py-3 uppercase text-[#2d2a26]">Color Range</div>
            </div>
            <div className="divide-y divide-[#eeeae4] text-[#2d2a26] text-[9px] sm:text-xs">
              <div className="grid grid-cols-4 py-1.5 sm:py-2.5 px-2 sm:px-3 text-center">
                <span className="font-medium">Solar Diamond</span>
                <span className="text-[#524e48]">Antwerp Lab</span>
                <span className="text-[#524e48]">Eternal clarity</span>
                <span className="text-[#524e48]">D-F Colorless</span>
              </div>
              <div className="grid grid-cols-4 py-1.5 sm:py-2.5 px-2 sm:px-3 text-center bg-[#fbf9f6]">
                <span className="font-medium">Ceylon Sapphire</span>
                <span className="text-[#524e48]">Sri Lanka</span>
                <span className="text-[#524e48]">Wisdom & serenity</span>
                <span className="text-[#524e48]">Royal Blue, Pastel</span>
              </div>
              <div className="grid grid-cols-4 py-1.5 sm:py-2.5 px-2 sm:px-3 text-center">
                <span className="font-medium">Muzo Emerald</span>
                <span className="text-[#524e48]">Colombia</span>
                <span className="text-[#524e48]">Growth & nobility</span>
                <span className="text-[#524e48]">Vivid Green</span>
              </div>
              <div className="grid grid-cols-4 py-1.5 sm:py-2.5 px-2 sm:px-3 text-center bg-[#fbf9f6]">
                <span className="font-medium">Pigeon Blood Ruby</span>
                <span className="text-[#524e48]">Myanmar</span>
                <span className="text-[#524e48]">Vitality & passion</span>
                <span className="text-[#524e48]">Deep Crimson</span>
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
                Gold & <br />
                Silver Lines
              </h2>
              <p className="text-[9px] sm:text-xs text-[#524e48] leading-relaxed font-serif font-light mt-4 sm:mt-6">
                Engineered with proprietary continuous extrusion casting, our 18k solid yellow gold, rose gold, and 950 platinum deliver high tensile durability while feeling weightless on skin.
              </p>
            </div>

            <div className="col-span-7 grid grid-cols-2 gap-3 sm:gap-4 items-center">
              <div className="h-32 sm:h-44 md:h-56 overflow-hidden rounded-xs col-start-2">
                <img
                  src="https://images.unsplash.com/photo-1611591477281-4de024d8a432?auto=format&fit=crop&w=800&q=85"
                  alt="Gold and Silver Editorial"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="col-span-2 bg-[#5c5963] text-white p-4 sm:p-6 md:p-7 rounded-xs text-[9px] sm:text-xs leading-relaxed font-serif font-light shadow-sm">
                Each piece is certified conflict-free, stamped with the official Milanese atelier hallmark, and refined to a mirror satin sheen by master goldsmiths.
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
                The <br />
                Wedding <br />
                Series
              </h2>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light mt-3 sm:mt-4">
                Bespoke engagement rings, eternity pavé bands, and ceremonial suites crafted to commemorate lifelong unions.
              </p>
            </div>

            <div className="col-span-4 h-full max-h-[260px] sm:max-h-[360px] overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=85"
                alt="The Wedding Series Model"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-4 flex flex-col justify-between h-full py-2 space-y-3 sm:space-y-4">
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Engineered with comfort-fit beveling and micro-prong diamond settings that withstand daily wear while maximizing brilliance.
              </p>
              <div className="h-24 sm:h-32 md:h-40 overflow-hidden rounded-xs">
                <img
                  src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85"
                  alt="Wedding Ring Hand"
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
                Luxury
              </h2>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Effortless silhouettes curated for modular stacking, refined commutes, and casual refinement.
              </p>
            </div>

            <div className="col-span-4 flex flex-col justify-start h-full pt-2 sm:pt-4">
              <div className="bg-[#cfcfcf]/50 p-4 sm:p-6 rounded-xs text-[9px] sm:text-[11px] text-[#2d2a26] leading-relaxed font-serif font-light">
                From delicate huggie earrings to whisper chain necklaces, each creation transitions gracefully from morning meetings to evening galas.
              </div>
            </div>

            <div className="col-span-4 h-full max-h-[260px] sm:max-h-[360px] overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=85"
                alt="Everyday Luxury Pieces"
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
                Men’s <br />
                Collection
              </h2>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Subtle structural cuffs, signet bands, and solid curb link chains rendered in brushed platinum and blackened gold.
              </p>
            </div>

            <div className="col-span-4 h-full max-h-[260px] sm:max-h-[360px] overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"
                alt="Men's Fine Collection"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-4 bg-[#cfcfcf]/50 p-4 sm:p-8 rounded-xs flex flex-col justify-center">
              <p className="text-[9px] sm:text-xs text-[#2d2a26] leading-relaxed font-serif font-light">
                Designed for discerning wearers who appreciate understated tactile substance and architectural proportions.
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
                Line
              </h2>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light mt-4 sm:mt-6">
                Our world-renowned halo solitaire ring and hand-woven snake chain necklace representing the core pillars of NaxtTo craft.
              </p>
            </div>

            <div className="col-span-7 grid grid-cols-2 gap-3 sm:gap-4 items-center">
              <div className="h-28 sm:h-36 md:h-44 overflow-hidden rounded-xs col-start-2">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=85"
                  alt="Signature Oval Ring"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="h-28 sm:h-36 md:h-44 overflow-hidden rounded-xs">
                <img
                  src="https://images.unsplash.com/photo-1611591477281-4de024d8a432?auto=format&fit=crop&w=600&q=85"
                  alt="Signature Chain Bracelet"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Individually numbered and registered in the NaxtTo client ledger with complimentary annual cleaning and inspections.
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
                Edition
              </h2>
              <div className="bg-[#cfcfcf]/50 p-4 sm:p-6 rounded-xs text-[9px] sm:text-[11px] text-[#2d2a26] leading-relaxed font-serif font-light mt-3 sm:mt-4">
                Strictly capped editions of 25 pieces per release, showcasing rare Australian boulder opals, Tahitian black pearls, and bespoke rose-cut diamonds.
              </div>
            </div>

            <div className="col-span-4 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85"
                alt="Limited Edition Sunlight Shadows"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-3 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=85"
                alt="Limited Edition Curb Link"
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
                Sustainability <br />
                Commitment
              </h2>
              <div className="h-24 sm:h-32 md:h-40 overflow-hidden rounded-xs bg-[#5c5963] p-1 mt-2 sm:mt-3">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=85"
                  alt="Sustainability Layered Rings"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="col-span-4 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85"
                alt="Sculpted Earrings on Marble"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-4 flex flex-col justify-between h-full py-2 space-y-3 sm:space-y-4">
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                We exclusively employ 100% recycled gold bullions and lab-grown diamonds crystallized using clean hydro and solar energy grids.
              </p>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Zero open-pit mining impact, zero conflict trace, and verified carbon-neutral express courier transport worldwide.
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
                Design <br />
                Service
              </h2>
              <p className="text-[9px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                Collaborate directly with our master jeweller on private 1-on-1 bespoke commissions from hand sketches to 3D wax renders.
              </p>
            </div>

            <div className="col-span-4 bg-[#cfcfcf]/50 p-4 sm:p-8 rounded-xs h-40 sm:h-56 md:h-72 flex items-center justify-center">
              <p className="text-[9px] sm:text-xs text-[#2d2a26] leading-relaxed font-serif font-light text-center">
                Virtual consultations or private Milan atelier appointments available upon request with guaranteed 4-week delivery.
              </p>
            </div>

            <div className="col-span-4 h-40 sm:h-56 md:h-72 overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85"
                alt="Custom Ring Stacking"
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
                Price Range <br />
                Overview
              </h2>
            </div>

            <div className="col-span-8 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col rounded-xs overflow-hidden shadow-xs border border-[#eeeae4]">
                <div className="bg-[#cfcfcf]/40 p-4 sm:p-6 flex-1 space-y-2 sm:space-y-3">
                  <h3 className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#2d2a26]">
                    Everyday Luxury
                  </h3>
                  <p className="text-[8px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                    Continuous bands, huggie hoops, and minimalist charm pendants in 18k solid gold.
                  </p>
                </div>
                <div className="bg-[#a69c93] py-3 sm:py-4 px-4 sm:px-6 text-white text-center font-serif text-xl sm:text-3xl font-light">
                  ₹28,000 – ₹98,000
                </div>
              </div>

              <div className="flex flex-col rounded-xs overflow-hidden shadow-xs border border-[#eeeae4]">
                <div className="bg-[#cfcfcf]/40 p-4 sm:p-6 flex-1 space-y-2 sm:space-y-3">
                  <h3 className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#2d2a26]">
                    Fine & Bespoke Suites
                  </h3>
                  <p className="text-[8px] sm:text-[11px] text-[#524e48] leading-relaxed font-serif font-light">
                    Solitaire diamonds, bridal sets, and one-of-a-kind gemstone heirlooms.
                  </p>
                </div>
                <div className="bg-[#a69c93] py-3 sm:py-4 px-4 sm:px-6 text-white text-center font-serif text-xl sm:text-3xl font-light">
                  ₹1,25,000 – ₹6,90,000+
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
                Brand <br />
                Vision
              </h2>
              <div className="bg-[#cfcfcf]/50 p-4 sm:p-6 rounded-xs text-[9px] sm:text-[11px] text-[#2d2a26] leading-relaxed font-serif font-light mt-3 sm:mt-4">
                To create enduring jewellery that lives symbiotically with the wearer, celebrating quiet sophistication over ostentation.
              </div>
            </div>

            <div className="col-span-4 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85"
                alt="Brand Vision Hoops"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-3 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1611591477281-4de024d8a432?auto=format&fit=crop&w=600&q=85"
                alt="Brand Vision Chain Bracelet"
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
                Manifesto
              </h2>
              <div className="bg-[#cfcfcf]/50 p-4 sm:p-6 rounded-xs text-[9px] sm:text-[11px] text-[#2d2a26] leading-relaxed font-serif font-light mt-3 sm:mt-4">
                Authenticity is our highest standard. Every facet, hallmark, and setting is backed by an unwavering commitment to generational craftsmanship.
              </div>
            </div>

            <div className="col-span-4 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=85"
                alt="Conclusion Draped Necklaces"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="col-span-3 h-36 sm:h-48 md:h-64 overflow-hidden rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=85"
                alt="Conclusion Pendants on Rock"
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
              <BrandLogo layout="vertical" size="xl" variant="dark" showSubtitle subtitleText="Milan & Antwerp Atelier" />
              <h2 className="font-serif text-3xl sm:text-5xl font-light leading-none text-[#2d2a26] pt-2">
                Thank You
              </h2>
            </div>

            <div className="col-span-6 grid grid-cols-2 gap-4 sm:gap-6 items-center">
              <div className="h-32 sm:h-44 md:h-56 overflow-hidden rounded-xs">
                <img
                  src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85"
                  alt="Thank You Interlocking Hoops"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="text-[9px] sm:text-xs text-[#524e48] leading-relaxed font-serif font-light space-y-2">
                <p className="font-semibold text-[#1d1d1f] font-sans text-xs">Client Concierge:</p>
                <p>Via Montenapoleone 8, Milano</p>
                <p>concierge@naxtto.com</p>
                <p>+39 02 8765 4321</p>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
