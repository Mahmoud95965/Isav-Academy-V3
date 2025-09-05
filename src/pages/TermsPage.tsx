import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  GraduationCap,
  Shield,
  BookOpen,
  Users,
  Award,
  Mail,
  CheckCircle,
  AlertTriangle,
  FileText,
  Lock,
  Globe
} from 'lucide-react';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  // العودة للصفحة الرئيسية
  const handleBackToHome = () => {
    navigate('/');
  };

  // إرسال بريد إلكتروني
  const handleEmailClick = () => {
    window.location.href = 'mailto:legal@isav.edu';
  };

  // بيانات الأقسام - يمكن تعديلها بسهولة
  const sections = [
    {
      id: 1,
      title: "قبول الشروط",
      icon: CheckCircle,
      content: `باستخدام منصة أكاديمية ISAV، فإنك توافق على الالتزام بهذه الشروط والأحكام بالكامل. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة. نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إشعارك بأي تغييرات جوهرية.`
    },
    {
      id: 2,
      title: "حقوق الملكية الفكرية",
      icon: Lock,
      content: `جميع المحتويات المنشورة على منصة أكاديمية ISAV، بما في ذلك النصوص والصور والفيديوهات والمقالات العلمية، محمية بموجب حقوق الملكية الفكرية. يحظر نسخ أو توزيع أو إعادة إنتاج أي من هذه المحتويات دون إذن كتابي مسبق من الأكاديمية.`
    },
    {
      id: 3,
      title: "استخدام المنصة",
      icon: Globe,
      content: `يجب استخدام المنصة لأغراض تعليمية وأكاديمية مشروعة فقط. يحظر استخدام المنصة لأي أغراض تجارية أو غير قانونية. يجب على المستخدمين احترام حقوق الآخرين وعدم نشر محتوى مسيء أو ضار.`
    },
    {
      id: 4,
      title: "حدود المسؤولية",
      icon: AlertTriangle,
      content: `أكاديمية ISAV لا تتحمل المسؤولية عن أي أضرار مباشرة أو غير مباشرة قد تنشأ عن استخدام المنصة. نحن نقدم المحتوى "كما هو" دون ضمانات صريحة أو ضمنية. المستخدم مسؤول عن تقييم دقة وملاءمة المعلومات المقدمة.`
    },
    {
      id: 5,
      title: "التعديلات",
      icon: FileText,
      content: `نحتفظ بالحق في تعديل أو تحديث هذه الشروط والأحكام في أي وقت. سيتم نشر التعديلات على هذه الصفحة مع تاريخ آخر تحديث. استمرارك في استخدام المنصة بعد التعديلات يعني موافقتك على الشروط الجديدة.`
    },
    {
      id: 6,
      title: "التواصل معنا",
      icon: Mail,
      content: `إذا كان لديك أي استفسارات حول هذه الشروط والأحكام، يمكنك التواصل معنا عبر البريد الإلكتروني. سنقوم بالرد عليك في أقرب وقت ممكن.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* زر العودة للصفحة الرئيسية */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onClick={handleBackToHome}
        className="fixed top-6 right-6 z-50 flex items-center space-x-2 rtl:space-x-reverse bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">العودة للرئيسية</span>
      </motion.button>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          
          {/* العنوان الرئيسي */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              الشروط والأحكام
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
              أكاديمية ISAV
            </h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* الفقرة التعريفية */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 mb-12"
          >
            <div className="flex items-start space-x-4 rtl:space-x-reverse mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  عن أكاديمية ISAV
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  أكاديمية ISAV هي منصة تعليمية رائدة تهدف إلى نشر المعرفة العلمية المتخصصة في مجالات الطب البيطري والزراعة والعلوم. نسعى لتقديم محتوى عالي الجودة يساهم في تطوير المجتمع العلمي والأكاديمي، ونلتزم بتوفير بيئة تعليمية آمنة ومحترمة لجميع المستخدمين.
                </p>
              </div>
            </div>

            {/* نقاط المميزات */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <motion.div 
                className="flex items-center space-x-3 rtl:space-x-reverse"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">محتوى علمي موثوق</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3 rtl:space-x-reverse"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">مجتمع أكاديمي محترم</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3 rtl:space-x-reverse"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">جودة عالية معتمدة</span>
              </motion.div>
            </div>
          </motion.div>

          {/* أقسام الشروط والأحكام */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
                >
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                        <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {section.id}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {section.title}
                        </h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* قسم التواصل */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 shadow-xl mt-12"
          >
            <div className="text-center">
              <Mail className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                هل لديك استفسارات؟
              </h3>
              <p className="text-emerald-100 mb-6 text-lg">
                يمكنك التواصل معنا عبر البريد الإلكتروني للحصول على المساعدة
              </p>
              <motion.button
                onClick={handleEmailClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors duration-200 shadow-lg"
              >
                راسلنا عبر البريد الإلكتروني
              </motion.button>
            </div>
          </motion.div>

          {/* ملاحظة ختامية */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center mt-12 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800"
          >
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              آخر تحديث: {new Date().toLocaleDateString('ar-SA')} | 
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {' '}جميع الحقوق محفوظة لأكاديمية ISAV
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
