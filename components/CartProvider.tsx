"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  id: string;
  beatId?: number;
  title: string;
  artist: string;
  slug: string;
  license: string;
  price: number;
  artworkUrl?: string | null;
}

export interface AddToCartItem {
  beatId?: number;
  title: string;
  artist: string;
  slug: string;
  license: string;
  price: number;
  artworkUrl?: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: AddToCartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | null>(
  null
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(item: AddToCartItem) {
    setCart((previousCart) => {
      const duplicate = previousCart.some(
        (cartItem) =>
          cartItem.slug === item.slug &&
          cartItem.license === item.license
      );

      if (duplicate) {
        return previousCart;
      }

      const newItem: CartItem = {
        ...item,
        id: crypto.randomUUID(),
      };

      return [...previousCart, newItem];
    });
  }

  function removeFromCart(id: string) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );
  }

  function clearCart() {
    setCart([]);
  }

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.price,
      0
    );
  }, [cart]);

  const cartCount = cart.length;

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
    }),
    [cart, cartTotal, cartCount]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}