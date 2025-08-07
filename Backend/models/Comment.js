const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    metadata: {
      likes: { type: Number, default: 0 },
      replies: { type: Number, default: 0 },
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

// Database Indexes for Performance
commentSchema.index({ post: 1, createdAt: -1 }); // Comments for a post
commentSchema.index({ user: 1, createdAt: -1 }); // User's comments
commentSchema.index({ parentComment: 1 }); // Replies to a comment
commentSchema.index({ "metadata.likes": -1 }); // Most liked comments

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
