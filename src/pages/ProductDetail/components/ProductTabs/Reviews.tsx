import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, AlertCircle } from 'lucide-react';
import productService from '../../../../services/productService';
import type { Product, Review } from '../../../../types/product';
import Button from '../../../../components/common/Button/Button';
import Textarea from '../../../../components/common/Textarea/Textarea';

interface ReviewsTabProps {
  product: Product;
  isUserLoggedIn?: boolean;
}

/**
 * Reviews Tab - Display product reviews and create new review
 */
const Reviews: React.FC<ReviewsTabProps> = ({ product, isUserLoggedIn = false }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const data = await productService.getProductReviews(product.id, {
          page: currentPage,
          limit: 10,
        });
        setReviews(data.data);
        setTotalPages(data.meta.totalPages);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product.id, currentPage]);

  // Handle submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUserLoggedIn) {
      setSubmitError('Vui lòng đăng nhập để viết đánh giá');
      return;
    }

    if (!comment.trim()) {
      setSubmitError('Vui lòng nhập bình luận');
      return;
    }

    if (comment.length < 10) {
      setSubmitError('Bình luận phải có ít nhất 10 ký tự');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await productService.createReview({
        productId: product.id,
        rating,
        comment,
      });

      setSubmitSuccess(true);
      setComment('');
      setRating(5);

      // Refetch reviews
      setTimeout(() => {
        setCurrentPage(1);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitError('Không thể tạo đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = product.averageRating
    ? parseFloat(product.averageRating.toString())
    : 0;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rating Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Đánh giá sản phẩm</h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 dark:text-gray-100">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {product.reviewCount} đánh giá
            </p>
          </div>
        </div>
      </div>

      {/* Write Review Form */}
      {isUserLoggedIn ? (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Viết đánh giá</h3>

          {submitSuccess && (
            <motion.div
              className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-green-800 dark:text-green-400 font-medium">✓ Đánh giá của bạn đã được tạo thành công!</p>
            </motion.div>
          )}

          {submitError && (
            <motion.div
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-400 font-medium">{submitError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Đánh giá
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Star
                      size={32}
                      className={`cursor-pointer transition-colors ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300 dark:hover:text-yellow-400'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Nhận xét ({comment.length}/1000)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                rows={5}
                maxLength={1000}
                className="w-full"
              />
              {comment.length < 10 && comment.length > 0 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Nhận xét phải có ít nhất 10 ký tự
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || comment.length < 10}
              className="w-full flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </form>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center bg-white dark:bg-gray-900">
          <AlertCircle size={32} className="text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">Vui lòng đăng nhập để viết đánh giá</p>
          <Button onClick={() => window.location.href = '/login'}>
            Đăng nhập
          </Button>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Đánh giá từ khách hàng ({product.reviewCount || 0})
        </h3>

        {isLoadingReviews ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Reviewer Info */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50"
                >
                  ← Trước
                </button>
                <span className="text-gray-600 dark:text-gray-400">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50"
                >
                  Sau →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Reviews;
