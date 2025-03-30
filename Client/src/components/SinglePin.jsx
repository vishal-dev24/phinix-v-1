import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import img from "../assets/pin.ico";
import lg from "../assets/lg.png";

const SinglePin = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [boards, setBoards] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showBoardModal, setShowBoardModal] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3000/posts/${postId}`, { withCredentials: true })
            .then((res) => {
                setPost(res.data.post);
                setLoading(false); // ✅ Update loading state
            })
            .catch((err) => {
                console.error("Error fetching post:", err);
                setLoading(false); // ✅ Even on error, update loading state
            });
    }, [postId]);

    if (loading) return <p className="text-center">Loading...</p>;
    if (!post) return <p className="text-center text-red-500">Post not found</p>;


    const handleDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this pin?");
        if (!confirmDelete) return;

        axios.delete(`http://localhost:3000/posts/${postId}`, { withCredentials: true })
            .then(() => {
                alert("Pin deleted successfully!");
                navigate("/Pins"); // ✅ Redirect after deletion
            })
            .catch((err) => console.error("Error deleting post:", err));
    };

    const openBoardModal = (postId) => {
        setSelectedPost(postId);
        setShowBoardModal(true);
        axios.get("http://localhost:3000/boards", { withCredentials: true })
            .then((res) => { setBoards(res.data.boards) })
            .catch(err => console.error(err));
    };

    const saveToBoard = (boardId) => {
        axios.post(`http://localhost:3000/boards/${boardId}/save`, { postId: selectedPost }, { withCredentials: true })
            .then(() => setShowBoardModal(false))
            .catch(err => console.error(err));
    };

    // dawnload
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
        <>
            <nav className="bg-white shadow-lg p-2 sticky top-0 z-50 w-full">
                <div className="flex justify-between items-center px-1">
                    <a href={'/home'} className="text-3xl font-extrabold flex items-center space-x-1">
                        <img src={img} alt="Pinterest Icon" className="w-12 h-12 rounded-full shadow-md" />
                        <span className="tracking-wide text-gray-800">Phinix</span>
                    </a>
                    <div className="flex space-x-2 items-center font-semibold">
                        <button onClick={() => navigate("/CreatePost")} className="px-3 py-2 bg-gray-700 text-white rounded-lg">CreatePin</button>
                        <button onClick={() => navigate("/Pins")} className="px-3 py-2 bg-gray-700 text-white rounded-lg">Pins</button>
                    </div>
                </div>
            </nav>

            <div className="min-h-screen flex items-start justify-center bg-gray-500 p-8">
                <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row transition-all">

                    {/* Left: Image Section */}
                    <div className="md:w-1/2 relative group border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                        <img
                            src={`http://localhost:3000/uploads/${post.image}`}
                            alt={post.title}
                            className="object-cover w-full h-[380px] md:h-[480px] lg:h-[520px] transition-all rounded-xl"
                        />

                        {/* Save Button */}
                        <button
                            className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transform transition-all hover:scale-105"
                            onClick={() => openBoardModal(post._id)}
                        >
                            Save
                        </button>

                        {/* Download Button */}
                        <img
                            src={lg}
                            onClick={() => handleDownload(`http://localhost:3000/uploads/${post.image}`, post.title)}
                            className="absolute right-3 bottom-3 opacity-0 bg-blue-100 p-3 rounded-lg text-white shadow-md group-hover:opacity-100 transition-all hover:scale-105"
                        />
                    </div>

                    {/* Right: Details Section */}
                    <div className="md:w-1/2 py-6 px-8 flex flex-col justify-between space-y-4">

                        {/* Title & Description */}
                        <div className="mb-2">
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white capitalize">{post.title}</h2>
                            <p className="text-gray-700 dark:text-gray-300 text-md mt-1">{post.description}</p>
                        </div>

                        {/* User Info & Likes */}
                        <div className="flex items-center gap-3">
                            {post.userId?.image && (
                                <img src={`http://localhost:3000/uploads/${post.userId.image}`} alt={post.userId.username} className="w-14 h-14 rounded-full object-cover border-2 border-gray-400 shadow-md" />
                            )}
                            <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">{post.likes || 0} ❤️</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-center gap-4 mt-5">
                            <button
                                onClick={() => navigate('/profile')}
                                className="px-6 py-3 w-full bg-gray-900 text-white rounded-xl shadow-md hover:bg-gray-800 transition-all transform hover:scale-105"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-6 py-3 w-full bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition-all transform hover:scale-105"
                            >
                                Delete Pin
                            </button>
                        </div>
                    </div>
                </div>


                {/* Save to Board Modal */}
                {showBoardModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                            <h2 className="text-xl font-bold mb-3">Save to Board</h2>
                            {boards.length > 0 ? (
                                boards.map((board) => (
                                    <button
                                        key={board._id}
                                        className="text-gray-800 hover:text-white flex items-center w-full py-2 px-4 bg-gray-100 border-2 border-gray-300 rounded-lg mb-2 hover:bg-gray-800"
                                        onClick={() => saveToBoard(board._id)}
                                    >
                                        {/* Board Image */}
                                        {board.posts.length > 0 ? (
                                            <img src={`http://localhost:3000/uploads/${board.posts[0].image}`}
                                                alt={board.name}
                                                className="w-14 h-14 rounded-lg border border-gray-400 mr-4 object-cover"
                                            />
                                        ) : (
                                            <img src="https://via.placeholder.com/50" className="w-14 h-14 rounded-lg mr-4" />
                                        )}
                                        <h2 className="text-lg capitalize font-bold">{board.name}</h2>
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-500">No boards found.</p>
                            )}
                            <div className="flex justify-between mt-3">
                                <button
                                    onClick={() => setShowBoardModal(false)}
                                    className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
};

export default SinglePin;
