import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedLayout from '../layouts/ProtectedLayout.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import Login from '../pages/login/Login.jsx'

function RootRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="*"
                    element={
                        <RequireAuth>
                            <ProtectedLayout />
                        </RequireAuth>
                    }
                />
                <Route path="/public/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RootRoutes