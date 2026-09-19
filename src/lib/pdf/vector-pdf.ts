import { jsPDF } from 'jspdf';
import type { ResumeData, RenderCVTheme, ResumeDesign } from '../../types/resume';

interface ThemeTokens {
  font: 'helvetica' | 'times';
  primaryColor: [number, number, number]; // [r, g, b]
  roleColor: [number, number, number];
  roleItalic: boolean;
  dateColor: [number, number, number];
  headerAlign: 'center' | 'left';
  headerBorderColor?: [number, number, number];
  sectionLineColor: [number, number, number];
  sectionLineWidth: number;
  topBarGradient?: [number, number, number][];
  topBarSolid?: [number, number, number];
  nameUppercase?: boolean;
}

const THEMES: Record<RenderCVTheme, ThemeTokens> = {
  ember: {
    font: 'helvetica',
    primaryColor: [155, 35, 25], // #9B2319 rich ember brick red
    roleColor: [90, 60, 55],     // #5A3C37
    roleItalic: true,
    dateColor: [155, 35, 25],    // #9B2319 matching preview dates
    headerAlign: 'left',
    headerBorderColor: [225, 195, 190], // #9B2319 with 25% opacity
    sectionLineColor: [155, 35, 25],
    sectionLineWidth: 1.5,
    topBarGradient: [
      [155, 35, 25],  // #9B2319
      [194, 65, 12],  // #C2410C
      [234, 88, 12],  // #EA580C
    ],
  },
  moderncv: {
    font: 'helvetica',
    primaryColor: [0, 79, 144], // #004F90 classic blue
    roleColor: [0, 79, 144],
    roleItalic: false,
    dateColor: [0, 79, 144],
    headerAlign: 'left',
    headerBorderColor: [190, 215, 235],
    sectionLineColor: [0, 79, 144],
    sectionLineWidth: 1.5,
    topBarSolid: [0, 79, 144],
  },
  opal: {
    font: 'helvetica',
    primaryColor: [0, 100, 90], // #00645A deep teal
    roleColor: [0, 100, 90],
    roleItalic: false,
    dateColor: [0, 100, 90],
    headerAlign: 'left',
    headerBorderColor: [185, 215, 210],
    sectionLineColor: [0, 100, 90],
    sectionLineWidth: 1.5,
    topBarSolid: [0, 100, 90],
  },
  ink: {
    font: 'times',
    primaryColor: [42, 24, 82], // #2A1852 royal purple
    roleColor: [70, 50, 110],   // #46326E
    roleItalic: false,
    dateColor: [70, 50, 110],
    headerAlign: 'center',
    headerBorderColor: [42, 24, 82],
    sectionLineColor: [42, 24, 82],
    sectionLineWidth: 1.5,
    nameUppercase: true,
  },
  classic: {
    font: 'times',
    primaryColor: [30, 58, 138], // #1E3A8A corporate navy
    roleColor: [55, 65, 81],
    roleItalic: false,
    dateColor: [75, 85, 99],
    headerAlign: 'center',
    headerBorderColor: [200, 210, 230],
    sectionLineColor: [30, 58, 138],
    sectionLineWidth: 1.5,
  },
  harvard: {
    font: 'times',
    primaryColor: [17, 24, 39], // #111827 sharp black
    roleColor: [75, 85, 99],
    roleItalic: false,
    dateColor: [75, 85, 99],
    headerAlign: 'center',
    headerBorderColor: [31, 41, 55],
    sectionLineColor: [31, 41, 55],
    sectionLineWidth: 0.75,
    nameUppercase: true,
  },
  sb2nov: {
    font: 'helvetica',
    primaryColor: [17, 24, 39], // #111827
    roleColor: [75, 85, 99],
    roleItalic: false,
    dateColor: [75, 85, 99],
    headerAlign: 'left',
    headerBorderColor: [17, 24, 39],
    sectionLineColor: [17, 24, 39],
    sectionLineWidth: 1.5,
  },
  engineeringresumes: {
    font: 'helvetica',
    primaryColor: [3, 7, 18], // #030712
    roleColor: [75, 85, 99],
    roleItalic: false,
    dateColor: [107, 114, 128],
    headerAlign: 'center',
    headerBorderColor: [229, 231, 235],
    sectionLineColor: [209, 213, 219],
    sectionLineWidth: 0.75,
  },
  engineeringclassic: {
    font: 'helvetica',
    primaryColor: [0, 79, 144], // #004F90
    roleColor: [55, 65, 81],
    roleItalic: false,
    dateColor: [75, 85, 99],
    headerAlign: 'left',
    headerBorderColor: [156, 163, 175],
    sectionLineColor: [31, 41, 55],
    sectionLineWidth: 1.0,
    nameUppercase: true,
  },
};

