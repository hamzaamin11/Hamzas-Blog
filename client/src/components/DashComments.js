import { useEffect, useState } from "react";
import { Button, Modal, Table, TableHead, TableHeadCell } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { BASE_URL } from "../Constant";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
const DashComments = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentToIdDelete, setCommentIdToDelete] = useState("");
  console.log(comments);
  console.log("more", commentToIdDelete);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/server/comment/getcomments`, {
          withCredentials: true,
        });
        console.log(res.data);
        setComments(res.data.comments);
        if (res.data.comments.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = comments.length;
    console.log({ startIndex });
    try {
      const res = await axios.get(
        `${BASE_URL}/server/comment/getcomments?&startIndex=${startIndex}`
      );
      console.log(res.data, "*** show more ***");
      setComments((prev) => {
        console.log(prev, "*** show more ***");
        return [...prev, ...res.data.comments];
      });
      if (res.data.comments.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `${BASE_URL}/server/comment/deletecomment/${commentToIdDelete}`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data);
      setComments((prev) => {
        console.log({ prev, postToIdDelete: commentToIdDelete });

        return prev.filter((user) => user._id !== commentToIdDelete);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && comments.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date updated</TableHeadCell>
              <TableHeadCell>Comment content</TableHeadCell>
              <TableHeadCell>Number of likes</TableHeadCell>
              <TableHeadCell>PostId</TableHeadCell>
              <TableHeadCell>UserId</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            {comments.map((c) => (
              <Table.Body className="divide-y" key={c._id}>
                <Table.Row className="bg-white  dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(c.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{c.content}</Table.Cell>
                  <Table.Cell>
                    <span className="">{c.numberOfLikes}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="">{c.postId}</span>
                  </Table.Cell>
                  <Table.Cell>{c.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(c._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </div>
      ) : (
        <p>You have no comments yet!</p>
      )}
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
            <Button color="failure" onClick={handleDeleteComment}>
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
        autoClose={2000}
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

export default DashComments;
