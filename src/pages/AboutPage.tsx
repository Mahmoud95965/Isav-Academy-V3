import React from 'react';
import { Target, Eye, Heart, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { teamMembers } from '../data/mockData';

const AboutPage: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const lang = currentLanguage.code;

  const values = [
    {
      icon: Target,
      title: {
        ar: 'الدقة العلمية',
        en: 'Scientific Accuracy'
      },
      description: {
        ar: 'نلتزم بأعلى معايير الدقة العلمية في جميع محتوياتنا',
        en: 'We adhere to the highest standards of scientific accuracy in all our content'
      }
    },
    {
      icon: Eye,
      title: {
        ar: 'الشفافية',
        en: 'Transparency'
      },
      description: {
        ar: 'نقدم المعلومات بشفافية ووضوح تام',
        en: 'We provide information with complete transparency and clarity'
      }
    },
    {
      icon: Heart,
      title: {
        ar: 'الشغف بالعلم',
        en: 'Passion for Science'
      },
      description: {
        ar: 'شغفنا بالعلم يدفعنا لتقديم الأفضل دائماً',
        en: 'Our passion for science drives us to always deliver the best'
      }
    },
    {
      icon: Award,
      title: {
        ar: 'التميز',
        en: 'Excellence'
      },
      description: {
        ar: 'نسعى للتميز في كل ما نقدمه من محتوى وخدمات',
        en: 'We strive for excellence in everything we offer'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {lang === 'ar' ? 
              'نحن أكاديمية ISAV، منصة تعليمية رائدة تهدف إلى نشر المعرفة العلمية المتخصصة' :
              'We are ISAV Academy, a leading educational platform dedicated to disseminating specialized scientific knowledge'
            }
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {lang === 'ar' ? 
                  'نحن في أكاديمية إيساف نؤمن بأن المعرفة المتخصصة هي أساس التقدم. رسالتنا تتمثل في تقديم محتوى تعليمي متميز في مجالات الطب البيطري والزراعة والعلوم، يسهم في تطوير المجتمع العلمي ويرفع من كفاءة المختصين. نعمل على تبسيط العلوم وتقديمها بشكل عصري لتمكين الباحثين والطلاب من الوصول للمعرفة الدقيقة.' :
                  'At ISAV Academy, we believe that specialized knowledge is the foundation of progress. Our mission is to provide distinguished educational content in the fields of veterinary medicine, agriculture, and sciences, contributing to the development of the scientific community and enhancing the efficiency of specialists. We work to simplify sciences and present them in a modern way to enable researchers and students to access accurate knowledge.'
                }
              </p>
            </div>

            {/* Vision */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t('about.vision.title')}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {lang === 'ar' ? 
                  'نطمح في أكاديمية إيساف إلى أن نكون الوجهة الأولى في الشرق الأوسط للتعليم والتدريب المتخصص في مجالات الطب البيطري والزراعة والعلوم. نسعى لبناء جيل من الخبراء القادرين على مواكبة التطورات العلمية وقيادة التغيير في مجتمعاتنا. نعمل على إنشاء مجتمع علمي متكامل يربط بين الخبراء والباحثين والطلاب لتبادل المعرفة والخبرات.' :
                  'At ISAV Academy, we aspire to be the premier destination in the Middle East for specialized education and training in the fields of veterinary medicine, agriculture, and sciences. We aim to build a generation of experts capable of keeping pace with scientific developments and leading change in our societies. We work to create an integrated scientific community that connects experts, researchers, and students to exchange knowledge and experiences.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {lang === 'ar' ? 'قيمنا الأساسية' : 'Our Core Values'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {lang === 'ar' ? 
                'القيم التي نؤمن بها وتوجه عملنا في خدمة المجتمع العلمي' :
                'The values we believe in and that guide our work in serving the scientific community'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title[lang]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {value.description[lang]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.team')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {lang === 'ar' ? 
                'تعرف على الفريق المتخصص الذي يقود رؤية الأكاديمية' :
                'Meet the specialized team that leads the academy\'s vision'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={member.image}
                    alt={member.name[lang]}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name[lang]}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.position[lang]}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.bio[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {lang === 'ar' ? 'إنجازاتنا بالأرقام' : 'Our Achievements in Numbers'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: lang === 'ar' ? 'مقال علمي' : 'Scientific Articles' },
              { number: '10K+', label: lang === 'ar' ? 'طالب مستفيد' : 'Students Benefited' },
              { number: '50+', label: lang === 'ar' ? 'خبير متخصص' : 'Expert Specialists' },
              { number: '3', label: lang === 'ar' ? 'مجالات تخصص' : 'Specialization Areas' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;