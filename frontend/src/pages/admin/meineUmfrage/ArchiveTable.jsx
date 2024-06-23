import { useState } from 'react'
import {
    umfragenArchivieren,
    umfragenLöschen,
    checkData,
    handleCheckboxChange,
} from './UmfragenUtils'
import { AiOutlineDelete } from 'react-icons/ai'
import { RiInboxUnarchiveLine } from 'react-icons/ri'

export default function UmfragenTable({ data, setData }) {
    const [selectedIds, setSelectedIds] = useState([])

    const umfragenVorhanden = checkData('archive', data)

    return (
        <div className="h-full w-full" data-testid="archiveTable">
            <div
                className={`flex space-x-4 mt-10 p-3 mr-10  ${
                    selectedIds.length > 0 ? '' : 'invisible'
                }`}
            >
                <button
                    name="Archivieren"
                    className="mb-2 text-white hover:text-gray-200 hover:underline"
                    onClick={() =>
                        umfragenArchivieren(
                            selectedIds,
                            setSelectedIds,
                            data,
                            setData
                        )
                    }
                >
                    <RiInboxUnarchiveLine className="size-7" />
                </button>
                <button
                    name="Löschen"
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

            <div id="scrollbar2" className="h-[55vh] overflow-auto pr-4">
                <table id="Archivierentabelle" data-testid="archivetabelle" className="w-full text-center">
                    <thead className="sticky top-0 bg-[#AF8A74]">
                        <tr>
                            <th className="text-lg">Name</th>
                            <th className="text-lg">ID</th>
                            <th className="text-lg">Beschreibung</th>
                            <th className="text-lg">Erstellungsdatum</th>
                            <th className="text-lg">Archivierungsdatum</th>
                            <th className="text-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {umfragenVorhanden ? (
                            data.umfragen
                                .filter(
                                    (umfrage) =>
                                        umfrage.archivierungsdatum !== null
                                )
                                .map((umfrage) => (
                                    <tr
                                        className="text-lg even:bg-[#FAEEDB] odd:bg-[#210803] even:text-black odd:text-white"
                                        key={umfrage.id}
                                    >
                                        <td className="min-w-[100px] min-h-[50px] p-3">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    id={umfrage.id}
                                                    data-testid={`checkbox-${umfrage.id}`}
                                                    className="mr-10 rounded-[50px]"
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
                                        <td className="min-w-[100px] min-h-[50px] p-3">
                                            <h1>
                                                {umfrage.archivierungsdatum}
                                            </h1>
                                        </td>
                                        <td className="min-w-[100px] min-h-[50px] p-3 flex justify-center items-center">
                                            <h1>
                                                {umfrage.status == 'aktiv' ? (
                                                    <div className="bg-green-700 h-[12.5px] w-[12.5px] justify-center aling-center items-center rounded-[50px]" />
                                                ) : (
                                                    <div className="bg-red-700 h-[12.5px] w-[12.5px] justify-center aling-center items-center rounded-[50px]" />
                                                )}
                                            </h1>
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
