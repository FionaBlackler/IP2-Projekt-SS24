import AdminLayout from '../../../layouts/AdminLayout.jsx'
import Umfrage from './Umfrage.jsx'

export default function MeineUmfragen() {
    return (
        <div data-testid="admin" >
            <AdminLayout>
                <div data-testid="umfrage" className='h-full relative overflow-hidden  pb-4  bg-[#AF8A74] '>
               <Umfrage />
            
                          </div>
            </AdminLayout>
        </div>
    )
}
