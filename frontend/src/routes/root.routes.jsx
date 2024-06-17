import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/login/Login.jsx'
import Register from '../pages/register/Register.jsx'
import ProtectedRoute from './protected.route.jsx'
import Homepage from '../pages/home/Homepage.jsx'
import Survey from '../pages/Survey/Survey.jsx'
import Question from '../components/Question/Question.jsx'
import FocusExample from '../components/FocusExample.jsx'
import FinishSurveyView from '../pages/FinishSurveyView/FinishSurveyView.jsx'

function RootRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedRoute component={Homepage} />} />
                <Route exact={true} path="/login" element={<Login />} />
                <Route exact={true} path="/register" element={<Register />} />
                <Route path="/test" element={<Survey />} />
                <Route path="/finish-survey" element={<FinishSurveyView />} />
                <Route path="/questions/:questionId" element={<Question />} />
                <Route path="/focus" element={<FocusExample />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RootRoutes
