// context/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || "guest"; // ✅ logged-in user ID or guest
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  // Load cart when app starts or user changes
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/api/cart/${userId}`)
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error("Error loading cart:", err));
  }, [API_URL, userId]);

  // Utility: pick correct image (first image if exists, else fallback)
  const getCartImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.imageUrl) {
      return product.imageUrl;
    }
    return "/placeholder.png"; // ✅ default fallback
  };

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    const existingItem = cart.items.find((i) => i.productId === product._id);
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    try {
      const res = await fetch(`${API_URL}/api/cart/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          price: Number(product.price),
          imageUrl: getCartImage(product), // ✅ match backend field
          quantity: newQuantity,
        }),
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Update quantity
  const updateQuantity = async (item, quantity) => {
    if (quantity <= 0) return removeItem(item.productId);

    try {
      const res = await fetch(`${API_URL}/api/cart/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          name: item.name,
          price: Number(item.price),
          imageUrl: item.imageUrl || "/placeholder.png", // ✅ match backend field
          quantity,
        }),
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/api/cart/${userId}/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};
