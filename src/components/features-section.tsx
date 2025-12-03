// components/features-section.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  Layers,
  Zap,
  GitBranch,
  RefreshCw,
  Clock,
  Sparkles,
  Box,
  Workflow,
  Binary,
  Lock,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

const visualizers = [
  {
    title: "React Suspense, Concurrent & Optimistic UI",
    description:
      "Understand how React handles async operations, concurrent rendering, and optimistic updates visually.",
    icon: RefreshCw,
    href: "/visualizers/suspense-concurrent",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    borderHover: "hover:border-amber-500/50",
    enabled: true, 
  },
  {
    title: "Virtual DOM & Reconciliation",
    description:
      "See how React's diffing algorithm works and how changes propagate through the virtual DOM tree.",
    icon: GitBranch,
    href: "/visualizers/virtual-dom",
    gradient: "from-[#61DBFB]/20 to-cyan-500/20",
    iconColor: "text-[#61DBFB]",
    borderHover: "hover:border-[#61DBFB]/50",
    enabled: false,
  },
  {
    title: "React Fiber Architecture",
    description:
      "Explore the internal Fiber tree structure and understand how React schedules and prioritizes updates.",
    icon: Layers,
    href: "/visualizers/fiber",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
    borderHover: "hover:border-violet-500/50",
    enabled: false,
  },
  {
    title: "JavaScript Event Loop",
    description:
      "Visualize the call stack, Web APIs, callback queue, and microtask queue in action.",
    icon: Zap,
    href: "/visualizers/event-loop",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400",
    borderHover: "hover:border-emerald-500/50",
    enabled: false,
  },
  {
    title: "React Hooks Lifecycle",
    description:
      "Understand when useEffect, useMemo, useCallback, and other hooks execute in the component lifecycle.",
    icon: Clock,
    href: "/visualizers/hooks-lifecycle",
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
    borderHover: "hover:border-rose-500/50",
    enabled: false,
  },
  {
    title: "State Management Flow",
    description:
      "See how state flows through Context, Redux, Zustand, and other state management patterns.",
    icon: Workflow,
    href: "/visualizers/state-management",
    gradient: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-400",
    borderHover: "hover:border-sky-500/50",
    enabled: false,
  },
  {
    title: "Server Components & RSC",
    description:
      "Explore how React Server Components work and the boundary between server and client.",
    icon: Box,
    href: "/visualizers/server-components",
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-400",
    borderHover: "hover:border-orange-500/50",
    enabled: false,
  },
  {
    title: "Closures & Lexical Scope",
    description:
      "Visualize JavaScript closures, scope chains, and how variables are captured in functions.",
    icon: Binary,
    href: "/visualizers/closures",
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-400",
    borderHover: "hover:border-teal-500/50",
    enabled: false,
  },
];

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  gradient: string;
  iconColor: string;
  borderHover: string;
  enabled: boolean;
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  gradient,
  iconColor,
  borderHover,
  enabled,
}: FeatureCardProps) {
  const cardContent = (
    <motion.div
      whileHover={enabled ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative h-full overflow-hidden rounded-xl border bg-zinc-900/50 p-5 backdrop-blur-sm transition-colors duration-300 sm:p-6 ${
        enabled
          ? `border-zinc-800 ${borderHover}`
          : "border-zinc-800/50"
      }`}
    >
      {/* Disabled overlay */}
      {!enabled && (
        <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[1px]" />
      )}

      {/* Coming Soon badge for disabled cards */}
      {!enabled && (
        <div className="absolute right-3 top-3 z-30 flex items-center gap-1 rounded-full border border-zinc-700/50 bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400 sm:right-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-xs">
          <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          Coming Soon
        </div>
      )}

      {/* Background gradient on hover (only for enabled) */}
      {enabled && (
        <div
          className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 ${!enabled ? "opacity-50" : ""}`}>
        {/* Icon and Arrow */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-zinc-900 transition-colors sm:h-12 sm:w-12 ${
              enabled
                ? "border-zinc-800 group-hover:border-zinc-700"
                : "border-zinc-800/50"
            }`}
          >
            <Icon
              className={`h-5 w-5 sm:h-6 sm:w-6 ${
                enabled ? iconColor : "text-zinc-600"
              }`}
            />
          </div>
          {enabled && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </motion.div>
          )}
        </div>

        {/* Title */}
        <h3
          className={`mb-2 text-base font-semibold transition-colors sm:text-lg ${
            enabled ? "text-white group-hover:text-white" : "text-zinc-400"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-sm leading-relaxed transition-colors ${
            enabled
              ? "text-zinc-500 group-hover:text-zinc-400"
              : "text-zinc-600"
          }`}
        >
          {description}
        </p>
      </div>

      {/* Bottom gradient line (only for enabled) */}
      {enabled && (
        <div
          className={`absolute bottom-0 left-0 h-px w-full bg-linear-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        />
      )}
    </motion.div>
  );

  return (
    <motion.div variants={cardVariants}>
      {enabled ? (
        <Link
          href={href}
          className="group block h-full cursor-pointer"
        >
          {cardContent}
        </Link>
      ) : (
        <div className="group block h-full cursor-not-allowed">
          {cardContent}
        </div>
      )}
    </motion.div>
  );
}


export default function FeaturesSection() {
  return (
    <section id="feature-section" className="relative w-full overflow-hidden bg-black py-16 sm:py-24 lg:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-linear-to-b from-amber-500/10 to-transparent blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[48px_48px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:mb-16"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400 sm:px-4 sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Interactive Visualizers
          </div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Explore{" "}
            <span className="bg-linear-to-r from-amber-400 to-[#61DBFB] bg-clip-text text-transparent">
              Core Concepts
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-zinc-500 sm:text-base md:text-lg">
            Dive deep into React and JavaScript internals with our interactive
            visualizers. Understand how things work under the hood.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
        >
          {visualizers.map((visualizer) => (
            <FeatureCard key={visualizer.title} {...visualizer} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center sm:mt-16"
        >
          <p className="text-sm text-zinc-600">
            More visualizers coming soon.{" "}
            {/* <Link
              href="/request"
              className="text-amber-400/80 underline-offset-4 transition-colors hover:text-amber-400 hover:underline"
            >
              Request a topic →
            </Link> */}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
