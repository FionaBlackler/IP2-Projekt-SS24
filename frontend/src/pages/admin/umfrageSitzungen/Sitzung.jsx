import axios from 'axios'
import { useEffect, useState } from 'react'
import React from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import SitzungenTable from './SitzungenTable'
import { VscAccount } from 'react-icons/vsc'

export default function Sitzung() {
    const { umfrageId } = useParams();  //umfrageId aus der URL mittels useParams extrahiert.
    //console.log('umfrageId:', umfrageId);
    //const navigate = useNavigate()

    const [data, setData] = useState({ sitzungen: [] })

    const [loading, setLoading] = useState(true)
    const accessToken = localStorage.getItem('accessToken')

    const sitzungenLaden = () => {
        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}umfrage/${umfrageId}/sitzungen`, {  //HTTP-GET-Anfrage
                headers: { 'Authorization' : `Bearer ${accessToken}` ,
                           "ContentType": `application/json` } 
            })
            .then((r) => {
                //console.log(r.data)
                if (r.status === 200) {
                    const responseData = r.data
                    console.log('Data received from server:', responseData)  //must be JSON
                    setData(responseData)
                } else if (r.status === 204) {
                    console.log('Keine Einträge vorhanden')
                } 
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        console.log('Authentifizierungsfehler', error.response.data)
                    } else if (error.response.status === 404) {
                        console.log('Umfrage nicht gefunden (falsche ID)', error.response.data)
                    } else if (error.response.status === 500) {
                        console.log('server error', error.response.data)
                    } else {
                        console.log('ERROR: ' + error.response.data)
                    }
                } else {
                    console.log('ERROR: ' + error.message)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        sitzungenLaden()
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
                    <SitzungenTable data={data} setData={setData} />
                </div>
            </div>
        </>
    )
}
