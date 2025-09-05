import type { Article, TeamMember } from '../types';

export const articles: Article[] = [];

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: {
      ar: 'م.محمد طه',
      en: 'Eng.mohammed Taha'
    },
    position: {
      ar: 'مدير الأكاديمية',
      en: 'Academy Director'
    },
    image: '/images/1.jpg',
    bio: {
      ar: '.',
      en: '.'
    }
  },
  {
    id: '2',
    name: {
      ar: 'م.مؤمن سيد',
      en: 'Eng.Mohammed taha'
    },
    position: {
      ar: 'نائب المدير للشؤون الأكاديمية',
      en: 'Vice Director for Academic Affairs'
    },
    image: '/images/2.jpg',
    bio: {
      ar: '.',
      en: '.'
    }
  },
];
