import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import addressService from "@/services/api/addressService"
import useCart from "@/hooks/useCart"
import { toast } from "react-toastify"

const AddressStep = ({ onBack, onContinue }) => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, getCartItemsCount, clearCart } = useCart()
  
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pincode: "",
    address: "",
    city: "",
    state: ""
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      const data = await addressService.getAll()
      setAddresses(data)
      // Auto-select default address or first address
      const defaultAddr = data.find(addr => addr.isDefault)
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.Id)
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].Id)
      }
    } catch (error) {
      toast.error("Failed to load addresses")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required"
    } else if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      newErrors.mobile = "Enter valid 10-digit mobile number"
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required"
    } else if (formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode)) {
      newErrors.pincode = "Enter valid 6-digit pincode"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the form errors")
      return
    }

    setLoading(true)

    try {
      const newAddress = await addressService.create(formData)
      setAddresses(prev => [...prev, newAddress])
      setSelectedAddressId(newAddress.Id)
      setShowAddForm(false)
      resetForm()
      toast.success("Address added successfully")
    } catch (error) {
      toast.error(error.message || "Failed to add address")
    } finally {
      setLoading(false)
    }
  }

  const handleEditAddress = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the form errors")
      return
    }

    setLoading(true)

    try {
      const updated = await addressService.update(editingAddressId, formData)
      setAddresses(prev => prev.map(addr => 
        addr.Id === editingAddressId ? updated : addr
      ))
      setEditingAddressId(null)
      resetForm()
      toast.success("Address updated successfully")
    } catch (error) {
      toast.error(error.message || "Failed to update address")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return
    }

    try {
      await addressService.delete(id)
      setAddresses(prev => prev.filter(addr => addr.Id !== id))
      if (selectedAddressId === id) {
        setSelectedAddressId(addresses[0]?.Id || null)
      }
      toast.success("Address deleted successfully")
    } catch (error) {
      toast.error(error.message || "Failed to delete address")
    }
  }

  const startEdit = (address) => {
    setEditingAddressId(address.Id)
    setFormData({
      name: address.name,
      mobile: address.mobile,
      pincode: address.pincode,
      address: address.address,
      city: address.city,
      state: address.state
    })
    setShowAddForm(false)
  }

  const cancelEdit = () => {
    setEditingAddressId(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      pincode: "",
      address: "",
      city: "",
      state: ""
    })
    setErrors({})
  }

const handleContinue = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address")
      return
    }

    const selectedAddress = addresses.find(addr => addr.Id === selectedAddressId)
    if (!selectedAddress) {
      toast.error("Invalid address selection")
      return
    }

    // Store selected address in localStorage for payment step
    localStorage.setItem("shoppers-stop-selected-address", JSON.stringify(selectedAddress))
    
    // Navigate to payment step
    onContinue()
  }

  const subtotal = getCartTotal()
  const shipping = subtotal >= 1999 ? 0 : 99
  const total = subtotal + shipping

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Address Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Addresses */}
          {addresses.length > 0 && !showAddForm && !editingAddressId && (
            <div className="bg-surface rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <ApperIcon name="MapPin" size={20} />
                  Select Delivery Address
                </h2>
                <Button
                  variant="ghost"
                  size="small"
                  icon="Plus"
                  onClick={() => setShowAddForm(true)}
                >
                  Add New
                </Button>
              </div>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.Id}
                    className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAddressId === addr.Id
                        ? "border-accent bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.Id}
                      checked={selectedAddressId === addr.Id}
                      onChange={() => setSelectedAddressId(addr.Id)}
                      className="mt-1 w-4 h-4 text-accent"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-primary">{addr.name}</p>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-accent text-surface text-xs font-medium rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary mb-2">
                        {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-sm text-secondary mb-3">
                        Mobile: {addr.mobile}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            startEdit(addr)
                          }}
                          className="text-sm text-accent hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <ApperIcon name="Edit2" size={14} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleDeleteAddress(addr.Id)
                          }}
                          className="text-sm text-secondary hover:text-accent font-medium flex items-center gap-1"
                        >
                          <ApperIcon name="Trash2" size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add/Edit Address Form */}
          {(showAddForm || editingAddressId) && (
            <div className="bg-surface rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <ApperIcon name="MapPin" size={20} />
                  {editingAddressId ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={() => {
                    if (editingAddressId) {
                      cancelEdit()
                    } else {
                      setShowAddForm(false)
                      resetForm()
                    }
                  }}
                  className="text-secondary hover:text-primary"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={editingAddressId ? handleEditAddress : handleAddAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      error={errors.name}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Mobile *
                    </label>
                    <Input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      maxLength={10}
                      error={errors.mobile}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-primary mb-1">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House no., Building, Street, Area"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                        errors.address ? "border-accent" : "border-gray-300"
                      }`}
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-accent text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      City *
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      error={errors.city}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      State *
                    </label>
                    <Input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      error={errors.state}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-primary mb-1">
                      Pincode *
                    </label>
                    <Input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      error={errors.pincode}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="medium"
                    loading={loading}
                    className="flex-1"
                  >
                    {editingAddressId ? "Update Address" : "Save Address"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="medium"
                    onClick={() => {
                      if (editingAddressId) {
                        cancelEdit()
                      } else {
                        setShowAddForm(false)
                        resetForm()
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Show Add Address Button if no addresses */}
          {addresses.length === 0 && !showAddForm && (
            <div className="bg-surface rounded-lg p-8 shadow-sm border text-center">
              <ApperIcon name="MapPin" size={48} className="mx-auto text-secondary mb-4" />
              <h3 className="text-lg font-bold text-primary mb-2">
                No Saved Addresses
              </h3>
              <p className="text-secondary mb-4">
                Add your first delivery address to proceed
              </p>
              <Button
                variant="primary"
                size="medium"
                icon="Plus"
                onClick={() => setShowAddForm(true)}
              >
                Add Delivery Address
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-lg p-6 shadow-sm border sticky top-8">
            <h2 className="text-lg font-bold text-primary mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
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

              <hr className="my-3" />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-primary">Total</span>
                <span className="text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>

<Button
              onClick={handleContinue}
              variant="primary"
              size="large"
              className="w-full mt-6"
              icon="ArrowRight"
              disabled={!selectedAddressId}
            >
              Continue to Payment
            </Button>

<button
              onClick={onBack}
              className="w-full mt-3 text-sm text-accent hover:text-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Previous Step
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressStep