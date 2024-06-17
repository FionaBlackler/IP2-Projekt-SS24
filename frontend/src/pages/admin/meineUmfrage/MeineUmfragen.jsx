import AdminLayout from '../../../layouts/AdminLayout.jsx'
import Umfrage from './Umfrage.jsx'

export default function MeineUmfragen() {
    return (
        <div className=''>
            <AdminLayout children={<Umfrage />} />
        </div>
    )
}
