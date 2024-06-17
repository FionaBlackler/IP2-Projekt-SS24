import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './survey.scss'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSurveyData, saveSurveyAnswers } from '../../redux/actions/surveyActions.js'
import { EyeInvisibleOutlined, EyeOutlined, LeftOutlined } from '@ant-design/icons'
import Question from '../../components/question/Question.jsx'

const umfrageId = '1'
const sitzungId = '1'

const Survey = () => {
    const [selections, setSelections] = useState({})
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [isScreenReaderMode, setIsScreenReaderMode] = useState(false)
    const [lockedQuestions, setLockedQuestions] = useState({})
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { data, isLoading } = useSelector((state) => state.surveyDetails)

    console.log('data: ', data)

    useEffect(() => {
        console.log('Fetching survey data...')
        dispatch(fetchSurveyData(umfrageId))
    }, [dispatch])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!data || !data.fragen) {
        return <div>Error: Failed to fetch survey data</div>
    }

    const handleAnswerSelection = (questionId, updatedSelections) => {
        console.log('questionId:', questionId)
        console.log('updatedSelections asd:', updatedSelections)
        setSelections(prevSelections => ({
            ...prevSelections,
            [questionId]: updatedSelections.map(updatedSelection => ({
                    antwort_id: updatedSelection.id,
                    gewaehlteAntwort: updatedSelection.isAnswerCorrect
                })
            )
        }))

        if (isScreenReaderMode && currentQuestionIndex < data.fragen.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    const handleQuestionSubmit = (questionId) => {
        setLockedQuestions(prevLocked => ({
            ...prevLocked,
            [questionId]: true
        }))

        const currentSelection = {
            antworten: selections[questionId]
        }

        dispatch(saveSurveyAnswers(sitzungId, currentSelection))
    }


    const submitSurvey = () => {
        // console.log("selections in submit: ", selections)
        //
        // const antworten = Object.entries(selections).map(([questionId, selection]) => ({
        //     antwort_id: questionId,
        //     ist_richtig: selection.points > 0
        // }))
        //
        // dispatch(saveSurveyAnswers(sitzungId, antworten))
        // toast.success('☑ Umfrage erfolgreich abgeschickt!')
        // navigate('/ok')
    }

    const totalQuestions = data.fragen.length
    const answeredQuestionsCount = Object.keys(selections).length
    const progress = (answeredQuestionsCount / totalQuestions) * 100
    const progressText = `${answeredQuestionsCount} von ${totalQuestions} beantwortet`

    const toggleMode = () => {
        setIsScreenReaderMode(!isScreenReaderMode)
        if (!isScreenReaderMode) setCurrentQuestionIndex(0)
    }

    return (
        <div className="survey-container">
            <header className="survey-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <LeftOutlined /> Zurück zur letzten Seite
                </button>
                <h1>Umfrage</h1>
                <button onClick={toggleMode} className="toggle-mode-button">
                    {isScreenReaderMode ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    {isScreenReaderMode ? ' Normale Ansicht' : ' Bildschirmlesemodus'}
                </button>
            </header>

            <div className="survey-content">
                <div className="survey-questions">
                    {data.fragen.map((frage, index) => {
                        console.log('frage:', frage) // Log the question

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
                                isScreenReaderMode={isScreenReaderMode}
                                index={index}
                                currentQuestionIndex={currentQuestionIndex}
                                isLocked={lockedQuestions[frage.id] || false}
                                onSubmit={() => handleQuestionSubmit(frage.id)}
                            />
                        )
                    })}
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
    )
}

export default Survey