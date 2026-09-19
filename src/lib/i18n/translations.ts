export type SupportedLang = 'en' | 'hi';

export interface Translations {
  appName: string;
  resumes: string;
  editor: string;
  coverLetter: string;
  downloadPdf: string;
  compiling: string;
  save: string;
  saved: string;
  autoAdjust: string;
  fresherMode: string;
  tailorForJob: string;
  govtFormAutofill: string;
  verifyWithDigilocker: string;
  importProfile: string;
  shareScore: string;
  shareWhatsapp: string;
  referFriend: string;
  placementPortal: string;
  contactTab: string;
  summaryTab: string;
  educationTab: string;
  projectsTab: string;
  skillsTab: string;
  experienceTab: string;
  certificationsTab: string;
  declarationTab: string;
  resumeStrength: string;
  needsWork: string;
  good: string;
  excellent: string;
  improveScore: string;
  closeTips: string;
  naukriOptimizer: string;
  digilockerVerified: string;
  digilockerBadgeDesc: string;
  govtExportTitle: string;
  govtDisclaimer: string;
  copyAll: string;
  copied: string;
}

export const TRANSLATIONS: Record<SupportedLang, Translations> = {
  en: {
    appName: 'ResumeCraft',
    resumes: 'Resumes',
    editor: 'Resume Editor',
    coverLetter: 'Cover Letter',
    downloadPdf: 'Download PDF',
    compiling: 'Compiling...',
    save: 'Save',
    saved: 'Saved',
    autoAdjust: '1-Page Fit',
    fresherMode: 'Fresher Mode',
    tailorForJob: 'Tailor for Job',
    govtFormAutofill: 'Govt Form Copy',
    verifyWithDigilocker: 'Verify with DigiLocker',
    importProfile: 'Import Profile',
    shareScore: 'Share Score',
    shareWhatsapp: 'Share to WhatsApp',
    referFriend: 'Refer a Friend',
    placementPortal: 'Placement Cell',
    contactTab: 'Contact Info',
    summaryTab: 'Summary',
    educationTab: 'Education',
    projectsTab: 'Projects',
    skillsTab: 'Skills',
    experienceTab: 'Experience',
    certificationsTab: 'Certifications',
    declarationTab: 'Declaration',
    resumeStrength: 'Resume Strength',
    needsWork: 'Needs work',
    good: 'Good',
    excellent: 'Excellent',
    improveScore: 'Improve score',
    closeTips: 'Close tips',
    naukriOptimizer: 'Naukri ATS Guidelines',
    digilockerVerified: 'DigiLocker Verified',
    digilockerBadgeDesc: 'Verified government educational record via National Academic Depository.',
    govtExportTitle: 'Government Application Form Autofill',
    govtDisclaimer: 'Formatted for manual entry into SSC, IBPS, UPSC, and State PSC recruitment forms.',
    copyAll: 'Copy All Data',
    copied: 'Copied to clipboard!',
  },
  hi: {
    appName: 'ResumeCraft',
    resumes: 'बायोडाटा / रेज्यूमे',
    editor: 'रेज्यूमे संपादक',
    coverLetter: 'कवर लेटर',
    downloadPdf: 'डाउनलोड PDF',
    compiling: 'कंपाइल हो रहा है...',
    save: 'सेव करें',
    saved: 'सहेजा गया',
    autoAdjust: '1-पेज फिट',
    fresherMode: 'फ्रेशर मोड',
    tailorForJob: 'जॉब के अनुसार ढालें',
    govtFormAutofill: 'सरकारी फॉर्म कॉपी',
    verifyWithDigilocker: 'डिजीलॉकर से सत्यापित करें',
    importProfile: 'प्रोफ़ाइल आयात करें',
    shareScore: 'स्कोर साझा करें',
    shareWhatsapp: 'व्हाट्सएप पर शेयर करें',
    referFriend: 'दोस्त को रेफर करें',
    placementPortal: 'प्लेसमेंट सेल',
    contactTab: 'संपर्क जानकारी',
    summaryTab: 'सारांश',
    educationTab: 'शिक्षा व योग्यता',
    projectsTab: 'प्रोजेक्ट्स',
    skillsTab: 'कौशल (Skills)',
    experienceTab: 'कार्य अनुभव',
    certificationsTab: 'प्रमाणपत्र',
    declarationTab: 'घोषणा (Declaration)',
    resumeStrength: 'रेज्यूमे प्रभावशीलता',
    needsWork: 'सुधार आवश्यक',
    good: 'अच्छा',
    excellent: 'उत्कृष्ट',
    improveScore: 'स्कोर सुधारें',
    closeTips: 'सुझाव बंद करें',
    naukriOptimizer: 'नौकरी.कॉम ATS दिशानिर्देश',
    digilockerVerified: 'डिजीलॉकर सत्यापित',
    digilockerBadgeDesc: 'राष्ट्रीय शैक्षणिक रिपोजिटरी (NAD) द्वारा सरकारी सत्यापित शैक्षणिक रिकॉर्ड।',
    govtExportTitle: 'सरकारी आवेदन फॉर्म ऑटो-फिल',
    govtDisclaimer: 'SSC, IBPS, UPSC और राज्य PSC भर्ती पोर्टलों में कॉपी करने के लिए व्यवस्थित डेटा।',
    copyAll: 'समस्त जानकारी कॉपी करें',
    copied: 'क्लिपबोर्ड में कॉपी हो गया!',
  },
};
