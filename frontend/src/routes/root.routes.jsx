import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/login/Login.jsx'
import Register from '../pages/register/Register.jsx'
import ProtectedRoute from './protected.route.jsx'
import Homepage from '../pages/home/Homepage.jsx'
import Umfrage from '../pages/admin/meineUmfrage/Umfrage.jsx'
import UmfragePopup from '../pages/admin/uploadUmfragePage/UmfragePopup.jsx'

function RootRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Umfrage />}
                />
               {/*<Route path="/Dashboard/:id" element={<Dashboard/>} />*/} 
                <Route exact={true} path="/login" element={<Login />} />
                <Route exact={true} path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RootRoutes
