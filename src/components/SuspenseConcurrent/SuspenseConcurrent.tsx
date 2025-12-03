'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Zap, Layers, CheckCircle2, Activity, ChevronRight, Braces, Cpu } from 'lucide-react';
import { Card, Button } from './ui-components';
import { UnderTheHoodDemo } from './UnderTheHoodDemo';
import { TransitionDemo } from './TransitionDemo';
import { OptimisticDemo } from './OptimisticDemo';
import { FiberTreeDemo } from './FiberTreeDemo';
import { TabConfig } from './types';

export default function SuspenseConcurrent() {
  const [activeTab, setActiveTab] = useState('intro');

  const tabs: TabConfig[] = [
    { id: 'intro', label: 'Start Here', icon: Atom },
    { id: 'throw', label: '1. The Throw', icon: Zap },
    { id: 'transition', label: '2. Transitions', icon: Layers },
    { id: 'optimistic', label: '3. Optimistic', icon: CheckCircle2 },
    { id: 'fiber', label: '4. Fiber Trees', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 font-sans text-slate-900">
      {/* Sidebar / Nav */}
      <motion.aside
        className="fixed left-0 top-0 z-50 flex h-auto w-full flex-row overflow-x-auto border-b border-slate-200 bg-white/80 backdrop-blur-lg shadow-sm lg:h-screen lg:w-72 lg:flex-col lg:border-r lg:border-b-0 lg:overflow-visible"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="hidden lg:block p-6">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Atom className="text-indigo-600" size={28} />
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800">
                React<span className="text-indigo-600">Suspense</span>
              </h1>
              <p className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Interactive Guide v1.0
              </p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex w-full gap-1 p-2 lg:flex-col lg:p-4">
          {tabs.map((t, index) => (
            <motion.button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'border border-indigo-100 bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <t.icon
                size={18}
                className={`shrink-0 ${activeTab === t.id ? 'text-indigo-600' : 'text-slate-400'}`}
              />
              <span className="hidden sm:inline">{t.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="mx-auto min-h-screen p-4 sm:p-6 lg:ml-72 lg:p-12 pt-20 lg:pt-12 lg:flex lg:items-center">
         <div className="w-full max-w-7xl mx-auto">

        <AnimatePresence mode="wait">
          {/* Intro Section */}
          {activeTab === 'intro' && (
            <motion.div
              key="intro"
              className="space-y-6 sm:space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Card */}
              <motion.div
                className="relative overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-12 text-center shadow-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Background Elements */}
                <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-70" />
                <motion.div
                  className="absolute top-12 left-12 opacity-5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Braces size={100} className="text-white" />
                </motion.div>
                <motion.div
                  className="absolute right-12 bottom-12 opacity-5"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                >
                  <Cpu size={100} className="text-white" />
                </motion.div>

                {/* Content */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Atom
                    size={80}
                    className="relative z-10 mx-auto mb-6 sm:mb-8 text-indigo-500 drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                  />
                </motion.div>

                <h1 className="relative z-10 mb-4 sm:mb-6 text-3xl sm:text-5xl font-black tracking-tight text-white">
                  React Internals <br />
                  <span className="mt-2 block font-mono text-2xl sm:text-4xl text-indigo-400">Visualized</span>
                </h1>

                <p className="relative z-10 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed font-medium text-slate-300 px-4">
                  Explore the engineering concepts behind React 18 & 19. Master Suspense, Concurrent Mode, and
                  Optimistic UI through interactive simulations.
                </p>

                <motion.div
                  className="relative z-10 mt-8 sm:mt-10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setActiveTab('throw')}
                    className="mx-auto bg-indigo-600! px-6! py-3! text-base! text-white! shadow-lg shadow-indigo-500/30 hover:bg-indigo-500!"
                  >
                    Start Simulation <ChevronRight size={18} />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Feature Cards */}
              <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                {[
                  { title: 'Suspense', icon: Zap, description: 'Visualize the "Promise Throwing" mechanism and Error Boundaries.' },
                  { title: 'Concurrency', icon: Layers, description: 'Understand how `useTransition` keeps the UI responsive during updates.' },
                  { title: 'Fiber Engine', icon: Activity, description: 'Deep dive into the Double Buffering strategy and Work Loop.' },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  >
                    <Card
                      title={feature.title}
                      icon={feature.icon}
                      className="h-full transition-all hover:border-indigo-200 hover:shadow-xl cursor-pointer"
                    >
                      <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Demo Sections */}
          {activeTab === 'throw' && (
            <motion.div
              key="throw"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card title="Concept 1: The Suspense Mechanism" icon={Zap}>
                <UnderTheHoodDemo />
              </Card>
            </motion.div>
          )}

          {activeTab === 'transition' && (
            <motion.div
              key="transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card title="Concept 2: Concurrent Transitions" icon={Layers}>
                <TransitionDemo />
              </Card>
            </motion.div>
          )}

          {activeTab === 'optimistic' && (
            <motion.div
              key="optimistic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card title="Concept 3: Optimistic UI Patterns" icon={CheckCircle2}>
                <OptimisticDemo />
              </Card>
            </motion.div>
          )}

          {activeTab === 'fiber' && (
            <motion.div
              key="fiber"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card title="Concept 4: The Fiber Architecture" icon={Activity}>
                <FiberTreeDemo />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
         </div>
      </main>
    </div>
  );
}
