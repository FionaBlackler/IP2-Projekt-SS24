
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { resultsLaden } from './SitzungUtils';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 


export default function SitzungenResults() {
    const { ids } = useParams();  //umfrageId aus der URL mittels useParams extrahiert.
    console.log('ids:', ids);

    const idsArray = ids.split(','); // Aufteilen des Strings anhand des Kommas
    const idsIntArray = idsArray.map(id => parseInt(id, 10)); // Konvertiert jeden String zu einer Ganzzahl
    console.log('idsArray:', idsIntArray); // Hier wäre idsArray ein Array mit den Werten ['2', '3']

    const accessToken = localStorage.getItem('accessToken')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    const  resultsLaden =  () => {
        idsIntArray.forEach((id) => {
          console.log(id)
            axios
                .get(`${import.meta.env.VITE_BACKEND_URL}sitzung/${id}/result`, {
                    headers: { 'Authorization' : `Bearer ${accessToken}` ,
                               "ContentType": 'application/json' }
                })
                .then((r) => {
                    if (r.status === 200) {
                      const responseData = r.data
                      console.log(`Ergebnisse zur Sitzung mit ID  ${id} sind ${r.data}`);
                      setData(responseData)
                    } else if (r.status === 404) {
                      console.error(`Could not find umfrage with a associated sitzung with id: ${id}`);
                    } 
                })
                .catch((error) => {
                    console.log('ERROR: ' + error);
                });
        });
    };

    useEffect(() => {
        resultsLaden();
    }, []); // Empty dependency array to run once on component mount

    if (loading) {
        return <div>Loading...</div>
    }

    return(<></>)

}