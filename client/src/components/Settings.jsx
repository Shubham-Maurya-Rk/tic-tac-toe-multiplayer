import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserDataContext } from '../context/UserContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Settings = () => {
    const { user, setuser } = useContext(UserDataContext);
    const [open, setopen] = useState(false);
    const navigate = useNavigate();
    const tl = useMemo(() => gsap.timeline({ paused: true }), [])
    
    useEffect(() => {
        if (open) tl.play()
            else tl.reverse()
        const refreshScore = async () => {
            const userScore = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/score/${user._id}`);
            setuser({ ...user, score: userScore.data.score });
        }
        if(user._id)refreshScore();
    }, [open])

    useGSAP(() => {
        tl.to('.ri-settings-2-fill', {
            rotation: 360,
            duration: 1
        }, 'anim')
        tl.from('.settings', {
            translateY: '-100%',
            duration: 0.7
        }, 'anim')
        return () => {
            tl.kill()
        }
    }, [tl])

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }

    return (
        <>
            <i onClick={() => setopen(!open)} className="ri-settings-2-fill cursor-pointer absolute top-4 right-4 text-4xl text-yellow-500 z-[12]"></i>
            <div className={`settings absolute w-full h-screen div-center z-10 `}>
                <div className='w-4/5 bg-[#321d80] border border-white rounded-2xl p-3'>
                    <h2 className='text-white font-[samurai] text-2xl text-center'>Settings</h2>
                    <div className='h-[3.8px] bg-yellow-300 w-3/12 mx-auto mb-4 rounded-lg'></div>


                    <h3 className='text-center text-yellow-500 text-xl font-bold font-[samurai] tracking-wider'>Name</h3>
                    <p className='text-center text-white leading-[0.4] text-md'>{user.name}</p>

                    <h3 className='text-center mt-4 text-yellow-500 text-xl font-bold font-[samurai] tracking-wider'>Email</h3>
                    <p className='text-center text-white leading-[0.4] text-md'>{user.email}</p>

                    <h3 className='text-center mt-4 text-yellow-500 text-xl font-bold font-[samurai] tracking-wider'>Your Score</h3>
                    <p className='text-center text-white leading-[0.4] text-md'>{user.score}</p>

                    <button onClick={logout} className='w-full mt-5 bg-[#EB1751] rounded-2xl py-3 text-md uppercase text-yellow-500 font-semibold font-[samurai] tracking-widest'>Logout<i className="ri-logout-circle-r-line"></i></button>
                </div>
            </div>
        </>
    )
}

export default Settings
