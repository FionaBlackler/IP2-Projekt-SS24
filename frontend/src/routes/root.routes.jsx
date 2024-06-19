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
import Survey from '../pages/Survey/Survey.jsx'
import Question from '../components/Question/Question.jsx'
import FocusExample from '../components/FocusExample.jsx'
import FinishSurveyView from '../pages/FinishSurveyView/FinishSurveyView.jsx'
import MeineUmfragen from '../pages/admin/meineUmfrage/MeineUmfragen.jsx'
import Survey from '../pages/Survey/Survey.jsx'
import FinishSurveyView from '../pages/FinishSurveyView/FinishSurveyView.jsx'

function RootRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/test" element={<Survey />} />
                <Route path="/finish-survey" element={<FinishSurveyView />} />
                <Route path="/questions/:questionId" element={<Question />} />
                <Route path="/focus" element={<FocusExample />} />
                <Route
                    path="/"
                    element={<ProtectedRoute component={Homepage} />}
                />
                <Route
                    path="/meineUmfragen"
                    element={<ProtectedRoute component={MeineUmfragen} />}
                />
                <Route exact={true} path="/login" element={<Login />} />
                <Route exact={true} path="/register" element={<Register />} />
                <Route
                    exact={true}
                    path="/changePassword"
                    element={<ChangePassword />}
                />
                <Route
                    exact={true}
                    path="/umfrage/:id"
                    element={<Survey />}
                />
                <Route
                    exact={true}
                    path="/finish-survey"
                    element={<FinishSurveyView />}
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
