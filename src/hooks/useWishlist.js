import { useState, useEffect } from "react"
import { toast } from "react-toastify"

const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem("shoppers-stop-wishlist")
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist))
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveWishlist = (items) => {
    try {
      localStorage.setItem("shoppers-stop-wishlist", JSON.stringify(items))
    } catch (error) {
      console.error("Error saving wishlist:", error)
    }
  }

  const addToWishlist = (product) => {
    const isAlreadyInWishlist = wishlistItems.some(item => item.productId === product.Id.toString())
    
    if (isAlreadyInWishlist) {
      toast.info("Already in wishlist!")
      return
    }

    const newWishlistItem = {
      productId: product.Id.toString(),
      name: product.name,
      brand: product.brand,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0],
      inStock: product.inStock
    }

    const newWishlistItems = [...wishlistItems, newWishlistItem]
    setWishlistItems(newWishlistItems)
    saveWishlist(newWishlistItems)
    toast.success("Added to wishlist!")
  }

  const removeFromWishlist = (productId) => {
    const newWishlistItems = wishlistItems.filter(item => item.productId !== productId)
    setWishlistItems(newWishlistItems)
    saveWishlist(newWishlistItems)
    toast.success("Removed from wishlist")
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.removeItem("shoppers-stop-wishlist")
    toast.success("Wishlist cleared")
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId.toString())
  }

  const getWishlistItemsCount = () => {
    return wishlistItems.length
  }

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistItemsCount
  }
}

export default useWishlist