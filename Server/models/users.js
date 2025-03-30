const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/PHINIX-1")

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    image: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }]
})

module.exports = mongoose.model('User', userSchema)