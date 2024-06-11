import axios from 'axios'
import { useEffect } from 'react'

const accessToken = localStorage.getItem('accessToken')

export const umfragenArchivieren = (selectedIds, setSelectedIds, getData, setData) => {
    const newUmfragen = getData.umfragen.filter((umfrage) => !selectedIds.includes(umfrage.id));
    setData({ umfragen: newUmfragen });

    selectedIds.forEach((id) => {
        axios
            .post(`${window.location.origin}/umfrage/archive/${id}`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    console.log(`Umfrage mit ID ${id} erfolgreich archiviert`);
                }
            })
            .catch((error) => {
                console.log('ERROR: ' + error);
            });
    });

    setSelectedIds([]);
};

export const  umfragenLöschen =  (selectedIds, setSelectedIds, getData, setData) => {
    const newUmfragen = getData.umfragen.filter((umfrage) => !selectedIds.includes(umfrage.id));
    setData({ umfragen: newUmfragen });

    selectedIds.forEach((id) => {
        axios
            .post(`${window.location.origin}/umfrage/delete/${id}`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    console.log(`Umfrage mit ID ${id} erfolgreich gelöscht`);
                }
            })
            .catch((error) => {
                console.log('ERROR: ' + error);
            });
    });

    setSelectedIds([]);
};
