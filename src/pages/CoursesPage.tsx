import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Newsletter from '../components/UI/Newsletter';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Course } from '../types';

const CoursesPage: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const lang = currentLanguage.code;
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'veterinary':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'agriculture':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'science':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('courses.title')}
          </h1>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            {t('courses.description')}
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4">
            <h2 className="text-2xl font-bold mb-2">
              {t('courses.comingSoon')}
            </h2>
            <p className="text-green-100">
              {lang === 'ar' ? 
                'نعمل بجد لإطلاق المنصة التعليمية قريباً' :
                'We are working hard to launch the learning platform soon'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Courses Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {lang === 'ar' ? 'الكورسات القادمة' : 'Upcoming Courses'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {lang === 'ar' ? 
                'تعرف على الكورسات التي سنطلقها قريباً في مختلف التخصصات' :
                'Get to know the courses we will launch soon in various specializations'
              }
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">جاري تحميل الكورسات...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title[lang]}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                        {t(`category.${course.category}`)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-white text-sm font-medium">
                        {lang === 'ar' ? 'قريباً' : 'Coming Soon'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {course.title[lang]}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {course.description[lang]}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration} {lang === 'ar' ? 'أسبوع' : 'weeks'}</span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons} {lang === 'ar' ? 'درس' : 'lessons'}</span>
                      </div>
                    </div>

                    <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-3 px-4 rounded-lg font-medium cursor-not-allowed">
                      {lang === 'ar' ? 'سيتم الإعلان عن التسجيل قريباً' : 'Registration opens soon'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {lang === 'ar' ? 'ما يميز كورساتنا' : 'What Makes Our Courses Special'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: lang === 'ar' ? 'خبراء متخصصون' : 'Expert Instructors',
                description: lang === 'ar' ? 'تعلم من أفضل الخبراء في المجال' : 'Learn from the best experts in the field'
              },
              {
                icon: BookOpen,
                title: lang === 'ar' ? 'محتوى تفاعلي' : 'Interactive Content',
                description: lang === 'ar' ? 'تجربة تعليمية تفاعلية وممتعة' : 'Interactive and engaging learning experience'
              },
              {
                icon: Star,
                title: lang === 'ar' ? 'شهادات معتمدة' : 'Certified Certificates',
                description: lang === 'ar' ? 'احصل على شهادة معتمدة عند الإنجاز' : 'Get certified upon completion'
              },
              {
                icon: Clock,
                title: lang === 'ar' ? 'تعلم بوتيرتك' : 'Learn at Your Pace',
                description: lang === 'ar' ? 'تعلم في الوقت المناسب لك' : 'Learn at your convenient time'
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <IconComponent className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default CoursesPage;