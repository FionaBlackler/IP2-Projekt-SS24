import AdminLayout from '../../../layouts/AdminLayout.jsx'
import StaticSitzung from './StaticSitzung.jsx'

export default function StaticUmfrageSitzungen() {
    return (
        <div>
            <AdminLayout children={<StaticSitzung />} />
        </div>
    )
}
