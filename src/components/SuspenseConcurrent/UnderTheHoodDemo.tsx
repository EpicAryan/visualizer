'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, Pause, Database, Activity, Zap, Loader2 } from 'lucide-react';
import { TimelineStep } from './types';
import { Button } from './ui-components';


export const UnderTheHoodDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const TOTAL_DURATION = 10000;

  const sequence: TimelineStep[] = [
    { t: 0, s: 0 },
    { t: 500, s: 1 },
    { t: 1500, s: 2 },
    { t: 2500, s: 3 },
    { t: 3500, s: 4 },
    { t: 4500, s: 5 },
    { t: 7000, s: 6 },
    { t: 8000, s: 7 },
    { t: 9000, s: 8 },
  ];

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number | undefined;
    let lastFrameTime = performance.now();

    const loop = (time: number) => {
      const delta = time - lastFrameTime;
      lastFrameTime = time;

      if (isPlaying && !isPaused) {
        setCurrentTime((prev) => {
          const newTime = prev + delta;
          if (newTime >= TOTAL_DURATION) {
            setIsPlaying(false);
            setIsPaused(false);
            return 0;
          }
          return newTime;
        });
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, isPaused]);

  const currentStepObj = sequence.slice().reverse().find((ev) => currentTime >= ev.t) || sequence[0];
  const step = currentStepObj.s;

  const handleTogglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentTime(0);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
  };

  const explanations: Record<number, string> = {
    0: 'Idle state. The Fiber tree is ready to mount.',
    1: 'React enters the component function. Execution begins on the Call Stack.',
    2: 'The component calls resource.read(). React checks if the data is already cached.',
    3: 'CACHE MISS! The Promise is pending. The function THROWS the Promise object. Execution halts immediately.',
    4: 'React catches the thrown Promise in its error boundary mechanism. This triggers Suspense handling.',
    5: 'React finds the nearest `<Suspense>` boundary. It pauses the component and mounts the `fallback` UI.',
    6: 'The Promise resolves in the background. React is notified and marks the component as ready to re-render.',
    7: 'Retry! React schedules a high-priority re-render of the component.',
    8: 'CACHE HIT! The Promise is settled. The function returns the resolved value synchronously.',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">
            1. The &quot;Throw&quot; Mechanism
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-500 mt-1">
            Algebraic Effects simulation via Error Boundaries
          </p>
        </motion.div>

        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button onClick={handleReset} variant="secondary" disabled={!isPlaying && currentTime === 0}>
            <RefreshCw size={16} /> Reset
          </Button>
          <Button onClick={handleTogglePlay}>
            {isPlaying && !isPaused ? <Pause size={16} /> : <Play size={16} />}
            <span className="hidden sm:inline">
              {isPlaying && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Run'}
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Visualizer */}
        <motion.div
          className="relative flex min-h-[400px] flex-col items-center justify-between overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-4 sm:p-6 shadow-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Cache Badge */}
          <motion.div
            className={`absolute top-4 right-4 rounded-xl border bg-slate-800 p-3 transition-all`}
            animate={{
              borderColor: step === 8 ? 'rgb(16, 185, 129)' : 'rgb(51, 65, 85)',
              boxShadow: step === 8 ? '0 10px 40px -10px rgba(16, 185, 129, 0.3)' : 'none',
            }}
          >
            <div className="mb-1 flex items-center gap-2 font-mono text-xs tracking-wide text-slate-400 uppercase">
              <Database size={12} /> LRU Cache
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="h-2 w-2 rounded-full"
                animate={{
                  backgroundColor: step >= 6 ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)',
                  boxShadow: step >= 6 ? '0 0 10px rgb(16, 185, 129)' : '0 0 10px rgb(244, 63, 94)',
                }}
              />
              <span className={`font-mono text-xs font-bold ${step >= 6 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {step >= 6 ? 'RESOLVED' : 'PENDING'}
              </span>
            </div>
          </motion.div>

          {/* Suspense Boundary */}
          <motion.div
            className={`w-full max-w-xs border-2 border-dashed relative mt-12 rounded-xl p-6 transition-all duration-500`}
            animate={{
              borderColor: step >= 5 && step < 8 ? 'rgb(139, 92, 246)' : 'rgb(51, 65, 85)',
              backgroundColor: step >= 5 && step < 8 ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
            }}
          >
            <div className="absolute -top-2.5 left-4 mb-2 bg-slate-900 px-2 font-mono text-[10px] tracking-widest text-slate-500 uppercase">
              {'<Suspense fallback={<Spinner />}>'}
            </div>

            <AnimatePresence mode="wait">
              {/* Fallback UI */}
              {step >= 5 && step < 8 && (
                <motion.div
                  key="fallback"
                  className="flex h-32 flex-col items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                  <span className="font-mono text-xs text-violet-200">Rendering Fallback...</span>
                </motion.div>
              )}

              {/* Component */}
              {(step < 5 || step >= 8) && (
                <motion.div
                  key="component"
                  className="relative flex h-32 flex-col justify-center rounded-lg border border-slate-700 bg-slate-800 p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    borderColor: step === 3 ? 'rgb(244, 63, 94)' : 'rgb(51, 65, 85)',
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2 text-center font-mono text-xs text-slate-400">
                    {'<UserProfile />'}
                  </div>

                  {/* Throw Animation */}
                  <AnimatePresence>
                    {step === 3 && (
                      <motion.div
                        className="absolute top-1/2 left-1/2 z-20 flex items-center gap-2 rounded-md border border-rose-400 bg-rose-600 px-4 py-2 font-mono text-xs font-bold whitespace-nowrap text-white shadow-xl"
                        initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1.2, 1], y: ['-50%', '-150%', '-200%', '-300%'] }}
                        transition={{ duration: 1, times: [0, 0.2, 0.8, 1] }}
                      >
                        <Zap size={12} className="fill-white" /> throw Promise
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Data Reveal */}
                  <AnimatePresence>
                    {step === 8 && (
                      <motion.div
                        className="rounded border border-emerald-500/30 bg-emerald-900/30 p-3 text-center font-mono text-sm font-bold text-emerald-400"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      >
                        {'{ name: "Dev" }'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Timeline */}
          <div className="mt-4 w-full">
            <div className="mb-2 flex justify-between font-mono text-[10px] tracking-wider text-slate-500 uppercase">
              <span>Render</span>
              <span>Suspend</span>
              <span>Ping</span>
              <span>Re-render</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className="h-full bg-linear-to-r from-indigo-500 to-violet-500"
                style={{ width: `${Math.min((currentTime / TOTAL_DURATION) * 100, 100)}%` }}
                animate={{
                  boxShadow: isPlaying ? '0 0 10px rgb(99, 102, 241)' : 'none',
                }}
                transition={{ duration: 0.075, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Explanation Panel */}
        <motion.div
          className="flex flex-col rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="mb-4 flex items-center gap-2 font-mono text-xs sm:text-sm font-bold tracking-wider text-slate-800 uppercase">
            <Activity className="text-indigo-500" size={16} /> Execution Context
          </h3>

          <div className="flex-1 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                className="min-h-[60px] text-sm leading-relaxed font-medium text-slate-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {explanations[step]}
              </motion.div>
            </AnimatePresence>

            {/* Code Block */}
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-slate-400 shadow-inner overflow-x-auto">
              <motion.div
                className="p-1"
                animate={{
                  backgroundColor: step === 1 || step === 7 ? 'rgba(67, 56, 202, 0.5)' : 'transparent',
                  color: step === 1 || step === 7 ? 'rgb(165, 180, 252)' : 'rgb(148, 163, 184)',
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-purple-400">function</span>{' '}
                <span className="text-blue-400">UserProfile</span>() {'{'}
              </motion.div>

              <motion.div
                className="p-1 pl-4"
                animate={{
                  backgroundColor: step === 2 || step === 8 ? 'rgba(67, 56, 202, 0.5)' : 'transparent',
                  color: step === 2 || step === 8 ? 'rgb(165, 180, 252)' : 'rgb(148, 163, 184)',
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-purple-400">const</span> data = resource.
                <span className="text-blue-400">read</span>();
              </motion.div>

              <motion.div
                className="p-1 pl-4"
                animate={{
                  backgroundColor: step === 3 ? 'rgba(190, 18, 60, 0.3)' : 'transparent',
                  color: step === 3 ? 'rgb(251, 113, 133)' : 'rgb(148, 163, 184)',
                  opacity: step === 3 ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-slate-500">If missing...</span>
                <br />
                <span className="pl-4 text-purple-400">throw</span> promise;
              </motion.div>

              <motion.div
                className="p-1 pl-4"
                animate={{
                  backgroundColor: step === 8 ? 'rgba(5, 150, 105, 0.3)' : 'transparent',
                  color: step === 8 ? 'rgb(52, 211, 153)' : 'rgb(148, 163, 184)',
                  opacity: step === 8 ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-purple-400">return</span>{' '}
                <span>{'<h1>{data.name}</h1>'}</span>;
              </motion.div>

              <div className="p-1">{'}'}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
