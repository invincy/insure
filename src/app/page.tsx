'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-[100svh] w-full bg-gradient-to-b from-yellow-200 via-yellow-100 to-yellow-50 relative overflow-x-hidden">
      {/* Header Section */}
      <div className="px-4 pt-6 pb-4">
        <div className={`text-center transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-2xl font-bold text-blue-900 mb-2 font-display">
            આપનું જીવન, આપણી જવાબદારી.
          </h1>
          <p className="text-sm text-blue-800 mb-0 leading-tight">
            – દરેક પડાવ માટે વીમાની સુરક્ષા
          </p>
          
          {/* Plans Badge with Family Photo */}
          <Link href="/plans" className="block">
            <div className="relative flex items-center justify-center -mt-1 cursor-pointer select-none">
              <div className="bg-yellow-400 rounded-2xl px-6 py-3 shadow-md hover:shadow-lg active:scale-[0.98] transition">
                <span className="text-lg font-bold text-blue-900">Plans</span>
              </div>
              
              {/* Family Photo - No Frame, Just Raw Image */}
              <div className="ml-4">
                <img 
                  src="/images/family.png" 
                  alt="Happy Family" 
                  className="w-48 h-48 object-cover"
                />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="px-8 mb-3">
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-30"></div>
        <p className="text-center text-xs text-blue-700 mt-2">
          તમારા પરિવાર માટે યોગ્ય પ્લાન પસંદ કરો અને તેમના ભવિષ્યને સુરક્ષિત કરો.
        </p>
      </div>

      {/* Content Sections */}
      <div className="px-4 space-y-3">
        {/* Life Stage Section */}
        <div className={`transform transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-blue-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="font-bold text-blue-900 font-display text-base">Life Stage પ્રમાણે શોધો</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Young Stage */}
              <button className="bg-white rounded-xl p-3 shadow hover:shadow-md transition group">
                <div className="flex items-center space-x-2">
                  <span className="text-xl group-hover:scale-105 transition">🎓</span>
                  <div className="text-left">
                    <span className="font-bold text-blue-900 text-sm block">યુવા સ્ટેજ</span>
                  </div>
                </div>
              </button>

              {/* Settling Stage */}
              <button className="bg-white rounded-xl p-3 shadow hover:shadow-md transition group">
                <div className="flex items-center space-x-2">
                  <span className="text-xl group-hover:scale-105 transition">👥</span>
                  <div className="text-left">
                    <span className="font-bold text-orange-900 text-sm block">સેટલિંગ સ્ટેજ</span>
                  </div>
                </div>
              </button>

              {/* Family Stage */}
              <button className="bg-white rounded-xl p-3 shadow hover:shadow-md transition group">
                <div className="flex items-center space-x-2">
                    <span className="text-xl group-hover:scale-105 transition">👪</span>
                  <div className="text-left">
                    <span className="font-bold text-red-900 text-sm block">ફેમિલી સ્ટેજ</span>
                  </div>
                </div>
              </button>

              {/* Retirement Stage */}
              <button className="bg-white rounded-xl p-3 shadow hover:shadow-md transition group">
                <div className="flex items-center space-x-2">
                  <span className="text-xl group-hover:scale-105 transition">👴</span>
                  <div className="text-left">
                    <span className="font-bold text-blue-900 text-sm block">રિટાયરમેન્ટ સ્ટેજ</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Financial Goal Section */}
        <div className={`transform transition-all duration-700 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-green-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
              <h2 className="font-bold text-green-900 font-display text-sm">Financial Goal પ્રમાણે પસંદ કરો</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Term Cover */}
              <button className="bg-white rounded-xl p-3 shadow hover:shadow-md transition group flex flex-col items-center space-y-2">
                <div className="text-xl">🛡️</div>
                <span className="text-xs font-semibold text-blue-900 text-center">Term Cover</span>
              </button>

              {/* ULIP Growth */}
              <button className="bg-white rounded-xl p-3 shadow hover:shadow-md transition group flex flex-col items-center space-y-2">
                <div className="text-xl">📈</div>
                <span className="text-xs font-semibold text-blue-900 text-center">ULIP Growth</span>
              </button>

              {/* Goals */}
              <button className="bg-white rounded-xl p-3 shadow hover:shadow-md transition group flex flex-col items-center space-y-2">
                <div className="text-xl">🎯</div>
                <span className="text-xs font-semibold text-blue-900 text-center">Goals</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className={`px-4 py-4 transform transition-all duration-700 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <Link href="/plans">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl py-4 font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 group">
            <span className="flex items-center justify-center">
              બધી યોજનાઓ જુઓ
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </Link>
      </div>
    </main>
  );
}