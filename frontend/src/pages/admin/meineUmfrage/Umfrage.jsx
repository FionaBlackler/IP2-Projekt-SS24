import axiosInstance from '../../../axios/axiosConfig.js'
import { useEffect, useState } from 'react'
import React from 'react'
import UmfragenTable from './UmfragenTable'
import ArchiveTable from './ArchiveTable'
import UmfragePopup from '../uploadUmfragePage/UmfragePopup'
import Popup from '../../../components/Popup.jsx'

export default function Umfrage() {
    
    const [data, setData] = useState({ umfragen: [] })
    const [filter, setFilter] = useState(true)
    const [showPopUp, setShowPopUp] = useState(false)
    const [loading, setLoading] = useState(true)

    const umfragenLaden = () => {
        axiosInstance
            .get(`/umfrage/getAll`)
            .then((res) => {
                setData(res.data)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        umfragenLaden()
    }, [filter, showPopUp])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Popup
            content={<UmfragePopup />}
            open={showPopUp}
            setOpen={setShowPopUp}
        >
            <>
                <div className="justify-between p-8">
                    <div className="flex justify-between">
                        <div className="flex-grow text-center">
                            <h1 className="text-3xl text-white">
                                Meine Umfragen
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-between p-8">
                        <button
                            className="blur-fix h-11 min-w-32 select-none rounded-2xl bg-[#1F0704] px-4 text-lg text-[#fff9ef] shadow-md shadow-[#1f070424] duration-150 hover:bg-[rgba(33,8,3,0.68)] active:scale-105 active:duration-75 disabled:cursor-not-allowed disabled:opacity-80 disabled:shadow-none disabled:hover:bg-[#1F0704] disabled:active:scale-100"
                            onClick={() => setShowPopUp(!showPopUp)}
                        >
                            + Umfragen hochladen
                        </button>
                        <button
                            className="blur-fix h-11 min-w-32 select-none rounded-2xl bg-[#1F0704] px-4 text-lg text-[#fff9ef] shadow-md shadow-[#1f070424] duration-150 hover:bg-[rgba(33,8,3,0.68)] active:scale-105 active:duration-75 disabled:cursor-not-allowed disabled:opacity-80 disabled:shadow-none disabled:hover:bg-[#1F0704] disabled:active:scale-100"
                            onClick={() => setFilter(!filter)}
                        >
                            Archiviert {filter ? 'anzeigen' : 'verbergen'}
                        </button>

                        {filter ? (
                            <UmfragenTable data={data} setData={setData}  />
                        ) : (
                            <ArchiveTable data={data} setData={setData} />
                        )}
                    </div>
                </div>
            </>
        </Popup>
    )
}
