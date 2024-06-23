import {useState, useEffect} from "react";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";

const PasswordManager = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordStrengthMessage, setPasswordStrengthMessage] = useState('');

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        password: false,
        confirmPassword: false
    });

    const validatePasswordStrength = (password) => {
        let strength = 0;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        const hasMinLength = password.length >= 8;

        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumber) strength++;
        if (hasSpecialChar) strength++;
        if (hasMinLength) strength++;

        return strength;
    };

    const getPasswordStrengthMessage = (strength) => {
        switch (strength) {
            case 5:
                return 'Sehr stark';
            case 4:
                return 'Stark';
            case 3:
                return 'Mittel';
            case 2:
                return 'Schwach';
            default:
                return 'Sehr schwach';
        }
    };

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const strength = validatePasswordStrength(newPassword);
        setPasswordStrength(strength);
        setPasswordStrengthMessage(getPasswordStrengthMessage(strength));

        if (confirmPassword !== newPassword) {
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

    const getPasswordStrengthColor = (strength) => {
        switch (strength) {
            case 5:
                return 'bg-green-700'; // Sehr stark
            case 4:
                return 'bg-green-400'; // Stark
            case 3:
                return 'bg-orange-400'; // Mittel
            case 2:
                return 'bg-red-300'; // Schwach
            default:
                return 'bg-red-700'; // Sehr schwach
        }
    };

    useEffect(() => {
        if (showConfirmation) {
            const timer = setTimeout(handleClose, 2000);
            return () => clearTimeout(timer);
        }
    }, [showConfirmation]);

    return (
        <div className="flex bg-[#FAEEDB] w-screen h-screen justify-center items-center">
            <div className="shadow-lg bg-[#AF8A74] rounded-3xl py-16 px-32 text-center relative z-10">
                <span className="ml-4 mt-4 font-semibold">
                    <h1 className="text-2xl text-[#fff9ef]">Password Manager</h1>
                    <hr className="border-black mt-6"/>
                </span>
                <table className="mt-12">
                    <tbody>
                    <tr>
                        <td className="px-6 relative">
                            <div className="relative w-72">
                                <input type={showPassword.currentPassword ? 'text' : 'password'}
                                       placeholder="Aktuelles Passwort"
                                       value={currentPassword}
                                       onChange={handleCurrentPasswordChange}
                                       className="border-[1px] border-black rounded-lg h-12 w-full placeholder-gray-400 text-center pr-10"/>
                                <div onClick={() => toggleShowPassword('currentPassword')}
                                     className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
                                    {showPassword.currentPassword ? <FaRegEyeSlash className="h-5 w-5 text-gray-500"/> :
                                        <FaRegEye className="h-5 w-5 text-gray-500"/>}
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-6 relative">
                            <div className="relative w-72 mt-6">
                                <input type={showPassword.password ? 'text' : 'password'}
                                       placeholder="Neues Passwort"
                                       value={password}
                                       onChange={handlePasswordChange}
                                       className={`border-[1px] rounded-lg h-12 w-full ${passwordsMatch ? 'border-green-600' : 'border-red-500'} text-center p-2 pr-10`}/>
                                <div onClick={() => toggleShowPassword('password')}
                                     className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
                                    {showPassword.password ? <FaRegEyeSlash className="h-5 w-5 text-gray-500"/> :
                                        <FaRegEye className="h-5 w-5 text-gray-500"/>}
                                </div>
                            </div>
                            <div className="relative w-72 mt-1">
                                <div
                                    className={`progress-bar ${getPasswordStrengthColor(passwordStrength)} w-${passwordStrength * 20}% h-1 transition-all duration-500`}></div>
                            </div>
                            <p>{passwordStrengthMessage}</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-6 relative">
                            <div className="relative w-72 mt-1">
                                <input type={showPassword.confirmPassword ? 'text' : 'password'}
                                       placeholder="Passwort Bestätigen"
                                       value={confirmPassword}
                                       onChange={handleConfirmPasswordChange}
                                       className={`border-[1px] rounded-lg h-12 w-full ${passwordsMatch ? 'border-green-600' : 'border-red-500'} text-center p-2 pr-10`}/>
                                <div onClick={() => toggleShowPassword('confirmPassword')}
                                     className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
                                    {showPassword.confirmPassword ? <FaRegEyeSlash className="h-5 w-5 text-gray-500"/> :
                                        <FaRegEye className="h-5 w-5 text-gray-500"/>}
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                {!passwordsMatch && <p className="text-[#fff9ef] font-bold">Password Stimmt nicht überein!</p>}
                {isEmpty && <p className="text-[#fff9ef] font-bold">Bitte füllen Sie alle Felder aus!</p>}
                <button
                    className="mt-6 blur-fix h-11 min-w-32 select-none rounded-2xl border-2 border-[#1F0704] bg-[#FAEEDB] px-4 text-lg font-semibold text-[#1F0704] shadow-sm shadow-[#1F0704] duration-150 hover:bg-[#D4BBA6] active:scale-105 active:duration-75 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none disabled:shadow-transparent disabled:hover:bg-transparent disabled:active:scale-100">Abbrechen
                </button>
                <button onClick={handleClick}
                        className="blur-fix h-11 min-w-32 select-none rounded-2xl bg-[#1F0704] px-4 text-lg text-[#fff9ef] shadow-md shadow-[#1f070424] duration-150 hover:bg-[rgba(33,8,3,0.68)] active:scale-105 active:duration-75 disabled:cursor-not-allowed disabled:opacity-80 disabled:shadow-none disabled:hover:bg-[#1F0704] disabled:active:scale-100 ml-11 mt-6 ">Speichern
                </button>
                {showPopup && (
                    <div
                        className="shadow-lg rounded-3xl py-6 px-6 text-center absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
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
                        className="shadow-lg bg-black rounded-3xl py-16 px-16 text-center absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg">
                            <h2 className="font-semibold text-black">Erfolgreich geändert</h2>
                            <button onClick={handleClose}
                                    className="mt-4 text-white bg-[#210803] py-2 px-6 rounded-lg hover:bg-red-500 hover:text-white duration-300">Schließen
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordManager;
