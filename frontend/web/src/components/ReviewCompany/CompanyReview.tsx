import React, { useState, useEffect } from "react";
import "./CompanyReview.css";
import { FaStar } from "react-icons/fa";
import useCompanyReview from "../../hook/useCompanyReview";
import useUser from "../../hook/useUser";

interface Props {
  companyId?: string;
}

const CompanyReview: React.FC<Props> = ({ companyId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const { reviews, addReview, addComment, loading } = useCompanyReview(companyId);
  const { user, getUser, loadingUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        const userId = parsed._id || parsed.user_id;
        if (userId) await getUser(userId);
      }
    };
    fetchUser();
  }, [getUser]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !content.trim() || !user) return;

    await addReview({
      companyId,
      rating,
      title,
      content,
      userId: user._id,
      fullname: user.fullname,
      avatar: user.avatar,
    });

    setRating(0);
    setTitle("");
    setContent("");
  };

  const handleAddComment = async (reviewId: string) => {
    const text = commentText[reviewId]?.trim();
    if (!text || !user?._id) return;

    await addComment(reviewId, text, user._id, user.fullname, user.avatar);
    setCommentText({ ...commentText, [reviewId]: "" });
  };

  if (loadingUser) return <p>Đang tải thông tin người dùng...</p>;
  if (!user) return <p>Vui lòng đăng nhập để đánh giá</p>;

  return (
    <div className="company-review-container">
      <h3 className="review-heading">Đánh giá công ty</h3>

      {/* FORM ĐÁNH GIÁ */}
      <form className="review-form" onSubmit={handleSubmitReview}>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={30}
              className="star"
              color={star <= (hover || rating) ? "#fbbf24" : "#d1d5db"}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <input
          type="text"
          placeholder="Tiêu đề đánh giá (tùy chọn)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="review-title-input"
        />

        <textarea
          placeholder="Chia sẻ trải nghiệm của bạn về công ty..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="review-textarea"
          rows={5}
        />

        <button
          type="submit"
          className={`review-submit ${!rating || !content.trim() ? "disabled" : ""}`}
          disabled={!rating || !content.trim()}
        >
          Gửi đánh giá
        </button>
      </form>

      <div className="review-list">
        {loading ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p className="no-review">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="review-user-info">
                  <img
                    src={review.avatar || "/default-avatar.png"}
                    alt={review.author || review.fullname}
                    className="review-avatar"
                  />
                  <div>
                    <p className="review-author">{review.author || review.fullname}</p>
                    <p className="review-date">
                      {new Date(review.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="review-stars" style={{paddingTop: 10, paddingBottom: 10}}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={18}
                      color={i < review.rating ? "#fbbf24" : "#d1d5db"}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <strong>Tiêu đề:</strong><h4>{review.title || "Không có tiêu đề"}</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <strong>Nội dung:</strong><p className="review-content">{review.content}</p>
                </div>
              </div>

              <div className="comment-section">
                {review.comments.map((c) => (
                  <div key={c._id} className="comment-item">
                    <img
                      src={c.avatar || "/default-avatar.png"}
                      alt={c.author}
                      className="comment-avatar"
                    />
                    <div>
                      <strong>{c.author}</strong>
                      <p className="review-date">{new Date(c.date).toLocaleTimeString("vi-VN")}</p>
                      <p>{c.text}</p>
                    </div>
                  </div>
                ))}

                <div className="comment-input-box">
                  <input
                    type="text"
                    placeholder="Viết bình luận..."
                    value={commentText[review._id] || ""}
                    onChange={(e) =>
                      setCommentText({ ...commentText, [review._id]: e.target.value })
                    }
                  />
                  <button onClick={() => handleAddComment(review._id)}>Gửi</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyReview;
