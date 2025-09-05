import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Edit,
  Save,
  X,
  Heart,
  Trash2,
  BookOpen,
  Eye
} from 'lucide-react';
import { auth } from '../config/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  address: string;
  educationLevel: string;
  createdAt: string;
  status: string;
  provider: string;
}

interface FavoriteArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  addedAt: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favoriteArticles, setFavoriteArticles] = useState<FavoriteArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [removingArticle, setRemovingArticle] = useState<string | null>(null);

  // جلب بيانات الملف الشخصي والمقالات المفضلة
  useEffect(() => {
    const fetchProfileAndFavorites = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // جلب بيانات الملف الشخصي
        const userDoc = await getDoc(doc(db, 'students', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setProfile(data);
          setEditedProfile(data);
        }

        // جلب المقالات المفضلة
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid)
        );
        const favoritesSnapshot = await getDocs(favoritesQuery);
        const favorites: FavoriteArticle[] = [];
        
        favoritesSnapshot.forEach((doc) => {
          const data = doc.data();
          favorites.push({
            id: doc.id,
            title: data.title,
            excerpt: data.excerpt,
            category: data.category,
            author: data.author,
            publishedAt: data.publishedAt,
            imageUrl: data.imageUrl,
            addedAt: data.addedAt
          });
        });

        setFavoriteArticles(favorites);
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndFavorites();
  }, [navigate]);

  // حفظ التعديلات
  const handleSave = async () => {
    if (!editedProfile || !auth.currentUser) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'students', auth.currentUser.uid), {
        fullName: editedProfile.fullName,
        phone: editedProfile.phone,
        nationalId: editedProfile.nationalId,
        dateOfBirth: editedProfile.dateOfBirth,
        address: editedProfile.address,
        educationLevel: editedProfile.educationLevel,
      });

      setProfile(editedProfile);
      setEditing(false);
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
    } finally {
      setSaving(false);
    }
  };

  // إلغاء التعديل
  const handleCancel = () => {
    setEditedProfile(profile);
    setEditing(false);
  };

  // إزالة مقال من المفضلة
  const handleRemoveFavorite = async (articleId: string) => {
    if (!auth.currentUser) return;

    setRemovingArticle(articleId);
    try {
      // البحث عن المقال في المفضلة
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', auth.currentUser.uid),
        where('articleId', '==', articleId)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);
      
      // حذف المقال من المفضلة
      favoritesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // تحديث القائمة المحلية
      setFavoriteArticles(prev => prev.filter(article => article.id !== articleId));
    } catch (error) {
      console.error('خطأ في إزالة المقال من المفضلة:', error);
    } finally {
      setRemovingArticle(null);
    }
  };

  // العودة للصفحة الرئيسية
  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">لم يتم العثور على البيانات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* زر العودة */}
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
          
          {/* العنوان */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              الملف الشخصي
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              معلومات حسابك الشخصي
            </p>
          </motion.div>

          {/* بطاقة الملف الشخصي */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
          >
            {/* رأس البطاقة */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.fullName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {profile.email}
                  </p>
                </div>
              </div>
              
              {!editing ? (
                <motion.button
                  onClick={() => setEditing(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>تعديل</span>
                </motion.button>
              ) : (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 rtl:space-x-reverse bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'حفظ...' : 'حفظ'}</span>
                  </motion.button>
                  <motion.button
                    onClick={handleCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>إلغاء</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* معلومات الملف الشخصي */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* العمود الأول */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم الكامل
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editedProfile?.fullName || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, fullName: e.target.value} : null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.fullName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{profile.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم الهاتف
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={editedProfile?.phone || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.phone || 'غير محدد'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الرقم القومي
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editedProfile?.nationalId || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, nationalId: e.target.value} : null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.nationalId || 'غير محدد'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* العمود الثاني */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاريخ الميلاد
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={editedProfile?.dateOfBirth || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, dateOfBirth: e.target.value} : null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.dateOfBirth || 'غير محدد'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العنوان
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editedProfile?.address || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, address: e.target.value} : null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.address || 'غير محدد'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المستوى التعليمي
                  </label>
                  {editing ? (
                    <select
                      value={editedProfile?.educationLevel || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, educationLevel: e.target.value} : null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    >
                      <option value="">اختر المستوى التعليمي</option>
                      <option value="ثانوية عامة">ثانوية عامة</option>
                      <option value="دبلوم">دبلوم</option>
                      <option value="بكالوريوس">بكالوريوس</option>
                      <option value="ماجستير">ماجستير</option>
                      <option value="دكتوراه">دكتوراه</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.educationLevel || 'غير محدد'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاريخ إنشاء الحساب
                  </label>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {new Date(profile.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* قسم المقالات المفضلة */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 mt-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    المقالات المفضلة
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {favoriteArticles.length} مقال محفوظ
                  </p>
                </div>
              </div>
            </div>

            {favoriteArticles.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  لا توجد مقالات مفضلة
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  ابدأ بإضافة مقالات إلى قائمة المفضلة لرؤيتها هنا
                </p>
                <motion.button
                  onClick={() => navigate('/articles')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 inline-flex items-center space-x-2 rtl:space-x-reverse bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition-colors duration-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>تصفح المقالات</span>
                </motion.button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* صورة المقال */}
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
                      
                      {/* زر الإزالة */}
                      <motion.button
                        onClick={() => handleRemoveFavorite(article.id)}
                        disabled={removingArticle === article.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-3 left-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        {removingArticle === article.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </motion.button>

                      {/* الفئة */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* محتوى المقال */}
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{article.author}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
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

export default ProfilePage;
