const express = require('express');
const cookieParser = require('cookie-parser');
const userModel = require('./models/users');
const postModel = require('./models/posts');
const boardModel = require('./models/boards');
const upload = require('./models/multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const SECRET = "shhhh"; // Secret key for JWT

// 🟢 Register Route
app.post('/register', upload.single('image'), async (req, res) => {
    const { username, email, password } = req.body;
    const imagefile = req.file ? req.file.filename : null;

    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) return res.status(500).json({ success: false, message: "Error hashing password" });

        const user = await userModel.create({ username, email, password: hash, image: imagefile });
        const token = jwt.sign({ email, userId: user._id }, SECRET);

        res.cookie("token", token, { httpOnly: true });
        res.json({ success: true, message: "User registered successfully", user });
    });
});
// 🟢 Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            const token = jwt.sign({ email, userId: user._id }, SECRET);
            res.cookie("token", token, { httpOnly: true });
            res.json({ success: true, message: "Login successful", user });
        } else {
            res.status(400).json({ success: false, message: "Invalid email or password" });
        }
    });
});
// 🟢 Middleware to Check Login
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const { userId, email } = jwt.verify(token, SECRET);
        req.user = { _id: userId, email };
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}
// 🟢 Profile Route
app.get('/profile', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
});
// 🟢 Logout Route
app.get("/logout", (req, res) => {
    res.cookie("token", "", { httpOnly: true });
    res.json({ success: true, message: "Logged out successfully" });
});

app.put('/profile/update', isLoggedIn, upload.single('image'), async (req, res) => {
    const { username } = req.body;
    const image = req.file ? req.file.filename : undefined
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, { username, ...(image && { image }) }, { new: true });
    res.json({ success: true, user: updatedUser });
});

// ----------- 🎯 POSTS (Pins Page) --------------------------------------------------------
// 🟢 Create a Post (Pin)
app.post("/posts/create", isLoggedIn, upload.single("image"), async (req, res) => {
    const { userId, title, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const post = await postModel.create({ userId, title, description, image });
    res.json({ success: true, post });
});
// 🟢 Home Page
app.get("/posts", async (req, res) => {
    const posts = await postModel.find().populate("userId", "username image");
    res.json({ success: true, posts });
});
// 🟢 Pins Page)
app.get("/posts/user/:userId", isLoggedIn, async (req, res) => {
    const { userId } = req.params;
    const posts = await postModel.find({ userId }).populate("userId", "username image");
    res.status(200).json({ success: true, posts });
});
// 🟢 Single Pin Page  
app.get("/posts/:postId", isLoggedIn, async (req, res) => {
    const post = await postModel.findById(req.params.postId).populate("userId", "username image");
    res.json({ success: true, post });
});
// 🟢 DELETE PIN
app.delete("/posts/:postId", isLoggedIn, async (req, res) => {
    await postModel.findByIdAndDelete(req.params.postId);
    res.json();
});

// ------------------------------------------------------------------------------------------
// 🎯 BOARDS (Collections of Saved Posts)
// ------------------------------------------------------------------------------------------

// 🟢 Create a Board ✅
app.post("/boards", isLoggedIn, async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;
    const board = new boardModel({ name, userId, posts: [] });
    await board.save();
    console.log(board);
    res.json({ success: true, board });
});
// 🟢 Get boards name in modal at home page ✅
app.get("/boards", isLoggedIn, async (req, res) => {
    const boards = await boardModel.find({ userId: req.user._id }).populate("posts", "image");
    res.json({ success: true, boards });
});

// 🟢 Save boards ✅
app.post("/boards/:boardId/save", isLoggedIn, async (req, res) => {
    const { postId } = req.body;
    const { boardId } = req.params;
    const board = await boardModel.findById(boardId);
    // 🔥 Ownership check
    if (board.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Forbidden: You cannot save posts to someone else's board" });
    }
    if (!board.posts.includes(postId)) {
        board.posts.push(postId);
        await board.save();
    }
    res.json({ success: true, message: "Post saved to board!" });
});

// 🟢 Get All Boards of a User (For Profile Page) ✅
app.get("/boards/user/:userId", isLoggedIn, async (req, res) => {
    const boards = await boardModel.find({ userId: req.params.userId }).populate({ path: "posts", select: "image title" });
    res.json({ success: true, boards });
});

// 🟢 Get a single board with populated pins ✅
app.get("/boards/:boardId", async (req, res) => {
    const board = await boardModel.findById(req.params.boardId).populate("posts", "image title description");
    res.json({ success: true, board });
});

// 🟢  DELETE Single board On Profile Page  ✅
app.delete("/boards/:boardId", isLoggedIn, async (req, res) => {
    const { boardId } = req.params;
    await boardModel.findByIdAndDelete(boardId);
    res.json({ success: true, message: "Board deleted successfully" });
});

// 🟢 Delete post from a board on Single board page
app.delete("/boards/:boardId/posts/:postId", isLoggedIn, async (req, res) => {
    const { boardId, postId } = req.params;
    await boardModel.findByIdAndUpdate(boardId, { $pull: { posts: postId } });
    await postModel.findByIdAndDelete(postId);
    res.json({ success: true, message: "Post removed from board" });
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));