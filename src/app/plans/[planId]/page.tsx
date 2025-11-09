import { notFound } from 'next/navigation';
import { plans } from '../../../data/plans';
import Plan733Interactive from '../../../components/plan/Plan733Interactive';
import type { Metadata } from 'next';

// Generate static params for all plans at build time
export async function generateStaticParams() {
  return plans.map(p => ({ planId: p.id }));
}

// Generate metadata per plan
export async function generateMetadata({ params }: { params: { planId: string } }): Promise<Metadata> {
  const plan = plans.find(p => p.id === params.planId);
  if (!plan) return {};
  
  return {
    title: plan.meta.title,
    description: plan.meta.description,
    openGraph: {
      title: plan.meta.title,
      description: plan.meta.description,
      images: [plan.assets.coin],
    },
  };
}

export default function PlanPage({ params }: { params: { planId: string } }) {
  const plan = plans.find(p => p.id === params.planId);
  
  if (!plan) {
    return notFound();
  }

  // For Plan 733, use the existing interactive component
  if (plan.id === '733') {
    return <Plan733Interactive />;
  }

  // For future plans, use a generic plan detail component
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">{plan.title}</h1>
      <p className="text-gray-700 mb-6">{plan.shortDescription}</p>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Features:</h2>
        <ul className="space-y-2">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <p className="text-sm text-gray-600">Starting from</p>
          <p className="text-2xl font-bold text-blue-600">₹{plan.priceStarting}+</p>
        </div>
      </div>
    </div>
  );
}
