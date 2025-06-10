import { useEffect, useState } from 'react'
import WarTile from '../components/WarTile'
import axios from 'axios'
import { Link } from 'react-router-dom'

const WarsList = () => {
    const [rooms, setrooms] = useState([])
    useEffect(() => {
        const fetchRooms = async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/room/all-rooms`);
            setrooms(res.data.rooms);
        }
        fetchRooms();
    }, [])
    return (
        <div className='w-full h-screen bg-[#321d80] relative p-4 '>
            <div className='flex gap-3 items-center'>
                <Link to={'/'} className='px-2 py-1 rounded-md bg-yellow-500 text-2xl text-[#EB1751] shadow-2xl'><i className="ri-home-9-fill text-shadow-lg"></i></Link>
                <h1 className='text-4xl text-[#EB1751] underline decoration-yellow-500 decoration-wavy font-[samurai] leading-tight'>WATCH WARS</h1>
            </div>

            <div className='mt-5'>
                {
                    rooms.length ? (rooms.map((roomDetails) => (
                        <WarTile key={roomDetails._id} roomDetails={roomDetails} />
                    ))) : <div className='text-2xl text-white font-bold text-center mt-52'>No Wars Available</div>
                }
            </div>
        </div>
    )
}

export default WarsList
