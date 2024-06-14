import {useState} from "react";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";

const PasswordManager = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        password: false,
        confirmPassword: false
    });

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (confirmPassword !== e.target.value) {
            setPasswordsMatch(false);
        } else {
            setPasswordsMatch(true);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (password !== e.target.value) {
            setPasswordsMatch(false);
        } else {
            setPasswordsMatch(true);
        }
    };

    const toggleShowPassword = (field) => {
        setShowPassword(prevState => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    const handleClick = () => {
        if (currentPassword === '' || password === '' || confirmPassword === '') {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
            setShowPopup(true);
        }
    }

    const handleClose = () => {
        setShowConfirmation(false);
        setShowPopup(false);
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <div className="flex bg-[#AF8A74] w-screen h-screen justify-center items-center">
            <div className="shadow-lg bg-[#FAEEDB] rounded-lg py-16 px-32 text-center relative z-10">
                <span className="ml-4 mt-4 font-semibold">
                    <h1 className="text-2xl">Password Manager</h1>
                </span>
                <table className="mt-12">
                    <tr>
                        <td className="px-6 relative">
                            <input type={showPassword.currentPassword ? 'text' : 'password'}
                                   placeholder="Aktuelles Passwort"
                                   value={currentPassword}
                                   onChange={handleCurrentPasswordChange}
                                   className="border-[1px] border-black rounded-lg h-12 w-72 placeholder-gray-400 text-center pr-10"/>
                            <div onClick={() => toggleShowPassword('currentPassword')}
                                 className="absolute inset-y-0 right-0 pr-11 flex items-center cursor-pointer z-20">
                                {showPassword.currentPassword ? <FaRegEyeSlash className="h-5 w-5 text-gray-500"/> :
                                    <FaRegEye className="h-5 w-5 text-gray-500"/>}
                            </div>
                        </td>
                    </tr>
                    <br/>
                    <tr>
                        <td className="px-6 relative">
                            <input type={showPassword.password ? 'text' : 'password'}
                                   placeholder="Neues Passwort"
                                   value={password}
                                   onChange={handlePasswordChange}
                                   className={`border-[1px] rounded-lg h-12 w-72 ${passwordsMatch ? 'border-green-600' : 'border-red-500'} text-center p-2 pr-10`}/>
                            <div onClick={() => toggleShowPassword('password')}
                                 className="absolute inset-y-0 right-0 pr-11 flex items-center cursor-pointer z-20">
                                {showPassword.password ? <FaRegEyeSlash className="h-5 w-5 text-gray-500"/> :
                                    <FaRegEye className="h-5 w-5 text-gray-500"/>}
                            </div>
                        </td>
                    </tr>
                    <br/>
                    <tr>
                        <td className="px-6 relative">
                            <input type={showPassword.confirmPassword ? 'text' : 'password'}
                                   placeholder="Passwort Bestätigen"
                                   value={confirmPassword}
                                   onChange={handleConfirmPasswordChange}
                                   className={`border-[1px] rounded-lg h-12 w-72 ${passwordsMatch ? 'border-green-600' : 'border-red-500'} text-center p-2 pr-10`}/>
                            <div onClick={() => toggleShowPassword('confirmPassword')}
                                 className="absolute inset-y-0 right-0 pr-11 flex items-center cursor-pointer z-20">
                                {showPassword.confirmPassword ? <FaRegEyeSlash className="h-5 w-5 text-gray-500"/> :
                                    <FaRegEye className="h-5 w-5 text-gray-500"/>}
                            </div>
                        </td>
                    </tr>
                </table>
                {!passwordsMatch && <p className="text-red-500">Password do not match</p>}
                {isEmpty && <p className="text-red-500">Bitte füllen sie alle felder aus</p>}
                <button
                    className="mt-6 text-white bg-[#222] py-2 px-6 rounded-lg hover:bg-red-500 hover:text-white duration-300"
                >Abbrechen</button>
                <button
                    onClick={handleClick}
                    className="ml-11 mt-6 text-white bg-[#222] py-2 px-6 rounded-lg hover:bg-green-500 hover:text-white duration-300"
                >Speichern</button>
                {showPopup && (
                    <div
                        className="shadow-lg rounded-lg py-6 px-6 text-center absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg">
                            <h2>Sind Sie sich sicher?</h2>
                            <button onClick={() => {
                                setShowPopup(false);
                                setShowConfirmation(true);
                            }}
                                    className="mt-4 text-white bg-[#210803] py-2 px-6 rounded-lg hover:bg-green-500 hover:text-white duration-300">Bestätigen
                            </button>
                        </div>
                    </div>
                )}
                {showConfirmation && (
                    <div
                        className="shadow-lg bg-black rounded-lg py-16 px-16 text-center absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50">
                        <div
                            className="bg-white p-6 rounded-lg">
                            <h2 className="font-semibold text-black">Erfolgreich geändert</h2>
                            <button onClick={handleClose}
                                    className="mt-4 text-white bg-[#210803] py-2 px-6 rounded-lg hover:bg-red-500 hover:text-white duration-300">Schließen
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};
export default PasswordManager;