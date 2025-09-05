import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  ChevronDown,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

interface UserMenuProps {
  user: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  };
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // تسجيل الخروج
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  };

  // الانتقال للملف الشخصي
  const handleProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  // الانتقال للوحة التحكم (للمدير فقط)
  const handleDashboard = () => {
    navigate('/dashboard');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* زر المستخدم */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rtl:space-x-reverse bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="صورة المستخدم" 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="text-sm font-medium hidden md:block">
          {user.displayName || user.email?.split('@')[0] || 'المستخدم'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* القائمة المنسدلة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* معلومات المستخدم */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.displayName || 'المستخدم'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>

                         {/* خيارات القائمة */}
             <div className="py-2">
               <motion.button
                 onClick={handleProfile}
                 className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200"
                 whileHover={{ x: 5 }}
                 transition={{ duration: 0.2 }}
               >
                 <User className="w-4 h-4" />
                 <span>الملف الشخصي</span>
               </motion.button>

               {/* لوحة التحكم للمدير فقط */}
               {user.email === 'mahmoud@gmail.com' && (
                 <motion.button
                   onClick={handleDashboard}
                   className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                   whileHover={{ x: 5 }}
                   transition={{ duration: 0.2 }}
                 >
                   <LayoutDashboard className="w-4 h-4" />
                   <span>لوحة التحكم</span>
                 </motion.button>
               )}

               <motion.button
                 onClick={handleSignOut}
                 className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                 whileHover={{ x: 5 }}
                 transition={{ duration: 0.2 }}
               >
                 <LogOut className="w-4 h-4" />
                 <span>تسجيل الخروج</span>
               </motion.button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
