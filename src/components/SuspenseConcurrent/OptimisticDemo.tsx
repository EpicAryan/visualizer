'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, GitMerge, Code2, Braces } from 'lucide-react';
import { Button, ExplainBox, sleep } from './ui-components';
import { DemoStatus } from './types';

export const OptimisticDemo: React.FC = () => {
  const [likes, setLikes] = useState(10);
  const [optimisticLikes, setOptimisticLikes] = useState(10);
  const [status, setStatus] = useState<DemoStatus>('idle');
  const [latency, setLatency] = useState(2000);
  const [mode, setMode] = useState<'standard' | 'optimistic'>('optimistic');


  const handleLike = async () => {
    if (status === 'pending') return;

    if (mode === 'optimistic') {
      // Optimistic: Update UI immediately
      setOptimisticLikes((l) => l + 1);
    }

    setStatus('pending');

    // Simulate server request
    await sleep(latency);

    // Server response: Update the source of truth
    const newLikes = likes + 1;
setLikes(newLikes);

// SYNC FOR BOTH MODES (no need for useEffect)
setOptimisticLikes(newLikes);
    // Note: In optimistic mode, the useEffect will sync optimisticLikes with likes

    setStatus('done');
    setTimeout(() => setStatus('idle'), 1500);
  };

  const handleModeChange = (newMode: 'standard' | 'optimistic') => {
  setMode(newMode);
  // Sync state when switching modes
  if (status === 'idle') {
    setOptimisticLikes(likes);
  }
};

  const displayLikes = mode === 'optimistic' ? optimisticLikes : likes;

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
            3. Optimistic Updates
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-500 mt-1">
            Closing the &quot;Perceived Latency&quot; gap.
          </p>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 sm:gap-4 rounded-lg border border-slate-200 bg-white p-2 sm:p-3 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label className="font-mono text-xs font-bold text-slate-500 whitespace-nowrap">
            LATENCY: {latency}ms
          </label>
          <input
            type="range"
            min="500"
            max="5000"
            step="500"
            value={latency}
            onChange={(e) => setLatency(Number(e.target.value))}
            className="w-20 sm:w-24 accent-indigo-600"
          />
        </motion.div>
      </div>

      {/* Mode Selector */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          onClick={() => handleModeChange('standard')}
          variant={mode === 'standard' ? 'primary' : 'secondary'}
          className="text-xs"
        >
          Standard (Await)
        </Button>
        <Button
          onClick={() => handleModeChange('optimistic')}
          variant={mode === 'optimistic' ? 'primary' : 'secondary'}
          className="text-xs"
        >
          Optimistic (Instant)
        </Button>
      </motion.div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Social Card */}
        <motion.div
          className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg">
            {/* Profile Header */}
            <div className="mb-4 flex items-center gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Code2 size={20} />
              </motion.div>
              <div>
                <div className="font-bold text-slate-800 text-sm sm:text-base">React Core Team</div>
                <div className="font-mono text-xs text-slate-400">@reactjs • 2h</div>
              </div>
            </div>

            {/* Post Content */}
            <motion.div
              className="group relative mb-4 overflow-hidden rounded-lg bg-slate-900 p-4 font-mono text-xs text-indigo-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute top-0 right-0 p-2 opacity-30">
                <Braces size={40} />
              </div>
              <p className="relative z-10">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-blue-400">future</span> ={' '}
                <span className="text-yellow-400">await</span> react.
                <span className="text-blue-400">next</span>();
              </p>
              <p className="relative z-10 mt-2 text-slate-400 text-[11px]">
                React 19 creates a seamless bridge between server and client. Try out the new primitives today.
              </p>
            </motion.div>

            {/* Like Button */}
            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
              <motion.button
                onClick={handleLike}
                disabled={mode === 'standard' && status === 'pending'}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition-all ${
                  displayLikes > 10 ? 'bg-rose-50 text-rose-600' : 'hover:bg-slate-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: mode === 'standard' && status === 'pending' ? 1 : 1.05 }}
                whileTap={{ scale: mode === 'standard' && status === 'pending' ? 1 : 0.95 }}
              >
                <motion.div
                  animate={{
                    scale: displayLikes > 10 ? [1, 1.3, 1.2] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {displayLikes > 10 ? '❤️' : '♡'}
                </motion.div>
                <span>{displayLikes}</span>
              </motion.button>

              <AnimatePresence>
                {mode === 'standard' && status === 'pending' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader2 className="animate-spin text-slate-400" size={14} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* State Timeline */}
        <motion.div
          className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6 font-mono text-xs text-slate-300 shadow-inner"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="mb-4 sm:mb-6 flex items-center gap-2 border-b border-slate-800 pb-2 tracking-wider text-indigo-400 uppercase">
            <GitMerge size={14} /> State Divergence
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            {/* Timeline Line */}
            <div className="absolute top-0 bottom-0 left-12 sm:left-16 w-0.5 bg-slate-800" />

            {/* Events */}
            <div className="relative z-10 w-full space-y-6 sm:space-y-8 pl-4">
              {/* 1. Initial */}
              <motion.div
                className="flex items-center gap-3 sm:gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-10 sm:w-12 text-right text-slate-500 text-[10px]">INIT</div>
                <div className="-ml-[5px] h-3 w-3 rounded-full border-2 border-slate-900 bg-slate-600" />
                <div className="rounded bg-slate-800 px-2 sm:px-3 py-1 text-slate-400 text-[10px] sm:text-xs">
                  Server: {likes} | UI: {displayLikes}
                </div>
              </motion.div>

              {/* 2. Action */}
              <motion.div
                className="flex items-center gap-3 sm:gap-4"
                animate={{ opacity: status !== 'idle' ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 sm:w-12 text-right font-bold text-indigo-400 text-[10px]">CLICK</div>
                <motion.div
                  className="-ml-[5px] h-3 w-3 rounded-full border-2 border-slate-900 bg-indigo-500"
                  animate={{ scale: status !== 'idle' ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                />
                <AnimatePresence mode="wait">
                  {mode === 'optimistic' ? (
                    <motion.div
                      key="optimistic"
                      className="flex items-center gap-2 rounded border border-indigo-500/30 bg-indigo-900/50 px-2 sm:px-3 py-1 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-[10px] sm:text-xs"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Zap size={12} /> Optimistic UI: {optimisticLikes}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="standard"
                      className="flex items-center gap-2 rounded bg-slate-800 px-2 sm:px-3 py-1 text-slate-500 text-[10px] sm:text-xs"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Loader2 size={12} className="animate-spin" /> UI Pending...
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 3. Network Latency */}
              <AnimatePresence>
                {status === 'pending' && (
                  <motion.div
                    className="relative ml-12 sm:ml-[60px] h-12 w-0.5 border-l border-dashed border-slate-600"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 48, opacity: [0.3, 1, 0.3] }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ opacity: { duration: 1, repeat: Infinity } }}
                  >
                    <span className="absolute top-1/2 left-4 -translate-y-1/2 bg-slate-900 px-1 text-[9px] sm:text-[10px] text-slate-500 whitespace-nowrap">
                      Network Request...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 4. Reconciliation */}
              <motion.div
                className="flex items-center gap-3 sm:gap-4"
                animate={{ opacity: status === 'done' ? 1 : 0.1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 sm:w-12 text-right font-bold text-emerald-400 text-[10px]">SYNC</div>
                <motion.div
                  className="-ml-[5px] h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-500"
                  animate={{ scale: status === 'done' ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="rounded border border-emerald-500/30 bg-emerald-900/20 px-2 sm:px-3 py-1 text-emerald-400 text-[10px] sm:text-xs">
                  {mode === 'optimistic' 
                    ? `Confirmed: Server(${likes}) = UI(${optimisticLikes})`
                    : `Updated: Server(${likes}) → UI(${displayLikes})`
                  }
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <ExplainBox title="Why use useOptimistic?">
          <p>
            It decouples the User Interface from the Network Latency.
            <br />
            <br />
            By creating a temporary &quot;Optimistic State&quot; branch, we simulate success instantly. When the
            server finally responds, React seamlessly discards the simulation and reconciles with the true
            server data. This makes applications feel &quot;local-first&quot; and incredibly snappy.
            <br />
            <br />
            <b>Try it:</b> Click the heart in both modes. In Standard mode, you must wait for the server. 
            In Optimistic mode, the UI updates instantly!
          </p>
        </ExplainBox>
      </motion.div>
    </div>
  );
};
