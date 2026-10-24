"use client";

import React from "react";

export type BadgeVariant =
  | "deal"
  | "save"
  | "bestseller"
  | "topsaver"
  | "instock"
  | "outstock"
  | "organic";

export interface BadgeProps {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "deal", children, className = "" }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1 font-bold text-[10px] tracking-wide rounded-md px-2 py-0.5 transition-colors whitespace-nowrap";

  const variantStyles: Record<BadgeVariant, string> = {
    deal: "bg-[#e05638] text-white shadow-xs",
    save: "bg-[#ff4d4f] text-white shadow-xs",
    bestseller:
      "bg-amber-100 text-amber-900 border border-amber-300/80 font-bold",
    topsaver:
      "bg-emerald-100 text-emerald-900 border border-emerald-300/80 font-bold",
    instock:
      "bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold",
    outstock: "bg-gray-100 text-gray-500 border border-gray-200 font-semibold",
    organic: "bg-green-100 text-green-800 border border-green-300/80 font-bold",
  };

  const icons: Partial<Record<BadgeVariant, React.ReactNode>> = {
    bestseller: <span>🔥</span>,
    topsaver: <span>💰</span>,
    instock: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>,
    outstock: <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>,
    organic: <span>🌿</span>,
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {icons[variant]}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
