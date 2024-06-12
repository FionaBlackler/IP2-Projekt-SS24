import AdminLayout from '../../../layouts/AdminLayout.jsx'
import Sitzung from './Sitzung.jsx'

export default function UmfrageSitzungen() {
    return (
        <div>
            <AdminLayout children={<Sitzung />} />
        </div>
    )
}
