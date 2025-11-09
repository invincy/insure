export interface Plan {
  id: string;
  slug: string;
  title: string;
  titleGujarati: string;
  subtitle: string;
  shortDescription: string;
  features: string[];
  assets: PlanAssets;
  priceStarting: number;
  badge?: string;
  category: PlanCategory;
  meta: {
    title: string;
    description: string;
  };
}

export interface PlanAssets {
  coin: string;
  path: string;
  figures: string;
  girl: string[];
  maturityPill: string;
  deathPill: string;
  thenPill: string;
  career: string;
  goals: string;
  marriage: string;
  study: string;
  background: string;
}

export type PlanCategory = 'child' | 'term' | 'endowment' | 'ulip' | 'annuity';

export const PLAN_CATEGORIES: Record<PlanCategory, { id: PlanCategory; name: string; icon: string; color: string }> = {
  child: { id: 'child', name: 'Child પ્લાન', icon: '👶', color: 'bg-orange-500' },
  term: { id: 'term', name: 'ટર્મ પ્લાન', icon: '🛡️', color: 'bg-blue-500' },
  endowment: { id: 'endowment', name: 'એન્ડોમેન્ટ', icon: '🏦', color: 'bg-purple-500' },
  ulip: { id: 'ulip', name: 'યુલિપ', icon: '📈', color: 'bg-green-500' },
  annuity: { id: 'annuity', name: 'પેન્શન', icon: '👴', color: 'bg-indigo-500' },
};
