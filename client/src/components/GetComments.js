import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../Constant";
import moment from "moment";
import { Button, Textarea } from "flowbite-react";
import { FaThumbsUp } from "react-icons/fa6";
import { useSelector } from "react-redux";
const GetComments = ({ comment, onLike, onEdit, onDelete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [editedContent, setEditContent] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/server/user/${comment.userId}`
        );
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);
  const handleEdit = async () => {
    setIsEdit(true);
    setEditContent(comment.content);
  };
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/server/comment/editcomment/${comment._id}`,
        {
          content: editedContent,
        },
        {
          withCredentials: true,
        }
      );
      onEdit(comment._id, editedContent);
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex  p-4 border-b dark:text-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3 ">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 truncate text-xs dark:text-gray-400 ">
            {user ? `@${user.username}` : "anonymous"}
          </span>
          <span className="text-gray-400 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEdit ? (
          <div>
            <Textarea
              className="mb-2"
              rows="3"
              value={editedContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex justify-end text-xs gap-3">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-500  pb-2"> {comment.content}</p>
            <div className="flex items-center pt-3 text-xs border-t dark:text-gray-700 max-w-fit gap-1">
              <button
                className={`text-sm text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp />
              </button>
              <p className=" text-gray-500">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    "" +
                    (comment.numberOfLikes === 1 ? "Like" : "Likes")}
              </p>
              <div className="">
                {currentUser &&
                  (currentUser._id === comment.userId ||
                    currentUser.isAdmin) && (
                    <div className="flex gap-1">
                      <button
                        onClick={handleEdit}
                        type="button"
                        className="text-gray-400 hover:text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(comment._id)}
                        type="button"
                        className="text-gray-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetComments;
