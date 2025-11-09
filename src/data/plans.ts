import { Plan } from '../types/plan';

export const plans: Plan[] = [
  {
    id: '733',
    slug: '733',
    title: 'LIC Jeevan Lakshya',
    titleGujarati: 'જીવન લક્ષ્ય પ્લાન',
    subtitle: 'પ્લાન (733)',
    shortDescription: 'Long-term life insurance plan focused on savings & maturity benefits for your child\'s future.',
    features: [
      '100% સમ એશ્યોર્ડ + બોનસ',
      'બાળકોના ભવિષ્ય માટે બચત',
      'ટેક્સ બેનિફિટ્સ u/s 80C',
      'લવચીક પ્રીમિયમ ભરપાઈ',
    ],
    assets: {
      coin: '/images/plans/jeevnalakshya/jeevan-lakshya.png',
      path: '/images/plans/jeevnalakshya/path.png',
      figures: '/images/plans/jeevnalakshya/dad&daughter.png',
      girl: [
        '/images/plans/jeevnalakshya/girl.png',
        '/images/plans/jeevnalakshya/dad&daughter.png',
      ],
      maturityPill: '/images/plans/jeevnalakshya/maturity.png',
      deathPill: '/images/plans/jeevnalakshya/death.png',
      thenPill: '/images/plans/jeevnalakshya/10sa.png',
      career: '/images/plans/jeevnalakshya/career.png',
      goals: '/images/plans/jeevnalakshya/goals.png',
      marriage: '/images/plans/jeevnalakshya/marriage.png',
      study: '/images/plans/jeevnalakshya/study.png',
      background: '/images/plans/jeevnalakshya/backgrond.png',
    },
    priceStarting: 5000,
    badge: 'લોકપ્રિય',
    category: 'child',
    meta: {
      title: 'LIC Jeevan Lakshya Plan 733 | Child Insurance Plan',
      description: 'Secure your child\'s future with LIC Jeevan Lakshya Plan 733. Get guaranteed returns, flexible premiums, and maturity benefits.',
    },
  },
  // Add more plans here following the same structure
  // Example placeholders for future plans:
  // {
  //   id: '945',
  //   slug: '945',
  //   title: 'LIC Jeevan Umang',
  //   titleGujarati: 'જીવન ઉમંગ',
  //   subtitle: 'પ્લાન (945)',
  //   shortDescription: 'Whole life policy with income benefits',
  //   features: [
  //     'Lifetime coverage',
  //     'Regular income after premium payment',
  //     'Maturity benefit',
  //   ],
  //   assets: {
  //     coin: '/images/plans/jeevan-umang/coin.png',
  //     path: '/images/plans/jeevan-umang/path.png',
  //     // ... other assets
  //   },
  //   priceStarting: 8000,
  //   badge: 'નવું',
  //   category: 'endowment',
  //   meta: {
  //     title: 'LIC Jeevan Umang Plan 945 | Whole Life Insurance',
  //     description: 'Get lifetime coverage with regular income...',
  //   },
  // },
];

export function getPlanById(id: string): Plan | undefined {
  return plans.find(p => p.id === id || p.slug === id);
}

export function getPlansByCategory(category: string): Plan[] {
  return plans.filter(p => p.category === category);
}
