import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("token");
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setMessage("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      setMessage("Access denied. Only admins can view this page.");
      setLoading(false);
      return;
    }
    fetchProducts();
  }, [user]); // ✅ Added user as dependency

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete product");

      setProducts(products.filter((p) => p._id !== id));
      setMessage("✅ Product deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      setMessage(err.message);
    }
  };

  // Start editing
  const startEditing = (product) => {
    setEditingId(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      category: product.category,
      images: product.images || [],
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  // Input change handler
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Multiple image upload
  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (data.secure_url) uploadedUrls.push(data.secure_url);
        else throw new Error("Image upload failed");
      }

      setEditData({ ...editData, images: [...(editData.images || []), ...uploadedUrls] });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setMessage("Image upload failed. Please try again.");
    }
  };

  // Save edited product
  const handleSave = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");

      setProducts(products.map((p) => (p._id === id ? data : p)));
      setEditingId(null);
      setEditData({});
      setMessage("✅ Product updated successfully");
    } catch (err) {
      console.error("Edit error:", err);
      setMessage(err.message);
    }
  };

  if (!user || !user.isAdmin) {
    return <p className="text-red-600 mt-4">{message || "Checking permissions..."}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Product List</h2>
      {message && (
        <p className={`mb-4 ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Image</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border p-2">
                    {editingId === product._id ? (
                      <>
                        <input type="file" multiple onChange={handleImagesUpload} />
                        <div className="flex gap-1 mt-1">
                          {editData.images?.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`Preview ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      </>
                    ) : product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === product._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === product._id ? (
                      <input
                        type="number"
                        name="price"
                        value={editData.price}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      `₹${product.price.toLocaleString("en-IN")}`
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === product._id ? (
                      <input
                        type="text"
                        name="category"
                        value={editData.category}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      product.category
                    )}
                  </td>
                  <td className="border p-2 flex space-x-2">
                    {editingId === product._id ? (
                      <>
                        <button
                          onClick={() => handleSave(product._id)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          <FiSave />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          <FiX />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(product)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
