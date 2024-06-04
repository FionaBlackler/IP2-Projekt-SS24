import PropTypes from 'prop-types';
import {useState} from "react";

const Question = () => {

    const [number, setNumber] = useState(0);
    const [text, setText] = useState('');
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);



    return (
        <div className="question-container">
            {/* Header */}
            <div className="question-header">
                <div className="question-number">Frage {number}</div>
                <div className="question-score">Punktzahl: {score}</div>
            </div>
            {/* Frage */}
            <div className="question-text">{text}</div>
            {/* Antwortmöglichkeiten */}
            <div className="question-options">
                {options.map((option, index) => (
                    <div key={index} className="option">{option}</div>
                ))}
            </div>
        </div>
    );
};

Question.propTypes = {
    number: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    score: PropTypes.number.isRequired,
};

export default Question;
