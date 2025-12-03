"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Play, Pause, ArrowDown, Loader2 } from "lucide-react";
import { Button, ExplainBox } from "./ui-components";
import { FiberStage } from "./types";

export const FiberTreeDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const TOTAL_DURATION = 6000; // Extended to show post-commit state

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

  // Calculate current stage
  let stage: FiberStage = "idle";
  if (isPlaying || currentTime > 0) {
    if (currentTime < 1500) stage = "fork";
    else if (currentTime < 3500) stage = "work";
    else stage = "commit";
  }

  const descriptions: Record<FiberStage, string> = {
    idle: "The 'Current' fiber tree is connected to the DOM. The browser renders what this tree describes. The DOM root pointer references this tree.",
    fork: "startTransition() called! React clones the Current tree to create an 'Alternate' (Work-In-Progress) tree in memory. The DOM still points to Current - no visual changes yet.",
    work: "React processes updates on the Alternate tree in time-sliced chunks (interruptible work). The Current tree stays connected to the DOM, keeping the UI responsive during this phase.",
    commit:
      "Atomic Pointer Swap! React switches the DOM root pointer from Current to Alternate. The Alternate tree becomes the new Current. The DOM updates in one synchronous frame - no flicker or intermediate states.",
  };

  // Calculate DOM pointer position based on stage
  const getDOMPointerPosition = () => {
    if (stage === "idle" || stage === "fork" || stage === "work") {
      return "35%"; // Points to Current tree (left side)
    }
    return "65%"; // Points to Alternate tree (right side) after commit
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
            4. Fiber Architecture: Double Buffering
          </h2>
          <p className="mt-1 font-mono text-xs text-slate-500 sm:text-sm">
            React&apos;s strategy for non-blocking, interruptible rendering.
          </p>
        </motion.div>

        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button
            onClick={handleReset}
            variant="secondary"
            disabled={!isPlaying && currentTime === 0}
          >
            <RefreshCw size={16} /> Reset
          </Button>
          <Button onClick={handleTogglePlay}>
            {isPlaying && !isPaused ? <Pause size={16} /> : <Play size={16} />}
            <span className="hidden sm:inline">
              {isPlaying && !isPaused
                ? "Pause"
                : isPaused
                  ? "Resume"
                  : "Visualize"}
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Visualizer */}
      <motion.div
        className="relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-3xl border border-slate-300 bg-linear-to-br from-slate-100 to-slate-50 p-4 shadow-inner sm:h-[500px] sm:p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Stage Badge */}
        <div className="absolute top-4 left-0 z-30 w-full text-center">
          <motion.span
            className={`inline-block rounded-full border px-3 py-1.5 font-mono text-xs font-bold shadow-sm sm:px-4 ${
              stage === "idle"
                ? "border-slate-300 bg-slate-200 text-slate-600"
                : stage === "commit"
                  ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                  : "border-amber-200 bg-amber-100 text-amber-700"
            }`}
            key={stage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            FIBER_STAGE: {stage.toUpperCase()}
          </motion.span>
        </div>

        {/* DOM Root Pointer */}
        <motion.div
          className="absolute top-16 z-20 flex flex-col items-center sm:top-20"
          animate={{
            left: getDOMPointerPosition(),
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            className="mb-2 rounded bg-slate-800 px-2 py-1 font-mono text-[10px] font-bold text-white shadow-lg sm:px-3"
            animate={{
              backgroundColor:
                stage === "commit" ? "rgb(16, 185, 129)" : "rgb(30, 41, 59)",
            }}
          >
            DOM ROOT
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown
              className={
                stage === "commit" ? "text-emerald-600" : "text-slate-800"
              }
              size={20}
            />
          </motion.div>
        </motion.div>

        {/* Swap Icon During Commit */}
        <AnimatePresence>
          {stage === "commit" && (
            <motion.div
              className="absolute top-32 z-30 rounded-full bg-white p-3 shadow-2xl ring-4 ring-emerald-500/30 sm:top-36"
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{ scale: 1, rotate: 360, opacity: 1 }}
              exit={{ scale: 0, rotate: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <RefreshCw size={24} className="text-emerald-500" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trees Container */}
        <div className="relative mt-20 flex flex-row items-end justify-center gap-8 sm:mt-24 sm:gap-16 lg:gap-24">
          {/* Current Tree (Left) */}
          <motion.div
            className="relative"
            animate={{
              opacity: stage === "commit" ? 0.3 : 1,
              scale: stage === "commit" ? 0.95 : 1,
            }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest text-slate-600">
              {stage === "commit" ? "OLD" : "CURRENT"}
            </div>

            <motion.div
              className={`relative z-10 flex w-32 flex-col items-center gap-2 rounded-xl border-2 bg-white p-3 shadow-xl sm:w-40 sm:gap-3 sm:p-5 ${
                stage !== "commit"
                  ? "border-indigo-500 ring-2 ring-indigo-500/20"
                  : "border-slate-300"
              }`}
              animate={{
                borderColor:
                  stage === "commit"
                    ? "rgb(203, 213, 225)"
                    : "rgb(99, 102, 241)",
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-md sm:h-12 sm:w-12">
                Root
              </div>
              <div className="h-4 w-0.5 bg-slate-300 sm:h-6" />
              <div className="flex gap-2 sm:gap-3">
                <div className="h-6 w-6 rounded border border-slate-300 bg-slate-200 sm:h-8 sm:w-8" />
                <div className="h-6 w-6 rounded border border-slate-300 bg-slate-200 sm:h-8 sm:w-8" />
              </div>
              <div
                className={`mt-2 w-full rounded border py-1 text-center font-mono text-[9px] font-bold sm:text-[10px] ${
                  stage === "commit"
                    ? "border-slate-200 bg-slate-100 text-slate-500"
                    : "border-indigo-200 bg-indigo-50 text-indigo-700"
                }`}
              >
                {stage === "commit" ? "Detached" : "Connected"}
              </div>
            </motion.div>
          </motion.div>

          {/* Alternate/WIP Tree (Right) */}
          <motion.div
            className="relative"
            animate={{
              opacity: stage === "idle" ? 0.2 : 1,
              scale: stage === "idle" ? 0.9 : stage === "commit" ? 1.05 : 1,
              filter:
                stage === "idle"
                  ? "blur(2px) grayscale(100%)"
                  : "blur(0px) grayscale(0%)",
            }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest text-amber-600">
              {stage === "commit" ? "NEW CURRENT" : "ALTERNATE"}
            </div>

            <motion.div
              className={`flex w-32 flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all sm:w-40 sm:gap-3 sm:p-5 ${
                stage === "idle"
                  ? "border-dashed border-slate-400 bg-slate-50"
                  : stage === "commit"
                    ? "border-emerald-500 bg-white shadow-2xl ring-4 ring-emerald-500/30"
                    : "border-dashed border-amber-400 bg-amber-50/80"
              } ${stage === "work" ? "shadow-[0_0_30px_rgba(251,191,36,0.4)]" : ""}`}
              animate={{
                scale: stage === "work" ? 1.05 : 1,
                borderStyle: stage === "commit" ? "solid" : "dashed",
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-md sm:h-12 sm:w-12 ${
                  stage === "commit" ? "bg-emerald-600" : "bg-amber-500"
                }`}
              >
                Root&apos;
              </div>
              <div
                className={`h-4 w-0.5 sm:h-6 ${stage === "commit" ? "bg-emerald-300" : "bg-amber-300"}`}
              />
              <div className="flex gap-2 sm:gap-3">
                <div
                  className={`h-6 w-6 rounded border sm:h-8 sm:w-8 ${
                    stage === "commit"
                      ? "border-emerald-300 bg-emerald-200"
                      : "border-amber-300 bg-amber-200"
                  }`}
                />
                <AnimatePresence mode="wait">
                  {stage === "work" ? (
                    <motion.div
                      key="working"
                      className="flex h-6 w-6 items-center justify-center rounded border-2 border-indigo-400 bg-white shadow-lg sm:h-8 sm:w-8"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Loader2
                        size={12}
                        className="animate-spin text-indigo-500"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      className={`h-6 w-6 rounded border sm:h-8 sm:w-8 ${
                        stage === "commit"
                          ? "border-emerald-300 bg-emerald-200"
                          : "border-amber-300 bg-amber-200"
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </div>
              <div
                className={`mt-2 w-full rounded border py-1 text-center font-mono text-[9px] font-bold sm:text-[10px] ${
                  stage === "commit"
                    ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                    : "border-amber-200 bg-amber-100 text-amber-800"
                }`}
              >
                {stage === "commit" ? "Connected!" : "In Memory"}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="absolute right-4 bottom-4 left-4">
          <div className="mb-1 flex justify-between font-mono text-[9px] tracking-wider text-slate-500 uppercase">
            <span>Fork</span>
            <span>Work</span>
            <span>Commit</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full bg-linear-to-r from-amber-500 via-amber-500 to-emerald-500"
              style={{
                width: `${Math.min((currentTime / TOTAL_DURATION) * 100, 100)}%`,
              }}
              transition={{ duration: 0.075, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ExplainBox title="Double Buffering Explained">
          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {descriptions[stage]}
            </motion.p>
          </AnimatePresence>
        </ExplainBox>
      </motion.div>
    </div>
  );
};
