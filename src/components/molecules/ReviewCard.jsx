import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import reviewService from "@/services/api/reviewService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/atoms/StarRating";
import Badge from "@/components/atoms/Badge";

const ReviewCard = ({ review, onUpdate }) => {
  const [helpful, setHelpful] = useState(review.helpful || 0)
  const [notHelpful, setNotHelpful] = useState(review.notHelpful || 0)
  const [voted, setVoted] = useState(null)

const handleHelpful = async () => {
    if (voted) {
      toast.info('You have already voted on this review')
      return
    }

    try {
      await reviewService.markHelpful(review.Id)
      setHelpful(helpful + 1)
      setVoted('helpful')
      toast.success('Thank you for your feedback!')
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error marking review as helpful:', error)
      toast.error('Failed to submit your vote. Please try again.')
    }
  }

const handleNotHelpful = async () => {
    if (voted) {
      toast.info('You have already voted on this review')
      return
    }

    try {
      await reviewService.markNotHelpful(review.Id)
      setNotHelpful(notHelpful + 1)
      setVoted('notHelpful')
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error marking review as not helpful:', error)
      toast.error('Failed to submit your vote. Please try again.')
    }
  }

  const formattedDate = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })

  return (
    <div className="border-b border-gray-200 py-6 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
          <span className="text-accent font-semibold text-sm">
            {review.userName.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">{review.userName}</span>
                {review.verifiedBuyer && (
                  <Badge variant="success" size="small">
                    <ApperIcon name="CheckCircle2" size={12} className="mr-1" />
                    Verified Buyer
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.rating} size={14} />
                <span className="text-xs text-secondary">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Review Title */}
          <h4 className="font-semibold text-primary mb-2">{review.title}</h4>

          {/* Review Text */}
          <p className="text-sm text-secondary leading-relaxed mb-3">
            {review.text}
          </p>

          {/* Product Variant */}
          {review.variant && (
            <p className="text-xs text-secondary mb-3">
              <span className="font-medium">Purchased:</span> {review.variant}
            </p>
          )}

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mb-4">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop"
                  }}
                />
              ))}
            </div>
          )}

          {/* Helpful Buttons */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-secondary">Was this helpful?</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="small"
                onClick={handleHelpful}
                disabled={voted !== null}
                className={cn(
                  "text-xs",
                  voted === 'helpful' && "bg-accent/10 border-accent text-accent"
                )}
              >
                <ApperIcon name="ThumbsUp" size={12} className="mr-1" />
                Yes ({helpful})
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={handleNotHelpful}
                disabled={voted !== null}
                className={cn(
                  "text-xs",
                  voted === 'notHelpful' && "bg-gray-100 border-gray-400"
                )}
              >
                <ApperIcon name="ThumbsDown" size={12} className="mr-1" />
                No ({notHelpful})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard