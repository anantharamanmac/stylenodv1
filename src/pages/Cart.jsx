// pages/Cart.jsx
import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Cart = () => {
  const { cart, updateQuantity, removeItem } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (cart) setLoading(false);
  }, [cart]);

  // Fetch related products based on cart categories
  useEffect(() => {
    const fetchRelated = async () => {
      if (!cart.items || cart.items.length === 0) return;

      try {
        const categories = [...new Set(cart.items.map((ci) => ci.category))];
        let allRelated = [];

        for (const cat of categories) {
          const res = await fetch(
            `${BACKEND_URL}/api/products?category=${encodeURIComponent(cat)}`
          );
          if (res.ok) {
            const data = await res.json();
            allRelated = [...allRelated, ...data];
          }
        }

        const cartIds = cart.items.map((item) => item.productId);
        const filtered = allRelated.filter((p) => !cartIds.includes(p._id));

        setRelatedProducts(filtered.slice(0, 6));
      } catch (err) {
        console.error("Related products fetch error:", err);
      }
    };

    fetchRelated();
  }, [cart]);

  if (loading) return <Spinner />;

  const subtotal = cart.items.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );

  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );
  const progress =
    subtotal >= freeShippingThreshold
      ? 100
      : Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">Cart</h1>

          {/* Free Shipping Banner */}
          <div className="bg-white shadow rounded-lg p-4 mb-10 text-center">
            {remainingForFreeShipping > 0 ? (
              <p className="text-gray-700">
                Shop for{" "}
                <span className="font-semibold">
                  ₹{remainingForFreeShipping.toLocaleString("en-IN")}
                </span>{" "}
                more to enjoy <span className="font-semibold">FREE Shipping</span>
              </p>
            ) : (
              <p className="font-semibold text-green-600">
                You unlocked FREE Shipping 🎉
              </p>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-black h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {cart.items.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-12">
              Your cart is empty 😢
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="md:col-span-2 space-y-6">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between bg-white shadow rounded-lg p-5"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.imageUrl || "/placeholder.png"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-gray-500">₹{item.price}</p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 text-sm mt-1 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity with + / - buttons */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item, Math.max(1, item.quantity - 1))
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                        >
                          −
                        </button>

                        <span className="px-3 font-medium">{item.quantity}</span>

                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="bg-white shadow rounded-lg p-6 space-y-6">
                {/* Coupon */}
                <div>
                  <h2 className="font-semibold mb-2">Have a coupon?</h2>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 border rounded-lg px-3 py-2"
                    />
                    <button className="bg-black text-white px-4 py-2 rounded-lg">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>₹{remainingForFreeShipping === 0 ? 0 : 50}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ₹
                      {(subtotal +
                        (remainingForFreeShipping === 0 ? 0 : 50)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900">
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">Hope you like</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
