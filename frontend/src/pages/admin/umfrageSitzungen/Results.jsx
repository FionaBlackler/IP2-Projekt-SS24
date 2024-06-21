
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
                      console.log(`Ergebnisse zur Sitzung mit ID  ${id}`);
                      setData(responseData)
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status === 404) {
                            console.error('not found',  error.response.data);
                        } else if (error.response.status === 500) {
                            console.error('server error',  error.response.data);
                        }
                        else {
                            console.log('ERROR: ' + error.response.data)
                        }
                    } else {
                        console.log('ERROR: ' + error.message)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
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