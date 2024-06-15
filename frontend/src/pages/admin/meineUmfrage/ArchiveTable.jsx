import { useState } from 'react'
import { umfragenArchivieren, umfragenLöschen } from './UmfragenUtils'
import { AiOutlineDelete } from 'react-icons/ai'
import { RiInboxUnarchiveLine } from 'react-icons/ri'

export default function UmfragenTable({ data, setData }) {
    const [selectedIds, setSelectedIds] = useState([])

    const handleCheckboxChange = (event, id) => {
        if (event.target.checked) {
            setSelectedIds([...selectedIds, id])
        } else {
            setSelectedIds(selectedIds.filter((item) => item !== id))
        }
    }

    const umfragenVorhanden = data && data.umfragen && data.umfragen.filter((umfrage) => umfrage.archivierungsdatum !== null).length > 0

    return (
        <div className="h-full w-full">
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
                        <RiInboxUnarchiveLine className="size-6" />
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
                        <AiOutlineDelete className="size-7" />
                    </button>
                </div>
            )}

            <table id="Umfragentabelle" className="w-full text-center leading-relaxed">
                <thead>
                    <tr>
                        <th className="text-lg p-4">Name</th>
                        <th className="text-lg p-4">ID</th>
                        <th className="text-lg p-4">Admin ID</th>
                        <th className="text-lg p-4">Beschreibung</th>
                        <th className="text-lg p-4">Erstellungsdatum</th>
                        <th className="text-lg p-4">Archivierungsdatum</th>
                        <th className="text-lg p-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {umfragenVorhanden ? (
                        data.umfragen
                            .filter((umfrage) => umfrage.archivierungsdatum !== null)
                            .map((umfrage) => (
                                <tr
                                    className="text-lg even:bg-[#FAEEDB] odd:bg-[#210803] even:text-black odd:text-white"
                                    key={umfrage.id}
                                >
                                    <td className="min-w-[100px] min-h-[50px] p-3">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={umfrage.id}
                                                className="mr-10"
                                                checked={selectedIds.includes(umfrage.id)}
                                                onChange={(event) =>
                                                    handleCheckboxChange(event, umfrage.id)
                                                }
                                            />
                                            <label htmlFor={umfrage.id}>
                                                <h1>{umfrage.titel}</h1>
                                            </label>
                                        </div>
                                    </td>
                                    <td className="min-w-[100px] min-h-[50px] p-3">
                                        <h1>{umfrage.id}</h1>
                                    </td>
                                    <td className="min-w-[100px] min-h-[50px] p-3">
                                        <h1>{umfrage.admin_id}</h1>
                                    </td>
                                    <td className="min-w-[100px] min-h-[50px] p-3">
                                        <h1>{umfrage.beschreibung}</h1>
                                    </td>
                                    <td className="min-w-[100px] min-h-[50px] p-3">
                                        <h1>{umfrage.erstellungsdatum}</h1>
                                    </td>
                                    <td className="min-w-[100px] min-h-[50px] p-3">
                                        <h1>{umfrage.archivierungsdatum}</h1>
                                    </td>
                                    <td className="min-w-[100px] min-h-[50px] p-3">
                                        <h1>{umfrage.status}</h1>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan="7">
                                <p className="mt-16 text-xl">Keine Umfragen vorhanden</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
