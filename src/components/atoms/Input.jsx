import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  label,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-lg bg-surface transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1"
  
  const stateStyles = error 
    ? "border-accent text-primary focus:border-accent focus:ring-accent"
    : "border-gray-300 text-primary focus:border-gray-500 focus:ring-gray-500"

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(baseStyles, stateStyles, className)}
        {...props}
      />
      {error && (
        <p className="text-accent text-sm mt-1">{error}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input