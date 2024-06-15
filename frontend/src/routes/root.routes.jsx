import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/login/Login.jsx'
import ChangePassword from '../pages/password/changePassword/ChangePassword.jsx'
import DeleteAccount from '../pages/admin/DeleteAccount.jsx'
import ForgotPassword from '../pages/password/forgotPassword/ForgotPassword.jsx'
import SetPassword from '../pages/password/forgotPassword/SetPassword.jsx'
import Register from '../pages/register/Register.jsx'
import Umfrage from '../pages/admin/meineUmfrage/Umfrage.jsx'
import ProtectedRoute from './protected.route.jsx'
import Homepage from '../pages/home/Homepage.jsx'
import MeineUmfragen from '../pages/admin/meineUmfrage/MeineUmfragen.jsx'
import UmfrageSitzungen from '../pages/admin/umfrageSitzungen/UmfrageSizungen.jsx'
import StaticUmfrageSitzungen from '../pages/admin/staticUmfrageSitzungen/StaticUmfrageSitzungen.jsx'
import SitzungenResults from '../pages/admin/umfrageSitzungen/Results.jsx'

function RootRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<ProtectedRoute component={Homepage} />}
                />
                <Route
                    path="/meineUmfragen"
                    element={<ProtectedRoute component={MeineUmfragen} />}
                />

                <Route exact={true} path="/dashboard/static/:umfrageId" element={<StaticUmfrageSitzungen />} />  {/* statistische daten zum testen */}
                <Route path="/dashboard/:umfrageId" element={<ProtectedRoute component={UmfrageSitzungen}/>} />
                <Route path="/sitzung/:ids/results" element={<ProtectedRoute component={SitzungenResults} />} />

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
