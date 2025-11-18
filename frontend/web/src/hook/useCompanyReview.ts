import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTS } from "../utils/host";

export interface Comment {
  _id: string;
  author: string;
  avatar?: string;
  text: string;
  date: string;
  userId?: string;
  editedAt?: string;
}

interface Review {
  _id: string;
  rating: number;
  title: string;
  content: string;
  userId: string;
  fullname: string;
  author: string;
  avatar?: string;
  date: string;
  editedAt?: string;
  comments: Comment[];
}

interface RatingInfo {
  averageRating: string; 
  totalReviews: number;
}

const useCompanyReview = (companyId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingInfo, setRatingInfo] = useState<RatingInfo>({
    averageRating: "0.0",
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUserId = (): string | null => {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    try {
      const parsed = JSON.parse(userData);
      return parsed._id || parsed.user_id || null;
    } catch {
      return null;
    }
  };

  const fetchReviews = async () => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const url = `${HOSTS.reviewService}/${companyId}`;
      const res = await axios.get(url);
      setReviews(res.data.reviews || []);
      setRatingInfo(
        res.data.ratingInfo || { averageRating: "0.0", totalReviews: 0 }
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (data: {
    companyId?: string;
    rating: number;
    title?: string;
    content: string;
    userId?: string;
    fullname?: string;
    avatar?: string;
  }) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !data.companyId)
      throw new Error("Thiếu User ID hoặc Company ID");

    try {
      const res = await axios.post(HOSTS.reviewService, {
        ...data,
        userId: currentUserId,
      });
      setReviews((prev) => [res.data.review, ...prev]);

      const newAverage = (res.data.rating.averageRating || 0).toFixed(1);
      const newTotal = res.data.rating.totalReviews || 0;

      setRatingInfo({
        averageRating: newAverage,
        totalReviews: newTotal,
      });

      return res.data;
    } catch (e) {
      throw e;
    }
  };

  const addComment = async (
    reviewId: string,
    text: string,
    userId?: string,
    fullname?: string,
    avatar?: string
  ) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    const res = await axios.post(
      `${HOSTS.reviewService}/${reviewId}/comments`,
      {
        text,
        userId: currentUserId,
        fullname,
        avatar,
      }
    );
    setReviews((prev) => prev.map((r) => (r._id === reviewId ? res.data : r)));
  };

  const updateReview = async (
    reviewId: string,
    data: { title?: string; content: string; rating?: number }
  ) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error("Không tìm thấy userId");

    try {
      const res = await axios.put(`${HOSTS.reviewService}/${reviewId}`, {
        ...data,
        userId: currentUserId,
      });
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? res.data.review : r))
      );
      // CẬP NHẬT ĐIỂM NGAY LẬP TỨC
      const newAverage = (res.data.rating.averageRating || 0).toFixed(1);
      const newTotal = res.data.rating.totalReviews || 0;
      setRatingInfo({ averageRating: newAverage, totalReviews: newTotal });
    } catch (e) {
      throw e;
    }
  };

  const updateComment = async (
    reviewId: string,
    commentId: string,
    text: string
  ) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error("Không tìm thấy userId");

    const res = await axios.put(
      `${HOSTS.reviewService}/${reviewId}/comments/${commentId}`,
      {
        text,
        userId: currentUserId,
      }
    );
    setReviews((prev) => prev.map((r) => (r._id === reviewId ? res.data : r)));
  };

  const deleteReview = async (id: string) => {
    try {
      // Backend trả về { message, ratingInfo }
      const res = await axios.delete(`${HOSTS.reviewService}/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setRatingInfo(res.data.ratingInfo);
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [companyId]);

  return {
    reviews,
    loading,
    error,
    addReview,
    addComment,
    updateReview,
    updateComment,
    deleteReview,
    refetch: fetchReviews,
    ratingInfo, // TRẢ VỀ RATING INFO ĐÃ LOAD
  };
};

export default useCompanyReview;
