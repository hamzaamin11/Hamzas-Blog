import { useEffect, useState } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Constant";
import axios from "axios";
import PostCard from "../components/PostCard";

const SearchPage = () => {
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  console.log("post", posts);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFormUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFormUrl || categoryFromUrl) {
      setSideBarData({
        ...sideBarData,
        searchTerm: searchTermFromUrl,
        sort: sortFormUrl,
        category: categoryFromUrl,
      });
    }
    const fetchPost = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await axios.get(
          `${BASE_URL}/server/post/getposts?${searchQuery}`
        );
        setPosts(res.data.posts);
        if (res.data.posts.length === 9) {
          setShowMore(true);
        } else setShowMore(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [location.search]);
  const handleChange = (e) => {
    if (e.target.name === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (e.target.name === "sort") {
      const order = e.target.value || "desc";
      setSideBarData({ ...sideBarData, sort: order });
    }
    if (e.target.name === "category") {
      const category = e.target.value || "uncategorized";
      setSideBarData({ ...sideBarData, category });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const paramsUrl = new URLSearchParams(location.search);
    paramsUrl.set("searchTerm", sideBarData.searchTerm);
    paramsUrl.set("sort", sideBarData.sort);
    paramsUrl.set("category", sideBarData.category);
    const searchQuery = paramsUrl.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className=" flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="search..."
              name="searchTerm"
              type="text"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">sort:</label>
            <Select
              onChange={handleChange}
              value={sideBarData.sort}
              name="sort"
            >
              <option value={"desc"}>Latest</option>
              <option value={"asc"}>Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">category:</label>
            <Select
              onChange={handleChange}
              value={sideBarData.category}
              name="category"
            >
              <option value={"uncategorized"}>Uncategorized</option>
              <option value={"reactjs"}>React.js</option>
              <option value={"nextjs"}>next.js</option>
              <option value={"javascriptjs"}>JavaScript</option>
            </Select>
          </div>
          <Button type="submit" gradientDuoTone="purpleToPink" outline>
            Apply Filter
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
