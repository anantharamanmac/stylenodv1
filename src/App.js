import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";

import { CartProvider } from "./context/CartContext";
import Preloader from "./components/Preloader"; // your existing preloader

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <CartProvider>
      {loading ? (
        <Preloader />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </Router>
      )}
    </CartProvider>
  );
}

export default App;
