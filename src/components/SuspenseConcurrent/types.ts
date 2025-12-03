import { LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline";

export interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}

export interface CardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export interface ExplainBoxProps {
  title?: string;
  children: React.ReactNode;
}

export interface PageContentProps {
  page: string;
}

export interface PageSkeletonProps {
  isLegacy: boolean;
}

export type TabMode = "legacy" | "modern";
export type DemoStatus = "idle" | "pending" | "done";
export type FiberStage = "idle" | "fork" | "work" | "commit";

export interface TimelineStep {
  t: number;
  s: number;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
}
