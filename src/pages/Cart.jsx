// pages/Cart.jsx
import React, { useEffect, useState, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";

// Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Cart = () => {
  const { cart, updateQuantity, removeItem, addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Normalize cart items to ensure images array exists
  const normalizeCartItems = (items) => {
    return items.map((item) => ({
      ...item,
      images: item.images || (item.imageUrl ? [item.imageUrl] : []),
    }));
  };

  useEffect(() => {
    if (cart) setLoading(false);

    // Fetch related products
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        let data = await res.json();

        // Exclude items already in cart
        data = data.filter((p) => !cart.items.some((ci) => ci.productId === p._id)).slice(0, 6);

        setRelatedProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRelated();
  }, [cart]);

  if (loading) return <Spinner />;

  const subtotal = cart.items.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );

  const normalizedItems = normalizeCartItems(cart.items);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-900">
          Shopping Cart
        </h1>

        {normalizedItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-12">
            Your cart is empty 😢
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {normalizedItems.map((item) => {
                const imageSrc =
                  item.images && item.images.length > 0
                    ? item.images[0]
                    : "/placeholder.png";

                return (
                  <div
                    key={item.productId}
                    className="flex flex-col md:flex-row items-center md:items-start justify-between bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition-shadow duration-300"
                  >
   <img
  src={item.imageUrl || "/placeholder.png"}
  alt={item.name}
  className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-lg"
/>


                    <div className="flex-1 md:ml-6 mt-4 md:mt-0 w-full">
                      <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                      <p className="text-gray-500 mt-1 text-lg">
                        ₹{item.price?.toLocaleString("en-IN") || 0}
                      </p>
                      <div className="flex items-center mt-3 space-x-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item, parseInt(e.target.value))
                          }
                          className="w-20 text-center border border-gray-300 rounded-lg py-1"
                        />
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow-lg rounded-xl p-6 md:sticky md:top-28">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">₹0</span>
                </div>
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <button className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition-colors text-lg font-semibold">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 text-center relative">
              Hey, take a look — you may also like this
              <span className="block w-24 h-1 bg-black mx-auto mt-2 rounded-full"></span>
            </h2>

            <div className="flex space-x-4 overflow-x-auto pb-4">
              {relatedProducts.map((p) => {
                const thumb = p.images && p.images.length > 0 ? p.images[0] : "/placeholder.png";

                return (
                  <div
                    key={p._id}
                    className="flex-none w-64 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                  >
                    <img
                      src={thumb}
                      alt={p.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {p.name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        ₹{p.price?.toLocaleString("en-IN")}
                      </p>
                      <button
                        className="mt-3 w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors"
                        onClick={() => addToCart(p, 1)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
