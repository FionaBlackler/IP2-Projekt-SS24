import { useState, useEffect } from 'react'
import QuestionHeader from '../questionHeader/QuestionHeader.jsx'
import './question.scss'

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
                      onSubmit,
                  }) => {
    const [selectedAnswers, setSelectedAnswers] = useState([])
    console.log('index passed: ', index)
    console.log("number: ", number)
    console.log("isLocked: ", isLocked)

    useEffect(() => {
        setSelectedAnswers(options.filter(option => option.isSelected).map(option => option.id))
    }, [options])

    const handleChange = (selectedOptionIds) => {
        let updatedSelections = []

        switch (questionType) {
            case 'A':
                updatedSelections = options.map(option => {
                    const isSelected = selectedOptionIds.includes(option.id)
                    const isCorrect = option.ist_richtig
                    const isAnswerCorrect = isSelected && isCorrect
                    return {
                        id: option.id,
                        text: option.text,
                        isCorrect: isCorrect,
                        isSelected: isSelected,
                        isAnswerCorrect: isAnswerCorrect
                    }
                })
                break
            case 'P':
                updatedSelections = options.map(option => {
                    const isSelected = selectedOptionIds.includes(option.id)
                    const isCorrect = option.ist_richtig
                    const isAnswerCorrect = isSelected && isCorrect
                    return {
                        id: option.id,
                        text: option.text,
                        isCorrect: isCorrect,
                        isSelected: isSelected,
                        isAnswerCorrect: isAnswerCorrect
                    }
                })
                break
            case 'K':
                updatedSelections = options.map(option => {
                    const isTrueSelected = selectedOptionIds.includes(`${option.id}-true`)
                    const isFalseSelected = selectedOptionIds.includes(`${option.id}-false`)
                    const isCorrect = option.ist_richtig
                    const userAnswer = isTrueSelected ? true : isFalseSelected ? false : null
                    const isAnswerCorrect = userAnswer === isCorrect
                    return {
                        id: option.id,
                        text: option.text,
                        isCorrect: isCorrect,
                        isSelected: userAnswer,
                        isAnswerCorrect: isAnswerCorrect
                    }
                })
                break
            default:
                break
        }

        onAnswerSelect(updatedSelections)
    }

    const handleRadioChange = (optionId) => {
        setSelectedAnswers([optionId])
        handleChange([optionId])
    }

    const handleCheckboxChangeForP = (optionId) => {
        const updatedSelectedAnswers = selectedAnswers.includes(optionId) ? selectedAnswers.filter(id => id !== optionId) : [...selectedAnswers, optionId]

        setSelectedAnswers(updatedSelectedAnswers)
        handleChange(updatedSelectedAnswers)
    }

    const handleCheckboxChangeForK = (optionId, isTrueSelected) => {
        let updatedSelectedAnswers = [...selectedAnswers]

        if (isTrueSelected) {
            if (updatedSelectedAnswers.includes(`${optionId}-false`)) {
                updatedSelectedAnswers = updatedSelectedAnswers.filter(id => id !== `${optionId}-false`)
            }
            updatedSelectedAnswers = updatedSelectedAnswers.includes(`${optionId}-true`) ? updatedSelectedAnswers.filter(id => id !== `${optionId}-true`) : [...updatedSelectedAnswers, `${optionId}-true`]
        } else {
            if (updatedSelectedAnswers.includes(`${optionId}-true`)) {
                updatedSelectedAnswers = updatedSelectedAnswers.filter(id => id !== `${optionId}-true`)
            }
            updatedSelectedAnswers = updatedSelectedAnswers.includes(`${optionId}-false`) ? updatedSelectedAnswers.filter(id => id !== `${optionId}-false`) : [...updatedSelectedAnswers, `${optionId}-false`]
        }

        setSelectedAnswers(updatedSelectedAnswers)
        handleChange(updatedSelectedAnswers)
    }

    const renderOptions = () => {
        switch (questionType) {
            case 'A':
                return (<div className="question-options-container">
                    {options.map((option) => (<div key={option.id} className="option">
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
                    </div>))}
                </div>)
            case 'P':
                return (<div className="question-options-container">
                    {options.map((option) => (<div key={option.id} className="option">
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
                    </div>))}
                </div>)
            case 'K':
                return (<div className="question-options-container">
                    <div className="label-container">
                        <span className="label-text">Zutreffend</span>
                        <span className="label-text">Nicht Zutreffend</span>
                    </div>
                    {options.map((option) => (
                        <div key={option.id} className="checkbox-container">
                            <div className="option-text-container">
                                <span className="option-text">{option.text}</span>
                            </div>
                            <fieldset className="checkbox-options">
                                <input
                                    type="checkbox"
                                    id={`option-${option.id}-true`}
                                    onChange={() => handleCheckboxChangeForK(option.id, true)}
                                    checked={selectedAnswers.includes(`${option.id}-true`)}
                                    disabled={isLocked}
                                    className="checkbox-left"
                                />
                                <input
                                    type="checkbox"
                                    id={`option-${option.id}-false`}
                                    onChange={() => handleCheckboxChangeForK(option.id, false)}
                                    checked={selectedAnswers.includes(`${option.id}-false`)}
                                    disabled={isLocked}
                                    className="checkbox-right"
                                />
                            </fieldset>
                        </div>
                    ))}
                </div>)
            default:
                return null
        }
    }

    return (
        <div className={`survey-question ${isScreenReaderMode && index > 0 ? 'blurred' : ''}`}>
            <QuestionHeader number={number} score={score} text={text} />
            <div className="question-options-container">
                {renderOptions()}
            </div>
            {!isLocked && (<button onClick={() => onSubmit(number)} className="submit-question-button">
                Antworten und sperren
            </button>)}
        </div>
    )
}

export default Question
