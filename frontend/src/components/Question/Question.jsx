import { useState, useEffect } from 'react';
import QuestionHeader from '../QuestionHeader/QuestionHeader.jsx';
import './question.scss';

const Question = ({
                      number,
                      text,
                      options,
                      score,
                      questionType,
                      onAnswerSelect,
                      isScreenReaderMode,
                      index,
                      isLocked,
                      onSubmit
                  }) => {
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setSelectedAnswers(options.filter(option => option.isSelected).map(option => option.id));
    }, [options]);

    const handleChange = (selectedOptionIds) => {
        let updatedSelections = [];

        switch (questionType) {
            case 'A':
                updatedSelections = options.map(option => {
                    const isSelected = selectedOptionIds.includes(option.id);
                    const isCorrect = option.ist_richtig;
                    const isAnswerCorrect = isSelected && isCorrect;
                    return {
                        id: option.id,
                        text: option.text,
                        isCorrect: isCorrect,
                        isSelected: isSelected,
                        isAnswerCorrect: isAnswerCorrect
                    };
                });
                break;
            case 'P':
                updatedSelections = options.map(option => {
                    const isSelected = selectedOptionIds.includes(option.id);
                    const isCorrect = option.ist_richtig;
                    const isAnswerCorrect = isSelected && isCorrect;
                    return {
                        id: option.id,
                        text: option.text,
                        isCorrect: isCorrect,
                        isSelected: isSelected,
                        isAnswerCorrect: isAnswerCorrect
                    };
                });
                break;
            case 'K':
                updatedSelections = options.map(option => {
                    const isTrueSelected = selectedOptionIds.includes(`${option.id}-true`);
                    const isFalseSelected = selectedOptionIds.includes(`${option.id}-false`);
                    const isCorrect = option.ist_richtig;
                    const userAnswer = isTrueSelected ? true : isFalseSelected ? false : null;
                    const isAnswerCorrect = userAnswer === isCorrect;
                    return {
                        id: option.id,
                        text: option.text,
                        isCorrect: isCorrect,
                        isSelected: userAnswer,
                        isAnswerCorrect: isAnswerCorrect
                    };
                });
                break;
            default:
                break;
        }

        onAnswerSelect(updatedSelections);
    };

    const handleRadioChange = (optionId) => {
        setSelectedAnswers([optionId]);
        handleChange([optionId]);
    };

    const handleCheckboxChangeForP = (optionId) => {
        const updatedSelectedAnswers = selectedAnswers.includes(optionId) ? selectedAnswers.filter(id => id !== optionId) : [...selectedAnswers, optionId];

        setSelectedAnswers(updatedSelectedAnswers);
        handleChange(updatedSelectedAnswers);
    };

    const handleCheckboxChangeForK = (optionId, isTrueSelected) => {
        let updatedSelectedAnswers = [...selectedAnswers];

        if (isTrueSelected) {
            if (updatedSelectedAnswers.includes(`${optionId}-false`)) {
                updatedSelectedAnswers = updatedSelectedAnswers.filter(id => id !== `${optionId}-false`);
            }
            updatedSelectedAnswers = updatedSelectedAnswers.includes(`${optionId}-true`) ? updatedSelectedAnswers.filter(id => id !== `${optionId}-true`) : [...updatedSelectedAnswers, `${optionId}-true`];
        } else {
            if (updatedSelectedAnswers.includes(`${optionId}-true`)) {
                updatedSelectedAnswers = updatedSelectedAnswers.filter(id => id !== `${optionId}-true`);
            }
            updatedSelectedAnswers = updatedSelectedAnswers.includes(`${optionId}-false`) ? updatedSelectedAnswers.filter(id => id !== `${optionId}-false`) : [...updatedSelectedAnswers, `${optionId}-false`];
        }

        setSelectedAnswers(updatedSelectedAnswers);
        handleChange(updatedSelectedAnswers);
    };

    const renderOptions = () => {
        switch (questionType) {
            case 'A':
                return (
                    <div className="question-options-container">
                        {options.map((option) => (
                            <div
                                key={option.id}
                                className={`option ${selectedAnswers.includes(option.id) ? 'selected' : ''} ${submitted ? (option.ist_richtig ? 'correct' : 'incorrect') : ''}`}
                            >
                                <input
                                    type="radio"
                                    id={`option-${option.id}`}
                                    name={`question-${number}`}
                                    value={option.text}
                                    onChange={() => handleRadioChange(option.id)}
                                    disabled={isLocked}
                                    className="option-checkbox"
                                />
                                <label htmlFor={`option-${option.id}`} className="option-label">
                                    {option.text}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case 'P':
                return (
                    <div className="question-options-container">
                        {options.map((option) => (
                            <div
                                key={option.id}
                                className={`option ${selectedAnswers.includes(option.id) ? 'selected' : ''} ${submitted ? (option.ist_richtig ? 'correct' : 'incorrect') : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    id={`option-${option.id}`}
                                    name={`question-${number}`}
                                    value={option.text}
                                    checked={selectedAnswers.includes(option.id)}
                                    onChange={() => handleCheckboxChangeForP(option.id)}
                                    disabled={isLocked}
                                    className="option-checkbox"
                                />
                                <label htmlFor={`option-${option.id}`} className="option-label">
                                    {option.text}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case 'K':
                return (
                    <div className="question-options-container">
                        {options.map((option) => (
                            <div key={option.id} className={`label-container ${submitted ? (option.isAnswerCorrect ? 'correct' : 'incorrect') : ''}`}>
                                <label className="label-text">{option.text}</label>
                                <div className="checkbox-options">
                                    <div className={`option ${selectedAnswers.includes(`${option.id}-true`) ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            id={`true-${option.id}`}
                                            name={`question-${number}-${option.id}`}
                                            checked={selectedAnswers.includes(`${option.id}-true`)}
                                            onChange={() => handleCheckboxChangeForK(option.id, true)}
                                            disabled={isLocked}
                                            className="checkbox-left"
                                        />
                                        <label htmlFor={`true-${option.id}`}>true</label>
                                    </div>
                                    <div className={`option ${selectedAnswers.includes(`${option.id}-false`) ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            id={`false-${option.id}`}
                                            name={`question-${number}-${option.id}`}
                                            checked={selectedAnswers.includes(`${option.id}-false`)}
                                            onChange={() => handleCheckboxChangeForK(option.id, false)}
                                            disabled={isLocked}
                                            className="checkbox-right"
                                        />
                                        <label htmlFor={`false-${option.id}`}>false</label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        onSubmit(selectedAnswers);
    };

    return (
        <div className="question-container">
            <QuestionHeader
                number={number}
                text={text}
                score={score}
                isScreenReaderMode={isScreenReaderMode}
                index={index}
            />
            {renderOptions()}
            <div className="submit-container">
                <button onClick={handleSubmit} className="submit-question-button" disabled={isLocked}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Question;
