// components/hero-section.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Code2, Layers, Zap } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1],
      delay: 0.4,
    },
  },
};

// Event Loop Visualization Component
function EventLoopVisualization() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-3 py-6 sm:gap-4 sm:px-6 sm:py-8 lg:gap-6 lg:px-10 lg:py-12">
      <span className="text-xs font-medium text-amber-400/80 sm:text-sm lg:text-base">
        Event Loop
      </span>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-8">
        {/* Call Stack */}
        <div className="flex flex-col items-center gap-1 lg:gap-2">
          <span className="text-[8px] text-zinc-500 sm:text-[10px] lg:text-xs">
            Stack
          </span>
          <div className="flex h-16 w-12 flex-col-reverse items-center justify-start gap-0.5 rounded border border-zinc-800 bg-zinc-900/50 p-1 sm:h-24 sm:w-16 sm:gap-1 sm:p-2 lg:h-32 lg:w-24 lg:gap-2 lg:rounded-lg lg:p-3">
            <motion.div
              animate={{
                opacity: [0, 1, 1, 0],
                y: [8, 0, 0, -8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                times: [0, 0.2, 0.8, 1],
              }}
              className="h-3 w-full rounded-sm border border-amber-500/30 bg-linear-to-r from-amber-500/50 to-orange-500/50 sm:h-5 lg:h-7 lg:rounded"
            />
            <motion.div
              animate={{
                opacity: [0, 1, 1, 1, 0],
                y: [8, 0, 0, 0, -8],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                times: [0, 0.15, 0.5, 0.85, 1],
              }}
              className="h-3 w-full rounded-sm border border-orange-500/30 bg-linear-to-r from-orange-500/50 to-amber-500/50 sm:h-5 lg:h-7 lg:rounded"
            />
          </div>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="hidden sm:block"
        >
          <ArrowRight className="h-3 w-3 text-zinc-600 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
        </motion.div>

        {/* Web APIs */}
        <div className="flex flex-col items-center gap-1 lg:gap-2">
          <span className="text-[8px] text-zinc-500 sm:text-[10px] lg:text-xs">
            APIs
          </span>
          <div className="flex h-16 w-14 flex-col items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900/50 p-1 sm:h-24 sm:w-20 sm:gap-2 sm:p-2 lg:h-32 lg:w-28 lg:gap-3 lg:rounded-lg lg:p-3">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                borderColor: [
                  "rgba(97,219,251,0.2)",
                  "rgba(97,219,251,0.5)",
                  "rgba(97,219,251,0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex h-4 w-full items-center justify-center rounded-sm border bg-[#61DBFB]/10 text-[6px] text-[#61DBFB]/80 sm:h-6 sm:text-[8px] lg:h-8 lg:rounded lg:text-[11px]"
            >
              setTimeout
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
              className="flex h-4 w-full items-center justify-center rounded-sm border border-[#61DBFB]/20 bg-[#61DBFB]/10 text-[6px] text-[#61DBFB]/80 sm:h-6 sm:text-[8px] lg:h-8 lg:rounded lg:text-[11px]"
            >
              fetch
            </motion.div>
          </div>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="hidden sm:block"
        >
          <ArrowRight className="h-3 w-3 text-zinc-600 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
        </motion.div>

        {/* Task Queue */}
        <div className="flex flex-col items-center gap-1 lg:gap-2">
          <span className="text-[8px] text-zinc-500 sm:text-[10px] lg:text-xs">
            Queue
          </span>
          <div className="flex h-16 w-14 flex-col items-center justify-end gap-0.5 rounded border border-zinc-800 bg-zinc-900/50 p-1 sm:h-24 sm:w-20 sm:p-2 lg:h-32 lg:w-28 lg:rounded-lg lg:p-3">
            <motion.div
              animate={{
                x: [12, 0, 0, -30],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                times: [0, 0.2, 0.7, 1],
              }}
              className="flex h-3 w-full items-center justify-center rounded-sm border border-emerald-500/30 bg-emerald-500/15 text-[5px] text-emerald-400/80 sm:h-5 sm:text-[7px] lg:h-7 lg:rounded lg:text-[10px]"
            >
              callback
            </motion.div>
          </div>
        </div>
      </div>

      {/* Loop indicator */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="relative h-5 w-5 rounded-full border border-dashed border-amber-500/20 sm:h-7 sm:w-7 lg:h-9 lg:w-9"
      >
        <div className="absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-500/60 sm:h-1.5 sm:w-1.5 lg:h-2 lg:w-2" />
      </motion.div>
    </div>
  );
}

// Fiber Tree Visualization Component
function FiberTreeVisualization() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-3 py-6 sm:gap-4 sm:px-6 sm:py-8 lg:gap-6 lg:px-10 lg:py-12">
      <span className="text-xs font-medium text-[#61DBFB]/80 sm:text-sm lg:text-base">
        React Fiber Tree
      </span>

      <div className="flex flex-col items-center">
        {/* Root node */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(97,219,251,0)",
              "0 0 8px 2px rgba(97,219,251,0.3)",
              "0 0 0 0 rgba(97,219,251,0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-[#61DBFB]/40 bg-[#61DBFB]/15 text-[7px] font-medium text-[#61DBFB] sm:h-9 sm:w-9 sm:text-[9px] lg:h-12 lg:w-12 lg:rounded-lg lg:text-xs"
        >
          App
        </motion.div>

        {/* Connector line */}
        <div className="h-2 w-px bg-linear-to-b from-[#61DBFB]/30 to-zinc-700/30 sm:h-4 lg:h-6" />

        {/* Second level */}
        <div className="flex items-start gap-3 sm:gap-6 lg:gap-10">
          {[
            { name: "Header", delay: 0 },
            { name: "Main", delay: 0.3 },
            { name: "Footer", delay: 0.6 },
          ].map((node) => (
            <div key={node.name} className="flex flex-col items-center">
              <div className="h-px w-2 bg-zinc-700/30 sm:w-3 lg:w-4" />
              <motion.div
                initial={{ opacity: 0.4 }}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: node.delay,
                }}
                className="flex h-5 w-9 items-center justify-center rounded border border-amber-500/30 bg-amber-500/10 text-[6px] text-amber-400/90 sm:h-7 sm:w-14 sm:text-[8px] lg:h-9 lg:w-20 lg:rounded-md lg:text-[11px]"
              >
                {node.name}
              </motion.div>

              {/* Child nodes for Main */}
              {node.name === "Main" && (
                <>
                  <div className="h-1.5 w-px bg-zinc-700/20 sm:h-2 lg:h-4" />
                  <div className="flex gap-1 sm:gap-2 lg:gap-3">
                    {["A", "B"].map((child, j) => (
                      <motion.div
                        key={child}
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: j * 0.4,
                        }}
                        className="flex h-4 w-4 items-center justify-center rounded border border-zinc-700 bg-zinc-800/50 text-[5px] text-zinc-500 sm:h-5 sm:w-5 sm:text-[7px] lg:h-7 lg:w-7 lg:text-[9px]"
                      >
                        {child}
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reconciliation indicator */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-1 text-[7px] text-zinc-600 sm:text-[9px] lg:text-xs"
      >
        reconciling...
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Gradient Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 2 }}
          className="absolute -top-20 -left-20 h-[300px] w-[300px] rounded-full bg-linear-to-r from-amber-500/30 to-orange-600/30 blur-[80px] sm:-top-40 sm:-left-40 sm:h-[500px] sm:w-[500px] sm:blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute top-1/3 -right-20 h-[250px] w-[250px] rounded-full bg-linear-to-l from-[#61DBFB]/30 to-cyan-500/30 blur-[80px] sm:-right-40 sm:h-[400px] sm:w-[400px] sm:blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, delay: 0.6 }}
          className="absolute -bottom-10 left-1/4 h-[200px] w-[300px] rounded-full bg-linear-to-t from-yellow-500/20 to-orange-500/15 blur-[60px] sm:-bottom-20 sm:left-1/3 sm:h-[300px] sm:w-[600px] sm:blur-[100px]"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[32px_32px] sm:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] sm:bg-size-[48px_48px]"
        style={{
          maskImage:
            "radial-gradient(ellipse at center, black 50%, transparent 85%)",
        }}
      />

      {/* Main Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24"
      >
        {/* Announcement Badge */}
        <motion.div variants={fadeUp}>
          <Badge
            variant="outline"
            className="mb-4 border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300 backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-1.5 sm:text-sm"
          >
            <Sparkles className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-3.5 sm:w-3.5" />
            Visualize React Under the Hood
          </Badge>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={fadeUp}
          className="max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
        >
          Learn React & Web Dev{" "}
          <span className="bg-linear-to-r from-amber-400 via-orange-400 to-[#61DBFB] bg-clip-text text-transparent">
            Visually
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-xl px-4 text-base text-zinc-400 sm:mt-6 sm:max-w-2xl sm:px-0 sm:text-lg md:text-xl"
        >
          Interactive visualizers that help you understand complex concepts like
          Virtual DOM, Fiber, Reconciliation, Event Loop, and more — all in one
          place.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={fadeUp} className="mt-8 sm:mt-10">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17,
            }}
          >
            <Button
              size="lg"
              onClick={() => {
                const section = document.getElementById("feature-section");
                section?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="group relative overflow-hidden bg-linear-to-r from-amber-500 to-orange-500 px-6 text-sm text-white shadow-lg shadow-amber-500/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-amber-500/25 sm:px-8 sm:text-base"
            >
              <span className="relative z-10 flex items-center">
                Explore Visualizers
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:mt-16 sm:gap-3"
        >
          {[
            { icon: Code2, label: "Virtual DOM" },
            { icon: Layers, label: "Fiber Architecture" },
            { icon: Zap, label: "Event Loop" },
          ].map((feature) => (
            <motion.div
              key={feature.label}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-sm transition-colors hover:border-zinc-700 hover:text-zinc-300 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
            >
              <feature.icon className="h-3.5 w-3.5 text-[#61DBFB] sm:h-4 sm:w-4" />
              {feature.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Preview Card - Single Column Visualizations */}
        <motion.div
          variants={scaleIn}
          className="mt-10 w-full max-w-xl sm:mt-16 sm:max-w-2xl lg:max-w-3xl"
        >
          <div className="relative rounded-lg border border-zinc-800 bg-zinc-900/40 p-1 backdrop-blur-xl sm:rounded-xl">
            {/* Browser-style header */}
            <div className="flex items-center gap-2 rounded-t-md border-b border-zinc-800 bg-zinc-950/50 px-3 py-2 sm:rounded-t-lg sm:px-4 sm:py-3">
              <div className="flex gap-1 sm:gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500/80 sm:h-3 sm:w-3" />
                <div className="h-2 w-2 rounded-full bg-yellow-500/80 sm:h-3 sm:w-3" />
                <div className="h-2 w-2 rounded-full bg-green-500/80 sm:h-3 sm:w-3" />
              </div>
              <div className="ml-2 flex-1 rounded bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-500 sm:ml-4 sm:rounded-md sm:px-3 sm:py-1 sm:text-xs">
                react-visualizer.dev
              </div>
            </div>

            {/* Single Column Visualizations */}
            <div className="flex flex-col divide-y divide-zinc-800 rounded-b-md bg-linear-to-br from-zinc-900 via-zinc-900 to-zinc-950 sm:rounded-b-lg">
              <EventLoopVisualization />
              <FiberTreeVisualization />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
