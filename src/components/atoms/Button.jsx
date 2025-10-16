import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "medium", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary text-surface hover:bg-gray-800 focus:ring-gray-500 active:bg-gray-900",
    secondary: "bg-surface text-primary border border-gray-300 hover:bg-gray-50 hover:text-accent focus:ring-gray-500",
    accent: "bg-accent text-surface hover:bg-red-700 focus:ring-accent active:bg-red-800",
    ghost: "bg-transparent text-primary hover:bg-gray-100 hover:text-accent focus:ring-gray-500",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-surface focus:ring-gray-500"
  }
  
  const sizes = {
    small: "px-3 py-1.5 text-sm rounded",
    medium: "px-4 py-2 text-base rounded-lg",
    large: "px-6 py-3 text-lg rounded-lg"
  }

  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ApperIcon name={icon} size={16} className="mr-2" />
          )}
          {children}
          {icon && iconPosition === "right" && (
            <ApperIcon name={icon} size={16} className="ml-2" />
          )}
        </>
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button