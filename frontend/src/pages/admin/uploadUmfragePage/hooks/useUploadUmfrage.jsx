import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FINISHED, ERROR } from "../UploadConstants.js";

export const useUploadPoll = (json, admin_id) => {
    const [pollStatus, setPollStatus] = useState({ state: ERROR, info: "Hochgeladene Datei hat kein JSON-Format!" });
    const fetchUmfrage = useCallback(async () => {
        let noJSON = false;
        console.log("fetchUmfrage called");
        let parsedJSON;
        try {
            console.log(json)
            parsedJSON = JSON.parse(json)
        } catch (error){
            setPollStatus({ state: ERROR, info: "Datei enthält kein JSON" });
            noJSON = true;
        }
        if(!noJSON){
            try {
                const response = await axios.post('http://localhost:5173/umfrage/upload', parsedJSON, {
                    params: { admin_id: admin_id },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 201) {
                    const responseJSON = JSON.parse(response.data);
                    setPollStatus({
                        state: FINISHED,
                        info: "Umfrage erfolgreich hinzugefügt! ID: " + responseJSON["umfrage_id"]
                    });
                } else {
                    setPollStatus({ state: ERROR, info: "Unerwarteter Fehler" });
                }
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 400:
                            setPollStatus({ state: ERROR, info: "Fehler in der JSON gefunden!" });
                            break;
                        case 404:
                            if(!error.response.data){
                                setPollStatus({ state: ERROR, info: "Keine Verbindung" });
                            } else {
                                setPollStatus({ state: ERROR, info: "Administrator nicht gefunden" });
                            }
                            break;
                        case 500:
                            console.error('Server Error:', error.response.data.message);
                            break;
                        default:
                            setPollStatus({ state: ERROR, info: "Unerwarteter Fehler" });
                    }
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error:', error.message);
                }
            }
        }
    }, [json, admin_id]);

    useEffect(() => {
        fetchUmfrage();
    }, [fetchUmfrage]);

    return { pollStatus };
};
