import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generatePDF(elementId, fullname) {
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
    clonedElement.style.width = '800px';
    clonedElement.style.maxHeight = 'none';
    clonedElement.style.overflow = 'visible';
    
    document.body.appendChild(clonedElement);

    // Add compatibility CSS class for layout rules
    clonedElement.classList.add('html2canvas-container');

    // Wait a brief moment for browser layout recalculation of the clone
    await new Promise(resolve => setTimeout(resolve, 150));

    // Dynamic page splitting with page-break spacers on the clone
    const pageHeightPx = 1130; // A4 aspect ratio height at 800px width
    const blocks = [];
    const header = clonedElement.querySelector('.roadmap-header');
    const clientInfo = clonedElement.querySelector('.roadmap-client-info');
    const sectionTitle = clonedElement.querySelector('.roadmap-section-title');
    const timelineItems = Array.from(clonedElement.querySelectorAll('.timeline-item'));
    const footer = clonedElement.querySelector('.roadmap-footer');

    if (header) blocks.push(header);
    if (clientInfo) blocks.push(clientInfo);
    if (sectionTitle) blocks.push(sectionTitle);
    blocks.push(...timelineItems);
    if (footer) blocks.push(footer);

    const spacers = [];
    let idx = 0;

    while (idx < blocks.length) {
      const block = blocks[idx];
      const containerTop = clonedElement.getBoundingClientRect().top;
      const rect = block.getBoundingClientRect();
      const blockTop = rect.top - containerTop;
      const blockHeight = rect.height;
      const blockBottom = blockTop + blockHeight;

      const currentPage = Math.floor(blockTop / pageHeightPx);
      const nextPage = Math.floor((blockBottom - 4) / pageHeightPx); // 4px tolerance margin

      if (nextPage > currentPage) {
        // The block crosses the page boundary! Insert a spacer before it.
        const targetY = nextPage * pageHeightPx;
        const spaceNeeded = targetY - blockTop;

        if (spaceNeeded > 0) {
          const spacer = document.createElement('div');
          spacer.className = 'pdf-page-spacer';
          spacer.style.height = `${spaceNeeded}px`;
          spacer.style.width = '100%';
          spacer.style.background = '#050505'; // Match background color exactly
          block.parentNode.insertBefore(spacer, block);
          spacers.push(spacer);
          
          // Recheck this block since its position has now shifted
          continue;
        }
      }
      idx++;
    }

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

    // Capture offscreen clone canvas
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
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Draw interactive clickable link overlays
      linkCoords.forEach(c => {
        pdf.link(c.x, c.y, c.w, c.h, { url: c.url });
      });
    } else {
      let remaining = pdfHeight;
      while (remaining > 1) { // 1mm threshold to avoid empty end pages
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        remaining -= pageHeight;
        position -= pageHeight;
        if (remaining > 1) pdf.addPage();
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

    const name = (fullname || 'athlete').trim().replace(/\s+/g, '_');
    pdf.save(`Roadmap_PosingEmpire_${name}.pdf`);
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
