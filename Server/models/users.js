const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://malviyavishalak47:IlKzgyzGQsuPY9rt@cluster0.9f2fjvr.mongodb.net/?retryWrites=true&w=majority&tls=true&appName=Cluster0');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    image: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }]
})

module.exports = mongoose.model('User', userSchema)