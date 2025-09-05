import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../types';

interface FirebaseArticle {
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

const ArticlesPage: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'readTime'>('newest');
  const [articles, setArticles] = useState<Article[]>([]);
  const [favoriteArticles, setFavoriteArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = currentLanguage.code;

  // Fetch articles from Firebase only
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
            summary: data.excerpt || '',
            content: data.content || '',
            category: data.category || 'general',
            author: data.author || 'مجهول',
            publishDate: data.createdAt?.toDate?.()?.toISOString?.()?.split('T')[0] || new Date().toISOString().split('T')[0],
            image: data.imageUrl || data.image || 'https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            readTime: Math.ceil((data.content?.length || 0) / 200) || 5
          } as Article;
        });

        setArticles(firebaseArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]); // Empty array if error
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
        const article = allArticles.find(a => a.id === articleId);
        if (article) {
          await addDoc(collection(db, 'favorites'), {
            userId: user.uid,
            articleId: articleId,
            title: typeof article.title === 'string' ? article.title : article.title[lang] || '',
            excerpt: typeof article.summary === 'string' ? article.summary : article.summary[lang] || '',
            category: article.category,
            author: typeof article.author === 'string' ? article.author : article.author[lang] || '',
            publishedAt: article.publishDate,
            imageUrl: article.image,
            addedAt: new Date().toISOString()
          });

          setFavoriteArticles(prev => [...prev, articleId]);
        }
      }
    } catch (error) {
      console.error('خطأ في تحديث المفضلة:', error);
    }
  };

  // تحويل المقالات الثابتة إلى تنسيق Firebase

  // استخدام مقالات Firebase فقط
  const allArticles = articles;

  const categories = [
    { key: 'all', label: lang === 'ar' ? 'جميع المقالات' : 'All Articles' },
    { key: 'veterinary', label: t('category.veterinary') },
    { key: 'agriculture', label: t('category.agriculture') },
    { key: 'science', label: t('category.science') },
    { key: 'طب بيطري', label: 'طب بيطري' },
    { key: 'زراعة', label: 'زراعة' },
    { key: 'علوم', label: 'علوم' },
    { key: 'تقنية', label: 'تقنية' },
    { key: 'صحة', label: 'صحة' },
  ];

  const filteredArticles = allArticles
    .filter((article: Article) => {
      if (selectedCategory === 'all') return true;
      return article.category === selectedCategory;
    })
    .filter((article: Article) => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      const title = typeof article.title === 'string' ? article.title : (article.title as any)[lang] || '';
      const summary = typeof article.summary === 'string' ? article.summary : (article.summary as any)[lang] || '';
      const author = typeof article.author === 'string' ? article.author : (article.author as any)[lang] || '';
      return (
        title.toLowerCase().includes(searchLower) ||
        summary.toLowerCase().includes(searchLower) ||
        author.toLowerCase().includes(searchLower)
      );
    })
    .sort((a: Article, b: Article) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'readTime':
          return a.readTime - b.readTime;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {lang === 'ar' ? 'جاري تحميل المقالات...' : 'Loading articles...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('articles.latest')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {lang === 'ar' ? 
              'استكشف مجموعتنا الواسعة من المقالات العلمية المتخصصة' :
              'Explore our extensive collection of specialized scientific articles'
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث في المقالات...' : 'Search articles...'}
                className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto flex items-center px-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            {/* Sort Options */}
            <div className="relative min-w-[200px]">
              <div className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'readTime')}
                className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="newest">{lang === 'ar' ? 'الأحدث' : 'Newest'}</option>
                <option value="oldest">{lang === 'ar' ? 'الأقدم' : 'Oldest'}</option>
                <option value="readTime">{lang === 'ar' ? 'وقت القراءة' : 'Reading Time'}</option>
              </select>
              <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto flex items-center px-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {lang === 'ar' ? 
              `تم العثور على ${filteredArticles.length} ${filteredArticles.length === 1 ? 'مقال' : 'مقالات'}` :
              `Found ${filteredArticles.length} ${filteredArticles.length === 1 ? 'article' : 'articles'}`
            }
          </p>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article: Article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Article Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={typeof article.title === 'string' ? article.title : article.title[lang] || ''}
                      className="w-full h-48 object-cover"
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
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h3 
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {typeof article.title === 'string' ? article.title : article.title[lang] || ''}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {typeof article.summary === 'string' ? article.summary : article.summary[lang] || ''}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{typeof article.author === 'string' ? article.author : article.author[lang] || ''}</span>
                    <span>{new Date(article.publishDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
                  </div>
                  
                  {/* زر قراءة المقال */}
                  <motion.button
                    onClick={() => navigate(`/articles/${article.id}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 rtl:space-x-reverse group"
                  >
                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>{lang === 'ar' ? 'قراءة المقال' : 'Read Article'}</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {lang === 'ar' ? 'لم يتم العثور على مقالات' : 'No articles found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {lang === 'ar' 
                ? 'جرب استخدام كلمات مفتاحية مختلفة أو تصفية أخرى'
                : 'Try using different keywords or filters'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('newest');
              }}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              {lang === 'ar' ? 'إعادة ضبط البحث' : 'Reset search'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
