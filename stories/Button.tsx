import type { CSSProperties } from 'react';

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? 'bg-[#555ab9] text-white'
    : 'bg-transparent text-[#333] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15)]';
  const sizes = {
    small: 'px-4 py-2.5 text-xs',
    medium: 'px-5 py-[11px] text-sm',
    large: 'px-6 py-3 text-base',
  };
  return (
    <button
      type="button"
      className={`inline-block cursor-pointer border-0 rounded-[3em] font-bold leading-none font-storybook ${sizes[size]} ${mode} ${backgroundColor ? 'bg-(--button-background)!' : ''}`}
      style={backgroundColor ? { '--button-background': backgroundColor } as CSSProperties : undefined}
      {...props}
    >
      {label}
    </button>
  );
};
