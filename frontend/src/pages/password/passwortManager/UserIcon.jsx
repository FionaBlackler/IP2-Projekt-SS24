import {useState} from "react";
import {motion} from "framer-motion"
import {FaRegCircleUser} from "react-icons/fa6";
import {FaKey} from "react-icons/fa";

const UserIcon = () => {

    const [popupOpen, setPopupOpen] = useState(false);

    const handlePopupClick = () => {
        setPopupOpen(!popupOpen);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
    }

    const popupContent = (
        <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: -10}}
            transition={{duration: 0.5}}
        >
            <div className="absolute w-40 right-16 top-[66px] bg-[#AF8A74] p-4 rounded-lg shadow-lg">
                <div className="flex text-left items-center gap-2">
                    <FaKey size={22}/>
                    <button
                        className="cursor-pointer bg-White hover:bg-[#FAEEDB] rounded-lg px-3 duration-300">Passwort
                    </button>
                </div>
                <br/>
                <hr className="border border-black rounded-full"/>
                <div className="text-center mt-2">
                    <button className="cursor-pointer bg-White hover:bg-[#FAEEDB] rounded-lg px-12 duration-300"
                            onClick={handleClosePopup}>Close
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <>
            <div className='flex h-screen w-screen bg-[#FAEEDB]'>
                <nav className='h-14 w-full bg-[#210803] flex justify-end'>
                    <div className="relative">
                        <FaRegCircleUser
                            size={35}
                            className="mr-32 mt-2 text-white hover:text-[#AF8A74] rounded-full cursor-pointer duration-300"
                            onClick={handlePopupClick}
                        />
                    </div>
                </nav>
                {popupOpen && popupContent}
            </div>
        </>

    )
};

export default UserIcon;
