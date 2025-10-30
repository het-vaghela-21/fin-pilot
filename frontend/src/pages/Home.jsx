import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { staggerElements, floatingAnimation } from '../utils/animations';
import { CoinStack, CreditCard, PiggyBank, GrowthChart, FinanceDecoration } from '../components/decorative/FinanceElements';

export default function Home() {
  // Animation references
  const heroRef = useRef(null);
  const featureListRef = useRef(null);
  const imageRef = useRef(null);
  
  useEffect(() => {
    // Animate hero section
    gsap.fromTo(heroRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );
    
    // Animate feature list items with stagger
    staggerElements(
      '.feature-item', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1 },
      0.2
    );
    
    // Animate the finance image
    gsap.fromTo(imageRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, delay: 0.3, ease: "back.out(1.7)" }
    );
    
    // Add floating animation to finance elements
    floatingAnimation(document.querySelectorAll('.floating-element'));
  }, []);
  
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 transform rotate-12">
          <CoinStack size="xl" className="floating-element" />
        </div>
        <div className="absolute top-40 right-20 transform -rotate-6">
          <CreditCard size="xl" className="floating-element" />
        </div>
        <div className="absolute bottom-40 left-20 transform rotate-12">
          <PiggyBank size="xl" className="floating-element" />
        </div>
        <div className="absolute bottom-20 right-10 transform -rotate-6">
          <GrowthChart size="xl" positive={true} className="floating-element" />
        </div>
      </div>
      
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 relative z-10">
        <div className="text-xl font-bold flex items-center">
          <span className="mr-2">Fin-Pilot</span>
          <span className="text-2xl">✈️</span>
          <span className="ml-1 text-blue-500 text-xs font-normal">v1.0</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors duration-300">Log in</Link>
          <Link to="/register" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20">Sign up</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div ref={heroRef} className="relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 text-blue-500 opacity-20 text-4xl font-serif">"</div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Smart Financial Management System
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Track income and expenses in real time, set goals, build budgets, and visualize your cash flow with beautiful interactive charts and animations.
            </p>
            
            <ul ref={featureListRef} className="mt-6 space-y-3 text-gray-700 dark:text-gray-200">
              <li className="feature-item flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mr-3 dark:bg-green-900/40 dark:text-green-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                <span>Real-time animated transaction graphs</span>
              </li>
              <li className="feature-item flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 dark:bg-blue-900/40 dark:text-blue-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </span>
                <span>Smart budget categories with quick add</span>
              </li>
              <li className="feature-item flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 mr-3 dark:bg-yellow-900/40 dark:text-yellow-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
                <span>Financial goals with visual progress tracking</span>
              </li>
              <li className="feature-item flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 mr-3 dark:bg-purple-900/40 dark:text-purple-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                <span>Interactive reports and expenditure charts</span>
              </li>
            </ul>
            
            <div className="mt-8 flex gap-3">
              <Link to="/login" className="rounded-md bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1">
                Let's get started
              </Link>
              <Link to="/register" className="rounded-md border px-5 py-3 font-semibold hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1">
                Create an account
              </Link>
            </div>
          </div>
          
          <div ref={imageRef} className="rounded-xl border bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>
            <div className="relative h-64 w-full rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CoinStack size="lg" className="mx-2" />
                  <CreditCard size="lg" className="mx-2" />
                </div>
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">Your money, clearly in view</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto text-sm">
                  Visualize your finances with beautiful animations and interactive charts that make financial planning enjoyable.
                </p>
                <div className="mt-4 flex justify-center">
                  <GrowthChart size="md" positive={true} className="mx-2" />
                  <PiggyBank size="md" className="mx-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-8 border-t dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-xl font-bold mr-2">Fin-Pilot</span>
            <span className="text-2xl">✈️</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Fin-Pilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
