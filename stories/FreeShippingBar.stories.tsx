import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { FreeShippingBar } from '../app/components/FreeShippingBar';

const meta: Meta<typeof FreeShippingBar> = {
  title: 'Farmart/FreeShippingBar',
  component: FreeShippingBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gamified cart threshold tracker incentivizing higher order totals to reach free shipping. Turns emerald upon qualification.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentAmount: {
      control: 'number',
      description: 'Current basket or item amount',
    },
    threshold: {
      control: 'number',
      description: 'Free shipping qualifying target (default $99.00)',
    },
    currency: {
      control: 'text',
      description: 'Currency symbol (default $)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FreeShippingBar>;

export const PartialProgress: Story = {
  args: {
    currentAmount: 45.0,
    threshold: 99.0,
    currency: '$',
  },
};

export const NearGoal: Story = {
  args: {
    currentAmount: 88.5,
    threshold: 99.0,
    currency: '$',
  },
};

export const GoalAchieved: Story = {
  args: {
    currentAmount: 115.0,
    threshold: 99.0,
    currency: '$',
  },
};

export const InteractiveSimulator: Story = {
  render: () => {
    const [amount, setAmount] = useState(35);
    return (
      <div className="max-w-xl mx-auto space-y-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <FreeShippingBar currentAmount={amount} threshold={99} />
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setAmount(20)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded"
          >
            $20 (Low)
          </button>
          <button
            type="button"
            onClick={() => setAmount(75)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded"
          >
            $75 (Close)
          </button>
          <button
            type="button"
            onClick={() => setAmount(105)}
            className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded"
          >
            $105 (Free Delivery)
          </button>
        </div>
      </div>
    );
  },
};
