import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { AiOutlineInfoCircle } from "react-icons/ai";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ backgroundPosition: "0% 0%" });

  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);

  const sizes = ["L", "XL", "XXL", "XXXL"]; // Available sizes

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images && data.images.length > 0 ? data.images[0] : data.imageUrl);

        // Fetch related products by category
        if (data.category) {
          const relatedRes = await fetch(
            `${BACKEND_URL}/api/products?category=${encodeURIComponent(data.category)}`
          );
          if (!relatedRes.ok) throw new Error("Failed to fetch related products");
          let related = await relatedRes.json();
          related = related.filter((p) => p._id !== data._id).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }
    if (!product) return;

    setLoading(true);
    try {
      await addToCart({ ...product, size: selectedSize }, 1);
      console.log("Added to cart ✅");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!product) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-4 md:px-12 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          
          {/* Left: Image gallery with zoom */}
          <div className="md:w-1/2 p-6 flex flex-col items-center">
            {!isZoomed ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-96 object-contain rounded-2xl border cursor-zoom-in transition-transform duration-300"
                onMouseEnter={() => setIsZoomed(true)}
              />
            ) : (
              <div
                className="w-full h-96 rounded-2xl border cursor-zoom-out"
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: "200%",
                  backgroundRepeat: "no-repeat",
                  ...zoomStyle,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                  setIsZoomed(false);
                  setZoomStyle({ backgroundPosition: "0% 0%" });
                }}
              />
            )}

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex mt-4 space-x-2">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                      mainImage === img ? "border-black" : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Product info */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-gray-700 mb-2">
                ₹{product.price.toLocaleString("en-IN")}
              </p>

              {/* Category */}
              {product.category && (
                <span className="inline-block bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full mb-4">
                  {product.category}
                </span>
              )}

              <p className="text-gray-600 mb-4">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-4 flex items-center space-x-3">
                <div>
                  <h3 className="font-semibold mb-2">Select Size:</h3>
                  <div className="flex space-x-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md font-semibold transition ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Chart Button */}
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="mt-6 flex items-center space-x-1 text-blue-600 hover:underline"
                >
                  <AiOutlineInfoCircle size={20} />
                  <span>Size Chart</span>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className={`flex-1 py-3 rounded-xl text-white font-semibold transition ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                }`}
              >
                {loading ? "Adding..." : "Add to Cart"}
              </button>
              <button className="flex-1 py-3 rounded-xl text-black font-semibold border border-black hover:bg-gray-200 transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full relative">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              &times;
            </button>
            <img
              src="/sizechart.webp"
              alt="Size Chart"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
