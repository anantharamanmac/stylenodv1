import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile"); // profile | orders | address | settings
  const [user, setUser] = useState(null);

  // Address states
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  // Password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);

      // Pre-fill address if available
      if (storedUser.address) {
        setStreet(storedUser.address.street || "");
        setCity(storedUser.address.city || "");
        setPostalCode(storedUser.address.postalCode || "");
        setCountry(storedUser.address.country || "India");
      }
    }
  }, []);

  // Save Address
  const handleAddressSave = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first");

    try {
      const res = await fetch(`${BACKEND_URL}/api/user/${user._id}/address`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ street, city, postalCode, country }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Address updated!");
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        alert(data.message || "Error updating address");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }
  };

  // Update Password
const handlePasswordUpdate = async (e) => {
  e.preventDefault();
  if (!user || !user._id) return alert("User ID missing, please login again");

  if (newPassword !== confirmPassword) {
    return alert("Passwords do not match!");
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/user/${user._id}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });

    const text = await res.text(); // parse safely
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON response: " + text);
    }

    alert(data.message || "Password updated");
    if (res.ok) {
      setNewPassword("");
      setConfirmPassword("");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Profile Details</h2>
            {user ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || "Not added"}</p>
              </div>
            ) : (
              <p>No user logged in</p>
            )}
          </div>
        );

      case "orders":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">My Orders</h2>
            <p>Order history will be shown here (fetch from backend `/api/orders/:userId`).</p>
          </div>
        );

      case "address":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Address</h2>
            <form onSubmit={handleAddressSave} className="space-y-4">
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Street Address"
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postal Code"
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="w-full border rounded-lg px-4 py-2"
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900"
              >
                Save Address
              </button>
            </form>
          </div>
        );

      case "settings":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full border rounded-lg px-4 py-2"
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900"
              >
                Update Password
              </button>
            </form>
          </div>
        );

      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-grow max-w-7xl mx-auto px-4 py-12 gap-8">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow rounded-lg p-6 space-y-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "profile" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "orders" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("address")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "address" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            Address
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "settings" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            Account Settings
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow bg-white shadow rounded-lg p-6">
          {renderContent()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
