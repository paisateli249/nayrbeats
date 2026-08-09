"use client";

import { useEffect, useState } from "react";

import { useCart } from "./CartProvider";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] =
    useState(false);
  const [checkoutError, setCheckoutError] =
    useState("");

  const {
    cart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function browseBeats() {
    setIsOpen(false);

    setTimeout(() => {
      document
        .getElementById("beats")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 250);
  }

  async function handleCheckout() {
    if (cart.length === 0 || isCheckingOut) {
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      const response = await fetch(
        "/api/checkout",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            items: cart.map((item) => ({
              beatId: item.beatId,
              title: item.title,
              artist: item.artist,
              slug: item.slug,
              license: item.license,
              price: item.price,
              artworkUrl:
                item.artworkUrl ?? null,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to start checkout."
        );
      }

      if (!data.url) {
        throw new Error(
          "Stripe checkout URL was not returned."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Unable to start checkout."
      );

      setIsCheckingOut(false);
    }
  }

  return (
    <>
      {/* Cart button */}
      <button
        type="button"
        onClick={() => {
          setCheckoutError("");
          setIsOpen(true);
        }}
        aria-label="Open cart"
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-blue-500 hover:bg-blue-600/20"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="20" r="1" />
          <circle cx="19" cy="20" r="1" />
          <path d="M3 4h2l2.5 11h10l2-8H6" />
        </svg>

        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white">
            {cartCount}
          </span>
        )}
      </button>

      {/* Background overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close cart"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[80] cursor-default bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Cart drawer */}
      <aside
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0b0b0b] shadow-2xl transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "pointer-events-none translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">
              NAYRBEATS
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Your Cart
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-blue-500 hover:text-blue-400"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <svg
                  viewBox="0 0 24 24"
                  className="h-9 w-9 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="19" cy="20" r="1" />
                  <path d="M3 4h2l2.5 11h10l2-8H6" />
                </svg>
              </div>

              <h3 className="mt-5 text-xl font-black text-white">
                Your cart is empty
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                Choose a license from one of the
                beats to add it to your cart.
              </p>

              <button
                type="button"
                onClick={browseBeats}
                className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                Browse Beats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-black text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1 truncate text-sm text-gray-500">
                        {item.artist}
                      </p>

                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                        {item.license}
                      </p>

                      <p className="mt-3 font-bold text-white">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      aria-label={`Remove ${item.title} from cart`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M6 6l12 12" />
                        <path d="M18 6 6 18" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout area */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 bg-[#080808] px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                Total
              </span>

              <span className="text-2xl font-black text-white">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {checkoutError && (
              <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {checkoutError}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                void handleCheckout();
              }}
              disabled={isCheckingOut}
              className="mt-5 w-full rounded-full bg-blue-600 px-6 py-4 font-black text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingOut
                ? "Opening Checkout..."
                : "Continue To Checkout"}
            </button>

            <button
              type="button"
              onClick={() => {
                clearCart();
                setCheckoutError("");
              }}
              disabled={isCheckingOut}
              className="mt-3 w-full rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Cart
            </button>

            <p className="mt-3 text-center text-xs text-gray-600">
              Secure checkout for NAYRBEATS
              licenses
            </p>
          </div>
        )}
      </aside>
    </>
  );
}