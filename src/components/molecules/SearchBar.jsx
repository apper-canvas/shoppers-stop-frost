import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ className = "" }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/category/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products, brands and more"
          className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg bg-surface text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors duration-200"
        >
          <ApperIcon name="Search" size={20} />
        </button>
      </div>
    </form>
  )
}

export default SearchBar