import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Tag,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Clock
} from 'lucide-react';
import { auth } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Course } from '../types';

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

interface DashboardStats {
  totalCourses: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalUsers: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalUsers: 0
  });

  // نموذج إضافة/تعديل المحتوى
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    imageUrl: '',
    status: 'draft' as 'draft' | 'published'
  });

  const [courseFormData, setCourseFormData] = useState({
    title: { ar: '', en: '' },
    description: { ar: '', en: '' },
    category: '',
    image: '',
    duration: '',
    lessons: '',
    youtubePlaylistUrl: ''
  });

  const [saving, setSaving] = useState(false);
  const [deletingArticle, setDeletingArticle] = useState<string | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);

  // التحقق من صلاحيات المدير
  useEffect(() => {
    const checkAdminAccess = async () => {
      const user = auth.currentUser;
      if (!user || user.email !== 'mahmoud@gmail.com') {
        navigate('/');
        return;
      }
      await fetchArticles();
      await fetchCourses();
      await fetchStats();
    };

    checkAdminAccess();
  }, [navigate]);

  // جلب الدورات
  const fetchCourses = async () => {
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(coursesQuery);
      const coursesData: Course[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setCourses(coursesData);
    } catch (error) {
      console.error('خطأ في جلب الدورات:', error);
    } finally {
      setLoading(false);
    }
  };

  // جلب المقالات
  const fetchArticles = async () => {
    try {
      const articlesQuery = query(
        collection(db, 'articles'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(articlesQuery);
      const articlesData: Article[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        articlesData.push({
          id: doc.id,
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
      });

      setArticles(articlesData);
    } catch (error) {
      console.error('خطأ في جلب المحتوى:', error);
    } finally {
      setLoading(false);
    }
  };

  // جلب إحصائيات لوحة التحكم
  const fetchStats = async () => {
    try {
      const articlesQuery = query(collection(db, 'articles'));
      const articlesSnapshot = await getDocs(articlesQuery);
      
      const coursesQuery = query(collection(db, 'courses'));
      const coursesSnapshot = await getDocs(coursesQuery);

      const usersQuery = query(collection(db, 'students'));
      const usersSnapshot = await getDocs(usersQuery);

      let publishedCount = 0;
      let draftCount = 0;

      articlesSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'published') {
          publishedCount++;
        } else {
          draftCount++;
        }
      });

      setStats({
        totalCourses: coursesSnapshot.size,
        totalArticles: articlesSnapshot.size,
        publishedArticles: publishedCount,
        draftArticles: draftCount,
        totalUsers: usersSnapshot.size
      });
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    }
  };

  // إضافة محتوى جديد
  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      const articleData = {
        ...formData,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'articles'), articleData);
      
      // إعادة تعيين النموذج
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: '',
        imageUrl: '',
        status: 'draft'
      });
      
      setShowAddForm(false);
      await fetchArticles();
      await fetchStats();
    } catch (error) {
      console.error('خطأ في إضافة المحتوى:', error);
    } finally {
      setSaving(false);
    }
  };

  // تحديث محتوى
  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        publishedAt: formData.status === 'published' && editingArticle.status === 'draft' 
          ? new Date().toISOString() 
          : editingArticle.publishedAt,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'articles', editingArticle.id), updateData);
      
      setEditingArticle(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: '',
        imageUrl: '',
        status: 'draft'
      });
      
      await fetchArticles();
      await fetchStats();
    } catch (error) {
      console.error('خطأ في تحديث المحتوى:', error);
    } finally {
      setSaving(false);
    }
  };

  // حذف محتوى
  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return;

    setDeletingArticle(articleId);
    try {
      await deleteDoc(doc(db, 'articles', articleId));
      await fetchArticles();
      await fetchStats();
    } catch (error) {
      console.error('خطأ في حذف المحتوى:', error);
    } finally {
      setDeletingArticle(null);
    }
  };

  // إضافة دورة جديدة
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      const courseData = {
        ...courseFormData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'courses'), courseData);

      setCourseFormData({
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        category: '',
        image: '',
        duration: '',
        lessons: '',
        youtubePlaylistUrl: ''
      });

      setShowAddCourseForm(false);
      await fetchCourses();
      await fetchStats();
    } catch (error) {
      console.error('خطأ في إضافة الدورة:', error);
    } finally {
      setSaving(false);
    }
  };

  // تحديث دورة
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setSaving(true);
    try {
      const updateData = {
        ...courseFormData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'courses', editingCourse.id), updateData);

      setEditingCourse(null);
      setCourseFormData({
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        category: '',
        image: '',
        duration: '',
        lessons: '',
        youtubePlaylistUrl: ''
      });

      await fetchCourses();
    } catch (error) {
      console.error('خطأ في تحديث الدورة:', error);
    } finally {
      setSaving(false);
    }
  };

  // حذف دورة
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدورة؟')) return;

    setDeletingCourse(courseId);
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      await fetchCourses();
      await fetchStats();
    } catch (error) {
      console.error('خطأ في حذف الدورة:', error);
    } finally {
      setDeletingCourse(null);
    }
  };

  // تحرير دورة
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      image: course.image,
      duration: course.duration,
      lessons: course.lessons,
      youtubePlaylistUrl: course.youtubePlaylistUrl || ''
    });
  };

  // إلغاء تحرير الدورة
  const handleCancelEditCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      title: { ar: '', en: '' },
      description: { ar: '', en: '' },
      category: '',
      image: '',
      duration: '',
      lessons: '',
      youtubePlaylistUrl: ''
    });
  };

  // تحرير محتوى
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      imageUrl: article.imageUrl,
      status: article.status
    });
  };

  // إلغاء التحرير
  const handleCancelEdit = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      imageUrl: '',
      status: 'draft'
    });
  };

  // إنشاء محتوى تجريبي
  const createSampleArticles = async () => {
    const sampleArticles = [
      {
        title: 'التغذية السريرية للحيوانات الأليفة',
        excerpt: 'مقدمة في أساسيات التغذية للقطط والكلاب، وكيفية تأثيرها على صحتهم العامة والوقاية من الأمراض.',
        content: 'تعتبر التغذية السليمة حجر الزاوية في صحة الحيوانات الأليفة. هذا المحتوى يغطي المكونات الغذائية الأساسية، وكيفية قراءة ملصقات طعام الحيوانات، والاحتياجات الغذائية الخاصة بمراحل الحياة المختلفة والأمراض الشائعة.',
        category: 'طب بيطري',
        author: 'فريق Isav Academy',
        imageUrl: 'https://images.unsplash.com/photo-1589928220674-ab74a5d2265d?w=800',
        status: 'published' as 'draft' | 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'صحة التربة وأهميتها في الزراعة العضوية',
        excerpt: 'تعرف على كيفية بناء تربة صحية وغنية بالمغذيات كأساس لنجاح الزراعة العضوية والمستدامة.',
        content: 'التربة هي أكثر من مجرد أوساخ؛ إنها نظام بيئي حي. يستكشف هذا المحتوى أهمية المواد العضوية، ودورة المغذيات، والكائنات الحية الدقيقة في التربة، ويقدم نصائح عملية لتحسين صحة التربة في مزرعتك أو حديقتك.',
        category: 'زراعة',
        author: 'فريق Isav Academy',
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        status: 'draft' as 'draft' | 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'التطورات الحديثة في العلوم البيولوجية',
        excerpt: 'نظرة شاملة على أحدث الاكتشافات والتطورات في مجال العلوم البيولوجية وتطبيقاتها العملية.',
        content: 'العلوم البيولوجية تشهد تطوراً سريعاً ومذهلاً في السنوات الأخيرة. من التعديل الجيني إلى الطب التجديدي، هذه التطورات تفتح آفاقاً جديدة في فهم الحياة وعلاج الأمراض. تشمل المجالات الناشئة البيولوجيا التركيبية والطب الشخصي.',
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
      console.log('تم إنشاء المحتوى التجريبي بنجاح');
      await fetchArticles();
      await fetchStats();
    } catch (error) {
      console.error('خطأ في إنشاء المحتوى التجريبي:', error);
    }
  };

  // إنشاء دورة تجريبية
  const createSampleCourse = async () => {
    const sampleCourse = {
      title: { ar: 'مقدمة في علم الأدوية البيطرية', en: 'Introduction to Veterinary Pharmacology' },
      description: {
        ar: 'دورة تأسيسية تشرح أساسيات عمل الأدوية في الحيوانات، بما في ذلك كيفية امتصاصها وتوزيعها والتخلص منها.',
        en: 'A foundational course explaining the basics of how drugs work in animals, including absorption, distribution, and elimination.'
      },
      category: 'طب بيطري',
      image: 'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      duration: '4',
      lessons: '8',
      youtubePlaylistUrl: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'courses'), sampleCourse);
      console.log('تم إنشاء الدورة التجريبية بنجاح');
      await fetchCourses();
      await fetchStats();
    } catch (error) {
      console.error('خطأ في إنشاء الدورة التجريبية:', error);
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
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل لوحة التحكم...</p>
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
          className="max-w-7xl mx-auto"
        >
          
          {/* العنوان */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              لوحة التحكم
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              إدارة محتوى أكاديمية Isav
            </p>
          </motion.div>

          {/* إحصائيات سريعة */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الدورات</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
                </div>
                <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المحتوى</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalArticles}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المحتوى المنشور</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.publishedArticles}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المحتوى المسودة</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.draftArticles}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* أزرار الإجراءات */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <motion.button
              onClick={() => setShowAddCourseForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-rose-500 text-white px-6 py-3 rounded-xl hover:bg-rose-600 transition-colors duration-200 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة دورة جديدة</span>
            </motion.button>

            <motion.button
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition-colors duration-200 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة محتوى جديد</span>
            </motion.button>

            <motion.button
              onClick={createSampleArticles}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-200 shadow-lg"
            >
              <FileText className="w-5 h-5" />
              <span>إنشاء محتوى تجريبي</span>
            </motion.button>
            <motion.button
              onClick={createSampleCourse}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition-colors duration-200 shadow-lg"
            >
              <BookOpen className="w-5 h-5" />
              <span>إنشاء دورة تجريبية</span>
            </motion.button>
          </motion.div>

          {/* قائمة الدورات */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 mb-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                الدورات ({courses.length})
              </h2>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  لا توجد دورات
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  ابدأ بإضافة دورة جديدة لرؤيته هنا
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {course.title.ar}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                          {course.description.ar}
                        </p>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Tag className="w-3 h-3" />
                            <span>{course.category}</span>
                          </span>
                          <span className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Clock className="w-3 h-3" />
                            <span>{course.duration} أسابيع</span>
                          </span>
                           <span className="flex items-center space-x-1 rtl:space-x-reverse">
                            <BookOpen className="w-3 h-3" />
                            <span>{course.lessons} درس</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <motion.button
                          onClick={() => handleEditCourse(course)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          onClick={() => handleDeleteCourse(course.id)}
                          disabled={deletingCourse === course.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          {deletingCourse === course.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* قائمة المقالات */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                المقالات ({articles.length})
              </h2>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  لا يوجد محتوى
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  ابدأ بإضافة محتوى جديد لرؤيته هنا
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {article.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            article.status === 'published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {article.status === 'published' ? 'منشور' : 'مسودة'}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Tag className="w-3 h-3" />
                            <span>{article.category}</span>
                          </span>
                          <span className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(article.createdAt).toLocaleDateString('ar-SA')}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <motion.button
                          onClick={() => handleEditArticle(article)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleDeleteArticle(article.id)}
                          disabled={deletingArticle === article.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          {deletingArticle === article.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* نموذج إضافة/تعديل المحتوى */}
      {(showAddForm || editingArticle) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingArticle ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}
              </h2>
              <button
                onClick={editingArticle ? handleCancelEdit : () => setShowAddForm(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={editingArticle ? handleUpdateArticle : handleAddArticle} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عنوان المقال *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الفئة *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  >
                    <option value="">اختر الفئة</option>
                    <option value="طب بيطري">طب بيطري</option>
                    <option value="زراعة">زراعة</option>
                    <option value="علوم">علوم</option>
                    <option value="تقنية">تقنية</option>
                    <option value="صحة">صحة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ملخص المقال *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  محتوى المقال *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اسم الكاتب *
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رابط الصورة
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  حالة المقال
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse pt-6">
                <motion.button
                  type="button"
                  onClick={editingArticle ? handleCancelEdit : () => setShowAddForm(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  إلغاء
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors duration-200 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>حفظ...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingArticle ? 'تحديث' : 'إضافة'}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* نموذج إضافة/تعديل الكورس */}
      {(showAddCourseForm || editingCourse) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingCourse ? 'تعديل الدورة' : 'إضافة دورة جديدة'}
              </h2>
              <button
                onClick={editingCourse ? handleCancelEditCourse : () => setShowAddCourseForm(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عنوان الكورس (العربية) *
                  </label>
                  <input
                    type="text"
                    value={courseFormData.title.ar}
                    onChange={(e) => setCourseFormData({ ...courseFormData, title: { ...courseFormData.title, ar: e.target.value } })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عنوان الكورس (الإنجليزية) *
                  </label>
                  <input
                    type="text"
                    value={courseFormData.title.en}
                    onChange={(e) => setCourseFormData({ ...courseFormData, title: { ...courseFormData.title, en: e.target.value } })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف الكورس (العربية) *
                </label>
                <textarea
                  value={courseFormData.description.ar}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: { ...courseFormData.description, ar: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف الكورس (الإنجليزية) *
                </label>
                <textarea
                  value={courseFormData.description.en}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: { ...courseFormData.description, en: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الفئة *
                  </label>
                  <input
                    type="text"
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رابط الصورة
                  </label>
                  <input
                    type="url"
                    value={courseFormData.image}
                    onChange={(e) => setCourseFormData({ ...courseFormData, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المدة (بالأسابيع) *
                  </label>
                  <input
                    type="text"
                    value={courseFormData.duration}
                    onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عدد الدروس *
                  </label>
                  <input
                    type="text"
                    value={courseFormData.lessons}
                    onChange={(e) => setCourseFormData({ ...courseFormData, lessons: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رابط قائمة تشغيل يوتيوب
                </label>
                <input
                  type="url"
                  value={courseFormData.youtubePlaylistUrl}
                  onChange={(e) => setCourseFormData({ ...courseFormData, youtubePlaylistUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="https://www.youtube.com/playlist?list=..."
                />
              </div>

              <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse pt-6">
                <motion.button
                  type="button"
                  onClick={editingCourse ? handleCancelEditCourse : () => setShowAddCourseForm(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  إلغاء
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors duration-200 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>حفظ...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingCourse ? 'تحديث' : 'إضافة'}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
