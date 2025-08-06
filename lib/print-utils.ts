/**
 * Print utility functions for the shop creator
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHTML(str: string): string {
  return str.replace(/[<>'"&]/g, (char) => {
    switch (char) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      case "'": return '&#x27;'
      case '&': return '&amp;'
      default: return char
    }
  })
}

/**
 * Generates the complete HTML content for printing a shop display
 */
export function generatePrintContent(shopTitle: string, shopDisplayHTML: string): string {
  // Sanitize the shop title to prevent XSS
  const sanitizedTitle = sanitizeHTML(shopTitle)
  
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print - ${sanitizedTitle}</title>
    <style>
      /* Import Tailwind CSS for print */
      @import url('https://cdn.tailwindcss.com/3.4.0');
      
      /* Print-specific styles */
      @media print {
        @page {
          margin: 0.75in;
          size: letter;
        }
        
        body {
          font-family: 'Georgia', 'Times New Roman', serif;
          line-height: 1.4;
          color: #000;
          background: white !important;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .print-hide {
          display: none !important;
        }
        
        .print-mode {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Card styling for print */
        [data-slot="card"] {
          box-shadow: none !important;
          border: 2px solid #666 !important;
          border-radius: 8px !important;
          background: white !important;
          page-break-inside: avoid;
        }
        
        /* Header styling */
        [data-slot="card-header"] {
          border-bottom: 2px solid #666 !important;
          padding: 1.5rem !important;
          background: #f8f9fa !important;
        }
        
        /* Content styling */
        [data-slot="card-content"] {
          padding: 2rem !important;
          background: white !important;
        }
        
        /* Typography */
        .font-fantasy {
          font-family: 'Georgia', 'Times New Roman', serif !important;
          font-weight: bold !important;
        }
        
        /* Category sections */
        .print\\:break-inside-avoid {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        /* Item list styling */
        li {
          border-bottom: 1px dotted #999 !important;
          padding: 0.5rem 0.75rem !important;
          margin: 0.25rem 0 !important;
          background: rgba(0,0,0,0.02) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: baseline !important;
          min-height: 1.75rem !important;
          line-height: 1.6 !important;
        }
        
        /* Item spacing improvements */
        .print\\:item-spacing {
          display: flex !important;
          justify-content: space-between !important;
          align-items: baseline !important;
          min-height: 1.75rem !important;
          padding-left: 0.75rem !important;
          padding-right: 0.75rem !important;
        }
        
        .print\\:item-name {
          padding-right: 3rem !important;
          flex: 1 !important;
          font-weight: 500 !important;
        }
        
        .print\\:item-price {
          white-space: nowrap !important;
          padding-left: 1rem !important;
          font-weight: 700 !important;
          text-align: right !important;
        }
        
        .print\\:line-spacing {
          line-height: 1.6 !important;
          margin-bottom: 0.25rem !important;
        }
        
        /* Ensure icons print */
        svg {
          width: 16px !important;
          height: 16px !important;
          display: inline-block !important;
        }
        
        /* Theme-specific print colors */
        .print\\:text-amber-900 { color: #92400e !important; }
        .print\\:text-amber-800 { color: #a16207 !important; }
        .print\\:text-amber-950 { color: #451a03 !important; }
        .print\\:text-stone-800 { color: #292524 !important; }
        .print\\:text-purple-800 { color: #6b21a8 !important; }
        .print\\:text-purple-900 { color: #581c87 !important; }
        .print\\:text-emerald-800 { color: #065f46 !important; }
        .print\\:text-emerald-900 { color: #064e3b !important; }
        .print\\:text-red-700 { color: #b91c1c !important; }
        
        .print\\:bg-amber-100\\/30 { background-color: rgba(254, 243, 199, 0.3) !important; }
        .print\\:bg-stone-200 { background-color: #e7e5e4 !important; }
        .print\\:bg-purple-100 { background-color: #f3e8ff !important; }
        .print\\:bg-emerald-100 { background-color: #dcfce7 !important; }
        
        .print\\:border-amber-900\\/40 { border-color: rgba(120, 53, 15, 0.4) !important; }
        .print\\:border-stone-600 { border-color: #57534e !important; }
        .print\\:border-purple-700 { border-color: #7c3aed !important; }
        .print\\:border-emerald-700 { border-color: #047857 !important; }
        .print\\:border-red-900\\/50 { border-color: rgba(127, 29, 29, 0.5) !important; }
      }
      
      /* Base styles that work in both screen and print */
      body {
        margin: 0;
        padding: 20px;
        font-family: 'Georgia', 'Times New Roman', serif;
      }
      
      .font-fantasy {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    ${shopDisplayHTML}
    <script>
      window.onload = function() {
        window.print();
        window.onafterprint = function() {
          window.close();
        };
      };
    </script>
  </body>
</html>`
}

/**
 * Opens a print window with the shop content
 */
export function openPrintWindow(shopTitle: string, shopDisplayElement: HTMLElement): void {
  // Create a new window for printing with security attributes
  const printWindow = window.open(
    "", 
    "_blank",
    "width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no"
  )
  if (!printWindow) {
    alert("Please allow pop-ups to enable printing")
    return
  }

  // Generate the print content with sanitized data
  const printContent = generatePrintContent(shopTitle, shopDisplayElement.outerHTML)

  // Write content to print window
  printWindow.document.open()
  printWindow.document.write(printContent)
  printWindow.document.close()
}
