import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { QuantityStepper } from '../app/components/QuantityStepper';

const meta: Meta<typeof QuantityStepper> = {
  title: 'Farmart/QuantityStepper',
  component: QuantityStepper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Interactive numeric stepper for cart adjustments, card deal pickers, and detail purchase panels. Supports min/max bounds and size variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Physical dimension variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the stepper controls are disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuantityStepper>;

export const MediumDefault: Story = {
  render: () => {
    const [val, setVal] = useState(1);
    return (
      <div className="flex flex-col items-center gap-2">
        <QuantityStepper value={val} onChange={setVal} min={1} max={99} size="md" />
        <span className="text-xs text-gray-500 font-mono">Current Quantity: {val}</span>
      </div>
    );
  },
};

export const SmallSize: Story = {
  render: () => {
    const [val, setVal] = useState(2);
    return (
      <div className="flex flex-col items-center gap-2">
        <QuantityStepper value={val} onChange={setVal} min={1} max={10} size="sm" />
        <span className="text-xs text-gray-500 font-mono">Compact Stepper: {val}</span>
      </div>
    );
  },
};

export const LargeSize: Story = {
  render: () => {
    const [val, setVal] = useState(4);
    return (
      <div className="flex flex-col items-center gap-2">
        <QuantityStepper value={val} onChange={setVal} min={1} max={50} size="lg" />
        <span className="text-xs text-gray-500 font-mono">Prominent Stepper: {val}</span>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    value: 3,
    onChange: () => {},
    disabled: true,
    size: 'md',
  },
};
