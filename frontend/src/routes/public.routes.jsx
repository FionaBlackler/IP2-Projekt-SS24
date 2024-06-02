import { Route, Routes } from 'react-router-dom'
import Login from '../pages/login/Login.jsx'

const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="login/*" element={<Login />} />
        </Routes>
    )
}

export default PublicRoutes
