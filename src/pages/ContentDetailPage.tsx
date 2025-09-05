import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Heart,
  Star,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

interface Content {
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

interface Rating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ContentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { contentId } = useParams<{ contentId: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  // جلب تفاصيل المقال
  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) return;

      try {
        const contentDoc = await getDoc(doc(db, 'content', contentId));
        if (contentDoc.exists()) {
          const data = contentDoc.data();
          setContent({
            id: contentDoc.id,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category,
            author: data.author,
            imageUrl: data.imageUrl,
            publishedAt: data.publishedAt,
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        } else {
          navigate('/content');
        }
      } catch (error) {
        console.error('خطأ في جلب المحتوى:', error);
        navigate('/content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId, navigate]);

  // جلب التقييمات
  useEffect(() => {
    const fetchRatings = async () => {
      if (!contentId) return;

      try {
        const ratingsQuery = query(
          collection(db, 'ratings'),
          where('articleId', '==', contentId)
        );
        const snapshot = await getDocs(ratingsQuery);
        const ratingsData: Rating[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          ratingsData.push({
            id: doc.id,
            userId: data.userId,
            userName: data.userName,
            rating: data.rating,
            comment: data.comment,
            createdAt: data.createdAt
          });
        });

        setRatings(ratingsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error('خطأ في جلب التقييمات:', error);
      }
    };

    fetchRatings();
  }, [contentId]);

  // التحقق من المفضلة
  useEffect(() => {
    const checkFavorite = async () => {
      const user = auth.currentUser;
      if (!user || !contentId) return;

      try {
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid),
          where('articleId', '==', contentId)
        );
        const snapshot = await getDocs(favoritesQuery);
        setIsFavorite(!snapshot.empty);
      } catch (error) {
        console.error('خطأ في التحقق من المفضلة:', error);
      }
    };

    checkFavorite();
  }, [contentId]);

  // إضافة/إزالة من المفضلة
  const toggleFavorite = async () => {
    const user = auth.currentUser;
    if (!user || !contentId || !content) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        // إزالة من المفضلة
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid),
          where('articleId', '==', contentId)
        );
        const snapshot = await getDocs(favoritesQuery);
        
        snapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, { deleted: true });
        });

        setIsFavorite(false);
      } else {
        // إضافة للمفضلة
        await addDoc(collection(db, 'favorites'), {
          userId: user.uid,
          articleId: contentId,
          title: content.title,
          excerpt: content.excerpt,
          category: content.category,
          author: content.author,
          publishedAt: content.publishedAt,
          imageUrl: content.imageUrl,
          addedAt: new Date().toISOString()
        });

        setIsFavorite(true);
      }
    } catch (error) {
      console.error('خطأ في تحديث المفضلة:', error);
    }
  };

  // إرسال التقييم
  const submitRating = async () => {
    const user = auth.currentUser;
    if (!user || !contentId || userRating === 0) return;

    setSubmittingRating(true);
    try {
      await addDoc(collection(db, 'ratings'), {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'مستخدم',
        articleId: contentId,
        rating: userRating,
        comment: userComment,
        createdAt: new Date().toISOString()
      });

      // إعادة جلب التقييمات
      const ratingsQuery = query(
        collection(db, 'ratings'),
        where('articleId', '==', contentId)
      );
      const snapshot = await getDocs(ratingsQuery);
      const ratingsData: Rating[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        ratingsData.push({
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          rating: data.rating,
          comment: data.comment,
          createdAt: data.createdAt
        });
      });

      setRatings(ratingsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      
      // إعادة تعيين النموذج
      setUserRating(0);
      setUserComment('');
      setShowRatingForm(false);
    } catch (error) {
      console.error('خطأ في إرسال التقييم:', error);
    } finally {
      setSubmittingRating(false);
    }
  };

  // حساب متوسط التقييم
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0;

  // العودة للصفحة السابقة
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">المحتوى غير موجود</h2>
          <button
            onClick={() => navigate('/content')}
            className="text-emerald-500 hover:text-emerald-600"
          >
            العودة لصفحة المحتوى
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
        <span className="text-sm font-medium">العودة</span>
      </motion.button>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* صورة المقال */}
          <div className="relative h-80 md:h-96 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl overflow-hidden mb-8 shadow-2xl">
            {content.imageUrl ? (
              <img
                src={content.imageUrl}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600">
                <BookOpen className="w-20 h-20 text-white/80" />
              </div>
            )}
            
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
              <span className="bg-emerald-500/95 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                {content.category}
              </span>
            </div>
            
            {/* معلومات المقال على الصورة */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm opacity-90 mb-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="w-4 h-4" />
                  <span>{content.author}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(content.publishedAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{averageRating.toFixed(1)} ({ratings.length} تقييم)</span>
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
              {content.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              {content.excerpt}
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
                {content.content}
              </div>
            </div>
          </motion.div>

          {/* قسم التقييم */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                تقييمات القراء
              </h2>
              <div className="flex items-center space-x-3 rtl:space-x-reverse bg-gray-50 dark:bg-gray-700 px-6 py-3 rounded-2xl">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  ({ratings.length} تقييم)
                </span>
              </div>
            </div>

            {/* نموذج إضافة تقييم */}
            {auth.currentUser && !showRatingForm && (
              <motion.button
                onClick={() => setShowRatingForm(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mb-8 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
              >
                <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                  <Star className="w-6 h-6" />
                  <span className="text-lg font-medium">أضف تقييمك للمقال</span>
                </div>
              </motion.button>
            )}

            {showRatingForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-800"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  تقييمك للمقال
                </h3>
                
                {/* النجوم */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      onClick={() => setUserRating(star)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-3xl transition-all duration-200"
                    >
                      <Star 
                        className={`w-10 h-10 ${
                          star <= userRating 
                            ? 'text-yellow-500 fill-current drop-shadow-lg' 
                            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                        }`} 
                      />
                    </motion.button>
                  ))}
                </div>

                {/* التعليق */}
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="اكتب تعليقك على المقال (اختياري)..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                />

                <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse mt-6">
                  <motion.button
                    onClick={() => {
                      setShowRatingForm(false);
                      setUserRating(0);
                      setUserComment('');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 font-medium"
                  >
                    إلغاء
                  </motion.button>
                  
                  <motion.button
                    onClick={submitRating}
                    disabled={userRating === 0 || submittingRating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
                  >
                    {submittingRating ? (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>إرسال...</span>
                      </div>
                    ) : (
                      'إرسال التقييم'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* قائمة التقييمات */}
            {ratings.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  لا توجد تقييمات بعد. كن أول من يقيم هذا المقال!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {ratings.map((rating) => (
                  <motion.div
                    key={rating.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">
                            {rating.userName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(rating.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse bg-white dark:bg-gray-800 px-3 py-2 rounded-xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= rating.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rating.comment && (
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                          {rating.comment}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContentDetailPage;
