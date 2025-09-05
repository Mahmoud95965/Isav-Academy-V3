import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Shield,
  BookOpen,
  Users,
  Award
} from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  
  // متغيرات الحالة للنموذج
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // متغيرات الحالة للواجهة
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // التحقق من صحة البيانات
  const isValidFullName = (name: string) => {
    return name.trim().length >= 3;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const passwordsMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  // معالجة تغيير البيانات
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // معالجة إنشاء الحساب
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // التحقق من صحة جميع البيانات
    if (!isValidFullName(formData.fullName)) {
      setError('يجب أن يكون الاسم الكامل 3 أحرف على الأقل');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      setError('كلمة المرور وتأكيدها غير متطابقين');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('يجب الموافقة على الشروط والسياسة');
      return;
    }

    setLoading(true);

    try {
      // إنشاء حساب المستخدم في Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // تحديث اسم المستخدم
      await updateProfile(user, {
        displayName: formData.fullName
      });

      // حفظ بيانات المستخدم في Firestore
      await setDoc(doc(db, 'students', user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        phone: '',
        nationalId: '',
        dateOfBirth: '',
        address: '',
        educationLevel: '',
        createdAt: new Date().toISOString(),
        status: 'active',
        provider: 'email'
      });

      setSuccess('تم إنشاء الحساب بنجاح! مرحباً بك في أكاديمية إيساف');
      
      // التوجيه للصفحة الرئيسية بعد إنشاء الحساب
      setTimeout(() => {
      navigate('/');
      }, 2000);

    } catch (error: any) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setError('البريد الإلكتروني مستخدم بالفعل');
      } else if (error.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة جداً');
      } else if (error.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صحيح');
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى');
      }
    } finally {
    setLoading(false);
    }
  };

  // العودة للصفحة الرئيسية
  const handleBackToHome = () => {
    navigate('/');
  };

  // الانتقال لصفحة تسجيل الدخول
  const handleGoToLogin = () => {
    navigate('/login');
  };

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
          className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          
          {/* العمود الأول - بطاقة تعريف الأكاديمية */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
              
              {/* الشعار */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center justify-center mb-8"
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <GraduationCap className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>

              {/* عنوان الأكاديمية */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4"
              >
                أكاديمية إيساف
              </motion.h1>

              {/* وصف الأكاديمية */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-gray-600 dark:text-gray-300 text-center mb-8 leading-relaxed"
              >
                انضم إلى مجتمعنا التعليمي واحصل على أفضل المحتويات العلمية في مجالات الطب البيطري والزراعة والعلوم
              </motion.p>

              {/* نقاط المميزات */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="space-y-4 mb-8"
              >
                <motion.div 
                  className="flex items-center space-x-3 rtl:space-x-reverse"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">محتوى علمي عالي الجودة</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-3 rtl:space-x-reverse"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">مجتمع تعليمي نشط</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-3 rtl:space-x-reverse"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">شهادات معتمدة</span>
                </motion.div>
              </motion.div>

              {/* ملاحظة الشروط */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800"
              >
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <div>
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">حماية البيانات</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      نضمن حماية بياناتك الشخصية وفقاً لأعلى معايير الأمان والخصوصية
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* العمود الثاني - نموذج إنشاء الحساب */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
              >
                
                {/* عنوان النموذج */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            إنشاء حساب جديد
          </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    انضم إلى مجتمع أكاديمية إيساف
                  </p>
                  <div className="mt-4 flex items-center justify-center space-x-4 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-emerald-200 rounded-full"></div>
                  </div>
        </div>

                {/* رسائل النجاح والخطأ */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center space-x-3 rtl:space-x-reverse"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-green-800 dark:text-green-200 text-sm">{success}</span>
                  </motion.div>
                )}

        {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3 rtl:space-x-reverse"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
                  </motion.div>
                )}

                {/* نموذج إنشاء الحساب */}
                <form onSubmit={handleSignup} className="space-y-6">
                  
                  {/* حقل الاسم الكامل */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`block w-full pr-10 pl-3 py-3 border rounded-xl text-sm transition-colors ${
                          formData.fullName && !isValidFullName(formData.fullName)
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
          </div>
                    {formData.fullName && !isValidFullName(formData.fullName) && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        يجب أن يكون الاسم 3 أحرف على الأقل
                      </p>
        )}
                  </div>

                  {/* حقل البريد الإلكتروني */}
            <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
              <input
                        id="email"
                        name="email"
                type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full pr-10 pl-3 py-3 border rounded-xl text-sm transition-colors ${
                          formData.email && !isValidEmail(formData.email)
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder="example@domain.com"
                        dir="ltr"
                required
              />
            </div>
                    {formData.email && !isValidEmail(formData.email) && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        يرجى إدخال بريد إلكتروني صحيح
                      </p>
                    )}
                  </div>

                  {/* حقل كلمة المرور */}
            <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
              <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full pr-10 pl-12 py-3 border rounded-xl text-sm transition-colors ${
                          formData.password && !isValidPassword(formData.password)
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder="********"
                        dir="ltr"
                required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formData.password && !isValidPassword(formData.password) && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        كلمة المرور يجب أن تكون 6 أحرف على الأقل
                      </p>
                    )}
            </div>

                  {/* حقل تأكيد كلمة المرور */}
            <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`block w-full pr-10 pl-12 py-3 border rounded-xl text-sm transition-colors ${
                          formData.confirmPassword && !passwordsMatch(formData.password, formData.confirmPassword)
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder="********"
                        dir="ltr"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && !passwordsMatch(formData.password, formData.confirmPassword) && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        كلمة المرور وتأكيدها غير متطابقين
                      </p>
                    )}
                  </div>

                  {/* الموافقة على الشروط */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
              <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                required
              />
            </div>
                    <div className="mr-3 text-sm">
                                             <label htmlFor="agreeToTerms" className="text-gray-700 dark:text-gray-300">
                         أوافق على{' '}
                         <button
                           type="button"
                           onClick={() => navigate('/terms')}
                           className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 underline"
                         >
                           الشروط والأحكام
                         </button>{' '}
                         و{' '}
                         <button
                           type="button"
                           onClick={() => navigate('/privacy')}
                           className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 underline"
                         >
                           سياسة الخصوصية
                         </button>
                       </label>
                    </div>
          </div>

                  {/* زر إنشاء الحساب */}
                  <motion.button
              type="submit"
              disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جارٍ إنشاء الحساب...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <CheckCircle className="w-4 h-4" />
                        <span>إنشاء الحساب</span>
                      </div>
                    )}
                  </motion.button>
                </form>

                {/* رابط الانتقال لصفحة تسجيل الدخول */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    لديك حساب بالفعل؟{' '}
                    <button
                      type="button"
                      onClick={handleGoToLogin}
                      className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-200 hover:underline"
                    >
                      تسجيل الدخول
            </button>
                  </p>
                </div>
              </motion.div>
          </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
