import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Simulate subscription
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <Mail className="w-12 h-12 text-white mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-white mb-4">
            {t('newsletter.title')}
          </h3>
          <p className="text-white/90 text-lg mb-8">
            {t('newsletter.description')}
          </p>

          {isSubmitted ? (
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-white">
              <Check className="w-6 h-6" />
              <span className="text-lg font-medium">
                {t('newsletter.title') === 'newsletter.title' ? 
                  'تم الاشتراك بنجاح!' : 
                  'Successfully subscribed!'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                className="flex-1 px-6 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {t('newsletter.subscribe')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;