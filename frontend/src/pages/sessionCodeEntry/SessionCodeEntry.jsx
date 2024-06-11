const SessionCodeEntry = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="container w-2/4 mx-auto bg-primary-color shadow-md rounded-[20px]">
                <div className="bg-secondary-color rounded-t-[20px] w-full h-[86.89px] flex items-center justify-center outline-[6px] outline-offset-[-4px] outline overflow-auto outline-secondary-color mb-5">
                    <span className="align-middle text-[#FEF2DE] text-4xl font-normal font-['Inter']">
                        Umfrage
                    </span>
                </div>
                <div className="flex flex-col items-center my-20">
                    <span className="text-lg font-medium">
                        Code eingeben, um teilzunehmen
                    </span>
                    <div className="w-2/4 flex justify-center items-center">
                        <input
                            type="text"
                            className="w-3/4 rounded-l-lg my-5 px-5 h-12 hover:border-accent-color border focus:border-accent-color text-center"
                            placeholder="123456"
                        />
                        <button className="w-1/4 rounded-r-lg bg-secondary-color h-12 font-medium hover:font-bold">
                            Teilnehmen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SessionCodeEntry
