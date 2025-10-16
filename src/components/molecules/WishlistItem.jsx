import React from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import useCart from "@/hooks/useCart"

const WishlistItem = ({ item, onRemove }) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleProductClick = () => {
    navigate(`/product/${item.productId}`)
  }

  const handleMoveToCart = (e) => {
    e.stopPropagation()
    // Create a product-like object for addToCart
    const product = {
      Id: parseInt(item.productId),
      name: item.name,
      brand: item.brand,
      price: item.price,
      salePrice: item.salePrice,
      images: [item.image],
      sizes: ["M"], // Default size, should be selected by user
      colors: ["Default"] // Default color, should be selected by user
    }
    
    addToCart(product, "M", "Default", 1)
    onRemove(item.productId)
  }

  const discount = item.salePrice 
    ? Math.round((1 - item.salePrice / item.price) * 100)
    : 0

  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div 
        className="cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop"
            }}
          />
          
          {item.salePrice && (
            <Badge 
              variant="sale" 
              size="small" 
              className="absolute top-2 left-2 font-bold"
            >
              {discount}% OFF
            </Badge>
          )}
          
          {!item.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="warning" size="medium">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-secondary uppercase tracking-wide font-medium">
              {item.brand}
            </p>
            <h3 className="text-sm font-medium text-primary line-clamp-2 mt-1">
              {item.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {item.salePrice ? (
              <>
                <span className="text-lg font-bold text-primary">
                  ₹{item.salePrice.toLocaleString()}
                </span>
                <span className="text-sm text-secondary line-through">
                  ₹{item.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">
                ₹{item.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 flex gap-2">
        <Button
          onClick={handleMoveToCart}
          variant="primary"
          size="small"
          className="flex-1"
          icon="ShoppingBag"
          disabled={!item.inStock}
        >
          Move to Cart
        </Button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(item.productId)
          }}
          className="p-2 text-gray-400 hover:text-accent transition-colors rounded"
        >
          <ApperIcon name="Trash2" size={16} />
        </button>
      </div>
    </div>
  )
}

export default WishlistItem