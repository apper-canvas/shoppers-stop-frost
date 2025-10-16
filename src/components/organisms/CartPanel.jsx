import React from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import useCart from "@/hooks/useCart"
import { toast } from "react-toastify"

const CartPanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount
  } = useCart()

  const handleCheckout = () => {
    onClose()
    navigate("/checkout")
  }

  const handleQuantityChange = (productId, size, color, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(productId, size, color, newQuantity)
    }
  }

  const handleRemove = (productId, size, color) => {
    removeFromCart(productId, size, color)
  }

  const subtotal = getCartTotal()
  const shipping = subtotal >= 1999 ? 0 : 99
  const total = subtotal + shipping

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-surface shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-primary">Shopping Cart</h2>
            <p className="text-xs text-secondary">
              {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ApperIcon name="ShoppingCart" size={64} className="text-gray-300 mb-4" />
              <p className="text-secondary mb-2">Your cart is empty</p>
              <p className="text-xs text-gray-400">Add items to get started</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}-${index}`}
                className="flex gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop"
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-secondary uppercase tracking-wide">
                        {item.brand}
                      </p>
                      <h3 className="text-sm font-medium text-primary line-clamp-1">
                        {item.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleRemove(item.productId, item.size, item.color)}
                      className="text-gray-400 hover:text-accent transition-colors p-1 ml-2"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-secondary mb-2">
                    <span>{item.size}</span>
                    <span>•</span>
                    <span>{item.color}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 transition-colors"
                      >
                        <ApperIcon name="Minus" size={12} />
                      </button>
                      <span className="px-2 py-1 text-xs font-medium min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 transition-colors"
                      >
                        <ApperIcon name="Plus" size={12} />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-primary">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Order Summary */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Subtotal</span>
                <span className="text-primary font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-secondary">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-primary'}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              
              {shipping > 0 && (
                <div className="text-xs text-accent bg-red-50 p-2 rounded">
                  Add ₹{(1999 - subtotal).toLocaleString()} more for FREE shipping
                </div>
              )}
              
              <hr className="my-2" />
              
              <div className="flex justify-between text-base font-bold">
                <span className="text-primary">Total</span>
                <span className="text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              variant="primary"
              size="large"
              className="w-full"
              icon="CreditCard"
            >
              Proceed to Checkout
            </Button>

            <button
              onClick={onClose}
              className="w-full text-sm text-accent hover:text-red-700 transition-colors flex items-center justify-center gap-2 py-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Continue Shopping
            </button>

            {/* Security Features */}
            <div className="pt-3 border-t">
              <div className="grid grid-cols-1 gap-2 text-xs text-secondary">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Shield" size={12} className="text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="RotateCcw" size={12} className="text-green-600" />
                  <span>30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartPanel