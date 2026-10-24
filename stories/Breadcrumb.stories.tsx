import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Breadcrumb } from '../app/components/Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Farmart/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Semantic navigation breadcrumb hierarchy allowing quick ascending navigation through departments and subcategories.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const ThreeLevel: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Beverages', href: '/' },
      { label: 'Craft Beer & Cider' },
    ],
  },
};

export const DeepProductHierarchy: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Beverages & Drinks', href: '/' },
      { label: 'Craft & Canned Beer', href: '/' },
      { label: 'Ice Golds Beer Can (24 x 330ml)' },
    ],
  },
};
