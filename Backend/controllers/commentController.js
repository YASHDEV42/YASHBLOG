const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const createComment = async (req, res, next) => {
  try {
    const { postId, content, userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log(
      "Creating comment for post:",
      postId,
      "by user:",
      userId,
      "with content:",
      content
    );

    const comment = new Comment({
      content,
      post: postId,
      user: userId, // Changed from author to user to match your model
    });

    await comment.save();

    // Push the new comment reference to the post and user
    post.comments.push(comment._id);
    await post.save();
    await User.findByIdAndUpdate(userId, { $push: { comments: comment._id } });

    // Populate the user field before returning the comment
    await comment.populate("user", "name email profilePicture");

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "name email profilePicture")
      .sort({ createdAt: -1 });
    if (!comments) {
      return res
        .status(404)
        .json({ message: "No comments found for this post" });
    }
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });
    await User.findByIdAndUpdate(userId, { $pull: { comments: comment._id } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

const getCommentById = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId)
      .populate("author", "name email profilePicture")
      .populate("post", "title slug");
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

const getCommentsByUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comments = await Comment.find({ author: userId })
      .populate("post", "title slug")
      .sort({ createdAt: -1 });

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this user" });
    }

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
const replayComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const reply = new Comment({
      content,
      post: parentComment.post,
      author: userId,
      parent: commentId,
    });
    await reply.save();
    parentComment.replies.push(reply._id);
    await parentComment.save();
    await User.findByIdAndUpdate(userId, { $push: { comments: reply._id } });
    res.status(201).json(reply);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment,
  updateComment,
  getCommentById,
  getCommentsByUser,
  replayComment,
};
