import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import useCart from "@/hooks/useCart"

const PaymentStep = ({ onBack }) => {
  const navigate = useNavigate()
  const { getCartTotal, getCartItemsCount, clearCart } = useCart()

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  })
  const [giftCardCode, setGiftCardCode] = useState("")
  const [appliedGiftCard, setAppliedGiftCard] = useState(null)

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "CreditCard" },
    { id: "upi", name: "UPI", icon: "Smartphone" },
    { id: "netbanking", name: "Net Banking", icon: "Building2" },
    { id: "wallet", name: "Wallets", icon: "Wallet" },
    { id: "cod", name: "Cash on Delivery", icon: "Banknote" }
  ]

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, "")
    if (value.length > 16) return
    
    // Format with spaces every 4 digits
    value = value.match(/.{1,4}/g)?.join(" ") || value
    setCardDetails({ ...cardDetails, cardNumber: value })
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\//g, "")
    if (value.length > 4) return
    
    // Format as MM/YY
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2)
    }
    setCardDetails({ ...cardDetails, expiryDate: value })
  }

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length > 3) return
    setCardDetails({ ...cardDetails, cvv: value })
  }

  const handleApplyGiftCard = () => {
    if (!giftCardCode.trim()) {
      toast.error("Please enter a gift card code")
      return
    }

    // Mock validation - in real app would call service
    if (giftCardCode.length < 6) {
      toast.error("Invalid gift card code")
      return
    }

    // Mock gift card with random discount
    const discount = Math.floor(Math.random() * 500) + 100
    setAppliedGiftCard({
      code: giftCardCode,
      discount: discount
    })
    toast.success(`Gift card applied! ₹${discount} discount added`)
    setGiftCardCode("")
  }

  const handleRemoveGiftCard = () => {
    setAppliedGiftCard(null)
    toast.info("Gift card removed")
  }

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a valid 16-digit card number")
      return false
    }

    if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
      toast.error("Please enter expiry date in MM/YY format")
      return false
    }

    const [month, year] = cardDetails.expiryDate.split("/")
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1

    if (parseInt(month) < 1 || parseInt(month) > 12) {
      toast.error("Invalid expiry month")
      return false
    }

    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      toast.error("Card has expired")
      return false
    }

    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      toast.error("Please enter a valid 3-digit CVV")
      return false
    }

    if (!cardDetails.cardholderName.trim()) {
      toast.error("Please enter cardholder name")
      return false
    }

    return true
  }

  const handlePlaceOrder = () => {
    // Validate payment method specific details
    if (selectedPaymentMethod === "card") {
      if (!validateCardDetails()) return
    } else if (selectedPaymentMethod === "upi") {
      toast.info("UPI payment integration coming soon")
      return
    } else if (selectedPaymentMethod === "netbanking") {
      toast.info("Net Banking integration coming soon")
      return
    } else if (selectedPaymentMethod === "wallet") {
      toast.info("Wallet payment integration coming soon")
      return
    }

    // Process order
    toast.success("Order placed successfully! 🎉")
    clearCart()
    navigate("/")
  }

  const subtotal = getCartTotal()
  const shipping = subtotal >= 1999 ? 0 : 99
  const discount = appliedGiftCard ? appliedGiftCard.discount : 0
  const total = subtotal + shipping - discount

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Payment Methods */}
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Methods Selection */}
        <div className="bg-surface rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-bold text-primary mb-4">Select Payment Method</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  selectedPaymentMethod === method.id
                    ? "border-accent bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  selectedPaymentMethod === method.id ? "bg-accent text-white" : "bg-gray-100 text-secondary"
                }`}>
                  <ApperIcon name={method.icon} size={20} />
                </div>
                <span className={`font-medium ${
                  selectedPaymentMethod === method.id ? "text-primary" : "text-secondary"
                }`}>
                  {method.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Card Payment Form */}
        {selectedPaymentMethod === "card" && (
          <div className="bg-surface rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-bold text-primary mb-4">Card Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Card Number
                </label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Expiry Date
                  </label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleExpiryChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    CVV
                  </label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleCvvChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Cardholder Name
                </label>
                <Input
                  type="text"
                  placeholder="Name on card"
                  value={cardDetails.cardholderName}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Gift Card / Store Credit */}
        <div className="bg-surface rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-bold text-primary mb-4">Gift Card / Store Credit</h3>
          
          {appliedGiftCard ? (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <ApperIcon name="Gift" size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-primary">{appliedGiftCard.code}</p>
                  <p className="text-sm text-green-600">₹{appliedGiftCard.discount} discount applied</p>
                </div>
              </div>
              <button
                onClick={handleRemoveGiftCard}
                className="text-accent hover:text-red-700 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter gift card code"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleApplyGiftCard}
                variant="outline"
                className="px-6"
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-surface rounded-lg p-6 shadow-sm border sticky top-8">
          <h2 className="text-lg font-bold text-primary mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-secondary">Subtotal ({getCartItemsCount()} items)</span>
              <span className="text-primary font-medium">₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-secondary">Shipping</span>
              <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-primary"}`}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>

            {appliedGiftCard && (
              <div className="flex justify-between">
                <span className="text-secondary">Gift Card Discount</span>
                <span className="text-green-600 font-medium">-₹{discount.toLocaleString()}</span>
              </div>
            )}

            <hr className="my-3" />

            <div className="flex justify-between text-lg font-bold">
              <span className="text-primary">Total</span>
              <span className="text-primary">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <Button
            onClick={handlePlaceOrder}
            variant="primary"
            size="large"
            className="w-full"
            icon="CheckCircle"
          >
            Place Order
          </Button>

          <button
            onClick={onBack}
            className="w-full mt-3 text-sm text-accent hover:text-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Address
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentStep