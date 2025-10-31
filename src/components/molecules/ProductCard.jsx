import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import StarRating from "@/components/atoms/StarRating"
import ProductQuickViewModal from "@/components/atoms/ProductQuickViewModal"
import useCart from "@/hooks/useCart"
import useWishlist from "@/hooks/useWishlist"
import { cn } from "@/utils/cn"
const ProductCard = ({ product }) => {
  const navigate = useNavigate()
const [showQuickView, setShowQuickView] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const handleProductClick = () => {
    navigate(`/product/${product.Id}`)
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    setShowQuickView(true)
  }

const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product, product.sizes_c?.[0] || product.sizes_c, product.colors_c?.[0] || product.colors_c, 1)
  }

  const handleWishlistToggle = (e) => {
    e.stopPropagation()
    if (isInWishlist(product.Id)) {
      removeFromWishlist(product.Id.toString())
    } else {
      addToWishlist(product)
    }
  }

  const discount = product.salePrice 
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0

  return (
<>
      <div 
        className="bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
        onClick={handleProductClick}
      >
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop"
            }}
          />
          {discount > 0 && (
            <Badge 
              variant="sale" 
              size="small"
              className="absolute top-3 left-3"
            >
              {discount}% OFF
            </Badge>
          )}
          
          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute top-3 right-3 p-2 bg-surface rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
          >
            <ApperIcon name="Eye" size={16} />
          </button>
          
          <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-surface/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-surface"
        >
          <ApperIcon 
            name="Heart" 
            size={16} 
            className={isInWishlist(product.Id) ? "text-accent fill-accent" : "text-gray-500"}
          />
        </button>
      </div>

<div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-secondary uppercase tracking-wide font-medium">
            {product.brand}
          </p>
          <h3 className="text-sm font-medium text-primary line-clamp-2 mt-1">
            {product.name}
          </h3>
          
          {/* Rating Display */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={product.rating} size={12} />
              <span className="text-xs text-secondary">
                ({product.reviewCount})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-primary">
                ₹{product.salePrice.toLocaleString()}
              </span>
              <span className="text-sm text-secondary line-through">
                ₹{product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          variant="primary"
          size="small"
          className="w-full"
          icon="ShoppingBag"
        >
          Add to Cart
        </Button>
</div>
      </div>

      <ProductQuickViewModal 
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        productId={product.Id}
      />
    </>
  )
}

export default ProductCard