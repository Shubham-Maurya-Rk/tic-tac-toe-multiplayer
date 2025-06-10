import { useContext } from "react";
import { RoomDataContext } from "../context/RoomContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const WarTile = (props) => {
    const { setroom } = useContext(RoomDataContext);
    const navigate = useNavigate();
    const handleClick = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/room/${props.roomDetails._id}`);
            setroom(res.data.room);
            navigate('/game');
        } catch (err) {
            toast.error(err.response.data.error);
        }
    }
    return (
        <div className='w-full flex justify-between text-[#EB1751] text-lg rounded-xl font-bold bg-yellow-500 p-5 mb-2'>
            <p>
                {props.roomDetails.name}
            </p>
            <p className='cursor-pointer border-l-2 border-[#EB1751] pl-5' onClick={handleClick} >Watch <i className="ri-eye-line"></i></p>
        </div>
    )
}

export default WarTile
