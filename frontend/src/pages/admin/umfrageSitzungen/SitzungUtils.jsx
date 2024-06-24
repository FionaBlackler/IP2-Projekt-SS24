import axiosInstance from '../../../axios/axiosConfig'


// Funktion zum Löschen einer Sitzung
export const  sitzungenLöschen =  (selectedIds, setSelectedIds, getData, setData) => {

    const newSitzungen = getData.sitzungen.filter((sitzung) => !selectedIds.includes(sitzung.id));  //update table after delete
    setData({ sitzungen: newSitzungen });

    selectedIds.forEach((id) => {
        axiosInstance
            .delete(`sitzung/delete/${id}`)
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