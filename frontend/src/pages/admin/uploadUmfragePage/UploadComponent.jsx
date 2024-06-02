
import './loadingBar.css';
import { string } from 'prop-types';
import { useUploadPoll } from "./hooks/useUploadUmfrage.jsx";
import { ERROR, FINISHED, LOADING } from "./UploadConstants.js";

const UploadComponent = ({ json, fileName = "NO_FILENAME_FOUND" }) => {
    console.log("UploadComponent render");

    const { pollStatus } = useUploadPoll(json, "#####");

    return (
        <div className='item-enter w-full h-[31px] bg-[rgba(175,134,116,0.6)] flex flex-row rounded-[50px]'>
            <div className='w-[300px] min-w-[300px] h-full flex '>
                <span className="align-middle text-center text-[black] leading-[25px] text-xl font-normal font-['Inter'] truncate bg-[#F7EBDA] rounded-[50px] border-[3px] border-[rgba(175,134,116,0.6)] px-4">
                    {fileName}
                </span>
            </div>
            <div className='w-full h-full'>
                <span
                    className="absolute left-[50%] align-middle text-center text-[black] -translate-x-1/2 -translate-y-[-10%] leading-[25px] text-xl font-normal px-4">
                    {pollStatus.info}
                </span>
            </div>
            <div className='w-[0.7%] h-full bg-[#F9EDDC] order-[98]'/>
            <div
                className='h-full w-[15%] border-[rgba(175,134,116,0)] border-t-[3px] border-r-[3px] border-b-[3px] rounded-br-[50px] rounded-tr-[50px] order-[99]'>
            {pollStatus.state === LOADING &&
                    <div className='h-full w-full bar'><span className='bar'></span></div>}
                {pollStatus.state === FINISHED &&
                    <div className='h-full w-full bg-[#2B870B] rounded-br-[50px] rounded-tr-[50px]' />}
                {pollStatus.state === ERROR &&
                    <div className='h-full w-full bg-[#870B0B] rounded-br-[50px] rounded-tr-[50px]' />}
            </div>
        </div>
    );
};

UploadComponent.propTypes = {
    json: string.isRequired,
    fileName: string.isRequired,
};
/*
<div className='w-[100px] h-full order-[97] flex justify-center items-center'>
                <svg width="100%" height="80%" viewBox="0 0 457 430" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 215C0 333.741 96.2588 430 215 430V375.988C127.004 374.917 56 303.25 56 215C56 126.082 128.082 54 217 54C297.672 54 364.487 113.333 376.185 190.742L353.93 186.697C350.447 186.064 347.919 189.934 349.898 192.869L387.279 248.303C388.472 250.072 390.843 250.593 392.668 249.488L454.451 212.078C457.601 210.17 456.717 205.379 453.094 204.72L429.514 200.435C422.025 88.486 328.846 0 215 0C96.2588 0 0 96.2588 0 215Z" fill="#4A362F"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M218 82C204.193 82 193 93.1929 193 107V248.974V250H195.699L292.955 286.977C305.861 291.884 320.346 285.281 325.253 272.375C330.159 259.469 323.72 244.91 310.814 240.003L243 214.22V107C243 93.1929 231.807 82 218 82Z" fill="#4A362F"/>
                </svg>
            </div>
 */
export default UploadComponent;
