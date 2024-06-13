import './QuestionHeader.css';

const QuestionHeader = ({ number, score, text }) => {
    return (
        <div className="question-header-container">
            <div className="question-header">
                <div className="question-number">Frage {number}</div>
                <div className="question-score">{score} Punkt</div>
            </div>
            <div className="question-text">{text}</div>
        </div>
    );
};

export default QuestionHeader;
