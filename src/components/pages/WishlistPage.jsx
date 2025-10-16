import React from "react"
import WishlistItem from "@/components/molecules/WishlistItem"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Empty from "@/components/ui/Empty"
import useWishlist from "@/hooks/useWishlist"

const WishlistPage = () => {
  const { 
    wishlistItems, 
    isLoading, 
    removeFromWishlist, 
    clearWishlist, 
    getWishlistItemsCount 
  } = useWishlist()

  if (isLoading) {
    return <Loading />
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Empty
          title="Your wishlist is empty"
          description="Save items to your wishlist as you shop. They'll appear here so you can easily find them later!"
          actionLabel="Start Shopping"
          actionPath="/"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Wishlist</h1>
          <p className="text-secondary mt-1">
            {getWishlistItemsCount()} {getWishlistItemsCount() === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        <Button
          onClick={clearWishlist}
          variant="ghost"
          size="small"
          icon="Trash2"
          className="text-accent hover:bg-red-50"
        >
          Clear Wishlist
        </Button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <WishlistItem
            key={item.productId}
            item={item}
            onRemove={removeFromWishlist}
          />
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-12">
        <p className="text-secondary mb-4">
          Discover more products you'll love
        </p>
        <Button
          onClick={() => window.location.href = "/"}
          variant="primary"
          size="large"
          icon="ShoppingBag"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}

export default WishlistPage