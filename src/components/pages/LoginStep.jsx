import React, { useState } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import authService from "@/services/api/authService"
import { toast } from "react-toastify"

const LoginStep = ({ onLoginSuccess, onClose }) => {
  const [mode, setMode] = useState("login") // "login" or "signup"
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Signup specific validations
    if (mode === "signup") {
      if (!formData.name) {
        newErrors.name = "Name is required"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the form errors")
      return
    }

    setLoading(true)

    try {
      if (mode === "login") {
        await authService.login(formData.email, formData.password)
        toast.success("Login successful!")
        onLoginSuccess()
      } else {
        await authService.signup(
          formData.name,
          formData.email,
          formData.password,
          formData.confirmPassword
        )
        toast.success("Account created successfully!")
        onLoginSuccess()
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(prev => prev === "login" ? "signup" : "login")
    setErrors({})
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-surface rounded-lg p-8 shadow-lg border">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-secondary text-sm">
            {mode === "login" 
              ? "Sign in to continue with your order" 
              : "Sign up to proceed with checkout"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                error={errors.name}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Email *
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              error={errors.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Password *
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              error={errors.password}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Confirm Password *
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter password"
                error={errors.confirmPassword}
              />
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full"
            loading={loading}
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-sm text-secondary">
            {mode === "login" 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-accent hover:text-red-700 font-medium transition-colors"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginStep