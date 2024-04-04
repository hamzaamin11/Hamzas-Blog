import { CiSearch } from "react-icons/ci";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/ThemeSlice";
import { signOutUser } from "../redux/UserSlice";

const Header = () => {
  const location = useLocation().pathname;
  const [searchTerm, setSearchTeam] = useState("");
  const navigate = useNavigate();
  const path = useLocation().search;
  const currentUser = useSelector((state) => state.user.currentUser);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(path);
    const searchTermFormUrl = urlParams.get("searchTerm");
    if (searchTermFormUrl) {
      setSearchTeam(searchTermFormUrl);
    }
  }, [path]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(path);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className=" self-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white ">
          Hamza's
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={CiSearch}
          className="hidden sm:inline"
          value={searchTerm}
          onChange={(e) => setSearchTeam(e.target.value)}
        />
      </form>
      <Button className="lg:hidden h-10 w-12 border-2  " color="gray" pill>
        <CiSearch />
      </Button>
      <div className="flex gap-2 md:order-2 ">
        <Button
          className=" hidden sm:inline  w-12 h-10 "
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}.
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            {currentUser.isAdmin && (
              <Link to={"/create-post"}>
                <Dropdown.Item>Create Post</Dropdown.Item>
              </Link>
            )}
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => dispatch(signOutUser())}>
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"signin"}>
            <Button gradientDuoTone={"purpleToBlue"} outline>
              Sign in
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={location === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={location === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={location === "/project"} as={"div"}>
          <Link to={"/project"}>Project</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
