import reviewsData from "@/services/mockData/reviews.json"

class ReviewService {
  constructor() {
    this.reviews = this.loadReviews()
  }

  loadReviews() {
    const stored = localStorage.getItem('reviews')
    return stored ? JSON.parse(stored) : [...reviewsData]
  }

  saveReviews() {
    localStorage.setItem('reviews', JSON.stringify(this.reviews))
  }

  getAll() {
    return [...this.reviews]
  }

  getById(id) {
    return this.reviews.find(r => r.Id === parseInt(id))
  }

  getByProductId(productId) {
    return this.reviews.filter(r => r.productId === parseInt(productId))
  }

  create(review) {
    const newReview = {
      ...review,
      Id: Math.max(0, ...this.reviews.map(r => r.Id)) + 1,
      helpful: 0,
      notHelpful: 0,
      createdAt: new Date().toISOString()
    }
    
    this.reviews.push(newReview)
    this.saveReviews()
    return newReview
  }

  update(id, data) {
    const index = this.reviews.findIndex(r => r.Id === parseInt(id))
    if (index !== -1) {
      this.reviews[index] = { ...this.reviews[index], ...data }
      this.saveReviews()
      return this.reviews[index]
    }
    return null
  }

  delete(id) {
    const index = this.reviews.findIndex(r => r.Id === parseInt(id))
    if (index !== -1) {
      this.reviews.splice(index, 1)
      this.saveReviews()
      return true
    }
    return false
  }

  markHelpful(id) {
    const review = this.getById(id)
    if (review) {
      review.helpful = (review.helpful || 0) + 1
      this.saveReviews()
      return review
    }
    return null
  }

  markNotHelpful(id) {
    const review = this.getById(id)
    if (review) {
      review.notHelpful = (review.notHelpful || 0) + 1
      this.saveReviews()
      return review
    }
    return null
  }

  getStatsByProductId(productId) {
    const reviews = this.getByProductId(productId)
    
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let sum = 0

    reviews.forEach(review => {
      breakdown[review.rating]++
      sum += review.rating
    })

    return {
      average: Math.round((sum / reviews.length) * 10) / 10,
      total: reviews.length,
      breakdown
    }
  }
}

export default new ReviewService()