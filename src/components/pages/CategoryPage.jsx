import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import productService from "@/services/api/productService"
import categoryService from "@/services/api/categoryService"
import ProductGrid from "@/components/organisms/ProductGrid"
import FilterSidebar from "@/components/organisms/FilterSidebar"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const CategoryPage = () => {
  const { categoryName } = useParams()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("q")
  const subcategory = searchParams.get("subcategory")

  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [filters, setFilters] = useState({
    brands: [],
    priceRanges: [],
    colors: [],
    sizes: []
  })

  useEffect(() => {
    loadCategoryData()
  }, [categoryName, searchQuery, subcategory])

  useEffect(() => {
    applyFiltersAndSort()
  }, [filters, sortBy, allProducts])

  const loadCategoryData = async () => {
    try {
      setLoading(true)
      setError("")

      let productsData = []

      if (searchQuery) {
        // Search mode
        productsData = await productService.searchProducts(searchQuery)
        setCategory({ name: "search", display: `Search Results for "${searchQuery}"` })
      } else if (categoryName === "sale") {
        // Sale category
        productsData = await productService.getOnSale()
        setCategory({ name: "sale", display: "SALE" })
      } else {
        // Regular category
        const categoryData = await categoryService.getByName(categoryName)
        if (!categoryData) {
          setError("Category not found")
          return
        }

        setCategory(categoryData)
        productsData = await productService.getByCategory(categoryName)
      }

      // Filter by subcategory if specified
      if (subcategory) {
        productsData = productsData.filter(p => p.subcategory === subcategory)
      }

      setAllProducts(productsData)
    } catch (err) {
      console.error("Error loading category data:", err)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...allProducts]

    // Apply brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand))
    }

    // Apply price range filter
    if (filters.priceRanges.length > 0) {
      filtered = filtered.filter(product => {
        const price = product.salePrice || product.price
        return filters.priceRanges.some(range => {
          const [min, max] = range.split("-")
          if (max === "plus") {
            return price >= parseInt(min)
          }
          return price >= parseInt(min) && price <= parseInt(max)
        })
      })
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(p => 
        p.colors.some(color => filters.colors.includes(color))
      )
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => filters.sizes.includes(size))
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
        break
      case "price-high-low":
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
        break
      case "newest":
        // Since we don't have date data, reverse the order
        filtered.reverse()
        break
      case "discount":
        filtered.sort((a, b) => {
          const discountA = a.salePrice ? (1 - a.salePrice / a.price) : 0
          const discountB = b.salePrice ? (1 - b.salePrice / b.price) : 0
          return discountB - discountA
        })
        break
      default:
        // Keep original order for "featured"
        break
    }

    setProducts(filtered)
  }

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: category?.display || categoryName, path: `/category/${categoryName}` }
  ]

  if (subcategory) {
    breadcrumbs.push({ label: subcategory.replace("-", " "), path: "" })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-secondary mb-6">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ApperIcon name="ChevronRight" size={14} />}
            <span className={index === breadcrumbs.length - 1 ? "text-primary font-medium" : "hover:text-primary cursor-pointer"}>
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            {category?.display || categoryName}
          </h1>
          <p className="text-secondary">
            {loading ? "Loading..." : `${products.length} products found`}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            icon="Filter"
            className="lg:hidden"
          >
            Filters
          </Button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest First</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="discount">Best Discount</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            products={allProducts}
            isVisible={true}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            onRetry={loadCategoryData}
            emptyTitle={searchQuery ? "No products found for your search" : "No products found"}
            emptyDescription={searchQuery ? `Try searching for different keywords or browse our categories.` : "Try adjusting your filters or browse other categories."}
          />
        </div>
      </div>
    </div>
  )
}

export default CategoryPage