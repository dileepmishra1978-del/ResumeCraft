import { jsPDF } from 'jspdf';
import type { ResumeData, RenderCVTheme } from '../../types/resume';

interface ThemeConfig {
  font: 'helvetica' | 'times';
  primaryColor: [number, number, number];
  accentColor: [number, number, number];
  headerAlign: 'center' | 'left';
  topAccentBar?: boolean;
  sectionLineWidth: number;
}

const THEME_STYLES: Record<RenderCVTheme, ThemeConfig> = {
  sb2nov: {
    font: 'helvetica',
    primaryColor: [17, 24, 39], // #111827
    accentColor: [17, 24, 39],
    headerAlign: 'center',
    sectionLineWidth: 0.75,
  },
  harvard: {
    font: 'times',
    primaryColor: [0, 0, 0],
    accentColor: [0, 0, 0],
    headerAlign: 'center',
    sectionLineWidth: 0.75,
  },
  engineeringresumes: {
    font: 'helvetica',
    primaryColor: [15, 23, 42],
    accentColor: [15, 23, 42],
    headerAlign: 'center',
    sectionLineWidth: 0.75,
  },
  classic: {
    font: 'times',
    primaryColor: [0, 0, 0],
    accentColor: [0, 0, 0],
    headerAlign: 'center',
    sectionLineWidth: 0.75,
  },
  moderncv: {
    font: 'helvetica',
    primaryColor: [0, 79, 144], // #004F90
    accentColor: [0, 79, 144],
    headerAlign: 'left',
    topAccentBar: true,
    sectionLineWidth: 1.5,
  },
  ember: {
    font: 'helvetica',
    primaryColor: [217, 119, 6], // #D97706
    accentColor: [217, 119, 6],
    headerAlign: 'left',
    topAccentBar: true,
    sectionLineWidth: 1.5,
  },
  ink: {
    font: 'helvetica',
    primaryColor: [9, 11, 16], // #090B10
    accentColor: [9, 11, 16],
    headerAlign: 'left',
    sectionLineWidth: 1.25,
  },
  opal: {
    font: 'helvetica',
    primaryColor: [13, 148, 136], // #0D9488
    accentColor: [13, 148, 136],
    headerAlign: 'left',
    topAccentBar: true,
    sectionLineWidth: 1.5,
  },
  engineeringclassic: {
    font: 'helvetica',
    primaryColor: [0, 0, 0],
    accentColor: [0, 0, 0],
    headerAlign: 'center',
    sectionLineWidth: 0.5,
  },
};

/**
 * Builds a vector ATS-compliant PDF document using jsPDF.
 * 100% native PDF primitives: searchable text, zero HTML rendering bugs, zero print dialog.
 */
