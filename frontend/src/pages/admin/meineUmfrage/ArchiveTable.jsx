import { useState } from 'react'
import { umfragenArchivieren, umfragenLöschen } from './UmfragenUtils'
import { MdDeleteOutline } from 'react-icons/md'
import { FiArchive } from 'react-icons/fi'

export default function UmfragenTable({ data, setData }) {
    const [selectedIds, setSelectedIds] = useState([])

    const handleCheckboxChange = (event, id) => {
        if (event.target.checked) {
            setSelectedIds([...selectedIds, id])
        } else {
            setSelectedIds(selectedIds.filter((item) => item !== id))
        }
    }

    return (
        <div className="h-screen w-full p-4">
            {selectedIds.length > 0 && (
                <div className="flex space-x-4">
                    <button
                        className="mb-4 text-white hover:text-gray-200 hover:underline"
                        onClick={() =>
                            umfragenArchivieren(
                                selectedIds,
                                setSelectedIds,
                                data,
                                setData
                            )
                        }
                    >
                        <FiArchive />
                    </button>
                    <button
                        className="mb-4 text-white hover:text-gray-200 hover:underline"
                        onClick={() =>
                            umfragenLöschen(
                                selectedIds,
                                setSelectedIds,
                                data,
                                setData
                            )
                        }
                    >
                        <MdDeleteOutline />
                    </button>
                </div>
            )}

            <table id="Umfragentabelle" className="w-full text-center">
                <thead>
                    <tr>
                        <th className="text-lg">Name</th>
                        <th className="text-lg">ID</th>
                        <th className="text-lg">Admin ID</th>
                        <th className="text-lg">Beschreibung</th>
                        <th className="text-lg">Erstellungsdatum</th>
                        <th className="text-lg">Archivierungsdatum</th>
                        <th className="text-lg">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.umfragen?.filter(
                        (umfrage) => umfrage.archivierungsdatum !== null
                    ).length !== 0 ? (
                        data.umfragen
                            .filter(
                                (umfrage) => umfrage.archivierungsdatum !== null
                            )
                            .map((umfrage) => (
                                <tr
                                    className="text-lg even:bg-[#FAEEDB] odd:bg-[#210803] even:text-black odd:text-white"
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
                                        <h1>{umfrage.erstellungsdatum}</h1>
                                    </td>
                                    <td className="p-2">
                                        <h1>{umfrage.archivierungsdatum}</h1>
                                    </td>
                                    <td className="p-2">
                                        <h1>{umfrage.status}</h1>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan="7">
                                <p className="mt-16 text-xl">
                                    Keine Umfragen vorhanden
                                </p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
