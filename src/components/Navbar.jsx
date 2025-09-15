import { useState, useRef, useEffect, useContext } from "react";
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { cart } = useContext(CartContext);
  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const user = JSON.parse(localStorage.getItem("user"));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/products?search=${searchQuery}`
        );
        if (!res.ok) throw new Error("Failed to fetch search results");
        const data = await res.json();
        setSearchResults(data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserDropdown(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="cursor-pointer flex items-center" onClick={() => navigate("/")}>
          <img src="/logo2.webp" alt="Style Nod Logo" className="h-10 w-auto" />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-black">
          <a href="/new" className="hover:text-gray-600">New In</a>
          <a href="/" className="hover:text-gray-600">Shop</a>
          <a href="/" className="hover:text-gray-600">Our Story</a>
        </nav>

        {/* Desktop Icons */}
        <div
          className="hidden md:flex items-center space-x-5 text-lg text-black relative"
          ref={dropdownRef}
        >
          {/* Desktop Search */}
          <div className="relative">
            <motion.div
              className="flex items-center bg-gradient-to-r from-gray-100 to-white rounded-full px-4 py-1 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <FiSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-36 focus:w-64 transition-all duration-300 outline-none bg-transparent placeholder-gray-400"
              />
            </motion.div>

            <AnimatePresence>
              {searchQuery.length >= 2 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl max-h-60 overflow-auto z-50"
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <li
                        key={p._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer truncate text-sm"
                        onClick={() => {
                          navigate(`/product/${p._id}`);
                          setSearchQuery("");
                        }}
                      >
                        {p.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 italic text-sm">
                      No products found for &quot;{searchQuery}&quot;
                    </li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <FiUser
              className="cursor-pointer hover:text-gray-600"
              onClick={() => setUserDropdown(!userDropdown)}
            />
            {userDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-md text-sm z-30">
                {user ? (
                  <>
                    <button
                      onClick={() => { navigate("/profile"); setUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 border-b hover:bg-gray-100"
                    >
                      {user.name}
                    </button>
                    {user.isAdmin && (
                      <button
                        onClick={() => { navigate("/admin"); setUserDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate("/login"); setUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { navigate("/signup"); setUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Signup
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingBag className="hover:text-gray-600" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Menu and Search */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Search Icon */}
          <FiSearch
            className="text-xl cursor-pointer text-gray-700"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          />
          <button onClick={() => setOpenMenu(!openMenu)}>
            {openMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden px-4 pb-2 overflow-hidden"
          >
            <motion.input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-full bg-gray-100 outline-none placeholder-gray-400"
            />
            {searchQuery.length >= 2 && (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 w-full bg-white rounded-xl max-h-60 overflow-auto border shadow-sm"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <li
                      key={p._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer truncate text-sm"
                      onClick={() => {
                        navigate(`/product/${p._id}`);
                        setSearchQuery("");
                        setMobileSearchOpen(false);
                      }}
                    >
                      {p.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500 italic text-sm">
                    No products found for &quot;{searchQuery}&quot;
                  </li>
                )}
              </motion.ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      {openMenu && (
        <div className="md:hidden bg-gray-50 px-6 py-4 space-y-3 text-sm text-black">
          <a href="/" className="block">New In</a>
          <a href="/" className="block">Shop</a>
          <a href="/" className="block">Our Story</a>

          <div className="border-t pt-4 space-y-3">
            {user ? (
              <>
                <button
                  onClick={() => { navigate("/profile"); setOpenMenu(false); }}
                  className="block w-full text-left hover:text-gray-600"
                >
                  {user.name}
                </button>
                {user.isAdmin && (
                  <button
                    onClick={() => { navigate("/admin"); setOpenMenu(false); }}
                    className="block w-full text-left hover:text-gray-600"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => { handleLogout(); setOpenMenu(false); }}
                  className="block w-full text-left hover:text-gray-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate("/login"); setOpenMenu(false); }}
                  className="block w-full text-left hover:text-gray-600"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate("/signup"); setOpenMenu(false); }}
                  className="block w-full text-left hover:text-gray-600"
                >
                  Signup
                </button>
              </>
            )}

            {/* Cart in Mobile */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-gray-600"
              onClick={() => { navigate("/cart"); setOpenMenu(false); }}
            >
              <FiShoppingBag />
              <span>Cart ({cartCount})</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
