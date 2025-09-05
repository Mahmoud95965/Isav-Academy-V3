import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.articles'), href: '/articles' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

    const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/isavgroup', label: t('footer.facebook') },
    { icon: Twitter, href: 'https://twitter.com/isavgroup', label: t('footer.twitter') },
    { icon: Instagram, href: 'https://instagram.com/isavgroup', label: t('footer.instagram') },
    { icon: Linkedin, href: 'https://linkedin.com/company/isavgroup', label: t('footer.linkedin') },
  ];

  // Get current language
  const currentLanguage = t('language');
  
  // Developer credit text based on language
  const developedByText = currentLanguage === 'ar' 
    ? 'تم التطوير بواسطة' 
    : 'Developed by';
    
  const developerName = currentLanguage === 'ar' ? 'محمود موسى' : 'Mahmoud Moussa';

  return (
    <footer className="bg-gray-900 dark:bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-sm text-gray-400 mb-8">
          {developedByText}{' '}
          <a 
            href="https://www.facebook.com/Mahmoud5310" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {developerName}
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Academy Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">I</span>
              </div>
              <span className="text-xl font-bold">ISAV</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.about') === 'footer.about' ? 
                'أكاديمية رائدة في نشر المعرفة العلمية المتخصصة في مجالات الطب البيطري والزراعة والعلوم' :
                'أكاديمية رائدة في نشر المعرفة العلمية المتخصصة في مجالات الطب البيطري والزراعة والعلوم'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.links')}</h3>
                      <ul className="space-y-2">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.href} className="hover:text-blue-500 transition-colors duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">info@isavacademy.com</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">New York, USA</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.social')}</h3>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                    title={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;