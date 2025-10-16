import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StarRating from "@/components/atoms/StarRating";
import ReviewsSection from "@/components/organisms/ReviewsSection";
import productService from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";

const ProductDetailPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)

  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    loadProduct()
  }, [productId])

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
      setSelectedSize(productData.sizes[0] || "")
      setSelectedColor(productData.colors[0] || "")
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

  const handleBuyNow = () => {
    handleAddToCart()
    navigate("/cart")
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadProduct} />
  }

  if (!product) {
    return <Error message="Product not found" />
  }

  const discount = product.salePrice 
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: product.category.toUpperCase(), path: `/category/${product.category}` },
    { label: product.name, path: "" }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-secondary mb-6">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ApperIcon name="ChevronRight" size={14} />}
            {crumb.path ? (
              <button
                onClick={() => navigate(crumb.path)}
                className="hover:text-primary cursor-pointer"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="text-primary font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
            <div className="flex gap-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-accent" : "border-transparent"
                  }`}
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
        <div className="space-y-6">
<div>
            <p className="text-sm text-secondary uppercase tracking-wide font-medium">
              {product.brand}
            </p>
            <h1 className="text-3xl font-bold text-primary mt-2 mb-4">
              {product.name}
            </h1>
            
            {/* Rating Display */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={product.rating} size={18} />
                <span className="text-sm text-secondary">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-4 mb-4">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-primary">
                    ₹{product.salePrice.toLocaleString()}
                  </span>
                  <span className="text-xl text-secondary line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <Badge variant="sale" size="medium">
                    {discount}% OFF
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-secondary">
              {product.description}
            </p>
          </div>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
                Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedSize === size
                        ? "border-accent bg-accent text-surface"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
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
              <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
                Color: {selectedColor}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedColor === color
                        ? "border-accent bg-accent text-surface"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              Quantity
            </h3>
            <div className="flex items-center border rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="Minus" size={16} />
              </button>
              <span className="px-6 py-3 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="Plus" size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="large"
                className="flex-1"
                icon="ShoppingBag"
              >
                Add to Cart
              </Button>
              <button
                onClick={handleWishlistToggle}
                className="p-4 border border-gray-300 rounded-lg hover:border-accent hover:text-accent transition-colors"
              >
                <ApperIcon 
                  name="Heart" 
                  size={20} 
                  className={isInWishlist(product.Id) ? "text-accent fill-accent" : ""}
                />
              </button>
            </div>
            
            <Button
              onClick={handleBuyNow}
              variant="accent"
              size="large"
              className="w-full"
              icon="Zap"
            >
              Buy Now
            </Button>
          </div>

          {/* Product Features */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <ApperIcon name="Truck" size={16} className="text-accent" />
                <span className="text-secondary">Free Shipping above ₹1999</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="RotateCcw" size={16} className="text-accent" />
                <span className="text-secondary">Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Shield" size={16} className="text-accent" />
                <span className="text-secondary">Authentic Products</span>
              </div>
            </div>
</div>
        </div>
      </div>
      {/* Reviews Section */}
      <ReviewsSection productId={productId} />
    </div>
  )
}

export default ProductDetailPage