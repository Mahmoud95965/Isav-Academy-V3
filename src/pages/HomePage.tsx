import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Users, Award, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Newsletter from '../components/UI/Newsletter';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  imageUrl: string;
  publishedAt: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [favoriteArticles, setFavoriteArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const lang = currentLanguage.code;

  // مراقبة حالة تسجيل الدخول
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // جلب المقالات من Firebase
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const articlesQuery = query(
          collection(db, 'articles'),
          where('status', '==', 'published')
        );
        
        const querySnapshot = await getDocs(articlesQuery);
        const firebaseArticles = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            category: data.category || 'general',
            author: data.author || 'مجهول',
            publishedAt: data.createdAt?.toDate?.()?.toISOString?.()?.split('T')[0] || new Date().toISOString().split('T')[0],
            imageUrl: data.imageUrl || data.image || 'https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            status: 'published' as const,
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || new Date().toISOString()
          };
        });

        setArticles(firebaseArticles);
      } catch (error) {
        console.error('خطأ في جلب المقالات:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // جلب المقالات المفضلة للمستخدم
  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(favoritesQuery);
        const favoriteIds: string[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          favoriteIds.push(data.articleId);
        });

        setFavoriteArticles(favoriteIds);
      } catch (error) {
        console.error('خطأ في جلب المفضلة:', error);
      }
    };

    fetchFavorites();
  }, []);

  // إضافة/إزالة من المفضلة
  const toggleFavorite = async (articleId: string) => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (favoriteArticles.includes(articleId)) {
        // إزالة من المفضلة
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid),
          where('articleId', '==', articleId)
        );
        const snapshot = await getDocs(favoritesQuery);
        
        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        setFavoriteArticles(prev => prev.filter(id => id !== articleId));
      } else {
        // إضافة للمفضلة
        const article = articles.find(a => a.id === articleId);
        if (article) {
          await addDoc(collection(db, 'favorites'), {
            userId: user.uid,
            articleId: articleId,
            title: article.title,
            excerpt: article.excerpt,
            category: article.category,
            author: article.author,
            publishedAt: article.publishedAt,
            imageUrl: article.imageUrl,
            addedAt: new Date().toISOString()
          });

          setFavoriteArticles(prev => [...prev, articleId]);
        }
      }
    } catch (error) {
      console.error('خطأ في تحديث المفضلة:', error);
    }
  };

  // إنشاء مقالات تجريبية
  const createSampleArticles = async () => {
    const sampleArticles = [
      {
        title: 'أساسيات الطب البيطري الحديث',
        excerpt: 'دليل شامل لفهم المبادئ الأساسية للطب البيطري المعاصر وأحدث التقنيات المستخدمة في تشخيص وعلاج الحيوانات.',
        content: 'الطب البيطري هو فرع من فروع الطب يختص بالحيوانات. يشمل التشخيص والعلاج والوقاية من الأمراض والإصابات والاضطرابات في الحيوانات.',
        category: 'طب بيطري',
        author: 'د. أحمد محمد',
        imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800',
        status: 'published' as 'draft' | 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'تقنيات الزراعة المستدامة',
        excerpt: 'استكشف أحدث التقنيات والطرق المستخدمة في الزراعة المستدامة لضمان الأمن الغذائي وحماية البيئة.',
        content: 'الزراعة المستدامة هي نظام زراعي يهدف إلى تلبية احتياجات الأجيال الحالية دون المساس بقدرة الأجيال القادمة على تلبية احتياجاتها.',
        category: 'زراعة',
        author: 'د. فاطمة علي',
        imageUrl: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800',
        status: 'published' as 'draft' | 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'التطورات الحديثة في العلوم البيولوجية',
        excerpt: 'نظرة شاملة على أحدث الاكتشافات والتطورات في مجال العلوم البيولوجية وتطبيقاتها العملية.',
        content: 'العلوم البيولوجية تشهد تطوراً سريعاً ومذهلاً في السنوات الأخيرة. من التعديل الجيني إلى الطب التجديدي.',
        category: 'علوم',
        author: 'د. سارة أحمد',
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
        status: 'published' as 'draft' | 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    try {
      for (const article of sampleArticles) {
        await addDoc(collection(db, 'articles'), {
          ...article,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      console.log('تم إنشاء المقالات التجريبية بنجاح');
    } catch (error) {
      console.error('خطأ في إنشاء المقالات التجريبية:', error);
    }
  };

  const latestArticles = articles.slice(0, 3);

  const stats = [
    {
      icon: BookOpen,
      number: '500+',
      label: lang === 'ar' ? 'مقال علمي' : 'Scientific Articles'
    },
    {
      icon: Users,
      number: '10K+',
      label: lang === 'ar' ? 'طالب مستفيد' : 'Students Benefited'
    },
    {
      icon: Award,
      number: '50+',
      label: lang === 'ar' ? 'خبير متخصص' : 'Expert Specialists'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative text-white">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-green-600"></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t('home.welcome.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {t('home.welcome.subtitle')}
            </p>
            <p className="text-lg text-blue-50 max-w-2xl mx-auto">
              {t('home.welcome.description')}
            </p>
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span>{lang === 'ar' ? 'ابدأ الان' : 'Login'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => navigate('/articles')}
                className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                <span>{t('home.welcome.cta')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <IconComponent className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.number}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('articles.latest')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {lang === 'ar' ? 
                'اكتشف أحدث المقالات العلمية في مجالات الطب البيطري والزراعة والعلوم' :
                'Discover the latest scientific articles in veterinary medicine, agriculture, and sciences'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {latestArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Article Image */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-emerald-600">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/80" />
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <motion.button
                    onClick={() => toggleFavorite(article.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 left-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        favoriteArticles.includes(article.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-600'
                      }`} 
                    />
                  </motion.button>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h3 
                    className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => navigate(`/articles/${article.id}`)}
                  >
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{article.author}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                  
                  {/* زر قراءة المقال */}
                  <motion.button
                    onClick={() => navigate(`/articles/${article.id}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium text-sm hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 rtl:space-x-reverse group"
                  >
                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>قراءة المقال</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/articles')}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <span>{t('articles.viewAll')}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('about.title')}
              </h2>
<p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
  {lang === 'ar' ? 
    `مرحبًا بك في أكاديمية إيساف ✨
منصة تعليمية متخصصة تجمع الزراعة والطب البيطري والعلوم في مكان واحد. نقدّم مقالاتٍ ودروسًا عملية مبسطة تُساعد الطلاب والمهنيين على تنمية مهاراتهم وبناء مستقبل مهني أقوى. هدفنا أن تكون إيساف بوابتك للمعرفة والتطبيق.` :
    `Welcome to ISAV Academy ✨
A specialized learning hub bringing together agriculture, veterinary medicine, and sciences. We provide accessible articles and hands-on resources to help students and professionals grow their skills and careers. Our goal is to be your gateway to knowledge and real-world practice.`
  }
</p>

              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center space-x-2 rtl:space-x-reverse text-blue-600 hover:text-blue-700 font-semibold"
              >
                <span>{lang === 'ar' ? 'اعرف المزيد' : 'Learn More'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <img
                src="/images/isav-logo.svg"
                alt="ISAV Academy Logo"
                className="w-full h-auto max-w-lg mx-auto rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Coming Soon */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('courses.title')} {t('courses.comingSoon')}
            </h2>
            <p className="text-xl text-green-100 mb-8">
              {t('courses.description')}
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {lang === 'ar' ? 'اعرف المزيد' : 'Learn More'}
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default HomePage;