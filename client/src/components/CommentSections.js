import { Alert, Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { BASE_URL } from "../Constant";
import { Link } from "react-router-dom";
import GetComments from "./GetComments";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CommentSections = ({ postId }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCommentError(null);
      const res = await axios.post(
        `${BASE_URL}/server/comment/create`,
        {
          content: comment,
          postId,
          userId: currentUser._id,
        },
        {
          withCredentials: true,
        }
      );
      setComment("");
      setComments([res.data, ...comments]);
    } catch (error) {
      if (error.response?.data.statusCode === 403) {
        return setCommentError(error.response.data.message);
      }
      setCommentError(error.message);
    }
  };
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/server/comment/getpostcomments/${postId}`
        );
        setComments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [postId]);
  const handleLike = async (commentId) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/server/comment/likecomment/${commentId}`,
        {},
        {
          withCredentials: true,
        }
      );

      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: res.data.likes,
                numberOfLikes: res.data.likes.length,
              }
            : comment
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (commentId, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === commentId ? { ...c, content: editedContent } : c
      )
    );
  };
  const handleDelete = async (commentId) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/server/comment/deletecomment/${commentToDelete}`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data);
      setComments(comments.filter((prev) => prev._id !== commentToDelete));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="w-7 h-7 object-cover rounded-full"
            src={currentUser.profilePicture}
            about=""
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 flex gap-1  my-5">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to="/signin">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button
              className=""
              gradientDuoTone="purpleToBlue"
              type="submit"
              outline
            >
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5"> No comments yet!</p>
      ) : (
        <div className="flex items-center text-sm my-5  gap-1">
          <p>Comments</p>
          <div className="border border-gray-400 py-[2px] px-2 rounded-sm">
            <p>{comments.length}</p>
          </div>
        </div>
      )}
      {comments.map((comment) => {
        return (
          <GetComments
            key={comment._id}
            comment={comment}
            onLike={handleLike}
            onEdit={handleEdit}
            onDelete={(commentId) => {
              setShowModal(true);
              setCommentToDelete(commentId);
            }}
          />
        );
      })}
      <Modal
        show={showModal}
        onClick={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 text-center">
            Are you sure you want to delete this comment?
          </h3>
          <div className="flex items-center justify-center gap-5">
            <Button color="failure" onClick={handleDelete}>
              yes, I'm sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No,cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default CommentSections;
