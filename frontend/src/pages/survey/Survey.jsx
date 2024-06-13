import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import "./survey.scss"
import {useDispatch, useSelector} from "react-redux";
import {fetchSurveyData, submitSurveyAnswers} from "../../redux/actions/surveyActions.js";
import {EyeInvisibleOutlined, EyeOutlined, LeftOutlined} from '@ant-design/icons';
import Question from "../user-view/Question.jsx";

const umfrageId = "1"; // For TESTING purposes

const Survey = () => {
    const [selections, setSelections] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data, isLoading } = useSelector((state) => state.surveyDetails);

    console.log("data: ", data)

    const fragen = data?.fragen || [];

    console.log("fragen: ", fragen)

    console.log("selections: ", selections)

    useEffect(() => {
        console.log("Fetching survey data...");
        dispatch(fetchSurveyData(umfrageId));
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data || !data.fragen) {
        return <div>Error: Failed to fetch survey data</div>;
    }

    const handleAnswerSelection = (questionId, selectedAnswer) => {
        setSelections({
            ...selections,
            [questionId]: selectedAnswer
        });

        if (isScreenReaderMode) {
            // Move to the next question if not on the last question
            if (currentQuestionIndex < data.fragen.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }
    };

    const submitSurvey = () => {
        if (Object.keys(selections).length !== data.fragen.length) {
            toast.error("Bitte beantworten Sie alle Fragen.");
            return;
        }

        const antworten = Object.entries(selections).map(([questionId, selectedAnswer]) => ({
            antwort_id: parseInt(questionId, 10),
            gewaehlteAntwort: selectedAnswer
        }));

        dispatch(submitSurveyAnswers(umfrageId, antworten));
        toast.success("☑ Survey submitted successfully!");
        navigate("/ok");
    };

    const totalQuestions = data.fragen.length;
    const answeredQuestionsCount = Object.keys(selections).length;
    const progress = (answeredQuestionsCount / totalQuestions) * 100;
    const progressText = `${answeredQuestionsCount} von ${totalQuestions} beantwortet`;

    const toggleMode = () => {
        setIsScreenReaderMode(!isScreenReaderMode);
        if (!isScreenReaderMode) setCurrentQuestionIndex(0); // Reset to the first question in screen reader mode
    };

    return (
        <div className="survey-container">
            <header className="survey-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <LeftOutlined /> Zurück zur letzten Seite
                </button>
                <h1>Umfrage</h1>
                <button onClick={toggleMode} className="toggle-mode-button">
                    {isScreenReaderMode ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    {isScreenReaderMode ? " Normale Ansicht" : " Bildschirmlesemodus"}
                </button>
            </header>

            <div className="survey-content">
                <div className="survey-questions">
                    {data.fragen.map((frage, index) => (
                        // <div
                        //     key={frage.id}
                        //     className={`survey-question ${isScreenReaderMode && index !== currentQuestionIndex ? 'blurred' : ''}`}
                        // >
                        //     <h2>{frage.text}</h2>
                        //     {frage.antwort_optionen.map((antwort) => (
                        //         <div key={antwort.id}>
                        //             <input
                        //                 type="radio"
                        //                 value={antwort.text}
                        //                 checked={selections[frage.id] === antwort.text}
                        //                 onChange={() => handleAnswerSelection(frage.id, antwort.text)}
                        //             />
                        //             <label>{antwort.text}</label>
                        //         </div>
                        //     ))}
                        // </div>
                        <Question
                            key={frage.id}
                            number={frage.id}
                            text={frage.text}
                            options={frage.antwort_optionen.map(option => option.text)}
                            score={frage.punktzahl}
                            questionType={frage.typ_id}
                            className={`survey-question ${isScreenReaderMode && index !== currentQuestionIndex ? 'blurred' : ''}`}
                        />
                    ))}
                </div>

                <div className="survey-footer">
                    <button
                        onClick={submitSurvey}
                        className="submit-button"
                        disabled={answeredQuestionsCount < totalQuestions}
                    >
                        Fertig
                    </button>
                </div>
            </div>

            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                <div className="progress-text">{progressText}</div>
            </div>
        </div>
    );
}

export default Survey;