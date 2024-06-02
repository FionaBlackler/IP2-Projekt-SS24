import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Umfrage() {
    const accessToken = localStorage.getItem('accessToken')
    console.log(accessToken)
    const [data, setData] = useState({ umfragen: [] })
    const [selectedIds, setSelectedIds] = useState([])

    const handleCheckboxChange = (event, id) => {
        if (event.target.checked) {
            setSelectedIds([...selectedIds, id])
        } else {
            setSelectedIds(selectedIds.filter((item) => item !== id))
        }
    }

    const umfragenLaden = () => {
        axios
            .post(`${window.location.origin}/umfrage/getAll`, { headers: {"Authorization" : `Bearer ${accessToken}`}})
            .then((r) => {
                if (r.status === 200) {
                    setStatus({ state: 'FINISHED' })
                    setData(JSON.parse(r.data))
                    console.log(data)
                } else if (r.status === 204) {
                    console.log('Keine Einträge vorhanden')
                } else if (r.status === 500) {
                    console.log(r.data)
                }
            })
            .catch((error) => {
                console.log('ERROR: ' + error)
            })
       
    }

    const umfragenArchivieren = () => {
        selectedIds.forEach((id) => {
            setData({
                umfragen: data.umfragen.filter(
                    (umfrage) => !selectedIds.includes(umfrage.id)
                ),
            })

            // console.log(`${window.location.origin}/umfrage/archive/${id}`)
            axios
                .post(`${window.location.origin}/umfrage/archive/${id}`, { headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then((r) => {
                    if (r.status === 200) {
                        setStatus({ state: 'FINISHED' })
                    }
                })
                .catch((error) => {
                    console.log('ERROR: ' + error)
                })
        })
        setSelectedIds([])
    }

    const umfragenLöschen = () => {
        selectedIds.forEach((id) => {
            setData({
                umfragen: data.umfragen.filter(
                    (umfrage) => !selectedIds.includes(umfrage.id)
                ),
            })
            axios

                .post(`${window.location.origin}/umfrage/delete/${id}`, { headers: {"Authorization" : `Bearer ${accessToken}`}})
                .then((r) => {
                    if (r.status === 200) {
                        setStatus({ state: 'FINISHED' })
                    }
                })
                .catch((error) => {
                    console.log('ERROR: ' + error)
                })
        })

        setSelectedIds([])
    }

    useEffect(() => {
        umfragenLaden()
    }, [])

    return (
        <>
            <div className="h-screen w-full p-4">
                <div className=" w-full justify-between p-8 bg-[#AF8A74]">
                    <div className="flex flex-wrap  justify-between p-8 ">
                        <button className="mb-4 text-white hover:text-gray-200 hover:underline">
                            + Umfragen hochladen
                        </button>
                        {selectedIds.length > 0 && (
                            <div className="flex space-x-4">
                                <button
                                    className="mb-4 text-white hover:text-gray-200 hover:underline"
                                    onClick={umfragenArchivieren}
                                >
                                    Archivieren
                                </button>
                                <button
                                    className="mb-4 text-white hover:text-gray-200 hover:underline"
                                    onClick={umfragenLöschen}
                                >
                                    Löschen
                                </button>
                            </div>
                        )}
                        <table className="w-full text-center">
                            <thead>
                                <tr>
                                    <th className="text-lg">Name</th>
                                    <th className="text-lg">ID</th>
                                    <th className="text-lg">Admin ID</th>
                                    <th className="text-lg">Beschreibung</th>
                                    <th className="text-lg">
                                        Erstellungsdatum
                                    </th>
                                    <th className="text-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.umfragen.length !== 0 ? (
                                    data.umfragen.map((umfrage) => (
                                        <tr
                                            className="text-lg even:bg-[#FAEEDB] odd:bg-[#210803] even:text-black  odd:text-white"
                                            key={umfrage.id}
                                        >
                                            <td className="p-2">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={umfrage.id}
                                                        className="mr-10"
                                                        checked={selectedIds.includes(
                                                            umfrage.id
                                                        )}
                                                        onChange={(event) =>
                                                            handleCheckboxChange(
                                                                event,
                                                                umfrage.id
                                                            )
                                                        }
                                                    />
                                                    <label htmlFor={umfrage.id}>
                                                        <h1>{umfrage.titel}</h1>
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                <h1>{umfrage.id}</h1>
                                            </td>
                                            <td className="p-2">
                                                <h1>{umfrage.admin_id}</h1>
                                            </td>
                                            <td className="p-2">
                                                <h1>{umfrage.beschreibung}</h1>
                                            </td>
                                            <td className="p-2">
                                                <h1>
                                                    {umfrage.erstellungsdatum}
                                                </h1>
                                            </td>
                                            <td className="p-2">
                                                <h1>{umfrage.status}</h1>
                                            </td>
                                            <td className=" p-2">
                                                <button className="hover:underline">
                                                    Starten
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">
                                            <p className="mt-16 text-xl">
                                                Keine Umfragen vorhanden
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
