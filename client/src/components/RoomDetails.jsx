import { useContext, useRef } from 'react'
import { RoomDataContext } from '../context/RoomContext';
import { toast } from 'react-toastify';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const RoomDetails = ({ setshowroomDetails }) => {
    const { room } = useContext(RoomDataContext);
    const ref = useRef(null);
    const handleCopy = () => {
        navigator.clipboard.writeText(room._id);
        toast.success("Copied to clipboard");
    }
    useGSAP(() => {
        gsap.from(ref.current, {
            scale: 0,
            duration: 0.3
        })
    }, [])
    return (
        <div ref={ref} className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 w-[90%] z-50 border-yellow-200 border-2 rounded-3xl text-center p-6'>
            <button onClick={() => setshowroomDetails(false)} className='absolute top-3 right-3 text-3xl text-[#321d80]'><i className="ri-close-fill"></i></button>
            <h1 className='text-2xl mt-4 font-bold font-[samurai] text-left underline bg-gradient-to-r from-[#EB1751] to-[#321d80] bg-clip-text text-transparent decoration-[#321d80] decoration-wavy'>{room.name}</h1>
            <table className='w-full mt-5'>
                <tbody>
                    <tr className='pt-2'>
                        <td className='font-bold text-lg text-left text-[#EB1751] font-[samurai]' onClick={handleCopy}>Id <span className='cursor-pointer'><i className="text-[#321d80] text-xl ri-file-copy-2-fill"></i></span></td>
                        <td className='font-bold text-right text-[#321d80] text-xs'>{room._id}</td>
                    </tr>
                    <tr className='pt-2'>
                        <td className='font-bold text-left text-sm text-[#EB1751] font-[samurai]'>Total rounds</td>
                        <td className='font-bold text-right text-[#321d80]'>{room.rounds}</td>
                    </tr>
                </tbody>
            </table>
            <div className='flex gap-2 mt-2'>
                <div className='w-1/2 py-4 bg-[#EB1751] rounded text-white'>
                    <h2 className='font-[samurai]'>X score</h2>
                    <p className='text-4xl font bold'>{room.score.x}</p>
                </div>
                <div className='w-1/2 py-4 bg-[#321d80] rounded text-white '>
                    <h2 className='font-[samurai]'>O score</h2>
                    <p className='text-4xl font bold'>{room.score.o}</p>
                </div>
            </div>
            <div className='mt-2'>
                <button onClick={() => setshowroomDetails(false)} className='bg-gradient-to-r from-[#EB1751] to-[#321d80] w-full text-white font-bold py-3 px-5 rounded'>Close</button>
            </div>
        </div>
    )
}

export default RoomDetails
