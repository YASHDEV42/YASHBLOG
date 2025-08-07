const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: String,
      },
    ],
    comments: [
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
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Database Indexes for Performance
// Note: slug index is created by unique: true in schema
postSchema.index({ author: 1, createdAt: -1 }); // Author's posts sorted by date
postSchema.index({ published: 1, createdAt: -1 }); // Published posts by date
postSchema.index({ categories: 1 }); // Filter by categories
postSchema.index({ "metadata.views": -1 }); // Most viewed posts
postSchema.index({ "metadata.likes": -1 }); // Most liked posts
postSchema.index({ title: "text", content: "text" }); // Text search

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
