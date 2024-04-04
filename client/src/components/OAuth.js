import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../FireBase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../Constant";
import { getToken, signInSuccess } from "../redux/UserSlice";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      dispatch(getToken(resultsFromGoogle.user));
      console.log("result Email", resultsFromGoogle);
      const res = await axios.post(
        `${BASE_URL}/server/auth/google`,
        {
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        },
        {
          headers: {
            accessToken:
              "eyJhbGciOiJSUzI1NiIsImtpZCI6ImViYzIwNzkzNTQ1NzExODNkNzFjZWJlZDI5YzU1YmVmMjdhZDJjY2IiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiaGFtemEgYW1pbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJRG12cDBBWlQxdV9OU0JxVXM2bFNkdTNBbUdIeGI5bFJ2OFV1SXZ3QllKQT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9tZXJuLWJsb2ctMzk5YjAiLCJhdWQiOiJtZXJuLWJsb2ctMzk5YjAiLCJhdXRoX3RpbWUiOjE3MTA4ODYzNzMsInVzZXJfaWQiOiJ3VlpuSkxJTHd5TDN0TVNNelFzdGR1ZkRaOW0yIiwic3ViIjoid1ZabkpMSUx3eUwzdE1TTXpRc3RkdWZEWjltMiIsImlhdCI6MTcxMDg4NjM3MywiZXhwIjoxNzEwODg5OTczLCJlbWFpbCI6ImhhbXphYW1pbjEwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNDQzOTU4NDMyODQ4MDA4ODczNiJdLCJlbWFpbCI6WyJoYW16YWFtaW4xMDRAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.fqS09SjnqR9Gdw5gz0q_z12lgM0ssQSK0gTyVi1eMSKxLxbJSvJVz7NEqm_fRuwPibhdY9VzrAUump0c40MU_MCjoFGI_sBCQvgF-7oMGqMgudGI3iR8Y6tfeibCMkvq3HrowQDF8y26Yf_bQWzw3I5uZSaZTCcd10gMuBwF0h0Z7PuXeVtozDhGaW7Y_RBRZWW5oyKf5E_wIqZe6M4fdXyFBrUv0Jh4PumMjkrXGi2B5l3jSgbqoB2UmruA0Dv_alnMllEMbitDr0fT9QgGOnCjvQ-E6cOD2I7ns1aRO8hRcsIIlUbAVa0OYEjpGxczbHw-4M3zKzs2aoNPyGiaXg",
          },
        }
      );
      dispatch(signInSuccess(res.data));
      navigate("/");
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
