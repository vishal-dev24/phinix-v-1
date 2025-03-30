const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Creator of the post
    title: { type: String, required: true }, // Post title
    description: { type: String }, // Optional description
    image: { type: String, required: true }, // Image URL
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Users who liked the post
}, { timestamps: true });


module.exports = mongoose.model("Post", PostSchema);