// ============================================
// 5. pdfGenerator.js - Client-Side PDF Utils
// ============================================

// Note: For actual PDF generation, you'd use a library like jsPDF
// This file provides helper functions for PDF-related operations

// Open PDF in new window
export const openPDFInNewWindow = (pdfUrl) => {
  window.open(pdfUrl, '_blank');
};

// Download PDF
export const downloadPDF = (pdfUrl, filename = 'document.pdf') => {
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Print PDF
export const printPDF = (pdfUrl) => {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  
  iframe.onload = () => {
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
};

// Share PDF via Web Share API
export const sharePDF = async (pdfUrl, title = 'Document', text = '') => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: pdfUrl,
      });
      return { success: true };
    } catch (error) {
      console.error('Error sharing:', error);
      return { success: false, error: error.message };
    }
  } else {
    // Fallback - copy to clipboard
    await navigator.clipboard.writeText(pdfUrl);
    return { success: true, fallback: 'copied' };
  }
};

// Get invoice filename
export const getInvoiceFilename = (invoiceNumber, date) => {
  const formattedDate = new Date(date).toISOString().split('T')[0];
  return `Invoice_${invoiceNumber}_${formattedDate}.pdf`;
};