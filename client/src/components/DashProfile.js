import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../FireBase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { BASE_URL } from "../Constant";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInSuccess,
  signOutUser,
  updateStart,
} from "../redux/UserSlice";
import { Link } from "react-router-dom";
const DashProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [errors, setErrors] = useState(null);
  const [nameAlert, setNameAlert] = useState(
    `Name must be updated if you want update image!`
  );
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  console.log("====>>", imageFileUploadProgress, imageFileUploadError);
  console.log("formData", formData);
  console.log("Errors", errors);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    // service firebase.storage {
    //     match /b/{bucket}/o {
    //       match /{allPaths=**} {
    //         allow read;
    //         allow write: if
    //         request.resource.size < 2 * 1024 * 1024 &&
    //         request.resource.contentType.matches('image/.*')
    //       }
    //     }
    //   }
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
        });
        setImageFileUploadProgress(null);
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setImageFileUploadError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      return;
    }
    dispatch(updateStart());
    try {
      const res = await axios.post(
        `${BASE_URL}/server/user/update/${currentUser._id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(signInSuccess(res.data));
      setNameAlert(null);
      setErrors(null);
      setUpdateUserSuccess("User's profile updated successfully");
    } catch (error) {
      if (error.response?.data.statusCode === 400) {
        return setErrors(error.response.data.message);
      }
      setErrors(error.message);
      console.log(error);
      setNameAlert(null);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(
        `${BASE_URL}/server/user/delete/${currentUser._id}`,
        {
          withCredentials: true,
        }
      );
      dispatch(deleteUserSuccess(res.data));
      localStorage.clear();
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOutUser = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/server/user/signout`);
      dispatch(signOutUser(res.data));
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className=" relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full  "
          onClick={() => filePickerRef.current.click()}
          onChange={handleChange}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199) ${imageFileUploadProgress / 100}`,
                },
              }}
            />
          )}

          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {nameAlert && <Alert color="failure">{nameAlert}</Alert>}

        <TextInput
          type="text"
          placeholder="username"
          name="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          placeholder="email"
          name="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          placeholder="*********"
          name="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploadProgress}
        >
          {loading || imageFileUploadProgress ? "loading..." : "update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="submit"
              className="w-full"
              gradientDuoTone="purpleToPink"
              outline
            >
              Create a post
            </Button>
          </Link>
        )}
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {errors && <Alert color="failure">{errors}</Alert>}
        {updateUserSuccess && (
          <Alert color="success">{updateUserSuccess}</Alert>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignOutUser}>
          Sign Out
        </span>
      </div>
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
            Are you sure you want to delete your account?
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
    </div>
  );
};

export default DashProfile;
