import axiosInstance from '../../../axios/axiosConfig.js'
import { useEffect, useState } from 'react'
import React from 'react'
import { useParams } from 'react-router-dom';
import SitzungenTable from './SitzungenTable'

export default function Sitzung() {
    const { umfrageId } = useParams();  //umfrageId aus der URL mittels useParams extrahiert.

    const [data, setData] = useState({ sitzungen: [] })

    const [loading, setLoading] = useState(true)
    //const accessToken = localStorage.getItem('accessToken')

    const sitzungenLaden = () => {
        axiosInstance
            .get(`umfrage/${umfrageId}/sitzungen`)
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
            {/* Top block with Umfrage ID */}
            <div className="relative inset-x-0 top-0 h-7 mb-0 mt-0 bg-[#210803] rounded-bl-xl rounded-br-xl" style={{ marginRight: '-30px', marginLeft: '-30px' }}>
              {/* Umfrage ID text on the left */}
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white">
                Umfrage {umfrageId}
              </div>
              {/* Sessions text in the middle */}
              <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 text-center text-white">
                Alle Sessions
              </div>
            </div>
            {/* Main content */}
            <div className="flex flex-wrap justify-between p-8">
              <SitzungenTable data={data} setData={setData} />
            </div>
          </div>
        </>
      );
      
}
