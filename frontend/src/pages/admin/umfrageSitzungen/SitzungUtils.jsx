import axios from 'axios'
import { useEffect } from 'react'

const accessToken = localStorage.getItem('accessToken')

// Funktion zum Löschen einer Sitzung
export const  sitzungenLöschen =  (selectedIds, setSelectedIds, getData, setData) => {
    const newSitzungen = getData.sitzungen.filter((sitzung) => !selectedIds.includes(sitzung.id));  //update table after delete
    setData({ sitzungen: newSitzungen });

    selectedIds.forEach((id) => {
        axios
            .delete(`${import.meta.env.VITE_BACKEND_URL}sitzung/delete/${id}`, {
                headers:  { 'Authorization' : `Bearer ${accessToken}` ,
                            "ContentType": 'application/json' }
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

// Funktion zum Abrufen der Ergebnisse mehreren Sitzungen
export const  resultsLaden =  (selectedIds, setSelectedIds, resultData, setResultData) => {
  
  selectedIds.forEach((id) => {
      axios
          .get(`${import.meta.env.VITE_BACKEND_URL}sitzung/${id}/result`, {
              headers: { 'Authorization' : `Bearer ${accessToken}` ,
                         "ContentType": 'application/json' }
          })
          .then((r) => {
              if (r.status === 200) {
                const responseData = r.data
                console.log(`Ergebnisse zur Sitzung mit ID  ${id} sind ${r.data}`);
                setResultData({ results: responseData })
                console.log('resultData', resultData)
              } else if (r.status === 404) {
                console.error(`Could not find umfrage with a associated sitzung with id: ${id}`);
              } 
          })
          .catch((error) => {
              console.log('ERROR: ' + error);
          });
  });

  setSelectedIds([]);  //empty 
};