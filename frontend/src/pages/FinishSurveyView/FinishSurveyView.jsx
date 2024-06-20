import { Link } from 'react-router-dom'
import { Button, Result } from 'antd'
import './finishSurveyView.scss'
import { useSelector } from 'react-redux'

const FinishSurveyView = () => {
    const { data } = useSelector((state) => state.surveyAnswersSave)
    console.log('data in FinishSurveyView: ', data)

    const renderAnswers = () => {
        if (!data || Object.keys(data).length === 0) {
            return (
                <div className="no-data-container">
                    <p>No survey data available.</p>
                </div>
            );
        }

        return Object.keys(data).map(questionId => (
            <div key={questionId} className="question-container">
                <h3>Question {questionId}</h3>
                <ul>
                    {data[questionId].map(answer => (
                        <li key={answer.id}>
                            {answer.text}
                            {answer.isSelected ? (
                                answer.isAnswerCorrect ? <span className="correct-answer"> (Correct)</span> : <span className="wrong-answer"> (Incorrect)</span>
                            ) : (
                                <span className="not-selected"> (Not selected)</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        ));
    };

    return (
        <div className="finish-survey-view-container">
            <Result
                status="success"
                title="Geschafft!"
                subTitle="Thank you for wasting your time on this survey!"
                extra={[
                    <Button type="primary" key="homepage">
                        <Link to="/">Go To Homepage</Link>
                    </Button>,
                    <Button key="surveys">
                        <Link to="/">Join Another Survey</Link>
                    </Button>
                ]}
            />
            <div className="survey-results">
                {renderAnswers()}
            </div>
        </div>
    )
}

export default FinishSurveyView;
