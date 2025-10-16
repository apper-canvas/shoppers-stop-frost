import React, { useEffect, useState } from "react";
import reviewService from "@/services/api/reviewService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/atoms/StarRating";
import ReviewCard from "@/components/molecules/ReviewCard";
import ReviewForm from "@/components/molecules/ReviewForm";

const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filterRating, setFilterRating] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

useEffect(() => {
    loadReviews()
  }, [productId])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const productReviews = await reviewService.getByProductId(productId)
      const productStats = await reviewService.getStatsByProductId(productId)
      
      setReviews(productReviews)
      setStats(productStats)
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = () => {
    loadReviews()
    setShowForm(false)
  }

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (filterRating === 'all') return true
    return review.rating === parseInt(filterRating)
  })

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'helpful':
        return (b.helpful || 0) - (a.helpful || 0)
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  if (loading) {
    return <Loading />
  }

  if (!stats) {
    return null
  }

  const getPercentage = (count) => {
    return stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
  }

  return (
    <div className="bg-white rounded-lg p-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Customer Reviews</h2>

      {/* Overall Rating */}
      <div className="flex items-start gap-8 pb-8 border-b border-gray-200">
        {/* Rating Summary */}
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {stats.average.toFixed(1)}
          </div>
          <StarRating rating={stats.average} size={20} className="mb-2 justify-center" />
          <p className="text-sm text-secondary">
            Based on {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.breakdown[rating] || 0
            const percentage = getPercentage(count)
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <button
                  onClick={() => setFilterRating(rating.toString())}
                  className={cn(
                    "flex items-center gap-1 text-sm hover:text-accent transition-colors",
                    filterRating === rating.toString() ? "text-accent font-semibold" : "text-secondary"
                  )}
                >
                  <span>{rating}</span>
                  <ApperIcon name="Star" size={12} className="text-yellow-400 fill-yellow-400" />
                </button>
                
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <span className="text-sm text-secondary w-12 text-right">
                  {percentage}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="py-6 border-b border-gray-200">
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          icon={showForm ? "X" : "Edit3"}
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="py-6 border-b border-gray-200">
          <ReviewForm
            productId={productId}
            onSuccess={handleReviewSubmit}
          />
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex items-center justify-between py-6 border-b border-gray-200">
        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">Filter:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-6">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="MessageSquare" size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-secondary">
              {filterRating === 'all' 
                ? 'No reviews yet. Be the first to review this product!'
                : `No ${filterRating}-star reviews yet.`
              }
            </p>
          </div>
        ) : (
          sortedReviews.map(review => (
            <ReviewCard
              key={review.Id}
              review={review}
              onUpdate={loadReviews}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewsSection