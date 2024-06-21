import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SessionCodeEntry = () => {
    const navigate = useNavigate()
    const [code, setCode] = useState('')

    const enterCodeBtnHandler = async () => {
        //check if entered code(sessionID ?) is correct
        /*try {
            const request = await axios.get('')

            if (request === 200) {
                navigate('/test')
            } else {
                alert('Invalid code')
            }
        } catch (error) {
            console.error('Error validation code:', error)
        }*/
        navigate('/test')
    }

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-100">
            <div className="container w-11/12 bg-primary-color shadow-md rounded-[20px] sm:w-2/4 md:w-2/4 lg:w-2/4 xl:w-2/4 2xl:w-1/4">
                <div className="bg-secondary-color rounded-t-[20px] w-full h-[86.89px] flex items-center justify-center outline-[6px] outline-offset-[-4px] outline overflow-auto outline-secondary-color mb-5">
                    <span className="align-middle text-[#FEF2DE] text-4xl font-normal font-['Inter']">
                        Umfrage
                    </span>
                </div>
                <div className="flex flex-col items-center my-20">
                    <span className="text-lg font-medium">
                        Code eingeben, um teilzunehmen
                    </span>
                    <div className="w-2/4 flex flex-col justify-center items-center">
                        <input
                            type="text"
                            className="w-3/4 rounded-lg my-5 px-5 h-12 hover:border-accent-color border focus:border-accent-color text-center"
                            placeholder="123456"
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button
                            className="w-3/4 rounded-lg bg-secondary-color h-12 font-medium hover:font-bold"
                            onClick={enterCodeBtnHandler}
                        >
                            Teilnehmen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SessionCodeEntry
