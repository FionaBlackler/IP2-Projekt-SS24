import { Route, Routes } from 'react-router-dom'
import Homepage from './Homepage.jsx'

export default function AdminRoutes() {
    return (
        <Routes>
            <Route index element={<Homepage />} />
            {/*<Route path="something" element={<Something />} />*/}
        </Routes>
    )
}
