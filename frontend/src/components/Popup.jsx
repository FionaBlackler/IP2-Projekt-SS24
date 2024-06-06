import UmfragePopup from "../pages/admin/uploadUmfragePage/UmfragePopup.jsx";
import { useEffect, useRef, useState } from "react";

function Popup({ children }) {
    const dialogRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div>
            {children}
            <dialog ref={dialogRef} className="absolute w-[80%] h-full overflow-visible backdrop:bg-black/85 bg-transparent">
                <div
                    className="h-full w-full rounded-sm overflow-hidden bg-black"
                >
                    <UmfragePopup/>
                </div>
                <button
                    className="absolute -top-2 -right-2 z-1 flex items-center justify-center w-5 h-5 bg-zinc-200 rounded-full shadow"
                    onClick={handleClose}
                >
                    <span className="sr-only">Close</span>
                </button>
            </dialog>
            {!isOpen && (
                <button onClick={() => setIsOpen(true)}>Open Modal</button>
            )}
        </div>
    );
}

export default Popup;
