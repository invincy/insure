"use client";

import { useEffect, useState } from 'react';
import type { PlanSelection } from '../../../../types/planContext';
import { formatCurrency } from '../../../../utils/bonus';
import { estimateMaturity as estimateMaturityLib } from '../../../../lib/bonus';

export default function WhatIfPage() {
  const [selection, setSelection] = useState<PlanSelection | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('planSelection');
      if (raw) {
        const parsed = JSON.parse(raw);

        // Normalize payloads emitted by PlanContext/demo.
        // Support both the internal PlanSelection shape and the public payload shape
        // requested by product: { planId, goalId, age, term, ppt, sumAssured, annualPremium, totalPaid, estMaturity, bonusAssumptionNote }
        if (parsed && parsed.age && parsed.term) {
          const normalized: any = {
            age: parsed.age,
            term: parsed.term,
            ppt: parsed.ppt ?? (parsed.term ? parsed.term - 3 : undefined),
            sumAssured: parsed.sumAssured ?? parsed.sumAssured,
            annualPremium: parsed.annualPremium ?? parsed.annualPremium,
            totalPremiumPaid: parsed.totalPremiumPaid ?? parsed.totalPaid,
            // allow either a detailed object or a numeric estimated maturity
            estimatedMaturity: parsed.estimatedMaturity ?? parsed.estMaturity ?? parsed.estMaturity,
          };

          // If the emitter passed a numeric maturity, convert it to the detailed shape
          if (typeof normalized.estimatedMaturity === 'number') {
            try {
              if (normalized.sumAssured && normalized.term) {
                normalized.estimatedMaturity = estimateMaturityLib(normalized.sumAssured, normalized.term);
              } else {
                normalized.estimatedMaturity = {
                  basicSumAssured: normalized.sumAssured ?? 0,
                  simpleReversionaryBonus: 0,
                  finalAdditionalBonus: 0,
                  totalMaturity: normalized.estimatedMaturity ?? 0,
                };
              }
            } catch (e) {
              normalized.estimatedMaturity = {
                basicSumAssured: normalized.sumAssured ?? 0,
                simpleReversionaryBonus: 0,
                finalAdditionalBonus: 0,
                totalMaturity: normalized.estimatedMaturity ?? 0,
              };
            }
          }

          setSelection(normalized as any);
        } else {
          const rawParsed = JSON.parse(raw);
          // If a minimal payload was stored (e.g. only goal), just set it and let the UI show a friendly message.
          if (rawParsed && typeof rawParsed.estimatedMaturity === 'number' && rawParsed.sumAssured && rawParsed.term) {
            try {
              rawParsed.estimatedMaturity = estimateMaturityLib(rawParsed.sumAssured, rawParsed.term);
            } catch (e) {
              rawParsed.estimatedMaturity = {
                basicSumAssured: rawParsed.sumAssured ?? 0,
                simpleReversionaryBonus: 0,
                finalAdditionalBonus: 0,
                totalMaturity: rawParsed.estimatedMaturity ?? 0,
              };
            }
          }

          setSelection(rawParsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  if (!selection) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">No selection found</h2>
          <p className="text-sm text-gray-600">Please go back and pick an example from the plan context.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">What-If – Selection Payload</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Stat label="Age" value={`${selection.age} years`} />
          <Stat label="Term" value={`${selection.term} years`} />
          <Stat label="PPT" value={`${selection.ppt} years`} />
          <Stat label="Sum Assured" value={formatCurrency(selection.sumAssured)} />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Premiums</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-gray-600">Annual Premium</div>
            <div className="font-bold">{formatCurrency(selection.annualPremium)}</div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="text-sm text-gray-600">Total Paid (Annual × PPT)</div>
            <div className="font-bold">{formatCurrency(selection.totalPremiumPaid)}</div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Estimated Maturity</h3>
          <div className="mt-2 grid grid-cols-1 gap-2">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Basic Sum Assured</span>
              <span>{formatCurrency(selection.estimatedMaturity.basicSumAssured)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Simple Reversionary Bonus</span>
              <span>{formatCurrency(selection.estimatedMaturity.simpleReversionaryBonus)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Final Additional Bonus</span>
              <span>{formatCurrency(selection.estimatedMaturity.finalAdditionalBonus)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total (Illustrative)</span>
              <span>{formatCurrency(selection.estimatedMaturity.totalMaturity)}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => history.back()}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            ← Back
          </button>
          <button
            onClick={() => alert('What-If calculator to be implemented')}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            aria-label="Proceed to What-If calculator"
          >
            Proceed to Calculator
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-base font-semibold mt-1">{value}</div>
    </div>
  );
}
