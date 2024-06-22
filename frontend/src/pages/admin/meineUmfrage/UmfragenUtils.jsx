import axiosInstance from '../../../axios/axiosConfig'

export const umfragenArchivieren = (
    selectedIds,
    setSelectedIds,
    getData,
    setData
) => {
    const newUmfragen = getData.umfragen.filter(
        (umfrage) => !selectedIds.includes(umfrage.id)
    )

    selectedIds.forEach((id) => {
        axiosInstance
            .get(`/umfrage/archive/${id}`)
            .then((r) => {
                if (r.status === 200) {
                    console.log(`Umfrage mit ID ${id} erfolgreich archiviert`)
                    setData({ umfragen: newUmfragen })
                }
            })
            .finally(() => {
                setSelectedIds([])
            })
    })
}

export const umfragenLöschen = (
    selectedIds,
    setSelectedIds,
    getData,
    setData
) => {
    const newUmfragen = getData.umfragen.filter(
        (umfrage) => !selectedIds.includes(umfrage.id)
    )

    selectedIds.forEach((id) => {
        axiosInstance
            .delete(`/umfrage/delete/${id}`)
            .then((r) => {
                if (r.status === 200) {
                    console.log(`Umfrage mit ID ${id} erfolgreich gelöscht`)
                    setData({ umfragen: newUmfragen })
                }
            })
            .finally(() => {
                setSelectedIds([])
            })
    })
}

export const handleCheckboxChange = (
    event,
    id,
    selectedIds,
    setSelectedIds
) => {
    if (event.target.checked) {
        setSelectedIds([...selectedIds, id])
    } else {
        setSelectedIds(selectedIds.filter((item) => item !== id))
    }
}

export const checkData = (table, data) => {
    if (table === 'umfragen') {
        return (
            data &&
            data.umfragen &&
            data.umfragen.filter(
                (umfrage) => umfrage.archivierungsdatum === null
            ).length > 0
        )
    } else if (table === 'archive') {
        return (
            data &&
            data.umfragen &&
            data.umfragen.filter(
                (umfrage) => umfrage.archivierungsdatum !== null
            ).length > 0
        )
    }
}
