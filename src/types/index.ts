export interface Rating {
  userId: string;
  articleId: string;
  value: number;
  comment?: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  summary: {
    ar: string;
    en: string;
  };
  content: {
    ar: string;
    en: string;
  };
  category: 'veterinary' | 'agriculture' | 'science';
  author: {
    ar: string;
    en: string;
  };
  publishDate: string;
  image: string;
  readTime: number;
  ratings?: Rating[];
  averageRating?: number;
  totalRatings?: number;
}

export interface Course {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  category: string;
  image: string;
  duration: string;
  lessons: string;
  youtubePlaylistUrl?: string;
}

export interface Language {
  code: 'ar' | 'en';
  name: string;
  direction: 'rtl' | 'ltr';
}

export interface TeamMember {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  position: {
    ar: string;
    en: string;
  };
  image: string;
  bio: {
    ar: string;
    en: string;
  };
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}