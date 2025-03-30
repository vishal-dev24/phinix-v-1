import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import img from "../assets/pin.ico";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    userId: "", // ✅ Add userId
  });

  // Fetch logged-in user details (including userId)
  useEffect(() => {
    axios.get("http://localhost:3000/profile", { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setFormData(prev => ({ ...prev, userId: res.data.user._id })); // ✅ Set userId
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId) {
      console.error("Error: userId is missing!");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("image", formData.image);
    data.append("userId", formData.userId); // ✅ Send userId

    try {
      await axios.post("http://localhost:3000/posts/create", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ title: "", description: "", image: null, userId: formData.userId });
      navigate("/pins");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <nav className="bg-white shadow-lg p-2 sticky top-0 z-50 w-full">
        <div className="flex justify-between items-center px-1">
          <a href={'/home'} className="text-3xl font-extrabold flex items-center space-x-1">
            <img src={img} alt="Pinterest Icon" className="w-12 h-12 rounded-full shadow-md" />
            <span className="tracking-wide text-gray-800">Phinix</span>
          </a>
          <div className="flex space-x-2 items-cente font-semibold">
            <button onClick={() => navigate("/Pins")} className="px-3 py-2 bg-gray-700 text-white rounded-lg">Pins</button>
            <button onClick={() => navigate("/profile")} className="px-3 py-2 bg-gray-700 text-white rounded-lg">Profile</button>
          </div>
        </div>
      </nav>

      <div className="flex justify-center items-start h-screen p-5 mt-5">
        <div className="container mx-auto max-w-2xl bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Create a New PIN</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input type="text"  name="title" value={formData.title} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-300 capitalize focus:ring-2 focus:ring-gray-600 outline-none" placeholder="Enter post title" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3  capitalize rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 outline-none" rows="3" placeholder="Write something about this post" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
              <input type="file" name="image" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" required />
            </div>
            <button type="submit" className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-300 shadow-md">
              Create Pin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
