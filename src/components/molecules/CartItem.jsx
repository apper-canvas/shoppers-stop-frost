import React from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CartItem = ({ item, onUpdateQuantity, onRemove, onMoveToWishlist, onSaveForLater }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 0) {
      onUpdateQuantity(item.productId, item.size, item.color, newQuantity)
    }
  }

  return (
    <div className="flex gap-4 p-4 bg-surface rounded-lg">
      <div className="w-20 h-20 flex-shrink-0">
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
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-secondary uppercase tracking-wide">
              {item.brand}
            </p>
            <h3 className="text-sm font-medium text-primary line-clamp-2">
              {item.name}
            </h3>
          </div>
<button
            onClick={() => onRemove(item.productId, item.size, item.color)}
            className="text-gray-400 hover:text-accent transition-colors p-1"
            title="Remove from cart"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-secondary mb-2">
          <span>Size: {item.size}</span>
          <span>Color: {item.color}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Minus" size={14} />
            </button>
            <span className="px-3 py-1 text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Plus" size={14} />
            </button>
          </div>

<div className="text-right">
            <p className="text-lg font-bold text-primary">
              ₹{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t">
          <button
            onClick={() => onMoveToWishlist(item)}
            className="flex items-center gap-1.5 text-xs text-secondary hover:text-accent transition-colors"
          >
            <ApperIcon name="Heart" size={14} />
            <span>Move to Wishlist</span>
          </button>
          
          <span className="text-gray-300">|</span>
          
          <button
            onClick={() => onSaveForLater(item.productId, item.size, item.color)}
            className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors"
          >
            <ApperIcon name="Bookmark" size={14} />
            <span>Save for Later</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem