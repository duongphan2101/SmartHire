import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTS } from "../utils/host";

export interface Comment {
  _id: string;
  author: string;
   avatar?: string;
  text: string;
  date: string;
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
  comments: Comment[];
}

const useCompanyReview = (companyId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    author?: string;
    fullname?: string;
    avatar?: string;
  }) => {
    const res = await axios.post(HOSTS.reviewService, data);
    setReviews((prev) => [res.data, ...prev]);
  };

  const addComment = async (
  reviewId: string,
  text: string,
  userId?: string,
  fullname?: string,
  avatar?: string
) => {
  const res = await axios.post(`${HOSTS.reviewService}/${reviewId}/comments`, {
    text,
    userId,
    fullname,
    avatar,
  });
  setReviews((prev) =>
    prev.map((r) => (r._id === reviewId ? res.data : r))
  );
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
    deleteReview,
    refetch: fetchReviews,
  };
};

export default useCompanyReview;
