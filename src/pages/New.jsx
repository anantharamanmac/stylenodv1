import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const New = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products?category=New%20styles`);
        if (!res.ok) throw new Error("Failed to fetch new products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 py-16 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
           Discover Our New Styles
        </h1>
        <p className="text-lg text-gray-700">
          Fresh arrivals curated just for you. Upgrade your wardrobe today.
        </p>
      </div>

      <div className="min-h-screen bg-gray-50 px-4 md:px-12 py-10">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-2xl shadow animate-pulse h-72"
                >
                  <div className="bg-gray-300 h-40 w-full rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="text-center text-gray-500 text-lg">
              No new styles available right now. Check back soon 
            </p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default New;
