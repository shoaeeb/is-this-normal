import React, { useState } from "react";
import PropTypes from "prop-types";
import api from "../../utils/api";
import { trackEvent } from "../../utils/analytics";

const CommentForm = ({ questionId, parentId, onCommentAdded }) => {
  const [formData, setFormData] = useState({
    text: "",
    username: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { text, username } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (text.trim() === "") {
      setError("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/api/comments", {
        questionId,
        parentId,
        text,
        username: username.trim() || "Anonymous",
      });

      // Clear form
      setFormData({ text: "", username: "" });

      // Notify parent component
      onCommentAdded();

      // Show success message
      setSuccess("Comment posted successfully!");

      // Track comment submission
      trackEvent(
        'Comment', 
        parentId ? 'Reply' : 'New Comment', 
        `Question: ${questionId}`
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-form-container">
      {!parentId && <h3>Join the Discussion</h3>}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <textarea
            name="text"
            placeholder={
              parentId ? "Write a reply..." : "Share your thoughts..."
            }
            value={text}
            onChange={onChange}
            rows={parentId ? "2" : "3"}
          ></textarea>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Your name (optional)"
            value={username}
            onChange={onChange}
          />
          <small className="form-text">
            Leave blank to post as "Anonymous"
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Posting..."
            : parentId
            ? "Post Reply"
            : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  questionId: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  onCommentAdded: PropTypes.func.isRequired,
};

export default CommentForm;
