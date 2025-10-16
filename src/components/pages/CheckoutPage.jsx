import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useCart from "@/hooks/useCart"
import authService from "@/services/api/authService"
import LoginStep from "@/components/pages/LoginStep"
import AddressStep from "@/components/pages/AddressStep"
import PaymentStep from "@/components/pages/PaymentStep"
import Loading from "@/components/ui/Loading"
const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cartItems, isLoading } = useCart()
  
const [currentStep, setCurrentStep] = useState(1) // 1 = Login, 2 = Address, 3 = Payment
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      const authenticated = await authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      if (authenticated) {
        setCurrentStep(2)
      }
    }
    checkAuth()
  }, [])

  const handleLoginSuccess = () => {
setIsAuthenticated(true)
    setCurrentStep(2)
  }

  const handleAddressContinue = () => {
    setCurrentStep(3)
  }

  const handleBackToLogin = () => {
    setCurrentStep(1)
  }

  const handleBackToAddress = () => {
    setCurrentStep(2)
  }


if (isLoading) {
    return <Loading />
  }

  if (cartItems.length === 0) {
    navigate("/cart")
    return null
  }

return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
<div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Checkout</h1>
        <p className="text-secondary mt-1">Complete your order in 3 simple steps</p>
      </div>

      {/* Step Indicator */}
<div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 1 ? "border-accent bg-accent text-surface" : "border-gray-300 text-gray-400"
              }`}>
                <span className="font-semibold">1</span>
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= 1 ? "text-primary" : "text-secondary"
              }`}>
                Login
              </span>
            </div>

            {/* Connector */}
            <div className={`w-24 h-0.5 mx-4 ${
              currentStep >= 2 ? "bg-accent" : "bg-gray-300"
            }`} />

            {/* Step 2 */}
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 2 ? "border-accent bg-accent text-surface" : "border-gray-300 text-gray-400"
              }`}>
                <span className="font-semibold">2</span>
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= 2 ? "text-primary" : "text-secondary"
              }`}>
                Delivery Address
              </span>
            </div>

            {/* Connector */}
            <div className={`w-24 h-0.5 mx-4 ${
              currentStep >= 3 ? "bg-accent" : "bg-gray-300"
            }`} />

            {/* Step 3 */}
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 3 ? "border-accent bg-accent text-surface" : "border-gray-300 text-gray-400"
              }`}>
                <span className="font-semibold">3</span>
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= 3 ? "text-primary" : "text-secondary"
              }`}>
                Payment
              </span>
            </div>
          </div>
        </div>
      </div>

{/* Step Content */}
<div className="py-6">
        {currentStep === 1 && (
          <LoginStep 
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentStep === 2 && (
          <AddressStep 
            onBack={handleBackToLogin}
            onContinue={handleAddressContinue}
          />
        )}

        {currentStep === 3 && (
          <PaymentStep 
            onBack={handleBackToAddress}
          />
        )}
      </div>
    </div>
  )
}

export default CheckoutPage