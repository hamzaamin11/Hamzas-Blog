import { useEffect, useState } from "react";
import { Button, Modal, Table, TableHead, TableHeadCell } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../Constant";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
const DashPosts = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postToIdDelete, setPostIdToDelete] = useState("");
  console.log(userPosts);
  console.log("more", postToIdDelete);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/server/post/getposts?userId${currentUser._id}`
        );
        setUserPosts(res.data.posts);
        if (res.data.posts.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, postToIdDelete]);
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    console.log({ startIndex });
    try {
      const res = await axios.get(
        `${BASE_URL}/server/post/getposts?userId${currentUser._id}&startIndex=${startIndex}`
      );
      console.log(res.data, "*** show more ***");
      setUserPosts((prev) => {
        console.log(prev, "*** show more ***");
        return [...prev, ...res.data.posts];
      });
      if (res.data.posts.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `${BASE_URL}/server/post/deletepost/${postToIdDelete}/${currentUser._id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data);
      setUserPosts((prev) => {
        console.log({ prev, postToIdDelete });

        return prev.filter((post) => post._id !== postToIdDelete);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-32 p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date Updated</TableHeadCell>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell>Post title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>
                <span>Edit</span>
              </TableHeadCell>
            </TableHead>
            {userPosts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white  dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-20 object-cover bg-slate-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
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
        <p>You have no post yet!</p>
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
            Are you sure you want to delete this post?
          </h3>
          <div className="flex items-center justify-center gap-5">
            <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts;
