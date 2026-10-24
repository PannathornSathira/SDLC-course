"use client";

import React from "react";

export interface FreeShippingBarProps {
  currentAmount: number;
  threshold?: number;
  currency?: string;
  className?: string;
}

export function FreeShippingBar({
  currentAmount,
  threshold = 99,
  currency = "$",
  className = "",
}: FreeShippingBarProps) {
  const percent = Math.min(100, Math.max(0, (currentAmount / threshold) * 100));
  const remaining = Math.max(0, threshold - currentAmount);
  const isQualified = remaining === 0;

  return (
    <div
      className={`bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gray-800 flex items-center gap-1.5">
          <span>🚚</span>
          {isQualified ? (
            <strong className="text-emerald-700">
              Congratulations! You unlocked FREE Delivery!
            </strong>
          ) : (
            <span>
              Add{" "}
              <strong className="text-amber-700 font-bold">
                {currency}
                {remaining.toFixed(2)}
              </strong>{" "}
              more to enjoy <strong>FREE Shipping</strong>
            </span>
          )}
        </span>
        <span className="text-[11px] font-bold text-gray-500 font-mono">
          {percent.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200/80 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isQualified
              ? "bg-emerald-500"
              : "bg-gradient-to-r from-amber-400 to-[#fab528]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default FreeShippingBar;
