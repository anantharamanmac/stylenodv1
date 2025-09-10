import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AddProductForm from "../components/admin/AddProductForm";
import AdminProductList from "../components/admin/ProductList";
import HeroBannerForm from "../components/admin/HeroBannerForm";

const Admin = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState("add");
  const [refreshProducts, setRefreshProducts] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleProductAdded = () => {
    setActiveTab("list");
    setRefreshProducts((prev) => !prev);
  };

  return (
    <div>
      <Navbar />
      <div className="flex max-w-6xl mx-auto mt-8 min-h-[70vh]">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 rounded-lg p-4 mr-6 shadow">
          <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
          <ul className="space-y-2">
            <li
              className={`cursor-pointer p-2 rounded ${
                activeTab === "add" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("add")}
            >
              Add Product
            </li>
            <li
              className={`cursor-pointer p-2 rounded ${
                activeTab === "list" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("list")}
            >
              Manage Products
            </li>
            <li
              className={`cursor-pointer p-2 rounded ${
                activeTab === "hero" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("hero")}
            >
              Manage Hero Banner
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-lg p-6 shadow">
          {activeTab === "add" && (
            <div>
              <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
              <AddProductForm onProductAdded={handleProductAdded} />
            </div>
          )}

          {activeTab === "list" && (
            <div>
              <h1 className="text-2xl font-semibold mb-4">All Products</h1>
              <AdminProductList key={refreshProducts} />
            </div>
          )}

          {activeTab === "hero" && (
            <div>
              <h1 className="text-2xl font-semibold mb-4">Hero Banner</h1>
              <HeroBannerForm />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
