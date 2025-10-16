import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartPanel from "@/components/organisms/CartPanel";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";

const Header = () => {
const [isBannerVisible, setIsBannerVisible] = useState(
    localStorage.getItem("shoppers-stop-banner-dismissed") !== "true"
  )
  const [cartPanelOpen, setCartPanelOpen] = useState(false)
  const navigate = useNavigate()
  const { getCartItemsCount } = useCart()
  const { getWishlistItemsCount } = useWishlist()

  const handleBannerClose = () => {
    setIsBannerVisible(false)
    localStorage.setItem("shoppers-stop-banner-dismissed", "true")
  }

  const cartItemsCount = getCartItemsCount()
  const wishlistItemsCount = getWishlistItemsCount()

  return (
    <div className="sticky top-0 z-50 bg-surface">
      {/* Promotional Banner */}
      {isBannerVisible && (
        <div className="bg-gradient-to-r from-accent to-red-600 text-surface text-center py-2 text-sm">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center relative">
            <span className="font-medium">
              Free Shipping on orders above ₹1999 | Use Code: FREESHIP
            </span>
            <button
              onClick={handleBannerClose}
              className="absolute right-4 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <ApperIcon name="X" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-surface shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-red-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="ShoppingBag" size={20} className="text-surface" />
              </div>
              <span className="text-xl font-bold text-primary hidden sm:block">
                Shoppers Stop
              </span>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <SearchBar />
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search Icon */}
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ApperIcon name="Search" size={20} className="text-primary" />
              </button>

              {/* User Account */}
<button
                onClick={() => {
                  const { logout } = require("@/layouts/Root").useAuth?.() || {};
                  if (logout) logout();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Logout"
              >
                <ApperIcon name="LogOut" size={20} className="text-primary group-hover:text-accent" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => navigate("/wishlist")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group relative"
              >
                <ApperIcon name="Heart" size={20} className="text-primary group-hover:text-accent" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-surface text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {wishlistItemsCount > 99 ? '99+' : wishlistItemsCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart */}
<button
                onClick={() => setCartPanelOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group relative"
              >
                <ApperIcon name="ShoppingCart" size={20} className="text-primary group-hover:text-accent" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-surface text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-bounce-in">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3 bg-surface">
        <SearchBar />
      </div>
<CartPanel isOpen={cartPanelOpen} onClose={() => setCartPanelOpen(false)} />
    </div>
  )
}

export default Header