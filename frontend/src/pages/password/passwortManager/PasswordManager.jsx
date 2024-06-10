import {useState} from "react";

const PasswordManager = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

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

    const handleClick = (e) => {
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
            <div className="shadow-lg bg-[#FAEEDB] rounded-lg py-16 px-32 text-center">
                <span className="ml-4 mt-4 font-semibold">
                    <h1 className="text-2xl">Password Manager</h1>
                <table className="mt-12">
                    <tr>
                        <td className="px-6"><input type="password"
                                                    placeholder="Aktuelles Passwort"
                                                    value={currentPassword}
                                                    onChange={handleCurrentPasswordChange}
                                                    className="border-[1px] border-black rounded-lg h-12 w-72 placeholder-gray-400 text-center text-black"/>
                        </td>
                        </tr>
                    <br/>
                    <tr>
                        <td className="px-6"><input type="password"
                                                    placeholder="Neues Passwort"
                                                    value={password}
                                                    onChange={handlePasswordChange}
                                                    className={`border-[1px] rounded-lg h-12 w-72 ${passwordsMatch ? 'border-green-600' : 'border-red-500'} text-center p-2`}/>
                        </td>
                    </tr>
                    <br/>
                    <tr>
                        <td className="px-6"><input type="password"
                                                    placeholder="Passwort Bestätigen"
                                                    value={confirmPassword}
                                                    onChange={handleConfirmPasswordChange}
                                                    className={`border-[1px] rounded-lg h-12 w-72 ${passwordsMatch ? 'border-green-600' : 'border-red-500'} text-center p-2`}/>
                            {!passwordsMatch && <p className="text-red-500">Password do not match</p>}
                            {isEmpty && <p className="text-red-500">Bitte füllen sie alle felder aus</p>}
                        </td>
                    </tr>
                </table>
                        <button
                            className="mt-6 text-white bg-[#222] py-2 px-6 rounded-lg hover:bg-red-500 hover:text-white duration-300"
                        >Abbrechen</button>
                        <button
                            onClick={handleClick}
                            className="ml-11 mt-6 text-white bg-[#222] py-2 px-6 rounded-lg hover:bg-green-500 hover:text-white duration-300"
                        >Speichern</button>
                    {showPopup && (
                        <div className="mt-4 shadow-lg bg-white rounded-lg py-6 px-6 text-center">
                            <h2>Sind Sie sich sicher?</h2>
                            <button onClick={() => {
                                setShowPopup(false);
                                setShowConfirmation(true);
                            }}
                                    className="mt-4 text-white bg-[#210803] py-2 px-6 rounded-lg hover:bg-green-500 hover:text-white duration-300">Bestätigen
                            </button>
                        </div>
                    )}
                    {showConfirmation && (
                        <div className="mt-4 shadow-lg bg-white rounded-lg py-16 px-16 text-center">
                            <h2 className="font-semibold text-green-500">Erfolgreich geändert</h2>
                            <button onClick={handleClose}
                                    className="mt-4 text-white bg-[#210803] py-2 px-6 rounded-lg hover:bg-red-500 hover:text-white duration-300">Schließen
                            </button>
                        </div>
                    )}
                    </span>
            </div>
        </div>
    )
}
export default PasswordManager;