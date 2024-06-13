import React, { useState, useEffect } from 'react';
import QuestionHeader from '../questionHeader/QuestionHeader.jsx';
import './QuestionStyle.css';

const Question = ({ number, text, options, score, questionType, onAnswerSelect, isScreenReaderMode, index }) => {
    const [selectedAnswers, setSelectedAnswers] = useState([]);

    useEffect(() => {
        // Initialize selectedAnswers based on options, important for screen reader mode where options might be preselected
        setSelectedAnswers(options.filter(option => option.isSelected).map(option => option.text));
    }, [options]);

    const handleChange = (selectedAnswer) => {
        let points = 0;
        let updatedSelections = [];

        switch (questionType) {
            case 'A':
                const optionIndex = options.findIndex(option => option.text === selectedAnswer);
                points = options[optionIndex].ist_richtig ? score : 0;
                updatedSelections.push({ text: selectedAnswer, isCorrect: options[optionIndex].ist_richtig });
                break;
            case 'P':
                updatedSelections = options.map(option => ({
                    text: option.text,
                    isCorrect: option.ist_richtig,
                    isSelected: selectedAnswer.includes(option.text),
                }));
                points = updatedSelections.reduce((acc, option) => acc + (option.isCorrect && option.isSelected ? 1 : 0), 0);
                break;
            case 'K':
                console.log("options: ", options)
                const isCorrect = selectedAnswer === 'Stimmt zu';
                points = isCorrect ? score : 0;
                updatedSelections.push({ text: selectedAnswer, isCorrect });
                break;
            default:
                break;
        }

        console.log("updatedSelections: ", updatedSelections);
        onAnswerSelect(updatedSelections, points);
    };

    const handleCheckboxChange = (optionText) => {
        console.log("optionText: ", optionText);
        const updatedSelectedAnswers = selectedAnswers.includes(optionText)
            ? selectedAnswers.filter(answer => answer !== optionText)
            : [...selectedAnswers, optionText];
        console.log("updatedSelectedAnswers: ", updatedSelectedAnswers);

        setSelectedAnswers(updatedSelectedAnswers);
        handleChange(updatedSelectedAnswers);
    };

    const renderOptions = () => {
        switch (questionType) {
            case 'A':
                return (
                    <div className="question-options-container">
                        {options.map((option, index) => (
                            <div key={index} className="option">
                                <input
                                    type="radio"
                                    id={`option-${index}`}
                                    name={`question-${number}`}
                                    value={option.text}
                                    onChange={() => handleChange(option.text)}
                                    className="option-checkbox"
                                />
                                <label htmlFor={`option-${index}`} className="option-label">
                                    {option.text}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case 'P':
                return (
                    <div className="question-options-container">
                        {options.map((option, index) => (
                            <div key={index} className="option">
                                <input
                                    type="checkbox"
                                    id={`option-${index}`}
                                    name={`question-${number}`}
                                    value={option.text}
                                    checked={selectedAnswers.includes(option.text)}
                                    onChange={() => handleCheckboxChange(option.text)}
                                    className="option-checkbox"
                                />
                                <label htmlFor={`option-${index}`} className="option-label">
                                    {option.text}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case 'K':
                return (
                    <div className="question-options-container">
                        {options.map((option, index) => (
                            <div key={index} className="checkbox-container">
                                <span className="option-text">{option.text}</span>
                                <div className="checkbox-options">
                                    <input
                                        type="checkbox"
                                        id={`option-${index}-true`}
                                        onChange={() => handleChange('Stimmt zu')}
                                        checked={selectedAnswers.includes('Stimmt zu')}
                                    />
                                    <label htmlFor={`option-${index}-true`} className="checkbox-label">
                                        Stimmt zu
                                    </label>
                                    <input
                                        type="checkbox"
                                        id={`option-${index}-false`}
                                        onChange={() => handleChange('Stimmt nicht zu')}
                                        checked={selectedAnswers.includes('Stimmt nicht zu')}
                                    />
                                    <label htmlFor={`option-${index}-false`} className="checkbox-label">
                                        Stimmt nicht zu
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`survey-question ${isScreenReaderMode && index !== number ? 'blurred' : ''}`}>
            <QuestionHeader number={number} score={score} text={text}/>
            <div className="question-options-container">
                {renderOptions()}
            </div>
        </div>
    );
};

export default Question;
