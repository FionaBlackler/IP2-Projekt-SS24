import PropTypes from 'prop-types';
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

QuestionHeader.propTypes = {
    number: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
};

export default QuestionHeader;
