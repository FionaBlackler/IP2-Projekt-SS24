import QuestionHeader from './QuestionHeader';
import './QuestionStyle.css';

const Question = ({ number, text, options, score, questionType, onAnswerSelect, isScreenReaderMode, index }) => {
    const handleChange = (selectedAnswer) => {
        onAnswerSelect(number, selectedAnswer);
    };

    const renderOptions = () => {
        if (questionType === "A" || questionType === "P") {
            return (
                <div className="question-options-container">
                    {options.map((option, index) => (
                        <div key={index} className="option">
                            <input
                                type="radio"
                                id={`option-${index}`}
                                name={`question-${number}`}
                                value={option}
                                onChange={() => handleChange(option)}
                                className="option-checkbox"
                            />
                            <label htmlFor={`option-${index}`} className="option-label">{option}</label>
                        </div>
                    ))}
                </div>
            );
        } else if (questionType === "K") {
            return (
                <div className="question-options-container">
                    {options.map((option, index) => (
                        <div key={index} style={{ marginTop: '20px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#333', borderRadius: '5px' }}>
                            <span style={{ marginRight: '10px', flex: '1', color: '#fff' }}>{option}</span>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input type="checkbox" id={`option-${index}-true`} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                <label htmlFor={`option-${index}-true`} style={{ backgroundColor: '#5cb85c', color: '#fff', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Zutreffend</label>
                                <input type="checkbox" id={`option-${index}-false`} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                <label htmlFor={`option-${index}-false`} style={{ backgroundColor: '#d9534f', color: '#fff', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Nicht Zutreffend</label>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className={`survey-question ${isScreenReaderMode && index !== 0 ? 'blurred' : ''}`}>
            <QuestionHeader number={number} score={score} text={text} />
            <div className="question-options-container">
                {renderOptions()}
            </div>
        </div>
    );
};

export default Question;
