import { useContext, useRef, useState } from "react";
import { RoomDataContext } from "../context/RoomContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { UserDataContext } from "../context/UserContext";

const ChatDialog = ({ socket, setshowMsgDialog }) => {
    const emojis = ['😀', '😂', '😎', '😍', '😢'];
    const texts = ['Hey!', 'Great!', 'Awesome!', 'Nice!'];
    const { room } = useContext(RoomDataContext);
    const { user } = useContext(UserDataContext);
    const ref = useRef(null);
    const inputRef = useRef(null);
    useGSAP(() => {
        gsap.from(ref.current, {
            scale: 0,
            duration: 0.3
        })
    }, [])
    const sendMsg = (message) => {
        if (!message || !message.trim()) return
        socket.emit('send-msg', { name: user.name, msg: message, roomId: room._id });
        setshowMsgDialog(false);
    }
    return (
        <div className='w-full h-screen fixed z-50 top-0 bottom-0 right-0 left-0 flex justify-center items-center overflow-y-auto'>
            <div className='bg-yellow-500 w-[90%] p-5 rounded-2xl' ref={ref}>
                <div className="flex justify-between w-full items-center mb-4">
                    <h2 className="text-3xl font-extrabold font-[samurai] text-[#EB1751] underline decoration-wavy">Chat</h2>
                    <button onClick={() => setshowMsgDialog(false)} className="text-3xl"><i className="ri-close-fill"></i></button>
                </div>
                <div className="flex justify-between w-full text-3xl mb-4">
                    {emojis.map((emoji, idx) => (
                        <span
                            key={idx}
                            className="text-3xl cursor-pointer"
                            onClick={() => sendMsg(emoji)}
                        >
                            {emoji}
                        </span>
                    ))}
                </div>
                <div className="flex justify-between w-full text-sm mb-4">
                    {texts.map((text, idx) => (
                        <span
                            key={idx}
                            className="text-sm cursor-pointer bg-white bg-opacity-70 py-1 px-2 rounded-3xl"
                            onClick={() => sendMsg(text)}
                        >
                            {text}
                        </span>
                    ))}
                </div>
                <input type="text" ref={inputRef} minLength={1} maxLength={30} placeholder="Enter your message" className="w-full p-3 rounded-2xl outline-none" />
                <button onClick={() => sendMsg(inputRef.current.value)} className='w-full p-3 rounded-2xl bg-[#321d80] font-bold text-white text-lg mt-3'>Send</button>
            </div>
        </div>
    )
}

export default ChatDialog
