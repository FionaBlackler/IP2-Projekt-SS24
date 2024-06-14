import UploadComponent from './UploadComponent.jsx';
import React, {useState, useEffect, useRef} from "react";
import { useDropzone } from "react-dropzone";
import "./scrollBar.css";
import "./hoverDropzone.css";

const UmfragePopup = () => {
    const [loading, setLoading] = useState([]);
    const [newItemsCount, setNewItemsCount] = useState(0);
    const scrollDivRef = useRef(null);

    function processJSON(acceptedFiles, newUploadedItems) {
        acceptedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result;
                newUploadedItems.push({
                    item: loading.length + index,
                    component: <UploadComponent json={fileContent.toString()} fileName={file.name}/>,
                });
                if (newUploadedItems.length === acceptedFiles.length) {
                    setLoading(prevLoading => {
                        const updatedLoading = [...prevLoading, ...newUploadedItems];
                        setNewItemsCount(newUploadedItems.length);
                        return updatedLoading;
                    });
                }
            };
            reader.readAsText(file);
        });
    }

    const handleUpload = (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            console.log("ERROR");
        }
        const newUploadedItems = [];
        if(scrollDivRef.current.scrollTop !== 0){
            const scrollPromise = new Promise(resolve => {
                scrollDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                scrollDivRef.current.addEventListener('scroll', function checkScroll() {
                    if (scrollDivRef.current.scrollTop === 0) {
                        scrollDivRef.current.removeEventListener('scroll', checkScroll);
                        resolve();
                    }
                });
            });
            scrollPromise.then(() => {
                processJSON(acceptedFiles, newUploadedItems);
            });
        } else {
            processJSON(acceptedFiles, newUploadedItems);
        }
    };


    useEffect(() => {
        if (newItemsCount > 0) {
            const timer = setTimeout(() => {
                setNewItemsCount(0);
            }, newItemsCount*100);

            return () => clearTimeout(timer);
        }
    }, [newItemsCount]);

    const {
        isDragActive,
        getRootProps,
        getInputProps,
    } = useDropzone({
        accept: {
            'application/json': ['.json'], // specify the extensions you want to accept
        },
        onDrop: handleUpload,
        maxSize: 1000000
    });

    return (
        <div className='w-[1398.09px] h-[766px]'>
            <div
                className='bg-[#FAEEDB] h-full w-full rounded-[40px] flex flex-col space-y-[6.3%] border-r-2 border-l-2 border-b-2 border-[rgba(175,134,116,0.3)]'>
                <div
                    className='bg-[#AF8A74] rounded-t-[40px] w-full h-[86.89px] flex items-center justify-center outline-[6px] outline-offset-[-4px] outline overflow-auto outline-[#AF8A74]'>
                    <span
                        className="align-middle text-[#FEF2DE] text-4xl font-normal font-['Inter']">Umfrage Hochladen</span>
                </div>
                <div className='px-[5%] h-[68.3%] flex flex-col space-y-4'>
                    <div data-testid="dropzone"  {...getRootProps()}
                         className={'parentHover w-full h-[190px] bg-[#EEDFCE] rounded-[45px] outline-[#4A362F] outline-[5px] outline-dashed outline-offset-2 overflow-auto flex flex-col items-center justify-center space-y-3'}>
                        <input {...getInputProps()} />
                        <svg className={isDragActive ? 'dragging icon' : 'icon'} width="80" height="104"
                             viewBox="0 0 80 104" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <mask id="path-1-inside-1_256_1525" fill="white">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M45.9047 0.226074H7.52539V103.132H79.4231V26.993L45.9047 0.226074Z"/>
                            </mask>
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M45.9047 0.226074H7.52539V103.132H79.4231V26.993L45.9047 0.226074Z"
                                  fill="#FAEEDB"/>
                            <path
                                d="M7.52539 0.226074V-2.77393H4.52539V0.226074H7.52539ZM45.9047 0.226074L47.7767 -2.11816L46.9556 -2.77393H45.9047V0.226074ZM7.52539 103.132H4.52539V106.132H7.52539V103.132ZM79.4231 103.132V106.132H82.4231V103.132H79.4231ZM79.4231 26.993H82.4231V25.5495L81.2951 24.6487L79.4231 26.993ZM7.52539 3.22607H45.9047V-2.77393H7.52539V3.22607ZM10.5254 103.132V0.226074H4.52539V103.132H10.5254ZM79.4231 100.132H7.52539V106.132H79.4231V100.132ZM76.4231 26.993V103.132H82.4231V26.993H76.4231ZM81.2951 24.6487L47.7767 -2.11816L44.0326 2.57031L77.551 29.3372L81.2951 24.6487Z"
                                fill="black" mask="url(#path-1-inside-1_256_1525)"/>
                            <path d="M78.741 27.4865L45.6885 0.908203V27.4865H78.741Z" stroke="black" strokeWidth="2"
                                  strokeLinejoin="bevel"/>
                            <rect x="1.52832" y="62.0386" width="42.6601" height="13.0151" fill="#FAEEDB" stroke="black"
                                  strokeWidth="3"/>
                            <path
                                d="M12.6882 64.7273H13.5689V69.9261C13.5689 70.3902 13.4837 70.7843 13.3132 71.1087C13.1428 71.433 12.9025 71.6792 12.5923 71.8473C12.2822 72.0154 11.9164 72.0994 11.495 72.0994C11.0973 72.0994 10.7434 72.0272 10.4332 71.8828C10.1231 71.736 9.87926 71.5277 9.7017 71.2578C9.52415 70.9879 9.43537 70.6671 9.43537 70.2955H10.3018C10.3018 70.5014 10.3527 70.6813 10.4545 70.8352C10.5587 70.9867 10.7008 71.1051 10.8807 71.1903C11.0606 71.2756 11.2654 71.3182 11.495 71.3182C11.7483 71.3182 11.9638 71.2649 12.1413 71.1584C12.3189 71.0518 12.4538 70.8956 12.5462 70.6896C12.6409 70.4813 12.6882 70.2268 12.6882 69.9261V64.7273ZM19.3111 66.5455C19.2685 66.1856 19.0956 65.9062 18.7926 65.7074C18.4896 65.5085 18.1179 65.4091 17.6776 65.4091C17.3556 65.4091 17.0739 65.4612 16.8324 65.5653C16.5933 65.6695 16.4063 65.8127 16.2713 65.995C16.1387 66.1773 16.0724 66.3845 16.0724 66.6165C16.0724 66.8106 16.1186 66.9775 16.2109 67.1172C16.3056 67.2545 16.4264 67.3693 16.5732 67.4616C16.7199 67.5516 16.8738 67.6262 17.0348 67.6854C17.1958 67.7422 17.3438 67.7884 17.4787 67.8239L18.2173 68.0227C18.4067 68.0724 18.6174 68.1411 18.8494 68.2287C19.0838 68.3163 19.3075 68.4358 19.5206 68.5874C19.736 68.7365 19.9136 68.9283 20.0533 69.1626C20.1929 69.397 20.2628 69.6847 20.2628 70.0256C20.2628 70.4186 20.1598 70.7737 19.9538 71.0909C19.7502 71.4081 19.4519 71.6603 19.0589 71.8473C18.6683 72.0343 18.1937 72.1278 17.6349 72.1278C17.1141 72.1278 16.6631 72.0438 16.282 71.8757C15.9032 71.7076 15.6049 71.4732 15.3871 71.1726C15.1716 70.8719 15.0497 70.5227 15.0213 70.125H15.9304C15.9541 70.3996 16.0464 70.6269 16.2074 70.8068C16.3707 70.9844 16.5767 71.117 16.8253 71.2045C17.0762 71.2898 17.3461 71.3324 17.6349 71.3324C17.9711 71.3324 18.273 71.2779 18.5405 71.169C18.808 71.0578 19.0199 70.9039 19.1761 70.7074C19.3324 70.5085 19.4105 70.2765 19.4105 70.0114C19.4105 69.7699 19.343 69.5734 19.2081 69.4219C19.0732 69.2704 18.8956 69.1473 18.6754 69.0526C18.4553 68.9579 18.2173 68.875 17.9616 68.804L17.0668 68.5483C16.4986 68.3849 16.0488 68.1518 15.7173 67.8487C15.3859 67.5457 15.2202 67.1491 15.2202 66.6591C15.2202 66.2519 15.3303 65.8968 15.5504 65.5938C15.773 65.2884 16.0713 65.0516 16.4453 64.8835C16.8217 64.7131 17.242 64.6278 17.706 64.6278C18.1747 64.6278 18.5914 64.7119 18.956 64.88C19.3205 65.0457 19.6094 65.273 19.8224 65.5618C20.0379 65.8506 20.1515 66.1785 20.1634 66.5455H19.3111ZM27.8471 68.3636C27.8471 69.1307 27.7086 69.7936 27.4316 70.3523C27.1547 70.911 26.7747 71.3419 26.2917 71.6449C25.8088 71.9479 25.2572 72.0994 24.6369 72.0994C24.0166 72.0994 23.465 71.9479 22.9821 71.6449C22.4991 71.3419 22.1191 70.911 21.8422 70.3523C21.5652 69.7936 21.4267 69.1307 21.4267 68.3636C21.4267 67.5966 21.5652 66.9337 21.8422 66.375C22.1191 65.8163 22.4991 65.3854 22.9821 65.0824C23.465 64.7794 24.0166 64.6278 24.6369 64.6278C25.2572 64.6278 25.8088 64.7794 26.2917 65.0824C26.7747 65.3854 27.1547 65.8163 27.4316 66.375C27.7086 66.9337 27.8471 67.5966 27.8471 68.3636ZM26.9949 68.3636C26.9949 67.7339 26.8895 67.2024 26.6788 66.7692C26.4705 66.3359 26.1876 66.008 25.8301 65.7855C25.475 65.563 25.0772 65.4517 24.6369 65.4517C24.1966 65.4517 23.7976 65.563 23.4402 65.7855C23.085 66.008 22.8021 66.3359 22.5914 66.7692C22.3831 67.2024 22.2789 67.7339 22.2789 68.3636C22.2789 68.9934 22.3831 69.5249 22.5914 69.9581C22.8021 70.3913 23.085 70.7192 23.4402 70.9418C23.7976 71.1643 24.1966 71.2756 24.6369 71.2756C25.0772 71.2756 25.475 71.1643 25.8301 70.9418C26.1876 70.7192 26.4705 70.3913 26.6788 69.9581C26.8895 69.5249 26.9949 68.9934 26.9949 68.3636ZM35.095 64.7273V72H34.2427L30.2797 66.2898H30.2086V72H29.3279V64.7273H30.1802L34.1575 70.4517H34.2285V64.7273H35.095Z"
                                fill="black"/>
                        </svg>
                        <span
                            className="w-full h-[41.57px] text-center text-black text-xl font-normal font-['Inter']">Ziehen oder Drücken Sie um Ihre Umfrage hochzuladen
                        </span>
                    </div>
                    <div></div>
                    <div ref={scrollDivRef} className='w-full h-[310px] overflow-y-scroll' id="scrollbar2">
                        <div
                            className='min-w-0 px-[3%] flex flex-col-reverse space-y-reverse space-y-[10px] justify-end'>
                            {loading.map((l, index) => (
                                <div
                                    key={index}
                                    className='item-enter'
                                    style={{animationDelay: newItemsCount > 0 && index >= (loading.length - newItemsCount) ? `${(index - (loading.length - newItemsCount)) * 0.05}s` : '0s'}}
                                >
                                    {l.component}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UmfragePopup;
