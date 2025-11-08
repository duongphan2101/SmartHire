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

const useCompanyReview = (companyId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
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
    try {
      setLoading(true);
      const url = companyId
        ? `${HOSTS.reviewService}/${companyId}`
        : HOSTS.reviewService;
      const res = await axios.get(url);
      setReviews(res.data);
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
    if (!currentUserId) throw new Error("Không tìm thấy userId");

    const res = await axios.post(HOSTS.reviewService, {
      ...data,
      userId: currentUserId,
    });
    setReviews((prev) => [res.data, ...prev]);
  };

 const addComment = async (
  reviewId: string,
  text: string,
  userId?: string,
  fullname?: string,
  avatar?: string
) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) throw new Error("Không tìm thấy userId");

  const res = await axios.post(`${HOSTS.reviewService}/${reviewId}/comments`, {
    text,
    userId: currentUserId,
    fullname,
    avatar,
  });
  setReviews((prev) => prev.map((r) => (r._id === reviewId ? res.data : r)));
};

  const updateReview = async (
  reviewId: string,
  data: { title?: string; content: string; rating?: number }
) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) throw new Error("Không tìm thấy userId");

  const res = await axios.put(`${HOSTS.reviewService}/${reviewId}`, {
    ...data,
    userId: currentUserId,
  });
  setReviews((prev) => prev.map((r) => (r._id === reviewId ? res.data : r)));
};

const updateComment = async (
  reviewId: string,
  commentId: string,
  text: string
) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) throw new Error("Không tìm thấy userId");

  const res = await axios.put(`${HOSTS.reviewService}/${reviewId}/comments/${commentId}`, {
    text,
    userId: currentUserId,
  });
  setReviews((prev) => prev.map((r) => (r._id === reviewId ? res.data : r)));
};
  const deleteReview = async (id: string) => {
    await axios.delete(`${HOSTS.reviewService}/${id}`);
    setReviews((prev) => prev.filter((r) => r._id !== id));
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
  };
};

export default useCompanyReview;
