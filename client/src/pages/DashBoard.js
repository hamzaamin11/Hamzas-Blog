import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

const DashBoard = () => {
  const location = useLocation();
  console.log("locatin bazzi", location);
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const tabFromUrl = urlParam.get("tab");
    console.log("urlParams", urlParam);
    console.log("tabfromUrl", tabFromUrl);

    tabFromUrl && setTab(tabFromUrl);
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/*sidebar*/}
        <DashSideBar />
      </div>
      {/*profile*/}
      {tab === "profile" && <DashProfile />}
      <div>
        {/*Posts*/}
        {tab === "posts" && <DashPosts />}
      </div>
      {/*Posts*/}
      {tab === "users" && <DashUsers />}
      {/*Comments*/}
      {tab === "comments" && <DashComments />}
      {/*DashBoardComponent*/}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
};

export default DashBoard;
