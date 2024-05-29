import {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import image from '../../../assets/jsonIcon.png';

const UmfrageUpload = () => {
    const [uploaded, setUploaded] = useState([]);
    const [nextId, setNextId] = useState(0);
    const handleUpload = () => {
        setUploaded(prevUploaded => [...prevUploaded, acceptedFiles]);
        setNextId(nextId + 1); // Increment the nextId
    };
    const readUpload = ([file]) => {
        let reader = new FileReader();
        reader.onload = function (e) {
            handleUpload(e.target.result)
        };
        reader.readAsText(file);
    }
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: {
            'application/json': ['.json'], // you need to specify into this array the extensions you want to accept
        },
        onDrop: handleUpload,
        maxSize: 1000000
    });
    return (
        <div className='flex flex-col space-y-5'>
            <div
                className="text-center mt-5 border-neutral-400 bg-neutral-200 border-dashed border-2 h-56 cursor-pointer">
                        <div {...getRootProps()}
                             className='border border-amber-300 h-full w-full flex flex-col justify-center items-center'>
                            <input {...getInputProps()} />
                            <img src={image} alt='jsonIcon' className='h-20 border-2 border-amber-300 opacity-50'/>
                            {isDragAccept && (<p>All files will be accepted</p>)}
                            {isDragReject && (<p>Some files will be rejected</p>)}
                            {!isDragActive && (<p>Drop some files here ...</p>)}
                        </div>
            </div>
            <div className='h-24 w-full bg-amber-400' onClick={() => {
                handleUpload()
            }}>
                <ul>
                    {uploaded.map(upload => (
                        <li key={upload}>{upload.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default UmfrageUpload



