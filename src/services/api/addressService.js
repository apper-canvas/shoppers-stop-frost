import addressesData from "@/services/mockData/addresses.json"
import authService from "@/services/api/authService"

const STORAGE_KEY = "user_addresses"

class AddressService {
  constructor() {
    // Initialize addresses from JSON if not in localStorage
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addressesData))
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getAddresses() {
    const addressesJson = localStorage.getItem(STORAGE_KEY)
    return addressesJson ? JSON.parse(addressesJson) : []
  }

  saveAddresses(addresses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses))
  }

  async getAll() {
    await this.delay(300)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("User not authenticated")
    }

    const allAddresses = this.getAddresses()
    return allAddresses.filter(addr => addr.userId === currentUser.Id)
  }

  async getById(id) {
    await this.delay(200)

    if (!Number.isInteger(id)) {
      throw new Error("Address ID must be an integer")
    }

    const addresses = this.getAddresses()
    const address = addresses.find(addr => addr.Id === id)

    if (!address) {
      throw new Error("Address not found")
    }

    return { ...address }
  }

  async create(addressData) {
    await this.delay(400)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("User not authenticated")
    }

    // Validation
    const requiredFields = ["name", "mobile", "pincode", "address", "city", "state"]
    const missingFields = requiredFields.filter(field => !addressData[field]?.trim())

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
    }

    // Validate mobile
    if (addressData.mobile.length !== 10 || !/^\d+$/.test(addressData.mobile)) {
      throw new Error("Mobile number must be 10 digits")
    }

    // Validate pincode
    if (addressData.pincode.length !== 6 || !/^\d+$/.test(addressData.pincode)) {
      throw new Error("Pincode must be 6 digits")
    }

    const addresses = this.getAddresses()
    const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.Id)) + 1 : 1

    const newAddress = {
      Id: newId,
      userId: currentUser.Id,
      name: addressData.name.trim(),
      mobile: addressData.mobile.trim(),
      pincode: addressData.pincode.trim(),
      address: addressData.address.trim(),
      city: addressData.city.trim(),
      state: addressData.state.trim(),
      isDefault: addresses.filter(a => a.userId === currentUser.Id).length === 0
    }

    addresses.push(newAddress)
    this.saveAddresses(addresses)

    return { ...newAddress }
  }

  async update(id, addressData) {
    await this.delay(400)

    if (!Number.isInteger(id)) {
      throw new Error("Address ID must be an integer")
    }

    const addresses = this.getAddresses()
    const index = addresses.findIndex(addr => addr.Id === id)

    if (index === -1) {
      throw new Error("Address not found")
    }

    // Validation
    if (addressData.mobile && (addressData.mobile.length !== 10 || !/^\d+$/.test(addressData.mobile))) {
      throw new Error("Mobile number must be 10 digits")
    }

    if (addressData.pincode && (addressData.pincode.length !== 6 || !/^\d+$/.test(addressData.pincode))) {
      throw new Error("Pincode must be 6 digits")
    }

    const updatedAddress = {
      ...addresses[index],
      ...addressData,
      Id: id
    }

    addresses[index] = updatedAddress
    this.saveAddresses(addresses)

    return { ...updatedAddress }
  }

  async delete(id) {
    await this.delay(300)

    if (!Number.isInteger(id)) {
      throw new Error("Address ID must be an integer")
    }

    const addresses = this.getAddresses()
    const index = addresses.findIndex(addr => addr.Id === id)

    if (index === -1) {
      throw new Error("Address not found")
    }

    addresses.splice(index, 1)
    this.saveAddresses(addresses)

    return true
  }
}

const addressService = new AddressService()
export default addressService