export interface ReflowTier {
  name: string;
  design: ResumeDesign;
}

export const REFLOW_TIERS: ReflowTier[] = [
  {
    name: 'Standard',
    design: {
      font_size: '10pt',
      margins: { top: '0.6in', bottom: '0.6in', left: '0.6in', right: '0.6in' },
      line_spacing: '1.35',
      space_between_entries: '1.0rem',
      target_pages: 1,
    },
  },
  {
    name: 'Compact',
    design: {
      font_size: '9.4pt',
      margins: { top: '0.48in', bottom: '0.48in', left: '0.52in', right: '0.52in' },
      line_spacing: '1.28',
      space_between_entries: '0.8rem',
      target_pages: 1,
    },
  },
  {
    name: 'Tight',
    design: {
      font_size: '8.8pt',
      margins: { top: '0.40in', bottom: '0.40in', left: '0.45in', right: '0.45in' },
      line_spacing: '1.20',
      space_between_entries: '0.65rem',
      target_pages: 1,
    },
  },
  {
    name: 'Ultra-tight',
    design: {
      font_size: '8.2pt',
      margins: { top: '0.32in', bottom: '0.32in', left: '0.40in', right: '0.40in' },
      line_spacing: '1.15',
      space_between_entries: '0.5rem',
      target_pages: 1,
    },
  },
];

function parseMarginPt(val?: string, defaultPt: number = 38): number {
  if (!val) return defaultPt;
  if (val.endsWith('in')) return parseFloat(val) * 72;
  if (val.endsWith('mm')) return parseFloat(val) * 2.83465;
  if (val.endsWith('pt')) return parseFloat(val);
  const num = parseFloat(val);
  return isNaN(num) ? defaultPt : num;
}

/**
 * Builds a vector ATS-compliant PDF document matching the exact on-screen live preview styling.
 */
