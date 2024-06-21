
import { useEffect, useState } from 'react'
import axios from 'axios'; 


export default function SitzungenResults({ displayedIds }) {

    const accessToken = localStorage.getItem('accessToken')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    const  resultsLaden =  () => {
        displayedIds.forEach((id) => {
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

    //For Test!!!!  TODO: muss angepasst werden
    return (
        <div>
            {/* Display results based on selectedIds */}
            {displayedIds.map(id => (
                <div key={id}>
                    {/* Render results for each selected id */}
                    <p>Results for session {id}</p>
                </div>
            ))}
        </div>
    );

}