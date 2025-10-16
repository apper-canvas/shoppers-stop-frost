import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import productService from "@/services/api/productService"
import useCart from "@/hooks/useCart"
import useWishlist from "@/hooks/useWishlist"
import { cn } from "@/utils/cn"

const ProductQuickViewModal = ({ isOpen, onClose, productId }) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)

  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct()
    }
    
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError("")
      
      const productData = await productService.getById(productId)
      if (!productData) {
        setError("Product not found")
        return
      }
      
      setProduct(productData)
      setSelectedImage(0)
      setSelectedSize(productData.sizes[0] || "")
      setSelectedColor(productData.colors[0] || "")
      setQuantity(1)
    } catch (err) {
      console.error("Error loading product:", err)
      setError("Failed to load product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color")
      return
    }
    addToCart(product, selectedSize, selectedColor, quantity)
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product.Id)) {
      removeFromWishlist(product.Id.toString())
    } else {
      addToWishlist(product)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const discount = product?.salePrice 
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-slide-down"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative bg-surface rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-surface rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </button>

        {loading ? (
          <div className="p-12">
            <Loading />
          </div>
        ) : error ? (
          <div className="p-12">
            <Error message={error} onRetry={loadProduct} />
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop"
                  }}
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors",
                        selectedImage === index ? "border-accent" : "border-transparent"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop"
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wide font-medium">
                  {product.brand}
                </p>
                <h2 className="text-xl font-bold text-primary mt-1 mb-2">
                  {product.name}
                </h2>
                
                <div className="flex items-center gap-3 mb-3">
                  {product.salePrice ? (
                    <>
                      <span className="text-2xl font-bold text-primary">
                        ₹{product.salePrice.toLocaleString()}
                      </span>
                      <span className="text-lg text-secondary line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <Badge variant="sale" size="small">
                        {discount}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-sm text-secondary line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-3 py-1.5 text-sm border rounded-lg transition-colors",
                          selectedSize === size
                            ? "border-accent bg-accent text-surface"
                            : "border-gray-300 hover:border-gray-500"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                    Color: {selectedColor}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-3 py-1.5 text-sm border rounded-lg transition-colors",
                          selectedColor === color
                            ? "border-accent bg-accent text-surface"
                            : "border-gray-300 hover:border-gray-500"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <h3 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                  Quantity
                </h3>
                <div className="flex items-center border rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="Minus" size={14} />
                  </button>
                  <span className="px-4 py-2 font-medium text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="Plus" size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="medium"
                    className="flex-1"
                    icon="ShoppingBag"
                  >
                    Add to Cart
                  </Button>
                  <button
                    onClick={handleWishlistToggle}
                    className="p-3 border border-gray-300 rounded-lg hover:border-accent hover:text-accent transition-colors"
                  >
                    <ApperIcon 
                      name="Heart" 
                      size={18} 
                      className={isInWishlist(product.Id) ? "text-accent fill-accent" : ""}
                    />
                  </button>
                </div>
              </div>

              {/* Product Features */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Truck" size={14} className="text-accent" />
                    <span className="text-secondary">Free Shipping above ₹1999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="RotateCcw" size={14} className="text-accent" />
                    <span className="text-secondary">Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Shield" size={14} className="text-accent" />
                    <span className="text-secondary">Authentic Products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductQuickViewModal