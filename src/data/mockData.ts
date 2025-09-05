import type { Article, TeamMember } from '../types';

export const articles: Article[] = [];

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: {
      ar: 'د. محمد السيد',
      en: 'Dr. Mohamed El-Sayed'
    },
    position: {
      ar: 'مدير الأكاديمية - أستاذ الطب البيطري',
      en: 'Academy Director - Professor of Veterinary Medicine'
    },
    image: '/images/1.jpg',
    bio: {
      ar: 'خبرة 20 عاماً في الطب البيطري والبحث العلمي، حاصل على دكتوراه في الجراحة البيطرية',
      en: '20 years of experience in veterinary medicine and scientific research, PhD in Veterinary Surgery'
    }
  },
  {
    id: '2',
    name: {
      ar: 'د. أحمد محمود',
      en: 'Dr. Ahmed Mahmoud'
    },
    position: {
      ar: 'نائب المدير للشؤون الأكاديمية',
      en: 'Vice Director for Academic Affairs'
    },
    image: '/images/2.jpg',
    bio: {
      ar: 'أستاذ مساعد في العلوم الزراعية، متخصص في التقنيات الزراعية الحديثة',
      en: 'Associate Professor in Agricultural Sciences, specialist in modern agricultural technologies'
    }
  },
];