import React from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "Nothing to see here", 
  description = "It looks like there are no items to display.",
  actionLabel = "Start Shopping",
  actionPath = "/" 
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
        <ApperIcon name="Package" size={96} />
      </div>
      
      <h3 className="text-xl font-semibold text-primary mb-2">
        {title}
      </h3>
      
      <p className="text-secondary mb-8 max-w-sm">
        {description}
      </p>
      
      <button
        onClick={() => navigate(actionPath)}
        className="inline-flex items-center px-8 py-3 bg-primary text-surface rounded-lg hover:bg-gray-800 transition-all duration-200 hover:transform hover:scale-105"
      >
        <ApperIcon name="ShoppingBag" size={20} className="mr-2" />
        {actionLabel}
      </button>
    </div>
  )
}

export default Empty