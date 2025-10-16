import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import CartItem from "@/components/molecules/CartItem";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";

const CartPage = () => {
  const navigate = useNavigate()
const { 
    cartItems, 
    savedItems,
    isLoading, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotal,
    getCartItemsCount,
    moveToSaveForLater,
    restoreFromSaved,
    removeFromSaved
  } = useCart()

  const { addToWishlist } = useWishlist()
  const [couponCode, setCouponCode] = useState("")

const handleCheckout = () => {
    navigate("/checkout")
  }

  const handleMoveToWishlist = (item) => {
    addToWishlist({
      id: item.productId,
      name: item.name,
      brand: item.brand,
      price: item.price,
      image: item.image,
      category: item.category || "Fashion"
    })
    removeFromCart(item.productId, item.size, item.color)
    toast.success("Moved to wishlist")
  }

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      toast.info("Coupon validation will be implemented")
    } else {
      toast.error("Please enter a coupon code")
    }
  }
  if (isLoading) {
    return <Loading />
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Empty
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
          actionLabel="Continue Shopping"
          actionPath="/"
        />
      </div>
    )
  }

const subtotal = getCartTotal()
  const discount = Math.floor(subtotal * 0.1) // 10% discount
  const shipping = subtotal >= 1999 ? 0 : 99
  const total = subtotal - discount + shipping
  
  const shippingProgress = subtotal >= 1999 ? 100 : (subtotal / 1999) * 100

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-primary">Shopping Cart</h1>
            <p className="text-secondary mt-1">
                {getCartItemsCount()} {getCartItemsCount() === 1 ? "item" : "items"}in your cart
                          </p>
        </div>
        <Button
            onClick={clearCart}
            variant="ghost"
            size="small"
            icon="Trash2"
            className="text-accent hover:bg-red-50">Clear Cart
                    </Button>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-primary">Shopping Cart ({cartItems.length}items)</h2>
                {cartItems.map((item, index) => <CartItem
                    key={`${item.productId}-${item.size}-${item.color}-${index}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onMoveToWishlist={handleMoveToWishlist}
                    onSaveForLater={moveToSaveForLater} />)}
            </div>
            {/* Save for Later Section */}
            {savedItems.length > 0 && <div className="space-y-4 pt-6 border-t">
                <h2 className="text-xl font-bold text-primary">Saved for Later ({savedItems.length}items)</h2>
                {savedItems.map((item, index) => <div
                    key={`${item.productId}-${item.size}-${item.color}-${index}`}
                    className="bg-surface rounded-lg p-4 flex gap-4 border">
                    <div className="w-24 h-24 flex-shrink-0">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                            onError={e => {
                                e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop";
                            }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-secondary uppercase tracking-wide mb-1">{item.brand}</p>
                        <h3 className="text-base font-medium text-primary mb-2 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-secondary mb-3">
                            <span>Size: {item.size}</span>
                            <span>•</span>
                            <span>Color: {item.color}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-primary">₹{item.price.toLocaleString()}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => restoreFromSaved(item.productId, item.size, item.color)}
                                    variant="outline"
                                    size="small">Move to Cart
                                                            </Button>
                                <Button
                                    onClick={() => removeFromSaved(item.productId, item.size, item.color)}
                                    variant="outline"
                                    size="small">Remove
                                                            </Button>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>}
        </div>
    </div>
    {/* Order Summary */}
    <div className="lg:col-span-1">
        <div className="bg-surface rounded-lg p-6 shadow-sm border sticky top-8">
            <h2 className="text-lg font-bold text-primary mb-4">Order Summary
                            </h2>
            {/* Apply Coupon */}
            <div className="mb-4">
                <h3 className="text-sm font-bold text-primary mb-3">Apply Coupon</h3>
                <div className="flex gap-2">
                    <Input
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1" />
                    <Button onClick={handleApplyCoupon} variant="outline" size="small">Apply
                                        </Button>
                </div>
                <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-secondary">Available Offers:</p>
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                        <div className="flex items-start gap-2">
                            <ApperIcon name="Tag" size={14} className="text-green-600 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-green-800">FIRST10</p>
                                <p className="text-xs text-green-600">Get 10% off on your first order</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <div className="flex items-start gap-2">
                            <ApperIcon name="Tag" size={14} className="text-blue-600 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-blue-800">SAVE500</p>
                                <p className="text-xs text-blue-600">Save ₹500 on orders above ₹3999</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex justify-between">
                    <span className="text-secondary">Subtotal ({getCartItemsCount()}items)</span>
                    <span className="text-primary font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-secondary">Shipping</span>
                    <span
                        className={`font-medium ${shipping === 0 ? "text-green-600" : "text-primary"}`}>
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                </div>
                <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>- ₹{discount.toLocaleString()}</span>
                </div>
                {shipping > 0 && <div className="text-xs text-accent bg-red-50 p-2 rounded">Add ₹{(1999 - subtotal).toLocaleString()}more for FREE shipping
                                    </div>}
                <hr className="my-3" />
                {shipping > 0 && <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-yellow-800">Free Shipping Progress</span>
                        <span className="text-xs text-yellow-600">₹{(1999 - subtotal).toLocaleString()}to go
                                                </span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div
                            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${shippingProgress}%`
                            }} />
                    </div>
                </div>}
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                    <span className="text-primary">Total Amount</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    <div className="flex items-center gap-2">
                        <ApperIcon name="CheckCircle" size={14} />
                        <span>You're saving ₹{discount.toLocaleString()}on this order!</span>
                    </div>
                </div>
            </div>
            <Button
                onClick={handleCheckout}
                variant="primary"
                size="large"
                className="w-full mt-6"
                icon="CreditCard">Proceed to Checkout
                            </Button>
            <button
                onClick={() => navigate("/")}
                className="w-full mt-3 text-sm text-accent hover:text-red-700 transition-colors flex items-center justify-center gap-2">
                <ApperIcon name="ArrowLeft" size={16} />Continue Shopping
                            </button>
            {/* Security Features */}
            <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-1 gap-3 text-xs text-secondary">
                    <div className="flex items-center gap-2">
                        <ApperIcon name="Shield" size={14} className="text-green-600" />
                        <span>Secure SSL encrypted checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ApperIcon name="RotateCcw" size={14} className="text-green-600" />
                        <span>Easy returns within 30 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ApperIcon name="Award" size={14} className="text-green-600" />
                        <span>Authentic products guaranteed</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default CartPage