import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  currentLanguage: Language;
  switchLanguage: (lang: 'ar' | 'en') => void;
  t: (key: string) => string;
}

const languages: Record<'ar' | 'en', Language> = {
  ar: { code: 'ar', name: 'العربية', direction: 'rtl' },
  en: { code: 'en', name: 'English', direction: 'ltr' }
};

const translations: Record<string, Record<'ar' | 'en', string>> = {
  // Navigation
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.content': { ar: 'المحتوى', en: 'Content' },
  'nav.articles': { ar: 'المقالات', en: 'Articles' },
  'nav.courses': { ar: 'الكورسات', en: 'Courses' },
  'nav.about': { ar: 'من نحن', en: 'About Us' },
  'nav.contact': { ar: 'تواصل معنا', en: 'Contact' },
  'nav.comingSoon': { ar: 'قريباً', en: 'Coming Soon' },
  
  // Home page
  'home.welcome.title': { ar: 'Isav Academy', en: 'Isav Academy' },
  'home.welcome.subtitle': { ar: 'بوابتك للمعرفة البيطرية والزراعية', en: 'Your Gateway to Veterinary and Agricultural Knowledge' },
  'home.welcome.description': { ar: 'حيث تلتقي الزراعة والطب البيطري بالابتكار.', en: 'We provide exceptional scientific content in veterinary medicine, agriculture, and sciences' },
  'home.welcome.cta': { ar: 'استكشف المحتوى', en: 'Explore Content' },
  
  // Categories
  'category.veterinary': { ar: 'الطب البيطري', en: 'Veterinary Medicine' },
  'category.agriculture': { ar: 'الزراعة', en: 'Agriculture' },
  'category.science': { ar: 'العلوم', en: 'Sciences' },
  
  // Articles
  'articles.latest': { ar: 'أحدث المقالات', en: 'Latest Articles' },
  'articles.viewAll': { ar: 'عرض الكل', en: 'View All' },
  'articles.readMore': { ar: 'اقرأ المزيد', en: 'Read More' },
  'content.latest': { ar: 'أحدث المحتوى', en: 'Latest Content' },
  'content.readMore': { ar: 'اقرأ المزيد', en: 'Read More' },
  'content.viewAll': { ar: 'عرض كل المحتوى', en: 'View All Content' },
  'content.by': { ar: 'بقلم', en: 'By' },
  'content.publishedOn': { ar: 'نُشر في', en: 'Published on' },
  'content.readTime': { ar: 'دقيقة قراءة', en: 'min read' },
  
  // About
  'about.title': { ar: 'من نحن', en: 'About Us' },
  'about.mission.title': { ar: 'رسالتنا', en: 'Our Mission' },
  'about.vision.title': { ar: 'رؤيتنا', en: 'Our Vision' },
  'about.team': { ar: 'فريق العمل', en: 'Our Team' },
  
  // Contact
  'contact.title': { ar: 'تواصل معنا', en: 'Contact Us' },
  'contact.form.name': { ar: 'الاسم', en: 'Name' },
  'contact.form.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'contact.form.subject': { ar: 'الموضوع', en: 'Subject' },
  'contact.form.message': { ar: 'الرسالة', en: 'Message' },
  'contact.form.send': { ar: 'إرسال الرسالة', en: 'Send Message' },
  
  // Newsletter
  'newsletter.title': { ar: 'اشترك في النشرة البريدية', en: 'Subscribe to Newsletter' },
  'newsletter.description': { ar: 'احصل على آخر المحتوى والتحديثات', en: 'Get latest content and updates' },
  'newsletter.placeholder': { ar: 'أدخل بريدك الإلكتروني', en: 'Enter your email' },
  'newsletter.subscribe': { ar: 'اشتراك', en: 'Subscribe' },
  
  // Courses
  'courses.title': { ar: 'الكورسات', en: 'Courses' },
  'courses.comingSoon': { ar: 'قريباً...', en: 'Coming Soon...' },
  'courses.description': { ar: 'نعمل على إعداد مجموعة من الكورسات المتخصصة في مجالاتنا الأكاديمية', en: 'We are preparing specialized courses in our academic fields' },
  
  // Footer
  'footer.about': { ar: 'حول الأكاديمية', en: 'About Academy' },
  'footer.links': { ar: 'روابط سريعة', en: 'Quick Links' },
  'footer.contact': { ar: 'معلومات التواصل', en: 'Contact Info' },
  'footer.social': { ar: 'تابعنا', en: 'Follow Us' },
  'footer.rights': { ar: 'جميع الحقوق محفوظة لأكاديمية Isav', en: 'All rights reserved to ISAV Academy' },
  
  // Common
  'common.darkMode': { ar: 'الوضع الليلي', en: 'Dark Mode' },
  'common.lightMode': { ar: 'الوضع النهاري', en: 'Light Mode' },
  'common.loading': { ar: 'جاري التحميل...', en: 'Loading...' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages.en);

  const switchLanguage = (langCode: 'ar' | 'en') => {
    const language = languages[langCode];
    setCurrentLanguage(language);
    document.documentElement.lang = langCode;
    document.documentElement.dir = language.direction;
    localStorage.setItem('language', langCode);
  };

  const t = (key: string): string => {
    return translations[key]?.[currentLanguage.code] || key;
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLang && languages[savedLang]) {
      switchLanguage(savedLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};