import productsData from "@/services/mockData/products.json";
import React from "react";

class ProductService {
  constructor() {
    this.products = [...productsData]
  }

  calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) {
      return { average: 0, count: 0 }
    }
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    const average = sum / reviews.length
    
    return {
      average: Math.round(average * 10) / 10,
      count: reviews.length
    }
  }

  async getAll() {
    await this.delay(300)
    return [...this.products]
  }

  async getById(id) {
    await this.delay(200)
    const product = this.products.find(p => p.Id === parseInt(id))
    return product ? { ...product } : null
  }

  async getByCategory(category) {
    await this.delay(350)
    return this.products
      .filter(p => p.category.toLowerCase() === category.toLowerCase())
      .map(p => ({ ...p }))
  }

  async getOnSale() {
    await this.delay(300)
    return this.products
      .filter(p => p.salePrice !== null)
      .map(p => ({ ...p }))
  }

  async getFeatured(limit = 8) {
    await this.delay(250)
    return this.products
      .slice(0, limit)
      .map(p => ({ ...p }))
  }

  async searchProducts(query) {
    await this.delay(400)
    const searchTerm = query.toLowerCase()
    return this.products
      .filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      )
      .map(p => ({ ...p }))
  }

  async filterProducts(filters) {
    await this.delay(300)
    let filtered = [...this.products]

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand))
    }

    if (filters.priceRange) {
      const { min, max } = filters.priceRange
      filtered = filtered.filter(p => {
        const price = p.salePrice || p.price
        return price >= min && price <= max
      })
    }

    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(p => 
        p.colors.some(color => filters.colors.includes(color))
      )
    }

    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => filters.sizes.includes(size))
      )
    }

    return filtered.map(p => ({ ...p }))
  }

  async create(product) {
    await this.delay(400)
    const maxId = Math.max(...this.products.map(p => p.Id))
    const newProduct = {
      ...product,
      Id: maxId + 1
    }
    this.products.push(newProduct)
    return { ...newProduct }
  }

  async update(id, productData) {
    await this.delay(350)
    const index = this.products.findIndex(p => p.Id === parseInt(id))
    if (index === -1) return null

    this.products[index] = { ...this.products[index], ...productData }
    return { ...this.products[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.products.findIndex(p => p.Id === parseInt(id))
    if (index === -1) return false

    this.products.splice(index, 1)
    return true
  }

delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new ProductService()