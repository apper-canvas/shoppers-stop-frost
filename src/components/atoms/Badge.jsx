import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ 
  children, 
  variant = "default", 
  size = "medium",
  className,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary text-surface",
    accent: "bg-accent text-surface",
    sale: "bg-gradient-to-r from-accent to-red-600 text-surface",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800"
  }
  
  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-1.5 text-base"
  }

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge