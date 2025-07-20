const Post = require("../models/Post");
const User = require("../models/User");
const slugify = require("slugify");
const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, categories } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const author = req.userId;
    const slug = slugify(title, { lower: true, strict: true });

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: "The title is already used!" });
    }

    const post = new Post({
      title,
      content,
      excerpt,
      slug,
      author,
      categories,
    });
    const savedPost = await post.save();

    await User.findByIdAndUpdate(author, { $push: { posts: savedPost._id } });

    res.status(201).json(savedPost);
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug })
      .populate("author", "name email")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name email" },
      })
      .populate("likes", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.metadata.views += 1;
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name email" },
      })
      .populate("likes", "name email");

    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { title, content, excerpt, categories } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingPost = await Post.findOne({ slug });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = await Post.findOneAndUpdate(
      { slug },
      { title, content, excerpt, categories },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOneAndDelete({ slug });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await User.findByIdAndUpdate(post.author, {
      $pull: { posts: post._id },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const togglepublished = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.published = !post.published;
    await post.save();
    res.status(200).json({ message: "Post published status updated", post });
  } catch (err) {
    next(err);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.userId;

    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.status(200).json({ message: "Post like status updated", post });
  } catch (err) {
    next(err);
  }
};
const getPostByAuthor = async (req, res, next) => {
  try {
    const authorId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments({ author: authorId });

    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name email" },
      })
      .populate("likes", "name email");

    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
  togglepublished,
  toggleLike,
  getPostByAuthor,
};
