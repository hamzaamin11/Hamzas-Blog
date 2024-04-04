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
const DashUsers = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToIdDelete, setUserIdToDelete] = useState("");
  console.log(users);
  console.log("more", userToIdDelete);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/server/user/getusers`, {
          withCredentials: true,
        });
        console.log(res.data);
        setUsers(res.data.users);
        if (res.data.users.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUser();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = users.length;
    console.log({ startIndex });
    try {
      const res = await axios.get(
        `${BASE_URL}/server/user/getusers?&startIndex=${startIndex}`
      );
      console.log(res.data, "*** show more ***");
      setUsers((prev) => {
        console.log(prev, "*** show more ***");
        return [...prev, ...res.data.users];
      });
      if (res.data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `${BASE_URL}/server/user/delete/${userToIdDelete}`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data);
      setUsers((prev) => {
        console.log({ prev, postToIdDelete: userToIdDelete });

        return prev.filter((user) => user._id !== userToIdDelete);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-32 p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && users.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date Created</TableHeadCell>
              <TableHeadCell>User image</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Admin</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white  dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover bg-slate-500"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <span className="">{user.username}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="">{user.email}</span>
                  </Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
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
        <p>You have no user yet!</p>
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
            Are you sure you want to delete this user?
          </h3>
          <div className="flex items-center justify-center gap-5">
            <Button color="failure" onClick={handleDeleteUser}>
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

export default DashUsers;
