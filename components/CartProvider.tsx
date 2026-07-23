"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

export type CartItem = {
  title: string;
  license: string;
  price: number;
};

type CartContextType = {
  cart: CartItem[];
  isOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(
  null
);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    setIsOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const openCart = () => {
    setIsOpen(true);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        addToCart,
        removeFromCart,
        openCart,
        closeCart,
        toggleCart,
        clearCart,
      }}
    >
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