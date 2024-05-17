import { Route, Routes, Navigate } from 'react-router-dom'
import AdminRoutes from '../pages/admin/admin.routes.jsx'

const ProtectedRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/admin" />}
            />
            <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
    )
}

export default ProtectedRoutes