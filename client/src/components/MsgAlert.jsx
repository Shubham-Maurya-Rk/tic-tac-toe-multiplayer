import { useGSAP } from "@gsap/react"
import gsap from "gsap"

const MsgAlert = ({msg}) => {
    useGSAP(() => {
        gsap.from('.message', {
            y: '100%',
            duration: 0.2,
        })
    }, [])
    return (
        // <div className='w-full h-[10%]'>
            <div className='bg-[#0000008e] rounded-lg text-white text-sm text-center message fixed bottom-5 right-5 left-5 p-3 z-10'>
                <span className='font-bold text-yellow-500'>{msg.name} :</span> {msg.msg}
            </div>
        // </div>
    )
}

export default MsgAlert
