import './loadingBar.css'
import {useEffect, useState} from "react";
import axios from "axios";
import PropTypes, {string} from 'prop-types';

const UploadComponent = ({file, fileName = "NO_FILENAME_FOUND"}) => {
    const [creationTime] = useState(new Date());
    const [elapsedTime, setElapsedTime] = useState('10:00:00');
    useEffect(() => {
        const updateElapsedTime = () => {
            const now = new Date();
            const diffInSeconds = Math.floor((now - creationTime) / 1000);

            if (diffInSeconds < 60) {
                setElapsedTime('<1 Minute');
            } else if (diffInSeconds < 600) {
                setElapsedTime('<10 Minuten');
            } else if (diffInSeconds < 3600) {
                setElapsedTime(`${Math.floor(diffInSeconds / 60)} Minuten`);
            } else {
                setElapsedTime(`${Math.floor(diffInSeconds / 3600)} Stunden`);
            }
        };

        const intervalId = setInterval(updateElapsedTime, 1000);

        // Initial update
        updateElapsedTime();

        return () => clearInterval(intervalId);
    }, [creationTime, setElapsedTime]);
    /*
    axios.post('http://localhost:5173/umfrage/upload', {
        params: {admin_id: '#####'}
    }).then(r => {
        if (r.status === 200) {
            setStatus({state: "FINISHED"})
        }
    }).catch(error => {
        setErrorInfo(error)
        console.log("RORR")
        setStatus({state: "ERROR"})
    })
    */
    const [errorInfo, setErrorInfo] = useState({status: false, text: ""});
    const [status, setStatus] = useState({state: "LOADING"});
// Add a request interceptor
    return (
        <div className='w-full h-[31px] bg-[rgba(175,134,116,0.6)] flex flex-row rounded-[50px]'>
            <div className='w-[300px] min-w-[300px] h-full flex '>
            <span
                className=" align-middle text-center text-[black] leading-[25px] text-xl font-normal font-['Inter'] truncate bg-[#F7EBDA] rounded-[50px] border-[3px] border-[rgba(175,134,116,0.6)] px-4">{fileName}</span>
            </div>
            <div className='w-full h-full bg-blue-900'>

            </div>
            <div className='w-[100px] h-full order-[97] bg-amber-800'>

            </div>
            <div className='w-[0.7%] h-full bg-[#F9EDDC] order-[98]'>

            </div>
            <div
                className='h-full w-[15%] border-[rgba(175,134,116,0)] border-t-[3px] border-r-[3px] border-b-[3px] rounded-br-[50px] rounded-tr-[50px] order-[99]'>
                {status.state === "LOADING"
                    ?
                    <div className='h-full w-full bar'>
                        <span className='bar'></span>
                    </div>
                    : status.state === "OK"
                        ?
                        <div className='h-full w-full bg-[#2B870B] rounded-br-[50px] rounded-tr-[50px]'/>
                        : status.state === "ERROR" &&
                        <div className='h-full w-full bg-[#870B0B] rounded-br-[50px] rounded-tr-[50px]'/>
                }

            </div>
        </div>)
}


UploadComponent.propTypes = {
    file: string.isRequired,
    fileName: string.isRequired
};

export default UploadComponent