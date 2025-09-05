import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Heart,
  Calendar,
  User,
  BookOpen,
  Clock,
  Star,
  MessageCircle,
  Send
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { articles } from '../data/mockData';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
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

interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  rating: number;
  createdAt: string;
}

const ArticleDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { articleId } = useParams<{ articleId: string }>();
  const { currentLanguage, t } = useLanguage();
  const [user] = useAuthState(auth);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const lang = currentLanguage.code;

  // جلب تفاصيل المقال
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        navigate('/articles');
        return;
      }

      try {
        // البحث أولاً في المقالات الثابتة
        const foundMockArticle = articles.find(a => a.id === articleId);
        if (foundMockArticle) {
          setArticle(foundMockArticle);
          setLoading(false);
          return;
        }

        // إذا لم توجد في المقالات الثابتة، ابحث في Firebase
        const articleDoc = await getDoc(doc(db, 'articles', articleId));
        if (articleDoc.exists()) {
          const data = articleDoc.data() as FirebaseArticle;
          // تحويل مقال Firebase إلى تنسيق Article
          const convertedArticle: Article = {
            id: articleDoc.id,
            title: { ar: data.title, en: data.title },
            summary: { ar: data.excerpt, en: data.excerpt },
            content: { ar: data.content, en: data.content },
            category: data.category as "veterinary" | "agriculture" | "science",
            author: { ar: data.author, en: data.author },
            publishDate: data.publishedAt,
            image: data.imageUrl,
            readTime: Math.ceil(data.content.split(' ').length / 200)
          };
          setArticle(convertedArticle);
        } else {
          navigate('/articles');
        }
      } catch (error) {
        console.error('خطأ في جلب المقال:', error);
        navigate('/articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, navigate, lang]);

  // جلب التعليقات
  useEffect(() => {
    const fetchComments = async () => {
      if (!articleId) return;
      
      try {
        setCommentsLoading(true);
        const commentsQuery = query(
          collection(db, 'comments'),
          where('articleId', '==', articleId)
        );
        
        const querySnapshot = await getDocs(commentsQuery);
        const fetchedComments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Comment));

        // ترتيب التعليقات حسب التاريخ (الأحدث أولاً)
        fetchedComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setComments(fetchedComments);
      } catch (error) {
        console.error('خطأ في جلب التعليقات:', error);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  // العودة للصفحة السابقة
  const handleBack = () => {
    navigate('/articles');
  };

  // تبديل المفضلة (محاكاة)
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // إضافة تعليق جديد
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert(lang === 'ar' ? 'يجب تسجيل الدخول لإضافة تعليق' : 'Please login to add a comment');
      return;
    }

    if (!newComment.trim()) {
      alert(lang === 'ar' ? 'يرجى كتابة تعليق' : 'Please write a comment');
      return;
    }

    try {
      setSubmittingComment(true);
      
      const commentData = {
        articleId: articleId!,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'مستخدم مجهول',
        userEmail: user.email || '',
        content: newComment.trim(),
        rating: newRating,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'comments'), commentData);
      
      // إضافة التعليق للقائمة المحلية
      const newCommentObj: Comment = {
        id: Date.now().toString(), // معرف مؤقت
        ...commentData
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      setNewRating(5);
      
    } catch (error) {
      console.error('خطأ في إضافة التعليق:', error);
      alert(lang === 'ar' ? 'حدث خطأ في إضافة التعليق' : 'Error adding comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  // حساب متوسط التقييم
  const averageRating = comments.length > 0 
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length 
    : 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'veterinary':
        return 'bg-blue-500 text-white';
      case 'agriculture':
        return 'bg-green-500 text-white';
      case 'science':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {lang === 'ar' ? 'جاري تحميل المقال...' : 'Loading article...'}
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {lang === 'ar' ? 'المقال غير موجود' : 'Article not found'}
          </h2>
          <button
            onClick={() => navigate('/articles')}
            className="text-blue-500 hover:text-blue-600"
          >
            {lang === 'ar' ? 'العودة للمقالات' : 'Back to articles'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* زر العودة */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onClick={handleBack}
        className="fixed top-6 right-6 z-50 flex items-center space-x-2 rtl:space-x-reverse bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">
          {lang === 'ar' ? 'العودة' : 'Back'}
        </span>
      </motion.button>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* صورة المقال */}
          <div className="relative h-80 md:h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <img
              src={article.image}
              alt={article.title[lang]}
              className="w-full h-full object-cover"
            />
            
            {/* طبقة التدرج */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {/* زر المفضلة */}
            <motion.button
              onClick={toggleFavorite}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-6 left-6 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-200 backdrop-blur-sm"
            >
              <Heart 
                className={`w-6 h-6 ${
                  isFavorite 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-600'
                }`} 
              />
            </motion.button>

            {/* الفئة */}
            <div className="absolute top-6 right-6">
              <span className={`px-6 py-3 rounded-full text-sm font-semibold shadow-lg ${getCategoryColor(article.category)}`}>
                {t(`category.${article.category}`)}
              </span>
            </div>
            
            {/* معلومات المقال على الصورة */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm opacity-90 mb-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="w-4 h-4" />
                  <span>{article.author[lang]}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.publishDate)}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} {t('articles.readTime')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* معلومات المقال */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              {article.title[lang]}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              {article.summary[lang]}
            </motion.p>
          </div>

          {/* محتوى المقال */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                {article.content[lang]}
              </div>
            </div>
          </motion.div>

          {/* أزرار التفاعل */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-12"
          >
            <button
              onClick={toggleFavorite}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isFavorite
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              <span>
                {isFavorite 
                  ? (lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites')
                  : (lang === 'ar' ? 'إضافة للمفضلة' : 'Add to favorites')
                }
              </span>
            </button>

            <button
              onClick={() => navigate('/articles')}
              className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5" />
              <span>
                {lang === 'ar' ? 'المزيد من المقالات' : 'More articles'}
              </span>
            </button>
          </motion.div>

          {/* قسم التعليقات والتقييمات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
          >
            {/* عنوان قسم التعليقات */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MessageCircle className="w-6 h-6 text-blue-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lang === 'ar' ? 'التعليقات والتقييمات' : 'Comments & Reviews'}
                </h3>
              </div>
              
              {/* إحصائيات التقييم */}
              {comments.length > 0 && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({averageRating.toFixed(1)}) • {comments.length} {lang === 'ar' ? 'تعليق' : 'comments'}
                  </span>
                </div>
              )}
            </div>

            {/* نموذج إضافة تعليق */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.displayName || user.email?.split('@')[0] || 'مستخدم'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lang === 'ar' ? 'إضافة تعليق جديد' : 'Add a new comment'}
                      </p>
                    </div>
                  </div>

                  {/* تقييم بالنجوم */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {lang === 'ar' ? 'التقييم' : 'Rating'}
                    </label>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform duration-200"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newRating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* حقل التعليق */}
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                  />

                  {/* زر الإرسال */}
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {submittingComment ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>
                        {submittingComment 
                          ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                          : (lang === 'ar' ? 'إرسال التعليق' : 'Send Comment')
                        }
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 text-center mb-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {lang === 'ar' ? 'يجب تسجيل الدخول لإضافة تعليق' : 'Please login to add a comment'}
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </button>
              </div>
            )}

            {/* قائمة التعليقات */}
            <div className="space-y-6">
              {commentsLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {lang === 'ar' ? 'جاري تحميل التعليقات...' : 'Loading comments...'}
                  </p>
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6"
                  >
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {comment.userName}
                            </h4>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= comment.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString(
                                  lang === 'ar' ? 'ar-SA' : 'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {lang === 'ar' ? 'لا توجد تعليقات بعد' : 'No comments yet'}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    {lang === 'ar' ? 'كن أول من يعلق على هذا المقال' : 'Be the first to comment on this article'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
