import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/login/Login.jsx';
import Register from '../pages/register/Register.jsx';
import ProtectedRoute from './protected.route.jsx';
import Homepage from '../pages/home/Homepage.jsx';
import Survey from "../pages/survey/Survey.jsx";
import BinaryQuestion from "../pages/user-view/BinaryQuestion.jsx";
import Question from "../components/question/Question.jsx";

function RootRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedRoute component={Homepage} />} />
                <Route exact={true} path="/login" element={<Login />} />
                <Route exact={true} path="/register" element={<Register />} />
                <Route path="/test" element={<Survey />} />
                <Route path="/questions/:questionId" element={<Question/>} />
                <Route path="/binary-questions/:questionId" element={<BinaryQuestion/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default RootRoutes;
