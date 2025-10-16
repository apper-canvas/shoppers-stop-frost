import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto mb-6 text-accent">
          <ApperIcon name="AlertCircle" size={96} />
        </div>
        
        <h2 className="text-2xl font-bold text-primary mb-4">
          Oops! Something Went Wrong
        </h2>
        
        <p className="text-secondary mb-8">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-primary text-surface rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <ApperIcon name="RefreshCw" size={20} className="mr-2" />
            Try Again
          </button>
        )}
        
        <p className="text-sm text-secondary mt-6">
          If this problem persists, please contact our support team.
        </p>
      </div>
    </div>
  )
}

export default Error