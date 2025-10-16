import React from "react"
import ApperIcon from "@/components/ApperIcon"

const FilterSection = ({ 
  title, 
  options, 
  selectedOptions, 
  onOptionChange, 
  type = "checkbox",
  isOpen = true,
  onToggle 
}) => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
          {title}
        </h3>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-gray-400"
        />
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
          {options.map((option, index) => (
            <label
              key={`${option.value}-${index}`}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 -mx-1 px-1 py-1 rounded"
            >
              <input
                type={type}
                name={type === "radio" ? title : undefined}
                value={option.value}
                checked={
                  type === "checkbox" 
                    ? selectedOptions.includes(option.value)
                    : selectedOptions === option.value
                }
                onChange={(e) => {
                  if (type === "checkbox") {
                    if (e.target.checked) {
                      onOptionChange([...selectedOptions, option.value])
                    } else {
                      onOptionChange(selectedOptions.filter(item => item !== option.value))
                    }
                  } else {
                    onOptionChange(option.value)
                  }
                }}
                className="rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="text-sm text-primary">
                {option.label}
                {option.count && (
                  <span className="text-gray-400 ml-1">({option.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterSection