import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Users,
  Award,
  Shield,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // متغيرات الحالة
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // التحقق من صحة البريد الإلكتروني
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // التحقق من صحة كلمة المرور
  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  // معالجة تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // التحقق من صحة البيانات
    if (!isValidEmail(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (!isValidPassword(password)) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('تم تسجيل الدخول بنجاح! مرحباً بك في أكاديمية إيساف');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: any) {
      setLoading(false);
      if (error.code === 'auth/user-not-found') {
        setError('البريد الإلكتروني غير مسجل');
      } else if (error.code === 'auth/wrong-password') {
        setError('كلمة المرور غير صحيحة');
      } else if (error.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صحيح');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  };

  // معالجة تسجيل الدخول عبر Google
  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('جاري تسجيل الدخول عبر Google...');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // التحقق من وجود المستخدم في Firestore
      const userDoc = await getDoc(doc(db, 'students', user.uid));
      
      if (!userDoc.exists()) {
        // إنشاء حساب جديد في Firestore
        await setDoc(doc(db, 'students', user.uid), {
          fullName: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          nationalId: '',
          dateOfBirth: '',
          address: '',
          educationLevel: '',
          createdAt: new Date().toISOString(),
          status: 'active',
          provider: 'google'
        });
        setSuccess('تم إنشاء الحساب وتسجيل الدخول بنجاح! مرحباً بك في أكاديمية إيساف');
      } else {
        setSuccess('تم تسجيل الدخول بنجاح! مرحباً بك مجدداً في أكاديمية إيساف');
      }

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error: any) {
      setLoading(false);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('تم إغلاق نافذة تسجيل الدخول');
      } else if (error.code === 'auth/popup-blocked') {
        setError('تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول عبر Google');
      }
    } finally {
      setLoading(false);
    }
  };

  // معالجة إنشاء حساب جديد
  const handleSignUp = () => {
    setError('');
    setSuccess('جاري التوجيه إلى صفحة إنشاء الحساب...');
    setTimeout(() => {
      navigate('/signup');
    }, 1000);
  };

  // معالجة نسيت كلمة المرور
  const handleForgotPassword = () => {
    setError('');
    setSuccess('جاري التوجيه إلى صفحة إعادة تعيين كلمة المرور...');
    setTimeout(() => {
      navigate('/reset-password');
    }, 1000);
  };

  // العودة للصفحة الرئيسية
  const handleBackToHome = () => {
    navigate('/');
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
                منصة تعليمية رائدة تهدف إلى نشر المعرفة العلمية المتخصصة في مجالات الطب البيطري والزراعة والعلوم
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
                   <span className="text-gray-700 dark:text-gray-200">500+ مقال علمي</span>
                 </motion.div>
                 
                 <motion.div 
                   className="flex items-center space-x-3 rtl:space-x-reverse"
                   whileHover={{ x: 5 }}
                   transition={{ duration: 0.2 }}
                 >
                   <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                     <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                   </div>
                   <span className="text-gray-700 dark:text-gray-200">10K+ طالب مستفيد</span>
                 </motion.div>
                 
                 <motion.div 
                   className="flex items-center space-x-3 rtl:space-x-reverse"
                   whileHover={{ x: 5 }}
                   transition={{ duration: 0.2 }}
                 >
                   <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                     <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                   </div>
                   <span className="text-gray-700 dark:text-gray-200">50+ خبير متخصص</span>
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

          {/* العمود الثاني - نموذج تسجيل الدخول */}
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
                     تسجيل الدخول
                   </h2>
                   <p className="text-gray-600 dark:text-gray-400">
                     مرحباً بك مجدداً في أكاديمية إيساف
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

                {/* نموذج تسجيل الدخول */}
                <form onSubmit={handleLogin} className="space-y-6">
                  
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
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full pr-10 pl-3 py-3 border rounded-xl text-sm transition-colors ${
                          email && !isValidEmail(email)
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder="example@domain.com"
                        dir="ltr"
                      />
                    </div>
                    {email && !isValidEmail(email) && (
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
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block w-full pr-10 pl-12 py-3 border rounded-xl text-sm transition-colors ${
                          password && !isValidPassword(password)
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder="********"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {password && !isValidPassword(password) && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        كلمة المرور يجب أن تكون 6 أحرف على الأقل
                      </p>
          )}
        </div>

                                     {/* خيارات إضافية */}
                   <div className="flex items-center justify-between">
                     <div className="flex items-center">
                       <input
                         id="remember"
                         type="checkbox"
                         checked={remember}
                         onChange={(e) => setRemember(e.target.checked)}
                         className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                       />
                       <label htmlFor="remember" className="mr-2 block text-sm text-gray-700 dark:text-gray-300">
                         تذكرني
                       </label>
                     </div>
                     <button
                       type="button"
                       onClick={handleForgotPassword}
                       className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-200 hover:underline"
                     >
                       نسيت كلمة المرور؟
                     </button>
                   </div>

                                     {/* زر تسجيل الدخول */}
                   <motion.button
                     type="submit"
                     disabled={loading || !email || !password}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                   >
                     {loading ? (
                       <div className="flex items-center space-x-2 rtl:space-x-reverse">
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         <span>جارٍ تسجيل الدخول...</span>
                       </div>
                     ) : (
                       <div className="flex items-center space-x-2 rtl:space-x-reverse">
                         <LogIn className="w-4 h-4" />
                         <span>تسجيل الدخول</span>
                       </div>
                     )}
                   </motion.button>
                </form>

                                 {/* فاصل */}
                 <div className="relative my-6">
                   <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                   </div>
                   <div className="relative flex justify-center text-sm">
                     <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 font-medium">أو</span>
                   </div>
                 </div>

                                 {/* زر تسجيل الدخول عبر Google */}
                 <motion.button
                   type="button"
                   onClick={handleGoogleLogin}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                 >
                   <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                   </svg>
                   تسجيل الدخول عبر Google
                 </motion.button>

                                 {/* رابط إنشاء حساب جديد */}
                 <div className="mt-6 text-center">
                   <p className="text-sm text-gray-600 dark:text-gray-400">
                     ليس لديك حساب؟{' '}
                     <button
                       type="button"
                       onClick={handleSignUp}
                       className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-200 hover:underline"
                     >
                       إنشاء حساب جديد
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

export default LoginPage;
