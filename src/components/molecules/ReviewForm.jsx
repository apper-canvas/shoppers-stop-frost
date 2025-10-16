import React, { useState } from "react";
import { toast } from "react-toastify";
import reviewService from "@/services/api/reviewService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import StarRating from "@/components/atoms/StarRating";

const ReviewForm = ({ productId, onSuccess }) => {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter a review title')
      return
    }

    if (!text.trim() || text.length < 20) {
      toast.error('Review must be at least 20 characters')
      return
    }

    setLoading(true)

    try {
      const review = {
        productId,
        userId: 1, // Mock user ID
        userName: 'Guest User', // Would come from auth context
        rating,
        title: title.trim(),
        text: text.trim(),
        verifiedBuyer: false,
        variant: '', // Would be selected variant
        images: images
      }

await reviewService.create(review)
      
      toast.success('Review submitted successfully!')
      
      // Reset form
      setRating(0)
      setTitle('')
      setText('')
      setImages([])
      
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error('Failed to submit review')
    } finally {
      setLoading(false)
    }
  }
const resetForm = () => {
    setRating(0);
    setTitle('');
    setText('');
  };

  const handleCancel = () => {
    resetForm();
    toast.success('Review form cleared');
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length + images.length > 3) {
      toast.error('Maximum 3 images allowed')
      return
    }

    // In real app, would upload to server
    // For now, create temporary URLs
    const newImages = files.map(file => URL.createObjectURL(file))
    setImages([...images, ...newImages])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-surface border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-primary mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Your Rating *
          </label>
          <StarRating
            rating={rating}
            interactive
            onChange={setRating}
            size={24}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Review Title *
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your review"
            maxLength={100}
            required
          />
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Your Review *
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={5}
            maxLength={500}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none text-sm"
          />
          <p className="text-xs text-secondary mt-1 text-right">
            {text.length}/500 characters
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Add Photos (Optional)
          </label>
          
          {images.length < 3 && (
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <ApperIcon name="Upload" size={16} />
              <span className="text-sm">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

{/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm