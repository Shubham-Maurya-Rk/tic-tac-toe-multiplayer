import { useContext, useState } from 'react';
import TicTacToeBanner from '../components/TicTacToeBanner';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserDataContext } from '../context/UserContext';

const Signup = () => {
  const navigate=useNavigate();
  const {setuser}=useContext(UserDataContext);
  const [userData, setuserData] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (userData.name.length === 0 || userData.email === "" || userData.password === 0) return toast.error("All fields are required");
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/signup`, userData);
      setuser(res.data.user);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
  return (
    <div className='w-full h-screen bg-[#321d80] relative'>
      <div className='div-center flex-col h-[60%]'>
        <TicTacToeBanner />
      </div>
      <div className='w-full absolute bottom-10 px-5 flex flex-col gap-3'>
        <h2 className='text-white font-[samurai] text-4xl'>S<span className='text-[#EB1751]'>i</span>gnup !
        </h2>
        <input type="text" value={userData.name} onChange={(e) => setuserData({ ...userData, name: e.target.value })} className='w-full text-lg rounded-2xl p-3 text-center placeholder:uppercase' placeholder='Name' required />
        <input type="email" value={userData.email} onChange={(e) => setuserData({ ...userData, email: e.target.value })} className='w-full text-lg rounded-2xl p-3  text-center placeholder:uppercase' placeholder='Email' required />
        <input type="password" value={userData.password} onChange={(e) => setuserData({ ...userData, password: e.target.value })} className='w-full text-lg rounded-2xl p-3  text-center placeholder:uppercase' placeholder='Password' required />
        <div className='flex gap-2'>
          <Link to="/login" className='w-1/2 text-center font-bold rounded-xl bg-[#EB1751] text-lg uppercase py-3 text-yellow-500'>Login</Link>
          <button onClick={handleSubmit} className='w-1/2 font-bold rounded-xl bg-yellow-500 text-lg uppercase py-3 text-[#EB1751]'>Start game</button>
        </div>
      </div>
    </div>
  )
}

export default Signup
