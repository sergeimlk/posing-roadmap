import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generatePDF(elementId, filename) {
  let clonedElement = null;
  try {
    const originalElement = document.getElementById(elementId);
    if (!originalElement) throw new Error('Element not found');

    // Clone the element so we can modify it off-screen without disrupting the UI
    clonedElement = originalElement.cloneNode(true);
    
    // Style the clone so it is off-screen but fully rendered by the browser layout engine
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0px'; // Keep top close to 0 to avoid coordinate offset bugs
    clonedElement.style.width = '900px';
    clonedElement.style.maxHeight = 'none';
    clonedElement.style.overflow = 'visible';
    
    document.body.appendChild(clonedElement);

    // Add compatibility CSS class for layout rules
    clonedElement.classList.add('html2canvas-container');

    // Swap the logo to white version for PDF render and wait for its completion
    const logoImg = clonedElement.querySelector('.roadmap-logo');
    if (logoImg) {
      logoImg.src = '/posing-empire-white.svg';
      logoImg.style.filter = 'none';
      if (!logoImg.complete) {
        await new Promise(resolve => {
          logoImg.onload = resolve;
          logoImg.onerror = resolve;
        });
      }
    }

    // Wait a brief moment for browser layout recalculation of the clone
    await new Promise(resolve => setTimeout(resolve, 50));

    // Dynamic page splitting with page-break spacers on the clone
    const pageHeightPx = 1271; // A4 aspect ratio height at 900px width
    const blocks = [];
    const header = clonedElement.querySelector('.roadmap-header');
    const clientInfo = clonedElement.querySelector('.roadmap-client-info');
    const sectionTitle = clonedElement.querySelector('.roadmap-section-title');
    const timelineItems = Array.from(clonedElement.querySelectorAll('.timeline-item, .pdf-block, .bilan-road-action-block, .bilan-road-cta'));
    const footer = clonedElement.querySelector('.roadmap-footer');

    if (header) blocks.push(header);
    if (clientInfo) blocks.push(clientInfo);
    if (sectionTitle) blocks.push(sectionTitle);
    blocks.push(...timelineItems);
    if (footer) blocks.push(footer);

    // Filter out nested blocks (descendants of already matched blocks) to prevent duplicate spacing calculations
    const filteredBlocks = [];
    blocks.forEach(block => {
      if (!filteredBlocks.some(parent => parent.contains(block))) {
        filteredBlocks.push(block);
      }
    });

    // High performance batch measurements to avoid layout thrashing
    const blockHeights = filteredBlocks.map(block => block.getBoundingClientRect().height);
    const spacersToInsert = [];
    let currentY = 0;

    for (let i = 0; i < filteredBlocks.length; i++) {
      const block = filteredBlocks[i];
      const h = blockHeights[i];
      let blockTop = currentY;
      let blockBottom = currentY + h;

      const currentPage = Math.floor(blockTop / pageHeightPx);
      const nextPage = Math.floor((blockBottom - 4) / pageHeightPx);

      if (nextPage > currentPage) {
        // Only insert a spacer if the block is not already starting exactly at the top of a page
        const offsetFromPageStart = blockTop % pageHeightPx;
        if (offsetFromPageStart >= 5) {
          const targetY = nextPage * pageHeightPx;
          const spaceNeeded = targetY - blockTop;

          if (spaceNeeded > 0) {
            spacersToInsert.push({ block, height: spaceNeeded });
            currentY += spaceNeeded;
            blockTop = currentY;
            blockBottom = currentY + h;
          }
        }
      }
      currentY = blockBottom;
    }

    // Batch insert spacers into the DOM
    spacersToInsert.forEach(({ block, height }) => {
      const spacer = document.createElement('div');
      spacer.className = 'pdf-page-spacer';
      spacer.style.height = `${height}px`;
      spacer.style.width = '100%';
      spacer.style.background = '#050505';
      block.parentNode.insertBefore(spacer, block);
    });

    // Now gather coordinates of all link anchors (<a>) relative to the container
    // while the spacers are in their final positions.
    const pdfWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const containerRect = clonedElement.getBoundingClientRect();
    const scale = pdfWidth / containerRect.width;

    const links = Array.from(clonedElement.querySelectorAll('a'));
    const linkCoords = links.map(a => {
      const linkRect = a.getBoundingClientRect();
      return {
        url: a.href,
        x: (linkRect.left - containerRect.left) * scale,
        y: (linkRect.top - containerRect.top) * scale,
        w: linkRect.width * scale,
        h: linkRect.height * scale
      };
    });

    // Capture offscreen clone canvas (scale 2 for high quality PDF render)
    const canvas = await html2canvas(clonedElement, {
      backgroundColor: '#050505',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    let position = 0;

    // Draw the screenshot onto the PDF page by page
    if (pdfHeight <= pageHeight) {
      // Set solid black background
      pdf.setFillColor(5, 5, 5);
      pdf.rect(0, 0, pdfWidth, pageHeight, 'F');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Draw interactive clickable link overlays
      linkCoords.forEach(c => {
        pdf.link(c.x, c.y, c.w, c.h, { url: c.url });
      });
    } else {
      let remaining = pdfHeight;
      let pageNum = 1;
      while (remaining > 1) { // 1mm threshold to avoid empty end pages
        if (pageNum > 1) {
          pdf.addPage();
        }
        // Set solid black background for current page
        pdf.setFillColor(5, 5, 5);
        pdf.rect(0, 0, pdfWidth, pageHeight, 'F');
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        remaining -= pageHeight;
        position -= pageHeight;
        pageNum++;
      }

      // Draw interactive clickable link overlays on their respective pages
      linkCoords.forEach(c => {
        const pageIndex = Math.floor(c.y / pageHeight);
        const localY = c.y - (pageIndex * pageHeight);
        
        const totalPages = pdf.internal.getNumberOfPages();
        if (pageIndex < totalPages) {
          pdf.setPage(pageIndex + 1);
          pdf.link(c.x, localY, c.w, c.h, { url: c.url });
        }
      });
    }

    const finalFilename = filename && filename.trim() ? (filename.toLowerCase().endsWith('.pdf') ? filename.trim() : `${filename.trim()}.pdf`) : 'Roadmap.pdf';
    pdf.save(finalFilename);
    return true;
  } catch (err) {
    console.error('PDF generation error:', err);
    return false;
  } finally {
    // Clean up the off-screen clone from the DOM
    if (clonedElement && clonedElement.parentNode) {
      clonedElement.parentNode.removeChild(clonedElement);
    }
  }
}
