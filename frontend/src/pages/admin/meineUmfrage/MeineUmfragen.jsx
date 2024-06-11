import AdminLayout from '../../../layouts/AdminLayout.jsx'
import Umfrage from './Umfrage.jsx'

export default function MeineUmfragen() {
    return (
        <div>
            <AdminLayout children={<Umfrage />} />
        </div>
    )
}