export function buildResumePdf(resume: ResumeData, themeName?: RenderCVTheme): jsPDF {
  const themeKey = themeName || resume.template || 'engineeringresumes';
  const theme = THEME_STYLES[themeKey] || THEME_STYLES.engineeringresumes;

  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4', // 595.28 x 841.89 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 38; // ~0.53 inch margins
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // 1. Top Accent Bar (for moderncv, ember, opal)
  if (theme.topAccentBar) {
    doc.setFillColor(theme.accentColor[0], theme.accentColor[1], theme.accentColor[2]);
    doc.rect(0, 0, pageWidth, 5, 'F');
    y += 8;
  }

  // 2. Candidate Name
  doc.setFont(theme.font, 'bold');
  doc.setFontSize(22);
  doc.setTextColor(theme.primaryColor[0], theme.primaryColor[1], theme.primaryColor[2]);

  const candidateName = (resume.contact.name || 'Candidate Name').trim();
  if (theme.headerAlign === 'center') {
    doc.text(candidateName, pageWidth / 2, y, { align: 'center' });
  } else {
    doc.text(candidateName, margin, y);
  }
  y += 18;

  // Target Role
  if (resume.target_role) {
    doc.setFont(theme.font, 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(100, 116, 139);
    if (theme.headerAlign === 'center') {
      doc.text(resume.target_role.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text(resume.target_role.toUpperCase(), margin, y);
    }
    y += 14;
  }

  // Contact Info Line
  const contactParts: string[] = [];
  if (resume.contact.email) contactParts.push(resume.contact.email);
  if (resume.contact.phone) contactParts.push(resume.contact.phone);
  if (resume.contact.location) contactParts.push(resume.contact.location);
  if (resume.contact.linkedin) contactParts.push(resume.contact.linkedin.replace(/^https?:\/\/(www\.)?/, ''));
  if (resume.contact.github) contactParts.push(resume.contact.github.replace(/^https?:\/\/(www\.)?/, ''));
  if (resume.contact.website) contactParts.push(resume.contact.website.replace(/^https?:\/\/(www\.)?/, ''));

  if (contactParts.length > 0) {
    doc.setFont(theme.font, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    const contactLine = contactParts.join('  •  ');
    if (theme.headerAlign === 'center') {
      doc.text(contactLine, pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text(contactLine, margin, y);
    }
    y += 14;
  }

  y += 4;

  // Helper for Section Headers
  const drawSectionHeader = (title: string) => {
    checkPageBreak(30);
    y += 6;
    doc.setFont(theme.font, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(theme.primaryColor[0], theme.primaryColor[1], theme.primaryColor[2]);
    doc.text(title.toUpperCase(), margin, y);
    y += 4;

    doc.setDrawColor(theme.accentColor[0], theme.accentColor[1], theme.accentColor[2]);
    doc.setLineWidth(theme.sectionLineWidth);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  };

  // 3. Professional Summary
  if (resume.summary && resume.summary.trim()) {
    drawSectionHeader('Professional Summary');
    doc.setFont(theme.font, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);

    const summaryLines = doc.splitTextToSize(resume.summary.trim(), contentWidth);
    checkPageBreak(summaryLines.length * 13);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 13 + 4;
  }

  const isFresher = Boolean(
    resume.fresher_mode ?? (themeKey === 'harvard' || themeKey === 'sb2nov')
  );

  // Render Experience Section
  const renderExperience = () => {
    if (!resume.experience || resume.experience.length === 0) return;
    drawSectionHeader(isFresher ? 'Internships & Experience' : 'Work Experience');

    for (const exp of resume.experience) {
      checkPageBreak(35);
      doc.setFont(theme.font, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(exp.position || 'Role', margin, y);

      const dateStr = [exp.start_date, exp.end_date || 'Present'].filter(Boolean).join(' – ');
      doc.setFont(theme.font, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      doc.text(dateStr, pageWidth - margin, y, { align: 'right' });
      y += 12;

      doc.setFont(theme.font, 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(55, 65, 81);
      const companyLine = [exp.company, exp.location].filter(Boolean).join('  —  ');
      doc.text(companyLine, margin, y);
      y += 12;

      if (exp.highlights && exp.highlights.length > 0) {
        doc.setFont(theme.font, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);

        for (const hl of exp.highlights) {
          if (!hl.trim()) continue;
          const bulletLines = doc.splitTextToSize(hl.trim(), contentWidth - 14);
          checkPageBreak(bulletLines.length * 12 + 2);
          doc.text('•', margin + 2, y);
          doc.text(bulletLines, margin + 14, y);
          y += bulletLines.length * 12 + 2;
        }
      }
      y += 4;
    }
  };

  // Render Education Section
  const renderEducation = () => {
    if (!resume.education || resume.education.length === 0) return;
    drawSectionHeader('Education');

    for (const edu of resume.education) {
      checkPageBreak(30);
      doc.setFont(theme.font, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(edu.institution || 'University', margin, y);

      const dateStr = [edu.start_date, edu.end_date].filter(Boolean).join(' – ');
      doc.setFont(theme.font, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      doc.text(dateStr, pageWidth - margin, y, { align: 'right' });
      y += 12;

      const degreeParts = [edu.degree, edu.area].filter(Boolean).join(' in ');
      const gradePart = edu.cgpa_or_percentage ? `(Grade: ${edu.cgpa_or_percentage})` : '';
      const eduSub = [degreeParts, gradePart, edu.location].filter(Boolean).join('  —  ');

      doc.setFont(theme.font, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      doc.text(eduSub, margin, y);
      y += 12;

      if (edu.highlights && edu.highlights.length > 0) {
        doc.setFont(theme.font, 'normal');
        doc.setFontSize(8.5);
        for (const hl of edu.highlights) {
          const lines = doc.splitTextToSize(hl, contentWidth - 14);
          checkPageBreak(lines.length * 11 + 2);
          doc.text('•', margin + 2, y);
          doc.text(lines, margin + 14, y);
          y += lines.length * 11 + 2;
        }
      }
      y += 2;
    }
  };

  // Render Projects Section
  const renderProjects = () => {
    if (!resume.projects || resume.projects.length === 0) return;
    drawSectionHeader('Projects');

    for (const proj of resume.projects) {
      checkPageBreak(30);
      doc.setFont(theme.font, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(proj.name, margin, y);

      if (proj.link) {
        doc.setFont(theme.font, 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(theme.accentColor[0], theme.accentColor[1], theme.accentColor[2]);
        doc.text(proj.link.replace(/^https?:\/\//, ''), pageWidth - margin, y, { align: 'right' });
      }
      y += 12;

      if (proj.tools && proj.tools.length > 0) {
        doc.setFont(theme.font, 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(75, 85, 99);
        doc.text(`Tech Stack: ${proj.tools.join(', ')}`, margin, y);
        y += 11;
      }

      if (proj.highlights && proj.highlights.length > 0) {
        doc.setFont(theme.font, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);

        for (const hl of proj.highlights) {
          if (!hl.trim()) continue;
          const bulletLines = doc.splitTextToSize(hl.trim(), contentWidth - 14);
          checkPageBreak(bulletLines.length * 12 + 2);
          doc.text('•', margin + 2, y);
          doc.text(bulletLines, margin + 14, y);
          y += bulletLines.length * 12 + 2;
        }
      }
      y += 3;
    }
  };

  // Render Skills Section
  const renderSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return;
    drawSectionHeader('Technical Skills');

    doc.setFontSize(9);
    for (const cat of resume.skills) {
      if (!cat.items || cat.items.length === 0) continue;
      checkPageBreak(16);

      doc.setFont(theme.font, 'bold');
      doc.setTextColor(17, 24, 39);
      const categoryLabel = `${cat.category}: `;
      doc.text(categoryLabel, margin, y);

      const labelWidth = doc.getTextWidth(categoryLabel);
      doc.setFont(theme.font, 'normal');
      doc.setTextColor(55, 65, 81);

      const itemsText = cat.items.join(', ');
      const itemLines = doc.splitTextToSize(itemsText, contentWidth - labelWidth);

      if (itemLines.length === 1) {
        doc.text(itemLines[0], margin + labelWidth, y);
        y += 13;
      } else {
        doc.text(itemLines[0], margin + labelWidth, y);
        y += 12;
        for (let i = 1; i < itemLines.length; i++) {
          checkPageBreak(12);
          doc.text(itemLines[i], margin, y);
          y += 12;
        }
      }
    }
    y += 4;
  };

  // Render Certifications Section
  const renderCertifications = () => {
    if (!resume.certifications || resume.certifications.length === 0) return;
    drawSectionHeader('Certifications & Accreditations');

    doc.setFont(theme.font, 'normal');
    doc.setFontSize(9);
    for (const cert of resume.certifications) {
      checkPageBreak(14);
      doc.setFont(theme.font, 'bold');
      doc.setTextColor(17, 24, 39);
      doc.text(cert.name, margin, y);

      const certWidth = doc.getTextWidth(cert.name);
      if (cert.issuer) {
        doc.setFont(theme.font, 'normal');
        doc.setTextColor(75, 85, 99);
        doc.text(` — ${cert.issuer}`, margin + certWidth, y);
      }

      if (cert.date) {
        doc.setFont(theme.font, 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(cert.date, pageWidth - margin, y, { align: 'right' });
      }
      y += 13;
    }
    y += 4;
  };

  // Dynamic Section Ordering (Fresher puts Education & Projects at top)
  if (isFresher) {
    renderEducation();
    renderProjects();
    renderSkills();
    renderExperience();
    renderCertifications();
  } else {
    renderExperience();
    renderEducation();
    renderProjects();
    renderSkills();
    renderCertifications();
  }

  // Declaration Section (Indian / Corporate Format)
  if (resume.declaration?.enabled) {
    checkPageBreak(70);
    drawSectionHeader('Declaration');
    doc.setFont(theme.font, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);

    const declText = resume.declaration.text ||
      'I hereby declare that all the information provided above is authentic and complete to the best of my knowledge.';
    const declLines = doc.splitTextToSize(declText, contentWidth);
    doc.text(declLines, margin, y);
    y += declLines.length * 11 + 10;

    const datePlace = `Date: ${resume.declaration.date || new Date().toISOString().slice(0, 10)}    |    Place: ${resume.declaration.place || resume.contact.location || 'India'}`;
    doc.text(datePlace, margin, y);

    const signName = resume.declaration.signature_name || resume.contact.name || '';
    if (signName) {
      doc.setFont(theme.font, 'bold');
      doc.text(signName, pageWidth - margin, y, { align: 'right' });
    }
  }

  return doc;
}

/**
 * Directly downloads the resume PDF in the browser with ZERO dialogs and ZERO blank screens.
 */
export function downloadVectorPdf(resume: ResumeData, fileName?: string): void {
  const safeTitle = (resume.contact.name || resume.title || 'Resume')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const outName = fileName || `${safeTitle}_Resume.pdf`;

  const doc = buildResumePdf(resume);
  doc.save(outName);
}
