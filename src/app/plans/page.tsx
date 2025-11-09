'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { plans } from '../../data/plans';
import { PLAN_CATEGORIES, type PlanCategory } from '../../types/plan';

const PlansPage = () => {
  const [activeCategory, setActiveCategory] = useState<PlanCategory>('child');

  const categories = Object.values(PLAN_CATEGORIES);
  const filteredPlans = plans.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">વીમા યોજનાઓ</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">કુલ યોજના</span>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
              {plans.length}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const count = plans.filter(p => p.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? category.color.replace('bg-', 'bg-') + ' text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">{category.icon}</span>
                  <span>{category.name}</span>
                  {count > 0 && <span className="ml-1 text-xs opacity-75">({count})</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 py-6">
        {filteredPlans.length > 0 ? (
          <div className="space-y-4">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {plan.assets.coin ? (
                          <Image
                            src={plan.assets.coin}
                            alt={plan.title}
                            width={128}
                            height={128}
                            className="w-32 h-32 object-contain"
                            quality={90}
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <div className="text-white font-bold text-sm text-center leading-tight">
                              {plan.title.split(' ').slice(0, 2).join('\n')}
                            </div>
                          </div>
                        )}
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-xs">💰</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{plan.titleGujarati}</h3>
                        <p className="text-blue-600 font-medium text-sm">{plan.subtitle}</p>
                      </div>
                    </div>
                    {plan.badge && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/plans/${plan.id}`}>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                      <span>પ્લાન જુઓ</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Coming Soon State */
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {categories.find(c => c.id === activeCategory)?.name} યોજનાઓ ટૂંક સમયમાં
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              આ કેટેગરીમાં નવી યોજનાઓ ઉમેરવામાં આવશે.
            </p>
            <button className="bg-blue-50 text-blue-600 px-6 py-2 rounded-lg font-medium text-sm">
              મને જાણ કરો
            </button>
          </div>
        )}
      </div>

      {/* Bottom Help Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-600">મદદ જોઈએ?</div>
            <div className="font-semibold text-gray-900 text-sm">નિષ્ણાત સાથે વાત કરો</div>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1">
              <span>📞</span>
              <span>કૉલ કરો</span>
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1">
              <span>💬</span>
              <span>ચેટ કરો</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlansPage;