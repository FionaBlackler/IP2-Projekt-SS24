import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import "./survey.scss"
import {useDispatch, useSelector} from "react-redux";
import {fetchSurveyData, saveSurveyAnswers, submitSurveyAnswers} from "../../redux/actions/surveyActions.js";
import {EyeInvisibleOutlined, EyeOutlined, LeftOutlined} from '@ant-design/icons';
import Question from "../../components/question/Question.jsx";

const umfrageId = "1"; // For TESTING purposes
const sitzungId = "1"; // For TESTING purposes

const Survey = () => {
    const [selections, setSelections] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data, isLoading } = useSelector((state) => state.surveyDetails);

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

    const handleAnswerSelection = (questionId, selectedAnswer, questionType, points) => {
        let updatedSelections = selections[questionId] ? { ...selections[questionId] } : { points: 0 };

        switch (questionType) {
            case 'A':
                updatedSelections = {
                    selectedAnswer,
                    points: points,
                };
                break;
            case 'P':
                const selectedOption = updatedSelections.selectedAnswer ? updatedSelections.selectedAnswer.find(option => option.text === selectedAnswer.text) : null;

                if (selectedOption) {
                    selectedOption.isSelected = !selectedOption.isSelected;
                } else {
                    if (!updatedSelections.selectedAnswer) updatedSelections.selectedAnswer = [];
                    updatedSelections.selectedAnswer.push({ ...selectedAnswer, isSelected: true });
                }

                updatedSelections.points = points;
                break;
            case 'K':
                updatedSelections = {
                    selectedAnswer,
                    points: points,
                };
                break;
            default:
                break;
        }

        setSelections({
            ...selections,
            [questionId]: updatedSelections,
        });

        if (isScreenReaderMode) {
            if (currentQuestionIndex < data.fragen.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }
    };

    const submitSurvey = () => {
        if (Object.keys(selections).length !== data.fragen.length) {
            toast.error('Bitte beantworten Sie alle Fragen.');
            return;
        }

        const antworten = Object.entries(selections).map(([questionId, selection]) => ({
            antwort_id: questionId,
            ist_richtig: selection.points > 0, // Check if the answer has any points
        }));

        dispatch(saveSurveyAnswers(sitzungId, antworten));
        toast.success('☑ Umfrage erfolgreich abgeschickt!');
        navigate('/ok');
    };

    const totalQuestions = data.fragen.length;
    const answeredQuestionsCount = Object.keys(selections).length;
    const progress = (answeredQuestionsCount / totalQuestions) * 100;
    const progressText = `${answeredQuestionsCount} von ${totalQuestions} beantwortet`;

    const toggleMode = () => {
        setIsScreenReaderMode(!isScreenReaderMode);
        if (!isScreenReaderMode) setCurrentQuestionIndex(0);
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
                        <Question
                            key={frage.id}
                            number={frage.id}
                            text={frage.text}
                            options={frage.antwort_optionen}
                            score={frage.punktzahl}
                            questionType={frage.typ_id}
                            onAnswerSelect={(selectedAnswer, points) => {
                                console.log("selectedAnswer:", selectedAnswer);
                                console.log("points:", points);
                                handleAnswerSelection(frage.id, selectedAnswer, frage.typ_id, points);
                            }}
                            isScreenReaderMode={isScreenReaderMode}
                            index={index}
                            currentQuestionIndex={currentQuestionIndex}
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