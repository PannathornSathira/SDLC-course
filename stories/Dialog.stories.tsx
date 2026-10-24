import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Dialog } from '../app/components/Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Farmart/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modal Dialog component created from Farmart DESIGN.md specification. Features backdrop blur, 16px corner radius, hairline borders, shadow-2xl elevation, and accessible ESC-to-close behavior.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Confirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-xs"
        >
          Open Confirmation Dialog
        </button>

        <Dialog
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Empty Shopping Cart?"
          description="Are you sure you want to remove all 3 items ($2,450.59) from your cart?"
          maxWidth="sm"
          footer={
            <>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-[#ff4d4f] hover:bg-red-600 text-white rounded-lg text-xs font-bold"
              >
                Yes, Empty Cart
              </button>
            </>
          }
        >
          <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl flex items-start gap-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <p className="text-xs text-red-900 leading-relaxed">
              This action cannot be undone. Saved special deals and promotional coupon reserves will be released.
            </p>
          </div>
        </Dialog>
      </div>
    );
  },
};

export const ProductQuickView: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [qty, setQty] = useState(1);

    return (
      <div className="p-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-[#fab528] hover:bg-[#e5a420] text-gray-950 font-bold px-4 py-2 rounded-lg text-xs"
        >
          Open Product Quick View
        </button>

        <Dialog
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Ice Gold's Beer 350ml x 24 Pieces"
          description="Brand: Brand Name • Category: Chilled Beverages • SKU: BEER-350-24"
          maxWidth="lg"
          footer={
            <>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-2 bg-[#fab528] hover:bg-[#e5a420] text-gray-950 rounded-lg text-xs font-bold"
              >
                + Add to Cart • ${(49.5 * qty).toFixed(2)}
              </button>
            </>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="bg-emerald-50/60 rounded-xl p-4 flex items-center justify-center h-48 border border-emerald-100">
              <div className="text-center">
                <span className="text-6xl">🍺</span>
                <p className="text-[10px] font-bold text-emerald-800 mt-2 uppercase tracking-wider">
                  Premium Lager 24-Pack
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <span className="text-xs text-gray-400 font-medium">(3 customer reviews)</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-950">$49.50</span>
                <span className="text-xs text-gray-400 line-through">$58.00</span>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Save 15%
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Freshly chilled premium golden lager crafted with all-natural barley. Sold in convenient 24-can party box.
              </p>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-[11px] font-semibold text-gray-700 mb-1.5">Quantity:</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-semibold text-gray-900">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">In Stock: 20 packs left</span>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  },
};

export const MembershipOffer: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-xs"
        >
          Open 15% OFF Modal
        </button>

        <Dialog
          isOpen={open}
          onClose={() => setOpen(false)}
          title="🎁 Unlock 15% OFF Your First Order"
          description="Join the Farmart Member Circle to receive immediate savings on your grocery basket."
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-800 text-xs font-semibold"
              >
                No thanks, maybe later
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-2 bg-[#fab528] hover:bg-[#e5a420] text-gray-950 rounded-lg text-xs font-bold"
              >
                Register Now & Claim 15%
              </button>
            </>
          }
        >
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="yourdomain@gmail.com"
                defaultValue="customer@example.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                defaultValue="farmart2026"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
              />
            </div>
          </div>
        </Dialog>
      </div>
    );
  },
};
