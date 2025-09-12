// pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const Checkout = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [password, setPassword] = useState("");
  const [summary, setSummary] = useState(null);
  const [method, setMethod] = useState("card"); // card | upi | gpay | cod

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/cart/summary`);
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Error fetching cart summary:", err);
      }
    };
    fetchSummary();
  }, []);

  const handlePay = () => {
    alert(`Payment submitted via ${method}!`);
    // integrate with Razorpay / Stripe / UPI API here
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4 py-12">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-5xl grid md:grid-cols-2 gap-10">
          {/* Payment Form */}
          <div>
            <h1 className="text-2xl font-bold mb-6">Payment</h1>

            {/* Tabs for Payment Method */}
            <div className="flex space-x-3 mb-6">
              {["card", "upi", "gpay", "cod"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-4 py-2 rounded-lg border ${
                    method === m
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Card Form */}
            {method === "card" && (
              <>
                <label className="block mb-3 text-gray-700 font-medium">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="2412 7512 3412 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 mb-5 focus:ring-2 focus:ring-black"
                />

                <label className="block mb-3 text-gray-700 font-medium">
                  CVV Number
                </label>
                <input
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 mb-5 focus:ring-2 focus:ring-black"
                />

                <label className="block mb-3 text-gray-700 font-medium">
                  Expiry Date
                </label>
                <div className="flex space-x-4 mb-5">
                  <input
                    type="text"
                    placeholder="MM"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    className="w-1/2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    placeholder="YY"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    className="w-1/2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black"
                  />
                </div>

                <label className="block mb-3 text-gray-700 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your dynamic password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-black"
                />
              </>
            )}

            {/* UPI */}
            {method === "upi" && (
              <input
                type="text"
                placeholder="yourname@upi"
                className="w-full border rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-black"
              />
            )}

            {/* Google Pay */}
            {method === "gpay" && (
              <p className="text-gray-600 mb-6">
                You will be redirected to Google Pay to complete your payment.
              </p>
            )}

            {/* COD */}
            {method === "cod" && (
              <p className="text-gray-600 mb-6">
                Cash on Delivery selected. Please keep cash ready at delivery.
              </p>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-900 transition"
            >
              Pay Now
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-100 rounded-xl p-6 flex flex-col justify-between">
            {summary ? (
              <>
                <div>
                  <div className="bg-white shadow-md rounded-xl p-5 flex justify-between items-center mb-6">
                    <div>
                      <p className="text-gray-700 font-medium">
                        {summary.customer || "John Doe"}
                      </p>
                      <p className="text-sm text-gray-500">
                        **** **** **** 3456
                      </p>
                    </div>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                      alt="Card"
                      className="w-12"
                    />
                  </div>

                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <span>Order Number</span>
                      <span className="font-medium">{summary.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Products</span>
                      <span className="font-medium">{summary.itemsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-medium">₹{summary.shipping}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span className="font-medium">₹{summary.tax}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t mt-6 pt-6 flex justify-between items-center text-lg font-bold">
                  <span>You have to pay</span>
                  <span>
                    ₹{summary.total}{" "}
                    <span className="text-sm text-gray-500">INR</span>
                  </span>
                </div>
              </>
            ) : (
              <p>Loading summary...</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
