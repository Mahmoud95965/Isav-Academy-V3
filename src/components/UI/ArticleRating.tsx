import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import type { Rating } from '../../types';

interface ArticleRatingProps {
  articleId: string;
  currentRating?: number;
  totalRatings?: number;
  onRatingSubmit?: (rating: Rating) => void;
}

const ArticleRating: React.FC<ArticleRatingProps> = ({
  articleId,
  currentRating = 0,
  totalRatings = 0,
  onRatingSubmit
}) => {
  const { currentUser } = useAuth();
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage.code;
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState<Rating | null>(null);

  useEffect(() => {
    const checkUserRating = async () => {
      if (!currentUser) return;
      
      const db = getFirestore();
      const articleRef = doc(db, 'articles', articleId);
      const articleDoc = await getDoc(articleRef);
      
      if (articleDoc.exists()) {
        const ratings = articleDoc.data()?.ratings || [];
        const userRating = ratings.find((r: Rating) => r.userId === currentUser.uid);
        if (userRating) {
          setUserRating(userRating);
          setRating(userRating.value);
          setComment(userRating.comment || '');
          setHasRated(true);
        }
      }
    };

    checkUserRating();
  }, [currentUser, articleId]);

  const handleRatingSubmit = async () => {
    if (!currentUser || rating === 0) return;

    setIsSubmitting(true);
    const newRating: Rating = {
      userId: currentUser.uid,
      articleId,
      value: rating,
      comment,
      createdAt: new Date().toISOString()
    };

    try {
      const db = getFirestore();
      const articleRef = doc(db, 'articles', articleId);
      await updateDoc(articleRef, {
        ratings: arrayUnion(newRating)
      });

      setHasRated(true);
      setUserRating(newRating);
      onRatingSubmit?.(newRating);
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          {lang === 'ar' ? 'سجل دخول للتقييم' : 'Sign in to rate'}
        </h3>
        <p className="text-blue-800 dark:text-blue-200">
          {lang === 'ar'
            ? 'يرجى تسجيل الدخول لتتمكن من تقييم هذا المقال'
            : 'Please sign in to rate this article'}
        </p>
      </div>
    );
  }

  if (hasRated && userRating) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
            {lang === 'ar' ? 'شكراً لتقييمك' : 'Thanks for rating!'}
          </h3>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= userRating.value
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        {userRating.comment && (
          <p className="text-green-800 dark:text-green-200 text-sm">
            {userRating.comment}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {lang === 'ar' ? 'قيّم هذا المقال' : 'Rate this article'}
      </h3>
      
      <div className="flex flex-col space-y-4">
        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            lang === 'ar'
              ? 'اكتب تعليقك (اختياري)'
              : 'Write your comment (optional)'
          }
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        {/* Submit Button */}
        <button
          onClick={handleRatingSubmit}
          disabled={isSubmitting || rating === 0}
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
        >
          {isSubmitting
            ? lang === 'ar'
              ? 'جاري الإرسال...'
              : 'Submitting...'
            : lang === 'ar'
            ? 'إرسال التقييم'
            : 'Submit Rating'}
        </button>

        {/* Current Rating Stats */}
        {currentRating > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {lang === 'ar'
                ? `${totalRatings} تقييم`
                : `${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}`}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{currentRating.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleRating;
