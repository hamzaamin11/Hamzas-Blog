import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { BASE_URL } from "../Constant";
import OAuth from "../components/OAuth";
const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const value = e.target.value;
    const key = e.target.name;
    setFormData({ ...formData, [key]: value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(BASE_URL + "/server/auth/signup", formData);
      console.log(res.data);
      navigate("/signin");
      setLoading(false);
    } catch (error) {
      if (error.response?.data.statusCode === 400) {
        setError(error.response.data.message);
        setLoading(false);
        return;
      } else if (error.response?.data.statusCode === 500) {
        setError(error.response.data.message);
        setLoading(false);
        return;
      }
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-5 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to={"/"} className="text-3xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white ">
              Hamza's
            </span>
            Blog
          </Link>
          <p className="mt-5 text-sm">
            This is a demo project.You can sign up with your email and password
            or with goole.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="username"
                name="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="text"
                placeholder="name@company.com"
                name="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="text"
                placeholder="password"
                name="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div>
                  loading...
                  <Spinner
                    className="ml-3"
                    color="info"
                    aria-label="Info spinner example"
                    size="sm"
                  />
                </div>
              ) : (
                "Sign up"
              )}
            </Button>
            <OAuth />
          </form>
          {error && (
            <Alert className="mt-5 text-center" color="failure">
              {error}
            </Alert>
          )}
          <div className="flex gap-2 text-sm mt-4">
            <span>Have an account?</span>
            <Link className="text-sky-500" to={"/signin"}>
              sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
