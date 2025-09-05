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
  Globe,
  Eye,
  Database,
  Share2,
  Clock,
  UserCheck,
  Baby,
  Plane,
  RefreshCw,
  Info
} from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  // العودة للصفحة الرئيسية
  const handleBackToHome = () => {
    navigate('/');
  };

  // إرسال بريد إلكتروني - يمكن تغيير البريد الإلكتروني هنا
  const handleEmailClick = () => {
    window.location.href = 'mailto:privacy@isav.edu';
  };

  // بيانات الأقسام - يمكن تعديلها بسهولة
  const sections = [
    {
      id: 1,
      title: "نطاق السياسة",
      icon: Globe,
      content: `تطبق سياسة الخصوصية هذه على جميع الخدمات المقدمة من أكاديمية ISAV، بما في ذلك الموقع الإلكتروني والتطبيقات والمنصات التعليمية. تحكم هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية للمستخدمين.`
    },
    {
      id: 2,
      title: "البيانات التي نجمعها",
      icon: Database,
      content: `نجمع البيانات التالية: المعلومات الشخصية (الاسم، البريد الإلكتروني، رقم الهاتف)، بيانات الحساب، معلومات الاستخدام، البيانات التقنية (عنوان IP، نوع المتصفح)، والبيانات التعليمية (التقدم في الدورات، الشهادات).`
    },
    {
      id: 3,
      title: "كيفية استخدام البيانات",
      icon: Eye,
      content: `نستخدم البيانات لتقديم الخدمات التعليمية، تحسين تجربة المستخدم، التواصل مع المستخدمين، إرسال الإشعارات المهمة، تحليل الاستخدام، وتطوير المحتوى التعليمي. لا نبيع أو نؤجر البيانات الشخصية لأطراف ثالثة.`
    },
    {
      id: 4,
      title: "الأسس القانونية للمعالجة",
      icon: CheckCircle,
      content: `نعالج البيانات بناءً على الموافقة المقدمة، تنفيذ العقد، الالتزامات القانونية، والمصالح المشروعة. نحن ملتزمون بحماية حقوق المستخدمين وضمان الشفافية في جميع عمليات معالجة البيانات.`
    },
    {
      id: 5,
      title: "الكوكيز",
      icon: FileText,
      content: `نستخدم ملفات تعريف الارتباط (الكوكيز) لتحسين تجربة المستخدم، حفظ التفضيلات، تحليل الاستخدام، وتوفير محتوى مخصص. يمكن للمستخدمين التحكم في إعدادات الكوكيز من خلال متصفحهم.`
    },
    {
      id: 6,
      title: "مشاركة البيانات",
      icon: Share2,
      content: `لا نشارك البيانات الشخصية إلا في الحالات التالية: مع مزودي الخدمات الموثوقين، للامتثال للقوانين، لحماية الحقوق والأمان، أو بموافقة صريحة من المستخدم. نتأكد من أن جميع الشركاء يلتزمون بمعايير الحماية العالية.`
    },
    {
      id: 7,
      title: "الاحتفاظ بالبيانات",
      icon: Clock,
      content: `نحتفظ بالبيانات الشخصية طالما كان ذلك ضرورياً لتقديم الخدمات أو الوفاء بالالتزامات القانونية. عند انتهاء الحاجة، نقوم بحذف البيانات بشكل آمن أو إزالة المعرفات الشخصية.`
    },
    {
      id: 8,
      title: "أمن المعلومات",
      icon: Lock,
      content: `نطبق إجراءات أمنية صارمة لحماية البيانات الشخصية، بما في ذلك التشفير، جدران الحماية، التحكم في الوصول، والمراقبة المستمرة. نراجع ونحدث إجراءات الأمان بانتظام لمواكبة التهديدات الجديدة.`
    },
    {
      id: 9,
      title: "حقوق المستخدم",
      icon: UserCheck,
      content: `للمستخدمين الحق في الوصول لبياناتهم، تصحيح المعلومات غير الدقيقة، حذف البيانات، تقييد المعالجة، نقل البيانات، الاعتراض على المعالجة، وسحب الموافقة. يمكن ممارسة هذه الحقوق من خلال التواصل معنا.`
    },
    {
      id: 10,
      title: "خصوصية الأطفال",
      icon: Baby,
      content: `نحمي خصوصية الأطفال ونلتزم بقوانين حماية الأطفال. لا نجمع عمداً معلومات شخصية من الأطفال دون سن 13 عاماً دون موافقة الوالدين. نشجع الوالدين على مراقبة استخدام أطفالهم للإنترنت.`
    },
    {
      id: 11,
      title: "النقل الدولي للبيانات",
      icon: Plane,
      content: `قد يتم نقل البيانات إلى دول أخرى لتقديم الخدمات. نتأكد من أن جميع عمليات النقل تتوافق مع قوانين حماية البيانات وتطبق إجراءات أمنية مناسبة لحماية المعلومات الشخصية.`
    },
    {
      id: 12,
      title: "التحديثات على السياسة",
      icon: RefreshCw,
      content: `قد نقوم بتحديث سياسة الخصوصية من وقت لآخر لتعكس التغييرات في ممارساتنا أو المتطلبات القانونية. سنقوم بإشعار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو الإشعارات على المنصة.`
    }
  ];

  // تاريخ سريان السياسة - يمكن تعديله
  const effectiveDate = new Date('2024-01-01');
  const lastUpdated = new Date('2024-12-01');

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
              سياسة الخصوصية
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
                  عن سياسة الخصوصية
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  أكاديمية ISAV ملتزمة بحماية خصوصية وأمان بياناتك الشخصية. تشرح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا التعليمية. نحن نؤمن بالشفافية ونضع خصوصيتك في المقام الأول.
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
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">حماية قوية للبيانات</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3 rtl:space-x-reverse"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">شفافية كاملة</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3 rtl:space-x-reverse"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">حقوق المستخدم محفوظة</span>
              </motion.div>
            </div>
          </motion.div>

          {/* معلومات التواريخ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 mb-12"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">تاريخ السريان</h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    {effectiveDate.toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">آخر تحديث</h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    {lastUpdated.toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* أقسام سياسة الخصوصية */}
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
            transition={{ duration: 0.8, delay: 1.8 }}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 shadow-xl mt-12"
          >
            <div className="text-center">
              <Mail className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                هل لديك استفسارات حول الخصوصية؟
              </h3>
              <p className="text-emerald-100 mb-6 text-lg">
                يمكنك التواصل مع فريق حماية البيانات للحصول على المساعدة
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
            transition={{ duration: 0.8, delay: 2.0 }}
            className="text-center mt-12 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800"
          >
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                جميع الحقوق محفوظة لأكاديمية ISAV
              </span>
              {' '}| تم تصميم هذه السياسة وفقاً لأعلى معايير حماية البيانات العالمية
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
