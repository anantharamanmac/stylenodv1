import React, { useState, useContext } from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

const handleAddToCart = async (e) => {
  e.stopPropagation();
  setLoading(true);
  try {
    await addToCart(
      {
        ...product,
        images: product.images || [product.imageUrl].filter(Boolean), // ✅ always provide images array
      },
      1
    );
    console.log(`${product.name} added to cart ✅`);
  } catch (err) {
    console.error("Error adding to cart:", err);
  } finally {
    setLoading(false);
  }
};

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  // Use first image as thumbnail
// Product thumbnail
const thumbnail =
  product.images && product.images.length > 0 ? product.images[0] : null;

{thumbnail ? (
  <img
    src={thumbnail}
    alt={product.name}
    className="w-full h-64 object-cover"
  />
) : (
  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
    No Image
  </div>
)}


  return (
    <div
      onClick={handleCardClick}
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative cursor-pointer"
    >
      {product.discount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {product.discount}% OFF
        </div>
      )}

      <div className="relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <FiHeart className="text-gray-500" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 mt-1">₹{product.price.toLocaleString("en-IN")}</p>
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className={`mt-3 w-full py-2 rounded transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 text-white"
          }`}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
