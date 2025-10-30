import React, { useEffect, useRef } from 'react';
import { getGoal, setGoal, getStats } from '../lib/api';
import { AnimatedProgressBar } from '../components/decorative/AnimatedStats';
import { PiggyBank } from '../components/decorative/FinanceElements';
import { gsap } from 'gsap';

export default function Goals() {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [title, setTitle] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [current, setCurrent] = React.useState(null);
  const [balance, setBalance] = React.useState(0);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const g = await getGoal({ year });
      setCurrent(g);
      setTitle(String(g?.title || ''));
      setAmount(String(g?.amount || ''));
    } finally { setLoading(false); }
  }, [year]);

  React.useEffect(() => { load(); }, [load]);

  const loadStats = React.useCallback(async () => {
    try {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const s = await getStats({ startDate: start.toISOString(), endDate: now.toISOString() });
      setBalance(Number(s?.balance || 0));
    } catch {}
  }, []);
  React.useEffect(() => { loadStats(); }, [loadStats]);
  React.useEffect(() => {
    const onAdded = () => { loadStats(); };
    window.addEventListener('tx-added', onAdded);
    return () => window.removeEventListener('tx-added', onAdded);
  }, [loadStats]);

  const onSave = async (e) => {
    e.preventDefault();
    const amt = Number(amount || 0);
    await setGoal({ year, amount: amt, title });
    await load();
    
    // Show success animation
    const saveBtn = e.target.querySelector('button');
    if (saveBtn) {
      saveBtn.classList.add('bg-green-600');
      saveBtn.textContent = 'Saved!';
      setTimeout(() => {
        saveBtn.classList.remove('bg-green-600');
        saveBtn.textContent = 'Save Goal';
      }, 1500);
    }
  };
  
  // Check if goal is achieved and trigger celebration
  useEffect(() => {
    if (current && Number(current.amount) > 0 && balance >= Number(current.amount)) {
      // Dispatch event for money rain in App.jsx
      const event = new CustomEvent('goal-achieved');
      window.dispatchEvent(event);
    }
  }, [balance, current]);
  
  // Animation references
  const pageRef = useRef(null);
  const formRef = useRef(null);
  
  useEffect(() => {
    // Animate page entrance
    gsap.fromTo(pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
    
    // Animate form
    gsap.fromTo(formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
    );
  }, []);

  // Calculate progress percentage
  const progressPercent = current && Number(current.amount) > 0 
    ? Math.round(Math.max(0, Math.min(100, (Number(balance)/Number(current?.amount))*100))) 
    : 0;
  
  // Check if goal is achieved
  const isGoalAchieved = current && Number(current.amount) > 0 && balance >= Number(current.amount);
  
  return (
    <div ref={pageRef} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Financial Goals</h1>
        <PiggyBank size="md" className="animate-bounce hidden md:block" />
      </div>
      
      <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950 finance-card">
        <form ref={formRef} onSubmit={onSave} className="grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Year</label>
            <select 
              value={year} 
              onChange={(e)=>setYear(Number(e.target.value))} 
              className="rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 w-full transition-colors focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {Array.from({length:5}).map((_,i)=>{
                const y = new Date().getFullYear() - 1 + i; // last, current, next years
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
          <div className="flex-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Goal name</label>
            <input 
              value={title} 
              onChange={(e)=>setTitle(e.target.value)} 
              placeholder="e.g. Save for Bike" 
              className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 transition-colors focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Goal amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e)=>setAmount(e.target.value)} 
                placeholder="e.g. 200000" 
                className="w-full rounded-md border pl-6 pr-3 py-2 dark:border-gray-700 dark:bg-gray-800 transition-colors focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
              />
            </div>
          </div>
          <button 
            disabled={loading} 
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            Save Goal
          </button>
        </form>

        <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {loading ? 'Loading current goal...' : (
                  <span>
                    {current?.title || 'Unnamed goal'} 
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({year})</span>
                  </span>
                )}
              </h3>
              <div className="mt-1 flex items-center">
                <span className="money-symbol mr-1">₹</span>
                <span className="text-xl font-bold">{Number(current?.amount || 0).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-sm text-gray-600 dark:text-gray-300">Current balance:</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">₹{Number(balance).toLocaleString('en-IN')}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span className={isGoalAchieved ? 'text-green-600 dark:text-green-400' : ''}>
                {progressPercent}%
                {isGoalAchieved && <span className="ml-1">✨</span>}
              </span>
            </div>
            <AnimatedProgressBar 
              percentage={progressPercent} 
              color={isGoalAchieved ? 'bg-green-600 dark:bg-green-500' : 'bg-blue-600 dark:bg-blue-500'} 
              height={8} 
            />
          </div>
          
          {isGoalAchieved && (
            <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-100 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200 flex items-center">
              <span className="text-xl mr-2">🎉</span>
              <span>Congratulations! You've reached your goal.</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950 finance-card">
        <h3 className="text-lg font-semibold mb-3">Tips for Successful Goal Achievement</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="inline-block text-blue-500 mr-2">•</span>
            <span>Set realistic goals based on your income and expenses</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block text-blue-500 mr-2">•</span>
            <span>Break down large goals into smaller milestones</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block text-blue-500 mr-2">•</span>
            <span>The Dashboard chart shows a dashed line at your goal level</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block text-blue-500 mr-2">•</span>
            <span>When your balance meets or exceeds the goal, a celebration animation will appear</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
