import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import img from "../assets/pin.ico";
import lg from "../assets/lg.png";

const SingleBoard = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);
    const navigate = useNavigate();

    const [boards, setBoards] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showBoardModal, setShowBoardModal] = useState(false);


    useEffect(() => {
        axios.get(`http://localhost:3000/boards/${boardId}`)
            .then((res) => setBoard(res.data.board))
            .catch((err) => console.error("Error fetching board:", err));
    }, [boardId]);

    // const handleDelete = (postId) => {
    //     window.confirm("Are you sure you want to delete this post?") &&
    //         axios
    //             .delete(`http://localhost:3000/boards/${boardId}/posts/${postId}`, { withCredentials: true }) // ✅ Send cookies for authentication
    //             .then(() => {
    //                 setBoard((prevBoard) => ({
    //                     ...prevBoard,
    //                     posts: prevBoard.posts.filter((post) => post._id !== postId),
    //                 }));
    //             })
    //             .catch((err) => console.error("Error deleting post:", err));
    // };

    if (!board) return <div>Loading...</div>;

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
        <div className="bg-white min-h-screen">
            <nav className="bg-white shadow-lg p-2 sticky top-0 z-50 w-full">
                <div className="flex justify-between items-center px-1">
                    <a href={'/home'} className="text-3xl font-extrabold flex items-center space-x-1">
                        <img src={img} alt="Pinterest Icon" className="w-12 h-12 rounded-full shadow-md" />
                        <span className="tracking-wide text-gray-800">Phinix</span>
                    </a>
                    <div className="flex space-x-2 items-center font-semibold">
                        <button onClick={() => navigate("/Pins")} className="px-3 py-2 bg-gray-700 text-white rounded-lg">Pins</button>
                        <button onClick={() => navigate("/profile")} className="px-3 py-2 bg-gray-700 text-white rounded-lg">Profile</button>
                    </div>
                </div>
            </nav>


            {/* Masonry Grid Layout */}
            <div className="p-5">
                <h2 className="text-3xl text-gray-800 font-bold text-start ms-5">{board.name}</h2>
                <p className="text-gray-600 text-md ms-5"> {board.posts.length} {board.posts.length === 1 ? "pin" : "pins"}</p>

                <div className="p-5 columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                    {board.posts.map((post) => (
                        <div key={post._id} className="relative group break-inside-avoid bg-white border border-gray-400 bg-slate-200 shadow-lg rounded-lg overflow-hidden">
                            <img src={`http://localhost:3000/uploads/${post.image}`} alt={post.title} className="w-full object-cover rounded-t-lg" />
                            <div className="px-2 py-1 ">
                                <h2 className="text-md font-bold capitalize">{post.title}</h2>
                                <p className="text-gray-600 text-sm capitalize">{post.description}</p>
                            </div>
                            {/* Share */}
                            <img src={lg} onClick={() => handleDownload(`http://localhost:3000/uploads/${post.image}`, post.title)} className="absolute right-2 bottom-0 opacity-0  p-1/2 rounded mb-1 group-hover:opacity-100 transition" />
                            {/* Save */}
                            <button className="absolute top-2 right-2 bg-slate-900 text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition" onClick={() => openBoardModal(post._id)}> Save </button>
                            {/* Delete */}
                            {/* <button onClick={() => handleDelete(post._id)} className="absolute bottom-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition" >Delete</button> */}
                        </div>
                    ))}
                </div>

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
                        <div className="flex justify-between rounded">
                            <button onClick={() => setShowBoardModal(false)} className="text-red-100 bg-red-500 rounded hover:bg-red-600 hover:text-white block  mt-2 text-lg font-bold p-1 ">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleBoard;
