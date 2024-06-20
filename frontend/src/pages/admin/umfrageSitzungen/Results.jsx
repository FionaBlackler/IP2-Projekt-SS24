import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../layouts/AdminLayout.jsx';
import Menu from '../../../components/charts/StatistikMenü.jsx';

export default function SitzungenResults() {
    const { ids } = useParams();
    const idsArray = ids.split(',');
    const idsIntArray = idsArray.map(id => parseInt(id, 10));
    const accessToken = localStorage.getItem('accessToken');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const resultsLaden = () => {
        let allData = {};

        idsIntArray.forEach((id, index) => {
            axios
                .get(`${import.meta.env.VITE_BACKEND_URL}sitzung/${id}/result`, {
                    headers: { 'Authorization': `Bearer ${accessToken}`, "ContentType": 'application/json' }
                })
                .then((r) => {
                    if (r.status === 200) {
                        const responseData = r.data;
                        console.log(`Ergebnisse zur Sitzung mit ID ${id}`);
                        console.log(JSON.stringify(responseData, null, 2));

                        const resultData = responseData.result;

                        Object.keys(resultData).forEach(key => {
                            if (!allData[key]) {
                                allData[key] = {
                                    ...resultData[key],
                                    antworten: resultData[key].antworten.map(option => ({
                                        ...option,
                                        antwortenTrue: 0,
                                        antwortenFalse: 0
                                    }))
                                };
                            }

                            resultData[key].antworten.forEach((option, idx) => {
                                allData[key].antworten[idx].antwortenTrue += option.antwortenTrue;
                                allData[key].antworten[idx].antwortenFalse += option.antwortenFalse;
                            });
                        });

                        // Set data only after all requests are completed
                        if (index === idsIntArray.length - 1) {
                            setData(Object.values(allData));
                            setLoading(false);
                        }
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status === 404) {
                            console.error('not found', error.response.data);
                        } else if (error.response.status === 500) {
                            console.error('server error', error.response.data);
                        } else {
                            console.log('ERROR: ' + error.response.data);
                        }
                    } else {
                        console.log('ERROR: ' + error.message);
                    }
                    // Set loading to false if there's an error
                    if (index === idsIntArray.length - 1) {
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
        <AdminLayout>
            <div>
                <h1>Ergebnisse der ausgewählten Sitzungen</h1>
                <Menu data={data} />
            </div>
        </AdminLayout>
    );
}