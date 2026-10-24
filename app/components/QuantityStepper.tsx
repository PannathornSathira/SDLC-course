"use client";

import React from "react";

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  disabled = false,
  className = "",
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  const sizeStyles = {
    sm: {
      btn: "px-2 py-0.5 text-xs",
      input: "w-8 py-0.5 text-xs",
      container: "h-7",
    },
    md: {
      btn: "px-3 py-1.5 text-xs",
      input: "w-10 py-1.5 text-xs",
      container: "h-9",
    },
    lg: {
      btn: "px-4 py-2 text-sm",
      input: "w-12 py-2 text-sm",
      container: "h-11",
    },
  }[size];

  return (
    <div
      className={`inline-flex items-center border border-gray-200 bg-white rounded-lg shadow-xs overflow-hidden select-none ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${sizeStyles.container} ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min || disabled}
        className={`${sizeStyles.btn} font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer`}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span
        className={`${sizeStyles.input} font-bold text-gray-900 text-center font-mono`}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max || disabled}
        className={`${sizeStyles.btn} font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;
