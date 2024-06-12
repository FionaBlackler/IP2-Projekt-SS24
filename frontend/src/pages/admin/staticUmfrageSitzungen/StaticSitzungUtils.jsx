import axios from 'axios'
import { useEffect } from 'react'

const accessToken = localStorage.getItem('accessToken')

// Funktion zum Löschen einer Sitzung
export const  sitzungenLöschen =  (selectedIds, setSelectedIds, getData, setData) => {
    const newSitzungen = getData.sitzungen.filter((sitzung) => !selectedIds.includes(sitzung.id));  //update table after delete
    setData({ sitzungen: newSitzungen });

    selectedIds.forEach((id) => {
        axios
            .delete(`${import.meta.env.VITE_BACKEND_URL}/sitzung/delete/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    console.log(`Sitzung mit ID ${id} erfolgreich gelöscht`);
                }
            })
            .catch((error) => {
                console.log('ERROR: ' + error);
            });
    });

    setSelectedIds([]);  //empty 
};

