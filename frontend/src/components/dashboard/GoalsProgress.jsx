import React from 'react';

export default function GoalsProgress({ balance = 0, user }) {
  const storageKey = React.useMemo(() => `my_goals_${user?.id || 'guest'}`, [user]);
  const [items, setItems] = React.useState([]);
  const [draft, setDraft] = React.useState({ name: '', target: '' });

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setItems(Array.isArray(saved) ? saved : []);
    } catch { setItems([]); }
  }, [storageKey]);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const addGoal = () => {
    const name = draft.name.trim();
    const target = Number(draft.target || 0);
    if (!name || !target) return;
    persist([...items, { id: crypto.randomUUID(), name, target }]);
    setDraft({ name: '', target: '' });
  };

  const updateGoal = (id, patch) => {
    persist(items.map(g => g.id === id ? { ...g, ...patch } : g));
  };

  const removeGoal = (id) => {
    persist(items.filter(g => g.id !== id));
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-lg font-semibold">My Goals</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Balance considered: ₹{Number(balance).toLocaleString('en-IN')}</div>
      </div>

      {/* Add new */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-6">
        <input value={draft.name} onChange={e=>setDraft({...draft, name:e.target.value})} placeholder="Goal name (e.g. Goa Trip)" className="sm:col-span-4 rounded-md border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
        <input type="number" value={draft.target} onChange={e=>setDraft({...draft, target:e.target.value})} placeholder="Target ₹" className="sm:col-span-1 rounded-md border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
        <button onClick={addGoal} className="sm:col-span-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Add</button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">No goals yet. Add one above.</div>
        )}
        {items.map((g) => {
          const curr = Number(balance) || 0; // real-time available balance
          const pct = g.target > 0 ? Math.min(100, Math.round((curr / g.target) * 100)) : 0;
          return (
            <div key={g.id} className="rounded-md border p-3 dark:border-gray-800">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
                <div className="flex flex-1 items-center gap-2">
                  <input value={g.name} onChange={e=>updateGoal(g.id,{ name:e.target.value })} className="flex-1 rounded-md border px-2 py-1 dark:border-gray-700 dark:bg-gray-800" />
                  <input type="number" value={g.target} onChange={e=>updateGoal(g.id,{ target:Number(e.target.value||0) })} className="w-32 rounded-md border px-2 py-1 dark:border-gray-700 dark:bg-gray-800" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-gray-600 dark:text-gray-300">₹{curr.toLocaleString()} / ₹{Number(g.target).toLocaleString()}</div>
                  <button onClick={()=>removeGoal(g.id)} className="rounded-md border px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800">Remove</button>
                </div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
