import { useEffect, useState } from 'react'
import React from 'react'
import { useParams } from 'react-router-dom'
import StaticSitzungenTable from './StaticSitzungenTable'
import staticData from './staticData.json' // Import the static data from a local JSON file

export default function StaticSitzung() {
    const { umfrageId } = useParams();  // umfrageId aus der URL mittels useParams extrahiert.
    console.log('umfrageId:', umfrageId);

    const [data, setData] = useState({ sitzungen: [] })
    const [loading, setLoading] = useState(true)

    // Function to load the static data
    const sitzungenLaden = () => {
        try {
            // Simulate an API response delay
            setTimeout(() => {
                const responseData = staticData.body;
                console.log('Data received from static source:', responseData); // Must be JSON
                setData(responseData);
                setLoading(false);
            }, 1000); // 1 second delay to simulate network request
        } catch (error) {
            console.log('ERROR:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        sitzungenLaden();
    }, [umfrageId])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="h-screen justify-between p-8 bg-[#AF8A74] overflow-auto">
                <div className="flex justify-between">
                    <div className="flex-grow text-center">
                        <h1 className="text-3xl text-white">Sitzungstabelle für Umfrage ID {umfrageId}</h1>
                    </div>
                </div>

                <div className="flex flex-wrap justify-between p-8">
                    <StaticSitzungenTable data={data} setData={setData} />
                </div>
            </div>
        </>
    )
}
