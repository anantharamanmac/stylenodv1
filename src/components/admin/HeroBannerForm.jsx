import React, { useState, useEffect } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HeroBannerForm = () => {
  const [banner, setBanner] = useState({
    imageUrl: "",
    heading: "",
    subText: "",
    buttonText: "",
  });
  const [banners, setBanners] = useState([]);

  // Fetch all banners
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/hero`)
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch((err) => console.error(err));
  }, []);

  // Upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    setBanner({ ...banner, imageUrl: data.secure_url });
  };

  // Save banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`${BACKEND_URL}/api/hero`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(banner),
    });

    const data = await res.json();
    if (res.ok) {
      setBanners([data, ...banners]);
      setBanner({ imageUrl: "", heading: "", subText: "", buttonText: "" });
    } else {
      alert("Error adding banner");
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${BACKEND_URL}/api/hero/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setBanners(banners.filter((b) => b._id !== id));
  };

  return (
    <div>
      {/* Upload form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mb-8">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {banner.imageUrl && (
          <img src={banner.imageUrl} alt="preview" className="w-full h-48 object-cover rounded" />
        )}

        <input
          type="text"
          placeholder="Heading"
          value={banner.heading}
          onChange={(e) => setBanner({ ...banner, heading: e.target.value })}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Sub Text"
          value={banner.subText}
          onChange={(e) => setBanner({ ...banner, subText: e.target.value })}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Button Text"
          value={banner.buttonText}
          onChange={(e) => setBanner({ ...banner, buttonText: e.target.value })}
          className="w-full border rounded p-2"
        />

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Add Banner
        </button>
      </form>

      {/* Banner list */}
      <div className="grid gap-4 md:grid-cols-2">
        {banners.map((b) => (
          <div key={b._id} className="border rounded shadow p-4 relative">
            <img src={b.imageUrl} alt="" className="w-full h-40 object-cover rounded" />
            <h2 className="font-bold mt-2">{b.heading}</h2>
            <p>{b.subText}</p>
            <button
              onClick={() => handleDelete(b._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroBannerForm;
