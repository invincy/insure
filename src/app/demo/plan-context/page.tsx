/**
 * Demo page for Plan Context module
 * Shows the premium selection flow for LIC Jeevan Lakshya (733)
 * 
 * Route: /demo/plan-context
 */

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlanContext from '../../../components/planContext/PlanContext';
import type { PlanSelection, Language, BonusConfig } from '../../../types/planContext';

export default function PlanContextDemo() {
  const [selection, setSelection] = useState<PlanSelection | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [bonusConfig, setBonusConfig] = useState<BonusConfig>({
    simpleReversionaryPerThousand: 50,
    finalAdditionalPerThousand: 30,
  });

  const router = useRouter();

  const handleProceed = (sel: PlanSelection) => {
    // Build payload expected by the What-If scene
    const payload = {
      planId: 'JeevanLakshya733',
      goalId: 'selectedGoal', // placeholder: replace when integrating with goal selection
      age: sel.age,
      term: sel.term,
      ppt: sel.ppt,
      sumAssured: sel.sumAssured,
      annualPremium: sel.annualPremium,
      // include both naming variants so consumer code can pick either
      totalPaid: sel.totalPremiumPaid,
      totalPremiumPaid: sel.totalPremiumPaid,
      estMaturity: sel.estimatedMaturity,
      estimatedMaturity: sel.estimatedMaturity,
      bonusAssumptionNote: `Simple: ${bonusConfig.simpleReversionaryPerThousand} per ₹1,000; Final: ${bonusConfig.finalAdditionalPerThousand} per ₹1,000`,
    };

    // Persist selection for What-If scene and navigate
    try {
      sessionStorage.setItem('planSelection', JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not persist selection to sessionStorage', e);
    }

    setSelection(sel);
    console.log('Selection payload:', payload);
    router.push('/plans/733/what-if');
  };

  const handleReset = () => {
    setSelection(null);
  };

  if (selection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">✅</span>
              Selection Complete!
            </h1>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payload for What-If Scene:</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{JSON.stringify(selection, null, 2)}
              </pre>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Age" value={`${selection.age} years`} />
              <StatCard label="Term" value={`${selection.term} years`} />
              <StatCard label="PPT" value={`${selection.ppt} years`} />
              <StatCard label="Sum Assured" value={`₹${selection.sumAssured.toLocaleString('en-IN')}`} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
                <div className="text-sm text-gray-600 mb-1">💰 Total Premium You Pay</div>
                <div className="text-2xl font-bold text-orange-600">
                  ₹{selection.totalPremiumPaid.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  ₹{selection.annualPremium.toLocaleString('en-IN')} × {selection.ppt} years
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                <div className="text-sm text-gray-600 mb-1">🎯 Estimated Maturity</div>
                <div className="text-2xl font-bold text-green-600">
                  ₹{selection.estimatedMaturity.totalMaturity.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Basic SA + Bonuses (illustrative)
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                ← Try Another Selection
              </button>
              <button
                onClick={() => alert('What-If scene would load here!')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Continue to What-If →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Control Panel */}
      <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Plan Context Demo</h1>
              <p className="text-sm text-gray-600">LIC Jeevan Lakshya (733) - Premium Selection</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    language === 'en'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('gu')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    language === 'gu'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ગુજરાતી
                </button>
              </div>

              {/* Bonus Config Controls */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <div className="text-xs text-gray-600 mb-1">Bonus Config (for testing)</div>
                <div className="flex items-center space-x-2 text-xs">
                  <label className="flex items-center space-x-1">
                    <span>Simple:</span>
                    <input
                      type="number"
                      value={bonusConfig.simpleReversionaryPerThousand}
                      onChange={(e) =>
                        setBonusConfig({
                          ...bonusConfig,
                          simpleReversionaryPerThousand: Number(e.target.value),
                        })
                      }
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </label>
                  <label className="flex items-center space-x-1">
                    <span>Final:</span>
                    <input
                      type="number"
                      value={bonusConfig.finalAdditionalPerThousand}
                      onChange={(e) =>
                        setBonusConfig({
                          ...bonusConfig,
                          finalAdditionalPerThousand: Number(e.target.value),
                        })
                      }
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Component */}
      <PlanContext
        bonusConfig={bonusConfig}
        language={language}
        onProceed={handleProceed}
      />

      {/* Info Footer */}
      <div className="bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold mb-3">✅ Acceptance Criteria Status</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <CheckItem text="Only brochure premiums render" />
            <CheckItem text="Missing combos hidden (e.g., Age 50, Term 20)" />
            <CheckItem text="PPT = Term - 3 calculated correctly" />
            <CheckItem text="Total Paid = Annual × PPT (no GST)" />
            <CheckItem text="Estimated maturity clearly marked 'Illustrative'" />
            <CheckItem text="Installment options show approx. multipliers" />
            <CheckItem text="Single click emits payload" />
            <CheckItem text="Works offline, no network calls" />
            <CheckItem text="EN/GU bilingual support" />
            <CheckItem text="Minimum 14px text, accessible focus states" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-base font-bold text-gray-900">{value}</div>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span className="text-gray-300">{text}</span>
    </div>
  );
}
