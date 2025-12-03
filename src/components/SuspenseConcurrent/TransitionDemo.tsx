'use client';

import React, { useState, useTransition, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, XCircle, Lock, FileCode } from 'lucide-react';
import { ExplainBox, sleep } from './ui-components';
import { TabMode, PageContentProps, PageSkeletonProps } from './types';

// ========== PROPER TYPESCRIPT TYPES ==========
interface SuspenseResource<T> {
  read(): T;
}

type ResourceStatus = 'pending' | 'success' | 'error';

interface ResourceState<T> {
  status: ResourceStatus;
  result?: T;
  promise: Promise<void>;
}

// ========== SUSPENSE RESOURCE CACHE ==========
const dataCache = new Map<string, SuspenseResource<string>>();

function createSuspenseResource(key: string, asyncFn: (key: string) => Promise<string>): SuspenseResource<string> {
  const state: ResourceState<string> = {
    status: 'pending',
    result: undefined,
    promise: Promise.resolve(),
  };

  state.promise = asyncFn(key).then(
    (r) => {
      state.status = 'success';
      state.result = r;
    },
    (e) => {
      state.status = 'error';
      state.result = e;
    }
  );

  return {
    read(): string {
      if (state.status === 'pending') throw state.promise;
      if (state.status === 'error') throw state.result;
      return state.result as string;
    },
  };
}

// Pre-populate Home to avoid initial suspense
dataCache.set('Home', {
  read: () =>
    'This is the static content for the Home view. In a real app, this would be complex data fetched from a server.',
});

const fetchPageData = async (page: string): Promise<string> => {
  await sleep(2000); // Simulate network delay
  return `Fetched content for ${page}`;
};

const getPageResource = (page: string): SuspenseResource<string> => {
  const key = `page-${page}`;
  if (!dataCache.has(key)) {
    dataCache.set(key, createSuspenseResource(key, () => fetchPageData(page)));
  }
  return dataCache.get(key)!;
};

// Clear cache for a specific page (to simulate fresh fetch)
const clearPageCache = (page: string) => {
  const key = `page-${page}`;
  dataCache.delete(key);
};

// ========== PAGE CONTENT COMPONENT ==========
const PageContent: React.FC<PageContentProps> = ({ page }) => {
  const resource = getPageResource(page);
  const data = resource.read();
  return <p className="leading-relaxed text-slate-600 text-sm sm:text-base">{data}</p>;
};

// ========== SKELETON LOADING STATE ==========
const PageSkeleton: React.FC<PageSkeletonProps> = ({ isLegacy }) => (
  <motion.div
    className="absolute inset-0 z-10 flex flex-col gap-4 sm:gap-6 bg-white p-4 sm:p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center gap-4">
      <motion.div
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-200"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="h-5 w-1/3 sm:h-6 rounded bg-slate-200"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
      />
    </div>
    <motion.div
      className="h-24 w-full sm:h-32 rounded-xl bg-slate-100"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
    />
    <div className="space-y-3">
      <motion.div
        className="h-4 w-full rounded bg-slate-200"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      />
      <motion.div
        className="h-4 w-2/3 rounded bg-slate-200"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </div>
    {isLegacy && (
      <motion.div
        className="mt-auto flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs font-medium text-rose-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <XCircle size={16} />
        <span>
          <b>UX Violation:</b> The user lost context. The app feels &quot;janky&quot; and slow.
        </span>
      </motion.div>
    )}
  </motion.div>
);

