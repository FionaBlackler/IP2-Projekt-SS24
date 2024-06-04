import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/login/Login.jsx'
import Register from '../pages/register/Register.jsx'
import ProtectedRoute from './protected.route.jsx'
import Homepage from '../pages/home/Homepage.jsx'
import SurveyList from "../pages/user-view/SurveyList.jsx";

function RootRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/*<Route path="/" element={<ProtectedRoute component={Dashboard} />} />*/}
                <Route path="/" element={<ProtectedRoute component={Homepage} />} />
                <Route exact={true} path="/login" element={<Login />} />
                <Route exact={true} path="/register" element={<Register />} />
                <Route path="/surveys" element={<SurveyList />} />

            </Routes>
        </BrowserRouter>
    )
}

export default RootRoutes