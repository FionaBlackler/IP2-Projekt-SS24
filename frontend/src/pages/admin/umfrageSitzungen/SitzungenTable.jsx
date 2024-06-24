import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sitzungenLöschen } from './SitzungUtils'
import { AiOutlineDelete, AiOutlineDotChart } from 'react-icons/ai'
import { MdOutlineStart } from 'react-icons/md'
import SitzungenResults from './Results'

export default function SitzungenTable({ data, setData }) {
    const [selectedIds, setSelectedIds] = useState([])  // keeps track of selected checkboxes
    const [showResults, setShowResults] = useState(false); // State to toggle showing results
    const [displayedIds, setDisplayedIds] = useState([]); //  keeps track of the session IDs for which results should be displayed
    const [keyForResults, setKeyForResults] = useState(0);
    const navigate = useNavigate()

    const handleCheckboxChange = (event, id) => {
        // Updates selectedIds when checkboxes are checked or unchecked
        if (event.target.checked) {
            setSelectedIds([...selectedIds, id])
        } else {
            setSelectedIds(selectedIds.filter((item) => item !== id))
        }
    }

    // Navigate to session dashboard
    const handleNavigation = (id) => {
        navigate(`/sessiondashboard`)  //TODO: add pfad
    }

    const handleShowResults = () => {
        /* Sets displayedIds to selectedIds when clicked.
           Toggles showResults to true without clearing selectedIds. 
           Clearing selectedIds will not affect the results display because displayedIds and showResults are managed separately.
        */
        setDisplayedIds(selectedIds);
        setShowResults(true);
        //setSelectedIds([]);
        setKeyForResults(prevKey => prevKey + 1);
    };

    // Use useEffect to log state changes and effects
    useEffect(() => {
        console.log('selected ids:', selectedIds);
        console.log('displayed ids:', displayedIds);
        console.log('show results:', showResults);
    }, [selectedIds, displayedIds, showResults]);

    return (
        <div className="h-full w-full flex flex-col">
            {/* Buttons container */}
            <div className="flex justify-end space-x-4 mt-2 mb-4">
                <button
                    className="hover:text-gray-200 hover:underline"
                    onClick={() =>
                        sitzungenLöschen(selectedIds, setSelectedIds, data, setData)
                    }
                    disabled={selectedIds.length === 0}
                    data-testid="delete-button"
                >
                    <AiOutlineDelete className="size-7" />
                </button>
                <button
                    className="hover:text-gray-200 hover:underline"
                    onClick={() => handleShowResults()}
                    disabled={selectedIds.length === 0}
                    data-testid="results-button"
                >
                    <AiOutlineDotChart className="size-7" />
                </button>
            </div>
    
            <div className="h-full w-full flex">
                <div className="flex-1 bg-white p-2 ml-0 mr-2 rounded-lg" style={{ borderRadius: '16px', marginLeft: '-43px', flexBasis: '66.66%' }} data-testid="sitzungen-results">
                    {/* Left section - currently empty */}
                    {showResults && <SitzungenResults key={keyForResults} displayedIds={displayedIds} />}
                </div>
                <div className="flex-1 bg-[#FEF2DE] p-2 mr-0 ml-1 rounded-lg" style={{ borderRadius: '16px', marginRight: '-43px', flexBasis: '33.33%' }} data-testid="sitzungen-table">
                    <div className="border-t-2 border-[#AF8A74] mt-4" style={{ marginRight: '-10px', marginLeft: '-10px' }}></div>
                    <div id="scrollbar2" className="h-[55vh] overflow-auto  pr-4">
                        <table
                            id="Sitzungentabelle"
                            className="w-full text-center border-separate"
                            style={{ borderSpacing: '0 10px' }}
                        >
                            <thead>
                                <tr>
                                    <th className="text-sm leading-4 py-2 px-4"></th>
                                    <th className="text-sm leading-4 py-2 px-4">Startzeit</th>
                                    <th className="text-sm leading-4 py-2 px-4">Endzeit</th>
                                    <th className="text-sm leading-4 py-2 px-4">Teilnehmer</th>
                                    <th className="text-sm leading-4 py-2 px-4">Status</th>
                                    <th className="text-sm leading-4 py-2 px-4"></th> {/* Empty header for icon */}
                                </tr>
                            </thead>
                            <tbody>
                                {data?.sitzungen && data.sitzungen.length !== 0 ? (
                                    data.sitzungen.map((sitzung) => {
                                        const startzeit = sitzung.startzeit ? sitzung.startzeit.toString().slice(0, 16) : 'N/A';
                                        const endzeit = sitzung.endzeit ? sitzung.endzeit.toString().slice(0, 16) : 'N/A';
                                        /* const endzeitDatum = sitzung.endzeit ? new Date(sitzung.endzeit).toISOString().slice(0, 10) : 'N/A';
                                        const endzeitUhrzeit = sitzung.endzeit ? new Date(sitzung.endzeit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'; */
    
                                        return (
                                            <tr
                                                className="text-sm text-black"
                                                key={sitzung.id}
                                                style={{ backgroundColor: '#AF8A74'}}
                                            >
                                                <td className="p-2 rounded-l-full">
                                                    <div className="flex items-center justify-center pt-2">
                                                        <input
                                                            type="checkbox"
                                                            id={sitzung.id}
                                                            className="mr-3 rounded-full border-2 bg-[#FEF2DE] appearance-none w-6 h-6 checked:bg-[#210803] border-[#FEF2DE]"
                                                            checked={selectedIds.includes(sitzung.id)}
                                                            onChange={(event) =>
                                                                handleCheckboxChange(event, sitzung.id)
                                                            }
                                                            data-testid={`checkbox-${sitzung.id}`}
                                                        />
                                                        <label
                                                            htmlFor={sitzung.id}
                                                            /* className={`cursor-pointer w-6 h-6 border-2 rounded-full flex items-center justify-center ${selectedIds.includes(sitzung.id)
                                                                ? 'bg-[#210803] border-[#210803]'
                                                                : 'bg-[#FEF2DE] border-[#FEF2DE]'
                                                                }`} */
                                                        >
                                                            {/* {selectedIds.includes(sitzung.id) && (
                                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                                            )} */}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td width="99%">
                                                    <h1 className="text-sm">{startzeit}</h1>
                                                </td>
                                                <td width="99%">
                                                    {/* <span>{endzeitDatum}</span><br />
                                                    <span>{endzeitUhrzeit}</span> */}
                                                    <h1 className="text-sm">{endzeit}</h1>
                                                </td>
                                                <td className="p-2">
                                                    <h1 className="text-sm">{sitzung.teilnehmerzahl}</h1>
                                                </td>
                                                <td className="min-w-[50px] min-h-[50px] p-2">
                                                    <div className="flex justify-center gap-y-1 pt-4">
                                                        {sitzung.aktiv ? (
                                                            <div data-testid={`status-${sitzung.id}`} className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        ) : (
                                                            <div data-testid={`status-${sitzung.id}`} className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-2 bg-[#FEF2DE] border-2 border-[#AF8A74] rounded-r-full">
                                                    {/* Icon */}
                                                    <button
                                                        className="hover:underline"
                                                        data-testid={`navigate-button-${sitzung.id}`}
                                                        onClick={() => handleNavigation(sitzung.id)}
                                                    >
                                                        <MdOutlineStart className="size-5" data-testid="navigate-button" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6">
                                            <p className="mt-16 text-xl">Keine Sitzungen vorhanden</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}      
