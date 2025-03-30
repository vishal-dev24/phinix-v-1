import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import img from "../assets/pin.ico";
import lg from "../assets/lg.png";

const Pins = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showBoardModal, setShowBoardModal] = useState(false);

  // Fetch user info first
  useEffect(() => {
    axios
      .get("http://localhost:3000/profile", { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, []);

  // Fetch user's pins once user data is available
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:3000/posts/user/${user._id}`, { withCredentials: true })
        .then((res) => {
          setPosts(res.data.posts);
        })
        .catch((err) => console.error("Error fetching pins:", err));
    }
  }, [user]);

  // handleDelete
  const handleDelete = (postId) => {
    axios
      .delete(`http://localhost:3000/posts/${postId}`, { withCredentials: true })
      .then(() => {
        setPosts(posts.filter((p) => p._id !== postId));
        alert("Pin deleted successfully!");
      })
      .catch((err) => console.error("Error deleting pin:", err));
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
    <div className="min-h-screen ">
      <nav className="bg-white shadow-lg p-2 sticky top-0 z-50 w-full">
        <div className="flex justify-between items-center px-1">
          <a href={'/home'} className="text-3xl font-extrabold flex items-center space-x-1">
            <img src={img} alt="Pinterest Icon" className="w-12 h-12 rounded-full shadow-md" />
            <span className="tracking-wide text-gray-800">Phinix</span>
          </a>
          <div className="flex space-x-2 items-center font-semibold">
            <button onClick={() => navigate("/CreatePost")} className="px-3 py-2 bg-gray-700 text-white rounded-lg">CreatePin</button>
            <button onClick={() => navigate("/profile")} className="px-3 py-2 bg-gray-700 text-white rounded-lg">Profile</button>
          </div>
        </div>
      </nav>

      <div className="p-5">
        <h1 className="text-3xl font-bold ms-5">Your Pins</h1>
        {/* post quantity */}
        <p className="text-gray-600 text-sm ms-5">You have {posts.length} pins.</p>
        <div className="flex items-center justify-between space-x-4 p-5">
          <button onClick={() => navigate("/home")} className="px-3 py-2 bg-gray-700 text-white rounded-lg">All Pins</button>
        </div>


        {/* Masonry Grid Layout */}
        <div className="p-5 columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (

              <div key={post._id} className="relative group break-inside-avoid bg-white border border-gray-400 bg-slate-100 shadow-lg rounded-lg overflow-hidden">
                {/* <button onClick={() => handleDelete(post._id)} className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"> Delete </button> */}
                <button className="absolute top-2 right-2 bg-slate-900 text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition" onClick={() => openBoardModal(post._id)}> Save </button>
                <a onClick={() => navigate(`/post/${post._id}`)}>
                  <img src={`http://localhost:3000/uploads/${post.image}`} alt={post.title} className="w-full" />
                </a>

                <div className="px-2 flex  justify-between">
                  <div>
                    <h2 className="text-lg font-bold capitalize">{post.title}</h2>
                    <p className="text-gray-600 capitalize">{post.description}</p>
                  </div>
                  <img src={lg} onClick={() => handleDownload(`http://localhost:3000/uploads/${post.image}`, post.title)} className="absolute right-2 bottom-0 opacity-0 bg-white p-1/2 rounded mb-1 group-hover:opacity-100 transition" />

                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No posts found.</p>
          )}
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

export default Pins;