export function buildResumePdf(resume: ResumeData, themeName?: RenderCVTheme): jsPDF {
  const themeKey = themeName || resume.template || 'engineeringresumes';
  const theme = THEMES[themeKey] || THEMES.engineeringresumes;

  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4', // 595.28 x 841.89 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Dynamic Reflow & Margins based on resume.design
  const marginX = parseMarginPt(resume.design?.margins?.left, 38);
  const marginY = parseMarginPt(resume.design?.margins?.top, 38);
  const contentWidth = pageWidth - marginX * 2;

  // Scale factors for tight 1-page fit
  const fontScale = resume.design?.font_size
    ? Math.max(0.85, Math.min(1.15, parseFloat(resume.design.font_size) / 9.5))
    : 1.0;
  const lineSpacing = resume.design?.line_spacing
    ? Math.max(0.85, Math.min(1.2, parseFloat(resume.design.line_spacing) / 1.35))
    : 1.0;

  let y = marginY;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - marginY) {
      doc.addPage();
      y = marginY;
    }
  };

  // 1. Top Bar Decoration
  if (theme.topBarGradient) {
    const barHeight = 5;
    const thirdWidth = pageWidth / 3;
    theme.topBarGradient.forEach((color, idx) => {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(idx * thirdWidth, 0, thirdWidth + 1, barHeight, 'F');
    });
    y += 5;
  } else if (theme.topBarSolid) {
    doc.setFillColor(theme.topBarSolid[0], theme.topBarSolid[1], theme.topBarSolid[2]);
    doc.rect(0, 0, pageWidth, 4.5, 'F');
    y += 5;
  }

  // 2. Candidate Name
  doc.setFont(theme.font, 'bold');
  doc.setFontSize(Math.round(23 * fontScale));
  doc.setTextColor(theme.primaryColor[0], theme.primaryColor[1], theme.primaryColor[2]);

  let displayName = (resume.contact.name || 'Your Full Name').trim();
  if (theme.nameUppercase) {
    displayName = displayName.toUpperCase();
  }

  if (theme.headerAlign === 'center') {
    doc.text(displayName, pageWidth / 2, y, { align: 'center' });
  } else {
    doc.text(displayName, marginX, y);
  }
  y += Math.round(17 * lineSpacing);

  // Target Role
  if (resume.target_role) {
    doc.setFont(theme.font, theme.roleItalic ? 'bolditalic' : 'bold');
    doc.setFontSize(Math.round(9.5 * fontScale));
    doc.setTextColor(theme.roleColor[0], theme.roleColor[1], theme.roleColor[2]);

    const displayRole = resume.target_role.toUpperCase();
    if (theme.headerAlign === 'center') {
      doc.text(displayRole, pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text(displayRole, marginX, y);
    }
    y += Math.round(13 * lineSpacing);
  }

  // Contact Info Row
  const contactParts: string[] = [];
  if (resume.contact.location) contactParts.push(resume.contact.location);
  if (resume.contact.phone) contactParts.push(resume.contact.phone);
  if (resume.contact.email) contactParts.push(resume.contact.email);
  if (resume.contact.website) contactParts.push(resume.contact.website.replace(/^https?:\/\//, ''));
  if (resume.contact.linkedin) contactParts.push('LinkedIn');
  if (resume.contact.github) contactParts.push('GitHub');

  if (contactParts.length > 0) {
    doc.setFont(theme.font, 'normal');
    doc.setFontSize(Math.round(8.5 * fontScale));
    doc.setTextColor(75, 85, 99);
    const contactLine = contactParts.join('   •   ');
    if (theme.headerAlign === 'center') {
      doc.text(contactLine, pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text(contactLine, marginX, y);
    }
    y += Math.round(11 * lineSpacing);
  }

  // Header bottom separator line
  if (theme.headerBorderColor) {
    y += 3;
    doc.setDrawColor(theme.headerBorderColor[0], theme.headerBorderColor[1], theme.headerBorderColor[2]);
    doc.setLineWidth(0.75);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += Math.round(9 * lineSpacing);
  } else {
    y += 5;
  }

  // Section Header Drawer
  const drawSectionHeader = (title: string) => {
    checkPageBreak(28);
    y += 5;
    doc.setFont(theme.font, 'bold');
    doc.setFontSize(Math.round(10.5 * fontScale));
    doc.setTextColor(theme.primaryColor[0], theme.primaryColor[1], theme.primaryColor[2]);

    const headerText = title.toUpperCase();
    if (themeKey === 'harvard') {
      doc.text(headerText, pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text(headerText, marginX, y);
    }
    y += 3.5;

    doc.setDrawColor(theme.sectionLineColor[0], theme.sectionLineColor[1], theme.sectionLineColor[2]);
    doc.setLineWidth(theme.sectionLineWidth);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += Math.round(10 * lineSpacing);
  };

  // 3. Summary
  if (resume.summary && resume.summary.trim()) {
    drawSectionHeader('Professional Summary');
    doc.setFont(theme.font, 'normal');
    doc.setFontSize(Math.round(9 * fontScale));
    doc.setTextColor(31, 41, 55);

    const summaryLines = doc.splitTextToSize(resume.summary.trim(), contentWidth);
    checkPageBreak(summaryLines.length * (11.5 * lineSpacing));
    doc.text(summaryLines, marginX, y);
    y += summaryLines.length * (11.5 * lineSpacing) + 3;
  }

  const isFresher = Boolean(
    resume.fresher_mode ?? (themeKey === 'harvard' || themeKey === 'sb2nov')
  );

  // Render Experience Section
  const renderExperience = () => {
    if (!resume.experience || resume.experience.length === 0) return;
    drawSectionHeader(isFresher ? 'Internships & Experience' : 'Work Experience');

    for (const exp of resume.experience) {
      checkPageBreak(30);
      doc.setFont(theme.font, 'bold');
      doc.setFontSize(Math.round(9.5 * fontScale));
      doc.setTextColor(17, 24, 39);
      doc.text(exp.position || 'Position', marginX, y);

      const dateStr = [exp.start_date, exp.end_date || 'Present'].filter(Boolean).join(' – ');
      doc.setFont(theme.font, 'bold');
      doc.setFontSize(Math.round(8.5 * fontScale));
      doc.setTextColor(theme.dateColor[0], theme.dateColor[1], theme.dateColor[2]);
      doc.text(dateStr, pageWidth - marginX, y, { align: 'right' });
      y += Math.round(10.5 * lineSpacing);

      doc.setFont(theme.font, 'italic');
      doc.setFontSize(Math.round(9 * fontScale));
      doc.setTextColor(75, 85, 99);
      doc.text(exp.company || '', marginX, y);

      if (exp.location) {
        doc.setFont(theme.font, 'normal');
        doc.setFontSize(Math.round(8.5 * fontScale));
        doc.setTextColor(107, 114, 128);
        doc.text(exp.location, pageWidth - marginX, y, { align: 'right' });
      }
      y += Math.round(10.5 * lineSpacing);

      if (exp.highlights && exp.highlights.length > 0) {
        doc.setFont(theme.font, 'normal');
        doc.setFontSize(Math.round(8.5 * fontScale));
        doc.setTextColor(31, 41, 55);

        for (const hl of exp.highlights) {
          if (!hl.trim()) continue;
          const bulletLines = doc.splitTextToSize(hl.trim(), contentWidth - 14);
          checkPageBreak(bulletLines.length * (11 * lineSpacing) + 2);
          doc.text('•', marginX + 2, y);
          doc.text(bulletLines, marginX + 14, y);
          y += bulletLines.length * (11 * lineSpacing) + 2;
        }
      }
      y += 3;
    }
  };

  // Render Education Section
  const renderEducation = () => {
    if (!resume.education || resume.education.length === 0) return;
    drawSectionHeader('Education');

    for (const edu of resume.education) {
      checkPageBreak(28);
      doc.setFont(theme.font, 'bold');
      doc.setFontSize(Math.round(9.5 * fontScale));
      doc.setTextColor(17, 24, 39);
      doc.text(edu.institution || 'Institution', marginX, y);

      const dateStr = [edu.start_date, edu.end_date].filter(Boolean).join(' – ');
      doc.setFont(theme.font, 'bold');
      doc.setFontSize(Math.round(8.5 * fontScale));
      doc.setTextColor(theme.dateColor[0], theme.dateColor[1], theme.dateColor[2]);
      doc.text(dateStr, pageWidth - marginX, y, { align: 'right' });
      y += Math.round(10.5 * lineSpacing);

      const degreeParts = [edu.degree, edu.area].filter(Boolean).join(' in ');
      const gradePart = edu.cgpa_or_percentage ? `(Grade: ${edu.cgpa_or_percentage})` : '';
      const eduSub = [degreeParts, gradePart].filter(Boolean).join('  —  ');

      doc.setFont(theme.font, 'italic');
      doc.setFontSize(Math.round(9 * fontScale));
      doc.setTextColor(75, 85, 99);
      doc.text(eduSub, marginX, y);

      if (edu.location) {
        doc.setFont(theme.font, 'normal');
        doc.setFontSize(Math.round(8.5 * fontScale));
        doc.setTextColor(107, 114, 128);
        doc.text(edu.location, pageWidth - marginX, y, { align: 'right' });
      }
      y += Math.round(10.5 * lineSpacing);

      if (edu.highlights && edu.highlights.length > 0) {
        doc.setFont(theme.font, 'normal');
        doc.setFontSize(Math.round(8.5 * fontScale));
        for (const hl of edu.highlights) {
          const lines = doc.splitTextToSize(hl, contentWidth - 14);
          checkPageBreak(lines.length * (10.5 * lineSpacing) + 2);
          doc.text('•', marginX + 2, y);
          doc.text(lines, marginX + 14, y);
          y += lines.length * (10.5 * lineSpacing) + 2;
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
      checkPageBreak(28);
      doc.setFont(theme.font, 'bold');
      doc.setFontSize(Math.round(9.5 * fontScale));
      doc.setTextColor(17, 24, 39);
      doc.text(proj.name, marginX, y);

      if (proj.link) {
        doc.setFont(theme.font, 'normal');
        doc.setFontSize(Math.round(8.5 * fontScale));
        doc.setTextColor(theme.primaryColor[0], theme.primaryColor[1], theme.primaryColor[2]);
        doc.text(proj.link.replace(/^https?:\/\//, ''), pageWidth - marginX, y, { align: 'right' });
      }
      y += Math.round(10.5 * lineSpacing);

      if (proj.tools && proj.tools.length > 0) {
        doc.setFont(theme.font, 'italic');
        doc.setFontSize(Math.round(8.5 * fontScale));
        doc.setTextColor(100, 116, 139);
        doc.text(`Tech Stack: ${proj.tools.join(', ')}`, marginX, y);
        y += Math.round(9.5 * lineSpacing);
      }

      if (proj.highlights && proj.highlights.length > 0) {
        doc.setFont(theme.font, 'normal');
        doc.setFontSize(Math.round(8.5 * fontScale));
        doc.setTextColor(31, 41, 55);

        for (const hl of proj.highlights) {
          if (!hl.trim()) continue;
          const bulletLines = doc.splitTextToSize(hl.trim(), contentWidth - 14);
          checkPageBreak(bulletLines.length * (11 * lineSpacing) + 2);
          doc.text('•', marginX + 2, y);
          doc.text(bulletLines, marginX + 14, y);
          y += bulletLines.length * (11 * lineSpacing) + 2;
        }
      }
      y += 3;
    }
  };

  // Render Skills Section
  const renderSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return;
    drawSectionHeader('Technical Skills');

    doc.setFontSize(Math.round(8.5 * fontScale));
    for (const cat of resume.skills) {
      if (!cat.items || cat.items.length === 0) continue;
      checkPageBreak(14);

      doc.setFont(theme.font, 'bold');
      doc.setTextColor(17, 24, 39);
      const categoryLabel = `${cat.category}: `;
      doc.text(categoryLabel, marginX, y);

      const labelWidth = doc.getTextWidth(categoryLabel);
      doc.setFont(theme.font, 'normal');
      doc.setTextColor(55, 65, 81);

      const itemsText = cat.items.join(', ');
      const itemLines = doc.splitTextToSize(itemsText, contentWidth - labelWidth);

      if (itemLines.length === 1) {
        doc.text(itemLines[0], marginX + labelWidth, y);
        y += Math.round(11 * lineSpacing);
      } else {
        doc.text(itemLines[0], marginX + labelWidth, y);
        y += Math.round(10.5 * lineSpacing);
        for (let i = 1; i < itemLines.length; i++) {
          checkPageBreak(10.5);
          doc.text(itemLines[i], marginX, y);
          y += Math.round(10.5 * lineSpacing);
        }
      }
    }
    y += 3;
  };

  // Render Certifications Section
  const renderCertifications = () => {
    if (!resume.certifications || resume.certifications.length === 0) return;
    drawSectionHeader('Certifications & Accreditations');

    doc.setFontSize(Math.round(8.5 * fontScale));
    for (const cert of resume.certifications) {
      checkPageBreak(13);
      doc.setFont(theme.font, 'bold');
      doc.setTextColor(17, 24, 39);
      doc.text(cert.name, marginX, y);

      const certWidth = doc.getTextWidth(cert.name);
      if (cert.issuer) {
        doc.setFont(theme.font, 'normal');
        doc.setTextColor(75, 85, 99);
        doc.text(` — ${cert.issuer}`, marginX + certWidth, y);
      }

      if (cert.date) {
        doc.setFont(theme.font, 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(cert.date, pageWidth - marginX, y, { align: 'right' });
      }
      y += Math.round(11 * lineSpacing);
    }
    y += 3;
  };

  // Dynamic Section Ordering
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

  // Declaration Section
  if (resume.declaration?.enabled) {
    checkPageBreak(60);
    drawSectionHeader('Declaration');
    doc.setFont(theme.font, 'normal');
    doc.setFontSize(Math.round(8.5 * fontScale));
    doc.setTextColor(55, 65, 81);

    const declText = resume.declaration.text ||
      'I hereby declare that all the information provided above is authentic and complete to the best of my knowledge.';
    const declLines = doc.splitTextToSize(declText, contentWidth);
    doc.text(declLines, marginX, y);
    y += declLines.length * (10.5 * lineSpacing) + 7;

    const datePlace = `Date: ${resume.declaration.date || new Date().toISOString().slice(0, 10)}    |    Place: ${resume.declaration.place || resume.contact.location || 'India'}`;
    doc.text(datePlace, marginX, y);

    const signName = resume.declaration.signature_name || resume.contact.name || '';
    if (signName) {
      doc.setFont(theme.font, 'bold');
      doc.text(signName, pageWidth - marginX, y, { align: 'right' });
    }
  }

  return doc;
}

/**
 * Automatically computes and applies the optimal Reflow Tier (Standard, Compact, Tight, Ultra-tight)
 * to fit the candidate's resume onto exactly 1 page.
 */
export function optimize1PageFit(resume: ResumeData, targetPages: number = 1): {
  fitted: boolean;
  target_pages: number;
  achieved_pages: number;
  design: ResumeDesign;
  message: string;
} {
  for (const tier of REFLOW_TIERS) {
    const candidateResume: ResumeData = {
      ...resume,
      design: tier.design,
    };
    const doc = buildResumePdf(candidateResume);
    const pageCount = doc.getNumberOfPages();
    if (pageCount <= targetPages) {
      return {
        fitted: true,
        target_pages: targetPages,
        achieved_pages: pageCount,
        design: tier.design,
        message: `1-Page Fit optimized using ${tier.name} spacing.`,
      };
    }
  }

  // Fallback to ultra-tight
  const fallback = REFLOW_TIERS[REFLOW_TIERS.length - 1];
  return {
    fitted: false,
    target_pages: targetPages,
    achieved_pages: 2,
    design: fallback.design,
    message: `Applied ${fallback.name} spacing to minimize page overflow.`,
  };
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
