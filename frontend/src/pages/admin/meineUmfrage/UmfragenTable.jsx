import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    umfragenArchivieren,
    umfragenLöschen,
    checkData,
    handleCheckboxChange,
} from './UmfragenUtils'
import { MdOutlineStart } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiArchive } from 'react-icons/fi'

export default function UmfragenTable({ data, setData }) {
    const [selectedIds, setSelectedIds] = useState([])
    const navigate = useNavigate()

    const handleHistory = (id) => {
        navigate(`/dashboard/${id}`)
    }

    const umfragenVorhanden = checkData('umfragen', data)

    return (
        <div className="h-full w-full" data-testid="umfrageTable">
            <div
                className={`flex space-x-4 mt-10 p-3 mr-10  ${
                    selectedIds.length > 0 ? '' : 'invisible'
                }`}
            >
                <button
                    className="mb-2 text-white hover:text-gray-200 hover:underline "
                    onClick={() =>
                        umfragenArchivieren(
                            selectedIds,
                            setSelectedIds,
                            data,
                            setData
                        )
                    }
                >
                    <FiArchive className="size-6" />
                </button>
                <button
                    className="mb-2 text-white hover:text-gray-200 hover:underline"
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

            <div id="scrollbar2" className="h-[55vh] overflow-auto  pr-4">
                <table
                    id="Umfragentabelle"
                    className="w-full text-center border-separate"
                    style={{ borderSpacing: '0 10px' }}
                >
                    <thead className="sticky top-0 bg-[#AF8A74] ">
                        <tr>
                            <th className="text-lg">Name</th>
                            <th className="text-lg">ID</th>
                            <th className="text-lg">Beschreibung</th>
                            <th className="text-lg">Erstellungsdatum</th>
                            <th className="text-lg">Status</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {umfragenVorhanden ? (
                            data.umfragen
                                .filter(
                                    (umfrage) =>
                                        umfrage.archivierungsdatum === null
                                )
                                .map((umfrage) => (
                                    <tr
                                        className="text-lg even:bg-[#FAEEDB] odd:bg-[#210803] even:text-black odd:text-white"
                                        key={umfrage.id}
                                    >
                                        <td className="min-w-[100px] min-h-[50px] p-3 rounded-l-full">
                                            <div className="flex items-center justify-center pt-3">
                                                <input
                                                    type="checkbox"
                                                    id={umfrage.id}
                                                    data-testid={`checkbox-${umfrage.id}`}
                                                    className="mr-10 rounded-full border-2 border-gray-400 appearance-none w-6 h-6 checked:bg-green-500 checked:border-transparent"
                                                    checked={selectedIds.includes(
                                                        umfrage.id
                                                    )}
                                                    onChange={(event) =>
                                                        handleCheckboxChange(
                                                            event,
                                                            umfrage.id,
                                                            selectedIds,
                                                            setSelectedIds
                                                        )
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
                                            <h1>{umfrage.beschreibung}</h1>
                                        </td>
                                        <td className="min-w-[100px] min-h-[50px] p-3">
                                            <h1>{umfrage.erstellungsdatum}</h1>
                                        </td>
                                        <td className="min-w-[100px] min-h-[50px] p-3 ">
                                            <div className="flex justify-center gap-y-1">
                                            {umfrage.status === 'aktiv' ? (
                                                <h1 className="pt-3 w-3 h-3 bg-green-500 rounded-full" />
                                            ) : (
                                                <h1 className="pt-3 w-3 h-3 bg-red-500 rounded-full" />
                                            )}
                                            </div>
                                        </td>
                                        <td className="min-w-[100px] min-h-[50px] rounded-r-full">
                                            <button
                                                data-testid={`button-${umfrage.id}`}
                                                className="hover:underline"
                                                onClick={() =>
                                                    handleHistory(umfrage.id)
                                                }
                                            >
                                                        <MdOutlineStart  className='w-10 h-5'/>
                                            </button>
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
        </div>
    )
}