// ========== MAIN TRANSITION DEMO ==========
export const TransitionDemo: React.FC = () => {
  const [tab, setTab] = useState('Home');
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<TabMode>('modern');

  const handleNav = (nextTab: string) => {
    if (nextTab === tab) return;

    // Clear the cache for the next tab to force a fresh fetch
    clearPageCache(nextTab);

    if (mode === 'legacy') {
      // LEGACY MODE: Synchronous update
      // This will immediately trigger Suspense and show the skeleton
      setTab(nextTab);
    } else {
      // MODERN MODE: Concurrent update with startTransition
      // This keeps the old UI visible while preparing the new one
      startTransition(() => {
        setTab(nextTab);
      });
    }
  };

  const tabs = ['Home', 'Profile', 'Settings'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">
            2. Concurrent Transitions
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-500 mt-1">
            Prioritizing user interaction over network state.
          </p>
        </motion.div>

        <motion.div
          className="flex shrink-0 rounded-lg border border-slate-200 bg-slate-100 p-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button
            onClick={() => setMode('legacy')}
            className={`rounded px-3 sm:px-4 py-2 font-mono text-xs font-bold transition-all ${
              mode === 'legacy' ? 'bg-white text-rose-600 shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Legacy
          </button>
          <button
            onClick={() => setMode('modern')}
            className={`rounded px-3 sm:px-4 py-2 font-mono text-xs font-bold transition-all ${
              mode === 'modern' ? 'bg-white text-emerald-600 shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            useTransition
          </button>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Browser UI */}
        <motion.div
          className="flex min-h-[450px] flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Browser Chrome */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 p-3">
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3 w-3 rounded-full bg-slate-300" />
              ))}
            </div>
            <div className="flex w-1/2 items-center justify-center gap-2 rounded border border-slate-200 bg-white px-2 sm:px-3 py-1 text-center font-mono text-[9px] sm:text-[10px] text-slate-400">
              <Lock size={10} />
              <span className="truncate">
                {mode === 'legacy' ? 'app.legacy-react.com' : 'app.concurrent-react.com'}
              </span>
            </div>
            <div className="w-10" />
          </div>

          {/* Nav Bar */}
          <div className="flex gap-2 border-b border-slate-100 p-3 sm:p-4 overflow-x-auto">
            {tabs.map((t) => (
              <motion.button
                key={t}
                onClick={() => handleNav(t)}
                className={`relative rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  tab === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t}
                <AnimatePresence>
                  {mode === 'modern' && isPending && tab !== t && (
                    <motion.span
                      className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border border-white bg-sky-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.3, 1] }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
            <AnimatePresence>
              {mode === 'modern' && isPending && (
                <motion.div
                  className="ml-auto flex items-center gap-1.5 rounded-full bg-sky-50 px-2 py-1 text-xs font-medium text-sky-600"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ opacity: { duration: 1, repeat: Infinity } }}
                >
                  <Loader2 size={12} className="animate-spin" /> Loading...
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Viewport */}
          <div className="relative flex-1 bg-slate-50/50 p-4 sm:p-8">
            <Suspense fallback={<PageSkeleton isLegacy={mode === 'legacy'} />}>
              <motion.div
                key={tab}
                animate={{
                  opacity: mode === 'modern' && isPending ? 0.4 : 1,
                  filter: mode === 'modern' && isPending ? 'grayscale(100%)' : 'grayscale(0%)',
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
                  <motion.div
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FileCode size={20} />
                  </motion.div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{tab}</h1>
                    <p className="text-xs sm:text-sm text-slate-500">/app/{tab.toLowerCase()}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                  <PageContent page={tab} />
                  <div className="mt-4 flex gap-2">
                    <div className="h-2 w-20 rounded-full bg-indigo-100" />
                    <div className="h-2 w-12 rounded-full bg-slate-100" />
                  </div>
                </div>
              </motion.div>
            </Suspense>
          </div>
        </motion.div>

        {/* Explanation */}
        <motion.div
          className="flex flex-col justify-center space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ExplainBox title={mode === 'legacy' ? 'Legacy (Blocking)' : 'Concurrent (Non-Blocking)'}>
            <AnimatePresence mode="wait">
              <motion.p
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {mode === 'legacy' ? (
                  <>
                    <b>Synchronous Rendering:</b> When you trigger <code>setTab</code>, React treats it as an &quot;urgent&quot;
                    update. It halts the current screen, tries to render the new one, hits a Suspense boundary,
                    and is <b>forced to show a fallback (Skeleton)</b> immediately.
                    <br />
                    <br />
                    The user experiences a jarring flash of content removal. <b>Try clicking Profile or Settings to see the skeleton appear!</b>
                  </>
                ) : (
                  <>
                    <b>Concurrent Rendering:</b> By wrapping the update in <code>startTransition</code>, you tell React
                    &quot;this is not urgent&quot;.
                    <br />
                    <br />
                    React prepares the new screen in a background Fiber tree. <b>The old screen remains fully
                    visible and interactive</b> (dimmed/grayed out). Once ready, React swaps the trees in a single frame. <b>No jarring skeleton flash!</b>
                  </>
                )}
              </motion.p>
            </AnimatePresence>
          </ExplainBox>

          {/* Code Block */}
          <motion.div
            className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-slate-300 shadow-inner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {mode === 'legacy' ? (
                  <>
                    <span className="text-purple-400">const</span> handleNav = (tab) =&gt; {'{'}
                    <br />
                    &nbsp;&nbsp;<span className="text-slate-500"> 1. Urgent Update (Default)</span>
                    <br />
                    &nbsp;&nbsp;setTab(tab); <span className="text-rose-400"> 💥 Unmounts current UI immediately</span>
                    <br />
                    {'}'}
                  </>
                ) : (
                  <>
                    <span className="text-purple-400">const</span> handleNav = (tab) =&gt; {'{'}
                    <br />
                    &nbsp;&nbsp;<span className="text-slate-500"> 1. Transition (Low Priority)</span>
                    <br />
                    &nbsp;&nbsp;<span className="text-indigo-400">startTransition</span>(() =&gt; {'{'}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;setTab(tab);{' '}
                    <span className="text-emerald-400"> ✨ Background rendering</span>
                    <br />
                    &nbsp;&nbsp;{'}'});
                    <br />
                    {'}'}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
