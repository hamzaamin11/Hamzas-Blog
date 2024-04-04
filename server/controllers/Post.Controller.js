import Post from "../Models/Post.Model.js";
import { errorHandle } from "../utils/Error.js";

export const create = async (req, res, next) => {
  try {
    // Ensure that req.user is properly populated before accessing its properties
    if (!req.user || !req.user.isAdmin) {
      return errorHandle(403, "You are not allowed to create a post");
    }

    if (!req.body.title || !req.body.content) {
      return errorHandle(400, "Please provide all required fields");
    }

    console.log({ body: req.body });

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    // Check if req.user.category and req.user.image are properly populated
    if (!req.body.category || !req.body.image) {
      // Handle the case where category or image are not available
      return errorHandle(
        400,
        "Category or image information not available for the user"
      );
    }

    console.log({
      newPost: {
        title: req.body.title,
        content: req.body.content,
        slug: slug,
        userId: req.user.id,
        category: req.body.category,
        image: req.body.image,
      },
    });

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      slug: slug,
      userId: req.user.id,
      category: req.body.category,
      image: req.body.image,
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    console.log({ query: req.query });

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const query = {};

    if (req.query.userId) {
      query.userId = req.query.userId;
    }
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.slug) {
      query.slug = req.query.slug; 
    }
    if (req.query.postId) {
      query._id = req.query.postId;
    }
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    console.log({ sortDirection, startIndex, limit });

    let posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandle(403, "You are not allow to delete is post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted ");
  } catch (error) {
    next(error);
  }
};
export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || !req.user.id || !req.params.userId) {
    return next(errorHandle(403, "your are not allow to update this post "));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
