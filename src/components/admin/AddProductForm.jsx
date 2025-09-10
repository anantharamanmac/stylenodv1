import React, { useState, useEffect } from "react";

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AddProductForm = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [], // now an array
    category: "",
  });
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  // Check admin on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.isAdmin) {
      setMessage("Access denied. Only admins can add products.");
    } else {
      setUser(storedUser);
    }
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle multiple image uploads
  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setMessage("");

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

        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          throw new Error("Failed to upload image");
        }
      }

      setProduct({ ...product, images: [...product.images, ...uploadedUrls] });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setMessage("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.isAdmin) return;

    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add product");

      setMessage("✅ Product added successfully!");
      setProduct({ name: "", description: "", price: "", images: [], category: "" });
      onProductAdded && onProductAdded(data);
    } catch (err) {
      console.error("Product submission error:", err);
      setMessage(err.message);
    }
  };

  if (!user || !user.isAdmin) {
    return <p className="text-red-600 mt-4">{message || "Checking permissions..."}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mt-4">
      {message && (
        <p
          className={`text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={product.category}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="file"
        onChange={handleImagesUpload}
        className="w-full"
        multiple
      />
      {uploading && <p className="text-gray-500">Uploading images...</p>}

      {product.images.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {product.images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Preview ${idx + 1}`}
              className="w-32 h-32 object-cover rounded border"
            />
          ))}
        </div>
      )}

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
