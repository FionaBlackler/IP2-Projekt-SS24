import { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from '../../../components/charts/StatistikMenü.jsx';

export default function SitzungenResults({ displayedIds }) {
    const accessToken = localStorage.getItem('accessToken');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const resultsLaden = () => {
        let allData = {
            umfrage: {},
            result: {}
        };

        displayedIds.forEach((id, index) => {
            axios
                .get(`${import.meta.env.VITE_BACKEND_URL}sitzung/${id}/result`, {
                    headers: { 'Authorization': `Bearer ${accessToken}`, 'ContentType': 'application/json' }
                })
                .then((r) => {
                    if (r.status === 200) {
                        const responseData = r.data;
                        console.log(`Ergebnisse zur Sitzung mit ID ${id}`);
                        console.log(JSON.stringify(responseData, null, 2));

                        // Umfrage-Daten initialisieren, wenn sie noch nicht gesetzt sind
                        if (!allData.umfrage.titel && !allData.umfrage.beschreibung) {
                            allData.umfrage = {
                                titel: responseData.umfrage.titel,
                                beschreibung: responseData.umfrage.beschreibung
                            };
                        }

                        const resultData = responseData.result;
                        Object.keys(resultData).forEach(key => {
                            if (!allData.result[key]) {
                                allData.result[key] = {
                                    ...resultData[key],
                                    antworten: resultData[key].antworten.map(option => ({
                                        ...option,
                                        antwortenTrue: 0,
                                        antwortenFalse: 0
                                    }))
                                };
                            }

                            resultData[key].antworten.forEach((option, idx) => {
                                allData.result[key].antworten[idx].antwortenTrue += option.antwortenTrue;
                                allData.result[key].antworten[idx].antwortenFalse += option.antwortenFalse;
                            });
                        });

                        // Setze die Daten nach dem letzten Request
                        if (index === displayedIds.length - 1) {
                            setData(allData);
                            setLoading(false);
                        }
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status === 404) {
                            console.error('Not found', error.response.data);
                        } else if (error.response.status === 500) {
                            console.error('Server error', error.response.data);
                        } else {
                            console.log('ERROR: ' + error.response.data);
                        }
                    } else {
                        console.log('ERROR: ' + error.message);
                    }
                    // Set loading to false if there's an error
                    if (index === displayedIds.length - 1) {
                        setLoading(false);
                    }
                });
        });
    };

    useEffect(() => {
        resultsLaden();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Menu data={data} />
        </div>
    );
}
