import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const Protector = () => {
    const navigate = useNavigate();
    const { setuser } = useContext(UserDataContext);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
        else {
            axios.get(`${import.meta.env.VITE_SERVER_URL}/user/validateToken`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => setuser(res.data.user)).catch(err => navigate('/login'));

            // socket.on('connect', () => {
            //     axios.get(`${import.meta.env.VITE_SERVER_URL}/user/updateSocketId?socketID=${socket.id}`,
            //         {
            //             headers: {
            //                 Authorization: `Bearer ${token}`
            //             }
            //         }).then(res => setuser(res.data.user)).catch(err => navigate('/socket-error'));
            // });
        }
    }, [])
    return (
        <Outlet />
    )
}

export default Protector
