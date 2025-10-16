import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-32 h-32 mx-auto mb-8 text-gray-300">
          <ApperIcon name="SearchX" size={128} />
        </div>
        
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-primary mb-4">
          Oops! Page Not Found
        </h2>
        
        <p className="text-secondary mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="large" icon="Home">
              Go Home
            </Button>
          </Link>
          
          <Link to="/category/sale">
            <Button variant="accent" size="large" icon="Percent">
              Shop Sale
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-secondary mb-4">
            Popular Categories:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/category/men" className="text-accent hover:text-red-700 text-sm transition-colors">
              Men's Fashion
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/category/women" className="text-accent hover:text-red-700 text-sm transition-colors">
              Women's Fashion
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/category/beauty" className="text-accent hover:text-red-700 text-sm transition-colors">
              Beauty
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/category/kids" className="text-accent hover:text-red-700 text-sm transition-colors">
              Kids
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound