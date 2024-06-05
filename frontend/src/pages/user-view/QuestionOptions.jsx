import PropTypes from 'prop-types';
import './QuestionOptions.css';

const QuestionOptions = ({ options }) => {
    return (
        <div className="question-options-container">
            {options.map((option, index) => (
                <div key={index} className="option">
                    <input type="checkbox" id={`option-${index}`} className="option-checkbox" />
                    <label htmlFor={`option-${index}`} className="option-label">{option}</label>
                </div>
            ))}
        </div>
    );
};

QuestionOptions.propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default QuestionOptions;
