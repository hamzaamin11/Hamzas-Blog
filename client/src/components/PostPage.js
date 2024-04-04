import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Constant";
import { Button, Spinner } from "flowbite-react";
import CalltoAction from "./CalltoAction";
import CommentSections from "./CommentSections";
import PostCard from "./PostCard";
const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setrror] = useState(false);
  const [post, setPost] = useState();
  const [recentPost, setRecentPost] = useState(null);
  console.log("recentPost", recentPost);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/server/post/getposts?postSlug=${postSlug}`
        );

        setPost(res.data.posts[0]);
        setLoading(false);
      } catch (error) {
        setrror(error.message);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);
  useEffect(() => {
    try {
      const fetchRecentPost = async () => {
        const res = await axios.get(`${BASE_URL}/server/post/getposts?limit=4`);
        setRecentPost(res.data.posts);
      };
      fetchRecentPost();
    } catch (error) {
      console.log(error);
    }
  }, []);
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto">
        {post && post.title}
      </h1>
      <Link
        className="self-center mt-5"
        to={`/search?category=${post && post.category}`}
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
        src={post && post.image}
        alt={post && post.title}
      />
      <div className="flex  justify-between p-3 border-b border-slate-500 mx-auto max-w-2xl w-full">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post && (post.content.length / 1000).toFixed(0)}mins read</span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CalltoAction />
      </div>
      <CommentSections postId={post._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 justify-center mt-5">
          {recentPost &&
            recentPost.map((recent) => (
              <PostCard key={recent._id} post={recent} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
