import categoriesData from "@/services/mockData/categories.json"

class CategoryService {
  constructor() {
    this.categories = [...categoriesData]
  }

  async getAll() {
    await this.delay(200)
    return [...this.categories]
  }

  async getById(id) {
    await this.delay(150)
    const category = this.categories.find(c => c.Id === parseInt(id))
    return category ? { ...category } : null
  }

  async getByName(name) {
    await this.delay(150)
    const category = this.categories.find(c => c.name.toLowerCase() === name.toLowerCase())
    return category ? { ...category } : null
  }

  async create(category) {
    await this.delay(300)
    const maxId = Math.max(...this.categories.map(c => c.Id))
    const newCategory = {
      ...category,
      Id: maxId + 1
    }
    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id, categoryData) {
    await this.delay(250)
    const index = this.categories.findIndex(c => c.Id === parseInt(id))
    if (index === -1) return null

    this.categories[index] = { ...this.categories[index], ...categoryData }
    return { ...this.categories[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.categories.findIndex(c => c.Id === parseInt(id))
    if (index === -1) return false

    this.categories.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new CategoryService()