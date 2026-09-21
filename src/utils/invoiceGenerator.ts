import jsPDF from 'jspdf';
import { Order, UserProfile } from '../types';

export interface GenerateInvoiceOptions {
  order: Order;
  user?: Partial<UserProfile> | null;
  currencySymbol?: string;
}

/**
 * Generates and triggers download of a high-resolution, luxury atelier PDF tax invoice & consignment summary
 */
export function generateOrderInvoicePDF({
  order,
  user,
  currencySymbol = '£'
}: GenerateInvoiceOptions): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      // --- 1. LUXURY HEADER BANNER ---
      // Brand Bar Background
      doc.setFillColor(29, 29, 31); // #1d1d1f
      doc.rect(margin, y, contentWidth, 24, 'F');

      // Brand Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('NAXTTO FINE JEWELLERY', margin + 8, y + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(197, 160, 89); // Gold accent #c5a059
      doc.text('HAUTE JOAILLERIE • BIS HALLMARKED 18K & 22K SOLID GOLD', margin + 8, y + 16);

      // Tax Invoice Label on Right
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('OFFICIAL TAX INVOICE', pageWidth - margin - 8, y + 10, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      doc.text('ORIGINAL FOR RECIPIENT', pageWidth - margin - 8, y + 16, { align: 'right' });

      y += 30;

      // --- 2. INVOICE META & CONSIGNMENT SUMMARY (2-column box) ---
      doc.setFillColor(248, 249, 250);
      doc.setDrawColor(229, 229, 234);
      doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'FD');

      // Left column: Invoice & Order details
      doc.setFontSize(8);
      doc.setTextColor(134, 134, 139);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE NUMBER', margin + 6, y + 7);
      doc.text('ORDER / CONSIGNMENT ID', margin + 6, y + 14);
      doc.text('ORDER DATE', margin + 6, y + 21);
      doc.text('ORDER STATUS', margin + 6, y + 28);

      doc.setTextColor(29, 29, 31);
      doc.setFont('helvetica', 'bold');
      const invoiceNo = `INV-${order.orderNumber.replace(/[^a-zA-Z0-9-]/g, '')}`;
      doc.text(invoiceNo, margin + 48, y + 7);
      doc.text(order.orderNumber || order.id, margin + 48, y + 14);
      doc.setFont('helvetica', 'normal');
      doc.text(order.date || new Date().toISOString().split('T')[0], margin + 48, y + 21);

      // Status pill color text
      if (order.status === 'Delivered') {
        doc.setTextColor(16, 122, 60); // Emerald
        doc.setFont('helvetica', 'bold');
        doc.text('COMPLETED & DELIVERED', margin + 48, y + 28);
      } else {
        doc.setTextColor(180, 83, 9); // Amber
        doc.setFont('helvetica', 'bold');
        doc.text(order.status.toUpperCase(), margin + 48, y + 28);
      }

      // Right column: Courier Tracking & Payment
      const rightColX = margin + 95;
      doc.setFontSize(8);
      doc.setTextColor(134, 134, 139);
      doc.setFont('helvetica', 'bold');
      doc.text('AIRWAY BILL (AWB)', rightColX, y + 7);
      doc.text('PAYMENT METHOD', rightColX, y + 14);
      doc.text('PAYMENT STATUS', rightColX, y + 21);
      doc.text('ATELIER REGISTRATION', rightColX, y + 28);

      doc.setTextColor(29, 29, 31);
      doc.setFont('helvetica', 'normal');
      doc.text(order.trackingNumber || `TRACK-NXT-${order.id.slice(-6).toUpperCase()}`, rightColX + 42, y + 7);
      doc.text(order.paymentMethod || 'Razorpay Online Auth', rightColX + 42, y + 14);
      doc.setTextColor(16, 122, 60);
      doc.setFont('helvetica', 'bold');
      doc.text('SETTLED / PAID IN FULL', rightColX + 42, y + 21);
      doc.setTextColor(29, 29, 31);
      doc.setFont('helvetica', 'normal');
      doc.text('GSTIN: 27AAACN8491K1ZS', rightColX + 42, y + 28);

      y += 38;

      // --- 3. PATRON BILL-TO & DISPATCH ADDRESS ---
      const boxWidth = (contentWidth - 6) / 2;
      
      // Bill to / Patron
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(229, 229, 234);
      doc.roundedRect(margin, y, boxWidth, 30, 2, 2, 'D');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(197, 160, 89);
      doc.text('BILLED TO (PATRON)', margin + 6, y + 6);

      const patronName = order.shippingAddress?.fullName || user?.name || 'Valued Patron';
      doc.setFontSize(9);
      doc.setTextColor(29, 29, 31);
      doc.setFont('helvetica', 'bold');
      doc.text(patronName, margin + 6, y + 12);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(110, 110, 115);
      const patronEmail = order.customerEmail || user?.email || 'patron@naxtto.com';
      doc.text(`Email: ${patronEmail}`, margin + 6, y + 18);
      const patronPhone = order.shippingAddress?.phone || (user as any)?.phone || 'Registered on file';
      doc.text(`Contact: ${patronPhone}`, margin + 6, y + 23);

      // Ship to
      const shipToX = margin + boxWidth + 6;
      doc.roundedRect(shipToX, y, boxWidth, 30, 2, 2, 'D');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(197, 160, 89);
      doc.text('DISPATCH DESTINATION', shipToX + 6, y + 6);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(29, 29, 31);
      const addrLine1 = order.shippingAddress?.addressLine1 || 'Atelier Vault Priority Destination';
      const cityPostal = `${order.shippingAddress?.city || 'Mumbai'}, ${order.shippingAddress?.state || 'MH'} ${order.shippingAddress?.postalCode || '400001'}`;
      const country = order.shippingAddress?.country || 'India';

      doc.text(addrLine1.slice(0, 42), shipToX + 6, y + 12);
      doc.text(cityPostal, shipToX + 6, y + 18);
      doc.text(`${country} • Armored Courier Transit`, shipToX + 6, y + 23);

      y += 36;

      // --- 4. ITEMISED CREATIONS TABLE ---
      // Table Header Bar
      doc.setFillColor(242, 242, 247);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setDrawColor(209, 209, 214);
      doc.line(margin, y + 8, margin + contentWidth, y + 8);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(29, 29, 31);
      doc.text('#', margin + 4, y + 5.5);
      doc.text('CREATION & SPECIFICATION', margin + 14, y + 5.5);
      doc.text('PURITY / FINISH', margin + 96, y + 5.5);
      doc.text('SIZE', margin + 130, y + 5.5);
      doc.text('QTY', margin + 148, y + 5.5, { align: 'center' });
      doc.text('AMOUNT', margin + contentWidth - 4, y + 5.5, { align: 'right' });

      y += 10;

      // Line items
      const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];
      let itemRowHeight = 10;

      items.forEach((item, index) => {
        // Alternating row background
        if (index % 2 === 1) {
          doc.setFillColor(250, 250, 252);
          doc.rect(margin, y - 2, contentWidth, itemRowHeight, 'F');
        }

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(110, 110, 115);
        doc.text(String(index + 1).padStart(2, '0'), margin + 4, y + 3.5);

        // Product Title
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(29, 29, 31);
        const name = (item.product?.name || 'Handcrafted Fine Jewellery Piece').slice(0, 48);
        doc.text(name, margin + 14, y + 3.5);

        // Finish / Purity
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(70, 70, 75);
        const finish = (item.selectedFinish || '18k Solid Yellow Gold').replace(/-/g, ' ');
        doc.text(finish, margin + 96, y + 3.5);

        // Size
        const size = item.selectedSize || 'Standard';
        doc.text(size, margin + 130, y + 3.5);

        // Quantity
        const qty = item.quantity || 1;
        doc.text(String(qty), margin + 148, y + 3.5, { align: 'center' });

        // Line Amount
        const price = item.product?.price || 0;
        const lineTotal = price * qty;
        doc.setFont('helvetica', 'bold');
        doc.text(`${currencySymbol}${lineTotal.toLocaleString()}`, margin + contentWidth - 4, y + 3.5, { align: 'right' });

        // Light bottom divider
        doc.setDrawColor(240, 240, 242);
        doc.line(margin, y + 7, margin + contentWidth, y + 7);

        y += itemRowHeight;
      });

      if (items.length === 0) {
        doc.setFontSize(8);
        doc.setTextColor(134, 134, 139);
        doc.text('Bespoke custom commission item', margin + 14, y + 3.5);
        y += itemRowHeight;
      }

      y += 4;

      // --- 5. FINANCIAL SETTLEMENT SUMMARY TABLE ---
      const summaryBoxX = margin + 95;
      const summaryBoxWidth = contentWidth - 95;

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(229, 229, 234);
      doc.rect(summaryBoxX, y, summaryBoxWidth, 42, 'D');

      let sumY = y + 7;
      doc.setFontSize(8);

      // Subtotal
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(110, 110, 115);
      doc.text('Subtotal', summaryBoxX + 6, sumY);
      doc.setTextColor(29, 29, 31);
      doc.text(`${currencySymbol}${order.subtotal?.toLocaleString() || order.total?.toLocaleString()}`, summaryBoxX + summaryBoxWidth - 6, sumY, { align: 'right' });

      sumY += 6;

      // Discount (if any)
      if (order.discount && order.discount > 0) {
        doc.setTextColor(16, 122, 60);
        doc.text('Atelier Privilege Discount', summaryBoxX + 6, sumY);
        doc.text(`-${currencySymbol}${order.discount.toLocaleString()}`, summaryBoxX + summaryBoxWidth - 6, sumY, { align: 'right' });
        sumY += 6;
      }

      // Insured Shipping
      doc.setTextColor(110, 110, 115);
      doc.text('Insured Armored Express Courier', summaryBoxX + 6, sumY);
      if (order.shippingFee && order.shippingFee > 0) {
        doc.setTextColor(29, 29, 31);
        doc.text(`${currencySymbol}${order.shippingFee.toLocaleString()}`, summaryBoxX + summaryBoxWidth - 6, sumY, { align: 'right' });
      } else {
        doc.setTextColor(16, 122, 60);
        doc.text('Complimentary (Patron)', summaryBoxX + summaryBoxWidth - 6, sumY, { align: 'right' });
      }

      sumY += 6;

      // Tax / GST
      doc.setTextColor(110, 110, 115);
      doc.text('GST / VAT (3% Jewellery Tax Included)', summaryBoxX + 6, sumY);
      doc.setTextColor(29, 29, 31);
      const taxVal = order.tax ? `${currencySymbol}${order.tax.toLocaleString()}` : 'Included';
      doc.text(taxVal, summaryBoxX + summaryBoxWidth - 6, sumY, { align: 'right' });

      sumY += 8;

      // Total Settled (Bold bar)
      doc.setFillColor(29, 29, 31);
      doc.rect(summaryBoxX, sumY - 4, summaryBoxWidth, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('TOTAL SETTLED', summaryBoxX + 6, sumY + 2.5);
      doc.setTextColor(197, 160, 89); // Gold
      doc.text(`${currencySymbol}${order.total?.toLocaleString()}`, summaryBoxX + summaryBoxWidth - 6, sumY + 2.5, { align: 'right' });

      // Left side notes: Hallmark & Authenticity Guarantee box
      const notesWidth = 88;
      doc.setFillColor(250, 250, 252);
      doc.setDrawColor(229, 229, 234);
      doc.roundedRect(margin, y, notesWidth, 42, 2, 2, 'FD');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(197, 160, 89);
      doc.text('CERTIFICATE OF AUTHENTICITY', margin + 5, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(80, 80, 85);
      doc.text('• 100% Solid Gold with Bureau of Indian Standards (BIS) Hallmarking.', margin + 5, y + 12);
      doc.text('• Certified conflict-free natural and lab-graded brilliant gemstones.', margin + 5, y + 17);
      doc.text('• Lifetime complimentary ultrasonic cleaning & prong inspection warranty.', margin + 5, y + 22);
      doc.text('• Fully insured door-to-door transit underwritten by Lloyd’s syndicate.', margin + 5, y + 27);
      doc.text('• Authenticated by Naxtto Master Gemologist & Goldsmith Council.', margin + 5, y + 32);

      y += 50;

      // --- 6. ATELIER SEAL & SIGNATURE ---
      doc.setDrawColor(229, 229, 234);
      doc.line(margin, y, margin + contentWidth, y);
      y += 6;

      doc.setFontSize(7);
      doc.setTextColor(134, 134, 139);
      doc.text('Naxtto Fine Jewellery Atelier • Bandra West, Mumbai 400050 • concierge@naxtto.com • +91 22 8492 0100', margin, y);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(29, 29, 31);
      doc.text('AUTHORIZED ATELIER SIGNATURE & DIGITAL SEAL', pageWidth - margin, y, { align: 'right' });

      // Save and trigger browser download
      const filename = `Naxtto-Invoice-${order.orderNumber || order.id}.pdf`;
      doc.save(filename);
      resolve(true);
    } catch (error) {
      console.error('Failed to generate order invoice PDF:', error);
      reject(error);
    }
  });
}
