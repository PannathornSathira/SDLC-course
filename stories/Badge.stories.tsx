import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge } from '../app/components/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Farmart/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic status badge system adhering to Farmart DESIGN.md specifications. Used for flash deals, stock velocity, and quality certifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['deal', 'save', 'bestseller', 'topsaver', 'instock', 'outstock', 'organic'],
      description: 'Visual semantic style variant',
    },
    children: {
      control: 'text',
      description: 'Label content displayed inside the badge',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const FlashDeal: Story = {
  args: {
    variant: 'deal',
    children: 'SALE 25% OFF',
  },
};

export const DiscountSave: Story = {
  args: {
    variant: 'save',
    children: 'Save $5.00',
  },
};

export const BestSeller: Story = {
  args: {
    variant: 'bestseller',
    children: 'Best Seller',
  },
};

export const TopSaver: Story = {
  args: {
    variant: 'topsaver',
    children: 'Top Saver Today',
  },
};

export const InStock: Story = {
  args: {
    variant: 'instock',
    children: 'In Stock (20 units left)',
  },
};

export const OutOfStock: Story = {
  args: {
    variant: 'outstock',
    children: 'Currently Out of Stock',
  },
};

export const CertifiedOrganic: Story = {
  args: {
    variant: 'organic',
    children: '100% Certified Organic',
  },
};

export const AllVariantsShowcase: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
      <Badge variant="deal">SALE 20% OFF</Badge>
      <Badge variant="save">Save 15%</Badge>
      <Badge variant="bestseller">Best Seller</Badge>
      <Badge variant="topsaver">Top Saver</Badge>
      <Badge variant="instock">In Stock</Badge>
      <Badge variant="outstock">Sold Out</Badge>
      <Badge variant="organic">100% Organic</Badge>
    </div>
  ),
};
