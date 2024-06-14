import { useEffect, useRef } from "react";

function Popup({ children, content, open, setOpen }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal();
            document.body.style.overflow = 'hidden';
        } else {
            dialogRef.current?.close();
            document.body.style.overflow = 'auto';
        }
    }, [open]);

    const onClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {children}
            {open && (
                <div
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-900 bg-opacity-50"
                >
                    <div className="relative p-4 max-h-full">
                        <div className="relative w-auto h-auto">
                            <div className="">
                                <button
                                    type="button"
                                    className="absolute text-[#210803] right-3 top-3 bg-transparent hover:bg-[#c2a594] hover:text-[#c2a594] rounded-3xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-[#c2a594] dark:hover:text-white"
                                    onClick={onClose}
                                >
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                         fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                </button>
                                {content}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Popup;
