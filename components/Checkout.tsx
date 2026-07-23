"use client";

import { CreditCard, X } from "lucide-react";

import { useCart } from "./CartProvider";

type CheckoutProps = {
  open: boolean;
  onClose: () => void;
};

export default function Checkout({
  open,
  onClose,
}: CheckoutProps) {
  const { cart } = useCart();

  if (!open) return null;

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111111] p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-blue-500">
              Checkout
            </p>

            <h2 className="text-3xl font-black text-white">
              Complete Your Order
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="rounded-full border border-white/10 p-2 text-gray-400 transition hover:border-blue-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 space-y-3">
          {cart.map((item, index) => (
            <div
              key={`${item.title}-${item.license}-${index}`}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div>
                <h3 className="font-bold text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {item.license}
                </p>
              </div>

              <span className="font-black text-blue-500">
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between border-t border-white/10 pt-5">
          <span className="text-gray-400">
            Total
          </span>

          <span className="text-3xl font-black text-white">
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
          <div className="flex items-center gap-3">
            <CreditCard className="text-blue-500" />

            <div>
              <h3 className="font-bold text-white">
                Payment Coming Next
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-400">
                Stripe checkout will connect here after
                the full site is restored.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-not-allowed rounded-full bg-blue-600/50 px-6 py-4 font-bold text-white/70"
        >
          Pay ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}