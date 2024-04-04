import { Link } from "react-router-dom";
import CalltoAction from "../components/CalltoAction";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Constant";
const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/server/post/getposts?limit=6`);
        setPosts(res.data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, []);
  return (
    <div>
      <div className="flex flex-col  gap-6 lg:p-28 p-3 max-w-6xl mx-auto">
        <h1 className="3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development and programing languages.
        </p>
        <Link
          to="/search"
          className="text:xs sm:text-sm text-teal-500  font-bold hover:underline"
        >
          view all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CalltoAction />
      </div>
      <div className="max-w-6xl mx-auto flex flex-col p-3 gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg  text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
