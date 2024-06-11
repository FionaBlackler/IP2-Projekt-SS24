import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from '../pages/home/Homepage.jsx'
import Login from '../pages/login/Login.jsx'
import ChangePassword from '../pages/password/changePassword/ChangePassword.jsx'
import DeleteAccount from '../pages/admin/DeleteAccount.jsx'
import ForgotPassword from '../pages/password/forgotPassword/ForgotPassword.jsx'
import SetPassword from '../pages/password/forgotPassword/SetPassword.jsx'
import Register from '../pages/register/Register.jsx'
import ProtectedRoute from './protected.route.jsx'
import Umfrage from '../pages/admin/meineUmfrage/Umfrage.jsx'
import UmfragePopup from '../pages/admin/uploadUmfragePage/UmfragePopup.jsx'

function RootRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Umfrage />} />
                {/*<Route path="/Dashboard/:id" element={<Dashboard/>} />*/}
                <Route exact={true} path="/login" element={<Login />} />
                <Route exact={true} path="/register" element={<Register />} />
                <Route
                    exact={true}
                    path="/changePassword"
                    element={<ChangePassword />}
                />
                <Route
                    exact={true}
                    path="/forgotPassword"
                    element={<ForgotPassword />}
                />
                <Route
                    exact={true}
                    path="/setPassword"
                    element={<SetPassword />}
                />
                <Route
                    exact={true}
                    path="/deleteAccount"
                    element={<DeleteAccount />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default RootRoutes
