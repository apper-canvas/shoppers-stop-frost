import usersData from "@/services/mockData/users.json"

const STORAGE_KEY = "auth_user"
const USERS_STORAGE_KEY = "app_users"

class AuthService {
  constructor() {
    // Initialize users from JSON if not in localStorage
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersData))
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getUsers() {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY)
    return usersJson ? JSON.parse(usersJson) : []
  }

  saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }

  async login(email, password) {
    await this.delay(500)

    const users = this.getUsers()
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Store current user (without password)
    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))

    return userWithoutPassword
  }

  async signup(name, email, password, confirmPassword) {
    await this.delay(500)

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      throw new Error("All fields are required")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match")
    }

    const users = this.getUsers()

    // Check if email already exists
    if (users.some(u => u.email === email)) {
      throw new Error("Email already registered")
    }

    // Create new user
    const newUser = {
      Id: users.length > 0 ? Math.max(...users.map(u => u.Id)) + 1 : 1,
      name,
      email,
      password
    }

    users.push(newUser)
    this.saveUsers(users)

    // Auto login after signup
    const { password: _, ...userWithoutPassword } = newUser
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))

    return userWithoutPassword
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY)
  }

  getCurrentUser() {
    const userJson = localStorage.getItem(STORAGE_KEY)
    return userJson ? JSON.parse(userJson) : null
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null
  }
}

const authService = new AuthService()
export default authService