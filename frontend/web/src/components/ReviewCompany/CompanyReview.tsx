import React, { useState, useEffect } from "react";
import "./CompanyReview.css";
import { FaStar } from "react-icons/fa";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Pagination, message } from "antd";
import useCompanyReview from "../../hook/useCompanyReview";
import useUser from "../../hook/useUser";

interface Props {
  companyId?: string;
}

const REVIEWS_PER_PAGE = 3;
const COMMENTS_PER_PAGE = 2;

const CompanyReview: React.FC<Props> = ({ companyId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: number }>({});

  const [editingReview, setEditingReview] = useState<{
    reviewId?: string;
    title?: string;
    content?: string;
    rating?: number;
  }>({});

  const [editingComment, setEditingComment] = useState<{
    reviewId?: string;
    commentId?: string;
    text?: string;
  }>({});

  const { reviews, addReview, addComment, updateReview, updateComment, loading } = useCompanyReview(companyId);
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
    setCurrentReviewPage(1);
  };

  const handleAddComment = async (reviewId: string) => {
    const text = commentText[reviewId]?.trim();
    if (!text || !user?._id) return;

    await addComment(reviewId, text, user._id, user.fullname, user.avatar);
    setCommentText({ ...commentText, [reviewId]: "" });
    setExpandedComments((prev) => ({ ...prev, [reviewId]: 1 }));
  };

  const calculateAverageRating = (): string => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();
  const totalReviews = reviews.length;


  const startReviewIndex = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
  const paginatedReviews = reviews.slice(startReviewIndex, startReviewIndex + REVIEWS_PER_PAGE);

  const canEdit = (date: string): boolean => {
    const reviewTime = new Date(date).getTime();
    if (isNaN(reviewTime)) return false;
    const hoursDiff = (Date.now() - reviewTime) / (1000 * 60 * 60);
    return hoursDiff <= 48;
  };

  const startEditReview = (review: any) => {
    setEditingReview({
      reviewId: review._id,
      title: review.title || "",
      content: review.content,
      rating: review.rating,
    });
    setEditingComment({}); 
  };

  const saveEditReview = async () => {
    if (!editingReview.reviewId || !editingReview.content?.trim()) return;

    try {
      await updateReview(editingReview.reviewId, {
        title: editingReview.title,
        content: editingReview.content,
        rating: editingReview.rating,
      });
      message.success("Cập nhật thành công");
      setEditingReview({});
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  const cancelEditReview = () => setEditingReview({});

  const startEditComment = (reviewId: string, commentId: string, text: string) => {
    setEditingComment({ reviewId, commentId, text });
    setEditingReview({}); 
  };

  const saveEditComment = async () => {
    if (!editingComment.reviewId || !editingComment.commentId || !editingComment.text?.trim()) return;

    try {
      await updateComment(editingComment.reviewId, editingComment.commentId, editingComment.text);
      message.success("Cập nhật bình luận thành công");
      setEditingComment({});
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  const cancelEditComment = () => setEditingComment({});

  if (loadingUser) return <p>Đang tải thông tin người dùng...</p>;
  if (!user) return <p>Vui lòng đăng nhập để đánh giá</p>;

  return (
    <div className="company-review-container">
      <h3 className="review-heading">Đánh giá công ty</h3>
      <div className="company-overall-rating">
        <div className="overall-score">
          <span className="big-rating">{averageRating}</span>
          <span className="out-of">/5</span>
        </div>
        <div className="overall-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={20}
              color={star <= Math.round(parseFloat(averageRating)) ? "#fbbf24" : "#d1d5db"}
            />
          ))}
        </div>
        <p className="review-count">Dựa trên {totalReviews} đánh giá</p>
      </div>

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
          <>
            {paginatedReviews.map((review) => {
              const isEditingReview = editingReview.reviewId === review._id;
              const commentPage = expandedComments[review._id] || 1;
              const startCommentIndex = (commentPage - 1) * COMMENTS_PER_PAGE;
              const paginatedComments = review.comments.slice(
                startCommentIndex,
                startCommentIndex + COMMENTS_PER_PAGE
              );

              return (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <div className="review-user-info">
                      <img
                        src={review.avatar || "/default-avatar.png"}
                        alt={review.author}
                        className="review-avatar"
                      />
                      <div>
                        <p className="review-author">{review.author}</p>
                        <p className="review-date">
                          {new Date(review.date).toLocaleDateString("vi-VN")}
                          {review.editedAt && <span className="edited-tag"> (Đã chỉnh sửa)</span>}
                        </p>
                      </div>
                    </div>

                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={18}
                          color={i < review.rating ? "#fbbf24" : "#d1d5db"}
                        />
                      ))}
                    </div>

                    {review.userId === user._id && canEdit(review.date) && !editingReview.reviewId && (
                      <div className="edit-button-wrapper">
                        <EditOutlined
                          className="edit-icon"
                          onClick={() => startEditReview(review)}
                          title="Chỉnh sửa đánh giá"
                        />
                      </div>
                    )}
                  </div>

                  <div className="review-body">
                    {isEditingReview ? (
                      <>
                        <div className="edit-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={20}
                              color={star <= (editingReview.rating || 0) ? "#fbbf24" : "#d1d5db"}
                              onClick={() => setEditingReview({ ...editingReview, rating: star })}
                              style={{ cursor: "pointer" }}
                            />
                          ))}
                        </div>

                        <input
                          type="text"
                          value={editingReview.title || ""}
                          onChange={(e) => setEditingReview({ ...editingReview, title: e.target.value })}
                          placeholder="Tiêu đề"
                          className="edit-input"
                        />

                        <textarea
                          value={editingReview.content || ""}
                          onChange={(e) => setEditingReview({ ...editingReview, content: e.target.value })}
                          rows={3}
                          className="edit-textarea"
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && saveEditReview()}
                        />

                        <div className="edit-actions">
                          <CheckOutlined onClick={saveEditReview} className="save-icon" />
                          <CloseOutlined onClick={cancelEditReview} className="cancel-icon" />
                        </div>
                      </>
                    ) : (
                      <>
                        {review.title && (
                          <>
                            <strong>Tiêu đề:</strong> <h4>{review.title}</h4>
                          </>
                        )}
                        <strong>Nội dung:</strong>
                        <p className="review-content">{review.content}</p>
                      </>
                    )}
                  </div>

                  <div className="comment-section">
                    {paginatedComments.map((c) => {
                      const isEditingThisComment =
                        editingComment.reviewId === review._id && editingComment.commentId === c._id;

                      return (
                        <div key={c._id} className="comment-item">
                          <img
                            src={c.avatar || "/default-avatar.png"}
                            alt={c.author}
                            className="comment-avatar"
                          />
                          <div className="comment-content">
                            <div className="comment-header">
                              <strong>{c.author}</strong>
                              <span className="review-date">
                                {new Date(c.date).toLocaleTimeString("vi-VN")}
                                {c.editedAt && <span className="edited-tag"> (Đã sửa)</span>}
                              </span>

                              {c.userId === user._id && canEdit(c.date) && !editingComment.commentId && (
                                <EditOutlined
                                  className="edit-icon small"
                                  onClick={() => startEditComment(review._id, c._id, c.text)}
                                  title="Chỉnh sửa bình luận"
                                />
                              )}
                            </div>

                            {isEditingThisComment ? (
                              <>
                                <textarea
                                  value={editingComment.text || ""}
                                  onChange={(e) =>
                                    setEditingComment({ ...editingComment, text: e.target.value })
                                  }
                                  rows={2}
                                  className="edit-textarea small"
                                  onKeyDown={(e) =>
                                    e.key === "Enter" && !e.shiftKey && saveEditComment()
                                  }
                                />
                                <div className="edit-actions">
                                  <CheckOutlined onClick={saveEditComment} className="save-icon" />
                                  <CloseOutlined onClick={cancelEditComment} className="cancel-icon" />
                                </div>
                              </>
                            ) : (
                              <p className="comment-text">{c.text}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {review.comments.length > COMMENTS_PER_PAGE && (
                      <div className="comment-pagination">
                        <Pagination
                          current={commentPage}
                          total={review.comments.length}
                          pageSize={COMMENTS_PER_PAGE}
                          onChange={(page) =>
                            setExpandedComments((prev) => ({ ...prev, [review._id]: page }))
                          }
                          size="small"
                          showSizeChanger={false}
                        />
                      </div>
                    )}

                    <div className="comment-input-box">
                      <input
                        type="text"
                        placeholder="Viết bình luận..."
                        value={commentText[review._id] || ""}
                        onChange={(e) =>
                          setCommentText({ ...commentText, [review._id]: e.target.value })
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(review._id)}
                      />
                      <button onClick={() => handleAddComment(review._id)}>Gửi</button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="review-pagination">
              <Pagination
                current={currentReviewPage}
                total={reviews.length}
                pageSize={REVIEWS_PER_PAGE}
                onChange={setCurrentReviewPage}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyReview;