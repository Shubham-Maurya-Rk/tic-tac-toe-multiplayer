import React from 'react'
import Settings from '../components/Settings'
import TicTacToeBanner from '../components/TicTacToeBanner'
import { Link } from 'react-router-dom'

const SinglePlayerHome = () => {
    return (
        <div className='w-full h-screen bg-[#321d80] relative'>
            <Settings />
            <div className='div-center flex-col h-[60%] p-5'>
                <TicTacToeBanner />
            </div>
            <div className='w-full absolute bottom-10 px-5 flex flex-col gap-3'>
                <h2 className='text-white font-[samurai] text-4xl'>Si<span className='text-[#EB1751]'>ng</span>e Player !
                </h2>
                <Link to="/single-player/Easy" className='w-full text-center font-bold rounded-xl bg-yellow-500 text-lg uppercase py-3 text-[#EB1751]'>Easy <i className="ri-arrow-down-line"></i></Link>
                <Link to="/single-player/Normal" className='w-full text-center font-bold rounded-xl text-yellow-500 text-lg uppercase py-3 bg-[#EB1751]'> Medium <i className="ri-gamepad-line"></i></Link>
                <Link to="/single-player/Hard" className='w-full text-center font-bold rounded-xl text-yellow-500 text-lg uppercase py-3 button-color-1'> Hard<i className="ri-arrow-up-line"></i></Link>
            </div>
        </div>
    )
}

export default SinglePlayerHome
