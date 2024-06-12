import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sitzungenLöschen } from './SitzungUtils'
import { AiOutlineDelete, AiOutlineDotChart } from 'react-icons/ai'


export default function SitzungenTable({ data, setData }) {
    const [selectedIds, setSelectedIds] = useState([])
    const navigate = useNavigate()

    const handleCheckboxChange = (event, id) => {
        if (event.target.checked) {
            setSelectedIds([...selectedIds, id])
        } else {
            setSelectedIds(selectedIds.filter((item) => item !== id))
        }
    }

    // Navigate to result page based on status
    const handleHistory = (sitzung) => {
        const route = sitzung.aktiv ? `/sitzung/${sitzung.id}/live` : `/sitzung/${sitzung.id}/results`;
        navigate(route)
    }

    return (
        <div className="h-full w-full">
            {selectedIds.length > 0 && (
                <div className="flex space-x-4 ">
                    <button
                        className="mb-4 text-white hover:text-gray-200 hover:underline"
                        onClick={() =>
                            sitzungenLöschen(
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

            <table id="Sitzungentabelle" className="w-full text-center ">
                <thead>
                    <tr>
                        <th className="text-lg">ID</th>
                        <th className="text-lg">Startzeit</th>
                        <th className="text-lg">Endzeit</th>
                        <th className="text-lg">Teilnehmerzahl</th>
                        <th className="text-lg">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.sitzungen && data.sitzungen.length !== 0 ? (
                        data.sitzungen.map((sitzung) =>
                            <tr
                                className="text-lg even:bg-[#FAEEDB] odd:bg-[#210803] even:text-black odd:text-white"
                                key={sitzung.id}
                            >
                                <td className="min-w-[100px] min-h-[50px] p-2  ">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={sitzung.id}
                                            className="mr-10"
                                            checked={selectedIds.includes(
                                                sitzung.id
                                            )}
                                            onChange={(event) =>
                                                handleCheckboxChange(
                                                    event,
                                                    sitzung.id
                                                )
                                            }
                                        />
                                        <label htmlFor={sitzung.id}>     
                                            <h1>{sitzung.id}</h1>
                                        </label>
                                    </div>
                                </td>
                                <td className="min-w-[100px] min-h-[50px] p-2  ">
                                    <h1>{sitzung.startzeit}</h1>
                                </td>
                                <td className="min-w-[100px] min-h-[50px] p-2  ">
                                    <h1>{sitzung.endzeit || 'N/A'}</h1>
                                </td>
                                <td className="min-w-[100px] min-h-[50px] p-2  ">
                                    <h1>{sitzung.teilnehmerzahl}</h1>
                                </td>
                                <td className="min-w-[100px] min-h-[50px] p-2  ">
                                    <h1>{sitzung.aktiv ? 'Aktiv' : 'Geschlossen'}</h1>
                                </td>
                                <td className="min-w-[100px] min-h-[50px] p-2  ">       
                                    <button
                                        className="hover:underline"
                                        onClick={() =>
                                            handleHistory(sitzung)
                                        }
                                    >
                                        <AiOutlineDotChart />
                                    </button>
                                </td>
                            </tr>
                        ))
                        : (
                            <tr>
                                <td colSpan="7">
                                    <p className="mt-16 text-xl">
                                        Keine Sitzungen vorhanden
                                    </p>
                                </td>
                            </tr>
                        )}
                </tbody>
            </table>
        </div>
    )
}
