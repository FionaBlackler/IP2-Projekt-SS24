import axios from 'axios'
import { useEffect, useState } from 'react'
import React from 'react'
import UmfragenTable from './UmfragenTable'
import ArchiveTable from './ArchiveTable'
import UmfragePopup from '../uploadUmfragePage/UmfragePopup'
import Popup from 'E:/IF_6/umfragetool/frontend/src/components/Popup.jsx'

export default function Umfrage() {
    const [data, setData] = useState({ umfragen: [] })
    const [filter, setFilter] = useState(true)
    const [showPopUp, setShowPopUp] = useState(false)
    const [loading, setLoading] = useState(true)
    const accessToken = localStorage.getItem('accessToken')

    const umfragenLaden = () => {
        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/umfrage/getAll`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((r) => {
                console.log(r.data)
                if (r.status === 200) {
                    const responseData = r.data
                    console.log('Data received from server:', responseData)
                    setData(responseData)
                } else if (r.status === 204) {
                    console.log('Keine Einträge vorhanden')
                } else if (r.status === 500) {
                    console.log(r.data)
                }
            })
            .catch((error) => {
                console.log('ERROR: ' + error)
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
        <Popup content={<UmfragePopup/>} open={showPopUp} setOpen={setShowPopUp}>
            <>
                <div className="h-screen justify-between p-8 bg-[#AF8A74] overflow-auto">
                    <div className="flex justify-between">
                        <div className="flex-grow text-center">
                            <h1 className="text-3xl text-white">
                                Meine Umfragen
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-between p-8">
                        <button
                            className="mb-4 text-white hover:text-gray-200 hover:underline"
                            onClick={() => setShowPopUp(!showPopUp)}
                        >
                            + Umfragen hochladen
                        </button>
                        <button
                            className="mb-4 text-white hover:text-gray-200 hover:underline"
                            onClick={() => setFilter(!filter)}
                        >
                            Archiviert {filter ? 'anzeigen' : 'verbergen'}
                        </button>

                        {filter ? (
                            <UmfragenTable data={data} setData={setData} />
                        ) : (
                            <ArchiveTable data={data} setData={setData} />
                        )}
                    </div>
                </div>
            </>
        </Popup>
    )
}
