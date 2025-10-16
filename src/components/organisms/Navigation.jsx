import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import categoryService from "@/services/api/categoryService"

const Navigation = () => {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const location = useLocation()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const isActive = (categoryName) => {
    return location.pathname.includes(`/category/${categoryName}`)
  }

  return (
    <nav className="bg-surface border-b border-gray-200 sticky top-[64px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex space-x-8">
            {categories.map((category) => (
              <div
                key={category.Id}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category.name)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  to={`/category/${category.name}`}
                  className={`
                    block px-3 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-200
                    ${isActive(category.name)
                      ? "text-accent border-b-2 border-accent"
                      : "text-primary hover:text-accent border-b-2 border-transparent hover:border-accent"
                    }
                  `}
                >
                  {category.display}
                </Link>

                {/* Mega Menu Dropdown */}
                {activeCategory === category.name && category.subcategories.length > 0 && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-md bg-surface shadow-lg border-t-2 border-accent animate-slide-down">
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory}
                            to={`/category/${category.name}?subcategory=${subcategory}`}
                            className="block px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-gray-50 rounded transition-colors capitalize"
                          >
                            {subcategory.replace("-", " ")}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation