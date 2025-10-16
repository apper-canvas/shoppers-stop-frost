import React, { useState, useEffect } from "react"
import FilterSection from "@/components/molecules/FilterSection"
import Button from "@/components/atoms/Button"

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  products = [],
  isVisible = true,
  onClose 
}) => {
  const [openSections, setOpenSections] = useState({
    brands: true,
    price: true,
    colors: true,
    sizes: true
  })

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Extract unique values from products
  const getUniqueValues = (field) => {
    const values = products.reduce((acc, product) => {
      if (Array.isArray(product[field])) {
        acc.push(...product[field])
      } else if (product[field]) {
        acc.push(product[field])
      }
      return acc
    }, [])
    return [...new Set(values)].sort()
  }

  const brandOptions = getUniqueValues('brand').map(brand => ({
    value: brand,
    label: brand,
    count: products.filter(p => p.brand === brand).length
  }))

  const colorOptions = getUniqueValues('colors').map(color => ({
    value: color,
    label: color,
    count: products.filter(p => p.colors.includes(color)).length
  }))

  const sizeOptions = getUniqueValues('sizes').map(size => ({
    value: size,
    label: size,
    count: products.filter(p => p.sizes.includes(size)).length
  }))

  const priceRanges = [
    { value: "0-999", label: "Under ₹1,000" },
    { value: "1000-2499", label: "₹1,000 - ₹2,499" },
    { value: "2500-4999", label: "₹2,500 - ₹4,999" },
    { value: "5000-9999", label: "₹5,000 - ₹9,999" },
    { value: "10000-plus", label: "₹10,000 & Above" }
  ]

  const handlePriceRangeChange = (selectedRanges) => {
    onFiltersChange({
      ...filters,
      priceRanges: selectedRanges
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      brands: [],
      priceRanges: [],
      colors: [],
      sizes: []
    })
  }

  const hasActiveFilters = filters.brands?.length > 0 || 
                          filters.priceRanges?.length > 0 || 
                          filters.colors?.length > 0 || 
                          filters.sizes?.length > 0

  if (!isVisible) return null

  return (
    <div className="w-full lg:w-64 bg-surface">
      <div className="sticky top-32 p-6 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-primary">Filters</h2>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="small"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {brandOptions.length > 0 && (
            <FilterSection
              title="Brands"
              options={brandOptions}
              selectedOptions={filters.brands || []}
              onOptionChange={(brands) => onFiltersChange({ ...filters, brands })}
              isOpen={openSections.brands}
              onToggle={() => toggleSection('brands')}
            />
          )}

          <FilterSection
            title="Price Range"
            options={priceRanges}
            selectedOptions={filters.priceRanges || []}
            onOptionChange={handlePriceRangeChange}
            isOpen={openSections.price}
            onToggle={() => toggleSection('price')}
          />

          {colorOptions.length > 0 && (
            <FilterSection
              title="Colors"
              options={colorOptions}
              selectedOptions={filters.colors || []}
              onOptionChange={(colors) => onFiltersChange({ ...filters, colors })}
              isOpen={openSections.colors}
              onToggle={() => toggleSection('colors')}
            />
          )}

          {sizeOptions.length > 0 && (
            <FilterSection
              title="Sizes"
              options={sizeOptions}
              selectedOptions={filters.sizes || []}
              onOptionChange={(sizes) => onFiltersChange({ ...filters, sizes })}
              isOpen={openSections.sizes}
              onToggle={() => toggleSection('sizes')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar