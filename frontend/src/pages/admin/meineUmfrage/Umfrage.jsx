import axios from 'axios'
import { useEffect, useState } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import UmfragenTable from './UmfragenTable'
import ArchiveTable from './ArchiveTable'
import { VscAccount } from 'react-icons/vsc'
import UmfragePopup from '../uploadUmfragePage/UmfragePopup'

export default function Umfrage() {
    const navigate = useNavigate()
    const upi = () => {
        const umfragejs = {
            titel: 'Umfrage 2024',
            beschreibung: 'In dieser Umfrage geht es um X',
            fragen: [
                {
                    art: 'A',
                    frage_text: 'Wie lautet die Hauptstadt von Frankreich?',
                    richtige_antworten: ['Paris'],
                    falsche_antworten: ['Berlin', 'London', 'Rom'],
                    punktzahl: 2,
                },
                {
                    art: 'P',
                    frage_text:
                        'Welche der folgenden Städte liegt in Deutschland?',
                    richtige_antworten: ['Berlin', 'Hamburg', 'München'],
                    falsche_antworten: ['Paris', 'London', 'Rom'],
                    punktzahl: 1,
                },
                {
                    art: 'K',
                    frage_text: 'welche der folgenden Antworten trifft zu ...:',
                    kategorien: {
                        bestaetigt: 'zutreffend',
                        verneint: 'nicht zutreffend',
                    },
                    richtige_antworten: [
                        "Das Internet ist eine Erfindung des 20. Jahrhunderts'?",
                        "Trifft diese Aussage zu: 'Wasser besteht aus den Elementen Wasserstoff und Sauerstoff'?",
                    ],
                    falsche_antworten: [
                        "Trifft diese Aussage zu: 'Die Sonne ist ein Planet'?",
                    ],
                    punktzahl: 2,
                },
            ],
        }
        axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/umfrage/upload`,
            umfragejs,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        )
    }

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
    }, [filter])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Popup content={UmfragePopup} open={showPopUp} setOpen={setShowPopUp}>
            <div className="h-screen justify-between p-8 bg-[#AF8A74] overflow-auto">
                <div className="flex justify-between">
                    <div className="flex-grow text-center">
                        <h1 className="text-3xl text-white">Meine Umfragen</h1>
                    </div>
                </div>

                <div className="flex flex-wrap justify-between p-8">
                    <button
                        className="mb-4 text-white hover:text-gray-200 hover:underline"
                        onClick={() => upi()}
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
            </Popup>

        </>
    )
}
