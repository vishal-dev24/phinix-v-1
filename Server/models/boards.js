const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Owner of the board
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Posts saved in this board
    name: String,
}, { timestamps: true });

module.exports = mongoose.model("Board", BoardSchema);
