import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';
import UmfragenTable from './UmfragenTable';
import ArchiveTable from './ArchiveTable';
import UmfragePopup from '../uploadUmfragePage/UmfragePopup';

export default function Umfrage() {
    const [data, setData] = useState({ umfragen: [] });
    const [filter, setFilter] = useState(true);
    const [upload, setUpload] = useState(false);

    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem('accessToken');

    const umfragenLaden = () => {
        axios
            .get(`${window.location.origin}/umfrage/getAll`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    const responseData = r.data; 
                    console.log('Data received from server:', responseData);
                    setData(JSON.parse(responseData));
                } else if (r.status === 204) {
                    console.log('Keine Einträge vorhanden');
                } else if (r.status === 500) {
                    console.log(r.data);
                }
            })
            .catch((error) => {
                console.log('ERROR: ' + error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        umfragenLaden();
    }, [filter]);


    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <>
            {upload ? (
                <UmfragePopup setUpload={setUpload} />
            ) : (
                <div className="justify-between p-8 bg-[#AF8A74]">
                    <div className="flex flex-wrap justify-between p-8">
                        <button
                            className="mb-4 text-white hover:text-gray-200 hover:underline"
                            onClick={() => setUpload(!upload)}
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
            )}
        </>
    );
}
