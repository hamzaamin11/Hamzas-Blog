import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import DashBoard from "./pages/DashBoard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import FooterCom from "./components/FooterCom";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./components/PostPage";
import ScrolltoTop from "./components/ScrolltoTop";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <ScrolltoTop />
      <Header />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashBoard" element={<DashBoard />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}

export default App;
