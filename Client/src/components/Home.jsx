import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import img from "../assets/pin.ico";
import lg from "../assets/lg.png";

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [boards, setBoards] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showBoardModal, setShowBoardModal] = useState(false);
    const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
    const [newBoardName, setNewBoardName] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/profile", { withCredentials: true })
            .then((res) => res.data.success ? setUser(res.data.user) : navigate("/login"));

        axios.get("http://localhost:3000/posts")
            .then((res) => setPosts(res.data.posts))
            .catch(err => console.error(err));
    }, []);

    const openBoardModal = (postId) => {
        setSelectedPost(postId);
        setShowBoardModal(true);
        axios.get("http://localhost:3000/boards", { withCredentials: true })
            .then((res) => { setBoards(res.data.boards) })
            .catch(err => console.error(err));
    };

    const createBoard = () => {
        axios.post("http://localhost:3000/boards", { name: newBoardName }, { withCredentials: true })
            .then(() => {
                setShowCreateBoardModal(false);
                setNewBoardName("");
                openBoardModal(selectedPost);
            })
            .catch(err => console.error(err));
    };

    const saveToBoard = (boardId) => {
        axios.post(`http://localhost:3000/boards/${boardId}/save`, { postId: selectedPost }, { withCredentials: true })
            .then(() => setShowBoardModal(false))
            .catch(err => console.error(err));
    };

    //  download
    const handleDownload = async (imageUrl, title) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = title || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className=" bg-white shadow-xl p-2 sticky top-0 z-50 w-full">
                <div className="flex justify-between items-center px-1">
                    <a href="#" className="text-3xl font-extrabold flex items-center space-x-1">
                        <img src={img} alt="Pinterest Icon" className="w-12 h-12 rounded-full" />
                        <span className="tracking-wide text-gray-800">Phinix</span>
                    </a>
                    <div className="flex space-x-2 items-center text-white">
                        {user && (
                            <img src={`http://localhost:3000/uploads/${user.image}`} alt="User" className="w-12 h-12 border-2  border-slate-200 rounded-full" />
                        )}
                        <button onClick={() => navigate("/profile")} className="px-3 py-2 bg-gray-700 font-bold rounded-lg">Profile</button>
                    </div>
                </div>
            </nav>
            {/* Masonry Grid Layout */}
            <div className="p-5 columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="relative group break-inside-avoid bg-white shadow-lg rounded-lg overflow-hidden">
                            <img src={`http://localhost:3000/uploads/${post.image}`} alt={post.title} className="w-full object-cover rounded-t-lg" />
                            <button className="absolute top-2 right-2 bg-slate-900 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition" onClick={() => openBoardModal(post._id)}> Save </button>
                            {/* Download */}
                            <img src={lg} onClick={() => handleDownload(`http://localhost:3000/uploads/${post.image}`, post.title)}
                                className="absolute right-2 bottom-2 opacity-0 bg-white p-1 rounded-full shadow-lg group-hover:opacity-100 transition duration-300 hover:scale-110 hover:bg-gray-200 cursor-pointer" />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No posts found.</p>
                )}
            </div>

            {showBoardModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-3">Save to Board</h2>
                        {boards.length > 0 ? (
                            boards.map((board) => (
                                <button key={board._id} className="text-gray-800 hover:text-white flex items-center w-full py-1 px-4 bg-gray-100 border-2 border-zinc-400 rounded-lg mb-2 hover:bg-gray-800" onClick={() => saveToBoard(board._id)}>
                                    {/* Board Image */}
                                    {board.posts.length > 0 ? (
                                        <img src={`http://localhost:3000/uploads/${board.posts[0].image}`}
                                            alt={board.name}
                                            className="w-12 h-12 rounded-lg border-slate-600 border mr-5" />
                                    ) : (
                                        <img src="https://via.placeholder.com/50" className="w-10 h-5 rounded-lg mr-3" />
                                    )}
                                    <h2 className="text-xl capitalize font-bold tracking-wide">{board.name} </h2>
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-500">No boards found.</p>
                        )}
                        <div className="flex justify-between p-2  rounded">
                            <button onClick={() => { setShowBoardModal(false); setShowCreateBoardModal(true); }} className="mt-3 text-blue-900 bg-slate-300 p-2 rounded hover:bg-cyan-600 hover:text-white text-lg">
                                + Create New Board
                            </button>

                            <button onClick={() => setShowBoardModal(false)} className="text-red-900 bg-red-300 rounded hover:bg-red-600 hover:text-white block px-2 mt-3 text-lg ">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Board Modal */}
            {showCreateBoardModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-3">Create New Board</h2>
                        <form onSubmit={(e) => { e.preventDefault(); createBoard(); }}>
                            <input
                                type="text"
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                                placeholder="Board Name"
                                className="w-full border p-2 rounded-lg capitalize"
                                required
                            />
                            <button type="submit" className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Create</button>
                            <button type="button" onClick={() => setShowCreateBoardModal(false)} className="mt-3 text-red-500 block">Cancel</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;