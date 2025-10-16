import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import productService from "@/services/api/productService"
import categoryService from "@/services/api/categoryService"
import ProductGrid from "@/components/organisms/ProductGrid"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [saleProducts, setSaleProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      setLoading(true)
      setError("")

      const [featured, sale, categoriesData] = await Promise.all([
        productService.getFeatured(8),
        productService.getOnSale(),
        categoryService.getAll()
      ])

      setFeaturedProducts(featured)
      setSaleProducts(sale.slice(0, 4))
      setCategories(categoriesData)
    } catch (err) {
      console.error("Error loading home data:", err)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadHomeData} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          Fashion That 
          <span className="block gradient-text">Defines You</span>
        </h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">
          Discover the latest trends in fashion, beauty, and lifestyle. 
          Shop from thousands of products with free shipping on orders above ₹1999.
        </p>
        <Link
          to="/category/sale"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent to-red-600 text-surface text-lg font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Shop Sale Items
        </Link>
      </section>

      {/* Category Grid */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-primary text-center mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.Id}
              to={`/category/${category.name}`}
              className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-red-600/20 group-hover:from-accent/30 group-hover:to-red-600/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-primary group-hover:scale-110 transition-transform">
                  {category.display}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-primary">
              🔥 Hot Deals
            </h2>
            <Link
              to="/category/sale"
              className="text-accent hover:text-red-700 font-medium transition-colors"
            >
              View All Sale Items →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <div key={product.Id} className="relative">
                <div className="bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <Link to={`/product/${product.Id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop"
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-accent text-surface px-2 py-1 rounded text-xs font-bold">
                        {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-secondary uppercase tracking-wide">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-medium text-primary line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ₹{product.salePrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-secondary line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-primary text-center mb-8">
          Featured Products
        </h2>
        <ProductGrid 
          products={featuredProducts}
          loading={false}
          error=""
          emptyTitle="No featured products"
          emptyDescription="Check back later for featured products."
        />
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-accent to-red-600 rounded-2xl text-center text-surface my-12">
        <h2 className="text-3xl font-bold mb-4">
          Stay in the Loop
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Get the latest fashion trends, exclusive offers, and style tips delivered to your inbox.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="px-6 py-3 bg-surface text-accent font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage