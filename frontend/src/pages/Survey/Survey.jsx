import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './survey.scss'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSurveyData, saveQuestionAnswers, saveSurveyScores } from '../../redux/actions/surveyActions.js'
import { LeftOutlined } from '@ant-design/icons'
import Question from '../../components/Question/Question.jsx'
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal.jsx'

const umfrageId = '2'
const sitzungId = '1'

const Survey = () => {
    const [selections, setSelections] = useState({})
    const [lockedQuestions, setLockedQuestions] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [scores, setScores] = useState({})
    const [maxScore, setMaxScore] = useState(0)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { data, isLoading } = useSelector((state) => state.surveyDetails)

    useEffect(() => {
        dispatch(fetchSurveyData(umfrageId))
    }, [dispatch])

    useEffect(() => {
        if (data && data.fragen) {
            let max = 0;
            data.fragen.forEach(frage => {
                max += frage.punktzahl;
            });
            setMaxScore(max);
        }
    }, [data]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!data || !data.fragen) {
        return <div>Error: Failed to fetch survey data</div>
    }

    const handleAnswerSelection = (questionId, updatedSelections) => {
        setSelections(prevSelections => ({
            ...prevSelections,
            [questionId]: updatedSelections
        }))
    }

    const handleQuestionSubmit = (questionId) => {
        setLockedQuestions(prevLocked => ({
            ...prevLocked,
            [questionId]: true
        }))

        const selectedOptions = selections[questionId]
        let isQuestionCorrect = true

        selectedOptions.forEach(option => {
            if (option.isSelected && !option.isAnswerCorrect) {
                isQuestionCorrect = false
            }
        })

        const score = isQuestionCorrect ? data.fragen.find(frage => frage.id === questionId).punktzahl : 0

        setScores((prevScores) => ({
            ...prevScores,
            [questionId]: score
        }))

        const currentSelection = {
            antworten: selections[questionId].map(selection => ({
                antwort_id: selection.id,
                gewaehlteAntwort: selection.isSelected
            }))
        }

        dispatch(saveQuestionAnswers(sitzungId, currentSelection))
    }

    const confirmSubmit = () => {
        setIsModalOpen(false)
        dispatch(saveSurveyScores(calculateTotalScore(), maxScore))
        navigate('/finish-survey')
    }

    const submitSurvey = () => {
        const totalQuestions = data.fragen.length
        const answeredQuestionsCount = Object.keys(lockedQuestions).length

        if (answeredQuestionsCount < totalQuestions) {
            setIsModalOpen(true)
        } else {
            confirmSubmit()
        }
    }

    const calculateTotalScore = () => {
        let totalScore = 0
        Object.keys(scores).forEach((questionId) => {
            totalScore += scores[questionId]
        })
        return totalScore
    }

    const totalQuestions = data.fragen.length
    const answeredQuestionsCount = Object.keys(lockedQuestions).length
    const progress = (answeredQuestionsCount / totalQuestions) * 100
    const progressText = `${answeredQuestionsCount} von ${totalQuestions} beantwortet`

    return (
        <div className="survey-container">
            <header className="survey-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <LeftOutlined /> Zurück zur letzten Seite
                </button>
                <h1>Umfrage {umfrageId}</h1>
            </header>

            <div className="survey-content">
                <div className="survey-questions">
                    {data.fragen.map((frage) => {
                        return (
                            <Question
                                key={frage.id}
                                number={frage.id}
                                text={frage.text}
                                options={frage.antwort_optionen}
                                score={frage.punktzahl}
                                questionType={frage.typ_id}
                                onAnswerSelect={(updatedSelections) => {
                                    handleAnswerSelection(frage.id, updatedSelections)
                                }}
                                isLocked={lockedQuestions[frage.id] || false}
                                onSubmit={() => handleQuestionSubmit(frage.id)}
                            />
                        )
                    })}
                </div>
            </div>
            <div className="survey-footer">
                <button
                    onClick={submitSurvey}
                    className="submit-button"
                >
                    Fertig
                </button>
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                <div className="progress-text">{progressText}</div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmSubmit}
                title="Don't leave us yet!"
                content={`You have answered ${answeredQuestionsCount} out of ${totalQuestions} questions. Do you want to submit anyway?`}
            />
        </div>
    )
}

export default Survey
