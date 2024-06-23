import {useState} from "react";
import {motion} from "framer-motion";
import {FaRegCircleUser} from "react-icons/fa6";
import {FaKey} from "react-icons/fa";
import {CiLogout} from "react-icons/ci";

const UserIcon = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const popupContent = (
        <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: -10}}
            transition={{duration: 0.5}}
        >
            <div
                className="absolute w-72 right-0 top-full mt-4 bg-[#FAEEDB] p-4 rounded-lg shadow-2xl border-2 border-[#E4CEBC]">
                <div className="relative text-left flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <FaKey size={22}/>
                        <button
                            className="blur-fix h-11 min-w-32 select-none rounded-2xl bg-[#af8a74] px-4 text-lg text-[#fff9ef] shadow-md shadow-[#5d473b24] duration-150 hover:bg-[#71584d] active:scale-105 active:duration-75 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none disabled:hover:bg-[#af8a74] disabled:active:scale-100">
                            Settings
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <CiLogout size={24}/>
                        <button
                            className="blur-fix h-11 min-w-32 select-none rounded-2xl bg-[#af8a74] px-4 text-lg text-[#fff9ef] shadow-md shadow-[#5d473b24] duration-150 hover:bg-[#71584d] active:scale-105 active:duration-75 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none disabled:hover:bg-[#af8a74] disabled:active:scale-100">
                            Logout
                        </button>
                    </div>
                </div>
                <br/>
                <hr className="border border-black rounded-full"/>
            </div>
        </motion.div>
    );

    return (
        <>
            <div className="flex h-screen w-screen bg-[#FAEEDB]">
                <nav className="h-16 w-full bg-[#210803] flex justify-end relative">
                    <div
                        className="relative"
                        onMouseLeave={handleMouseLeave}
                    >
                        <FaRegCircleUser
                            onMouseEnter={handleMouseEnter}
                            size={35}
                            className="mt-3.5 mr-2 text-white hover:text-[#AF8A74] rounded-full cursor-pointer duration-300"
                        />
                        {isHovered && popupContent}
                    </div>
                </nav>
            </div>
        </>
    );
};

export default UserIcon;
