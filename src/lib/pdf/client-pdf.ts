import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates and downloads a high-fidelity ATS resume PDF directly in the browser.
 * Operates 100% client-side: eliminates server dependencies, Vercel Lambda limits,
 * and browser print dialog blank page issues.
 */
export async function downloadResumeAsPdf(
  targetElement: HTMLElement,
  fileName: string = 'Resume.pdf'
): Promise<void> {
  // 1. Ensure all custom fonts and web assets are fully ready
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font readiness timeout
    }
  }

  // 2. Clone the element into an isolated fixed container at z-index -9999
  // This guarantees pristine A4 layout regardless of screen size, mobile tabs, or zoom
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '794px';
  container.style.zIndex = '-9999';
  container.style.background = '#ffffff';
  container.style.pointerEvents = 'none';
  container.style.overflow = 'visible';

  const clone = targetElement.cloneNode(true) as HTMLElement;
  clone.id = 'resume-export-clone';
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.minHeight = '1123px';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.transform = 'none';
  clone.style.display = 'block';
  clone.style.visibility = 'visible';
  clone.style.opacity = '1';
  clone.style.overflow = 'visible';

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // 3. Render target DOM element to high-res canvas (scale 2 = crisp 200-300 DPI text)
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794,
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0,
    });

    // 4. Convert canvas to JPEG data URL with high quality
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // 5. Create standard A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Single-page fit check: standard 1-page resumes fit cleanly
    if (imgHeight <= pdfHeight + 10) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
    } else {
      // Multi-page slicing if content exceeds single A4 page
      let remainingHeight = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      remainingHeight -= pdfHeight;

      while (remainingHeight > 5) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        remainingHeight -= pdfHeight;
      }
    }

    // 6. Trigger native browser file download
    pdf.save(fileName);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
