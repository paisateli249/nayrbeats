"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import { useCart } from "./CartProvider";
import Checkout from "./Checkout";

export default function Cart() {
  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] =
    useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const handleCheckout = () => {
    closeCart();
    setCheckoutOpen(true);
  };

  return (
    <>
      {/* Dark Background */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close shopping cart"
          onClick={closeCart}
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Cart Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[90] h-full w-full max-w-md border-l border-white/10 bg-[#0d0d0d] shadow-2xl transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-blue-500" />

              <div>
                <h2 className="text-2xl font-black text-white">
                  Your Cart
                </h2>

                <p className="text-sm text-gray-400">
                  {cart.length}{" "}
                  {cart.length === 1
                    ? "item"
                    : "items"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              aria-label="Close shopping cart"
              className="rounded-full border border-white/10 p-2 text-gray-400 transition hover:border-blue-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-5 rounded-full bg-blue-500/10 p-5">
                  <ShoppingBag
                    size={36}
                    className="text-blue-500"
                  />
                </div>

                <h3 className="text-xl font-bold text-white">
                  Your cart is empty
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
                  Choose a beat and select a license
                  to add it to your cart.
                </p>

                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
                >
                  Browse Beats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.title}-${item.license}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          {item.license}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(index)
                        }
                        aria-label={`Remove ${item.title} from cart`}
                        className="rounded-full p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="mt-4 text-xl font-black text-blue-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t border-white/10 bg-[#111111] px-6 py-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-gray-400">
                  Total
                </span>

                <span className="text-3xl font-black text-white">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded-full bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-500"
              >
                Continue to Checkout
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Secure checkout for your selected
                licenses.
              </p>
            </div>
          )}
        </div>
      </aside>

      <Checkout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}