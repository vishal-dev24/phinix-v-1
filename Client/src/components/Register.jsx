import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import img from '../assets/pin.ico'

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', image: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('image', formData.image);
    await axios.post('http://localhost:3000/register', data, { withCredentials: true });
    setFormData({ username: '', email: '', password: '', image: null });
    navigate('/login');
  }
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <nav className="w-full bg-white p-2 shadow-md">
        <div className="flex justify-between items-center px-5">
          <a href="#" className="text-3xl font-extrabold flex items-center space-x-3">
            <img src={img} alt="Pinterest Icon" className="w-12 h-12 rounded-full shadow-md" />
            <span className="tracking-wide text-gray-800">Phinix</span>
          </a>
          <button type="submit" onClick={useNavigate('/login')}
            className="bg-gray-800 hover:bg-gray-700 font-bold text-white px-3 py-2 rounded"><Link to="/login" >Login</Link></button>
        </div>
      </nav>

      <div className="flex items-center justify-center flex-col p-7">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg border border-gray-300">
          <h2 className="text-gray-900 text-3xl font-extrabold text-center mb-6">Join Phinix</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Full Name</label>
              <input type="text" name='username'
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 outline-none"
                placeholder="Enter your name" onChange={handleChange} required value={formData.username} />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Email</label>
              <input type="email" name='email'
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 outline-none"
                placeholder="Enter your email" onChange={handleChange} required value={formData.email} />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Password</label>
              <input type="password" name='password'
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 outline-none"
                placeholder="Enter password" onChange={handleChange} required value={formData.password} />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Upload Image</label>
              <input type="file" name='image'
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 outline-none"
                placeholder="Enter password" onChange={handleChange} required />
            </div>
            <button type="submit"
              className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-300 shadow-md">
              Register !
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register