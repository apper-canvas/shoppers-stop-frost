import React, { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 16, 
  interactive = false,
  onChange,
  className 
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating
  
  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= Math.floor(displayRating)
        const isHalf = !isFilled && starValue === Math.ceil(displayRating) && displayRating % 1 !== 0
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={cn(
              "relative transition-transform",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
          >
            {isHalf ? (
              <div className="relative">
                <ApperIcon 
                  name="Star" 
                  size={size} 
                  className="text-gray-300"
                />
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <ApperIcon 
                    name="Star" 
                    size={size} 
                    className="text-yellow-400 fill-yellow-400"
                  />
                </div>
              </div>
            ) : (
              <ApperIcon 
                name="Star" 
                size={size} 
                className={cn(
                  "transition-colors",
                  isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                )}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default StarRating