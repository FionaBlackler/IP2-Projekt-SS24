import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuestionHeader from './QuestionHeader';
import QuestionOptions from './QuestionOptions';
import './QuestionStyle.css';

const Question = () => {
    const { questionId } = useParams();
    const [number, setNumber] = useState(1);
    const [text, setText] = useState('Lorem ipsum dolor sit amet, consectetur sadipscing elitr.');
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(1);
    const [questionType, setQuestionType] = useState(""); // Hinzugefügt: Frage-Typ

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/umfrage/${questionId}/fragen`);
                const data = await response.json();
                const question = data.fragen[2]; // Annahme: Du verwendest immer den 3. Eintrag (Index 2), ändere falls nötig
                setNumber(question.id);
                setText(question.text);
                setOptions(question.antwort_optionen.map(option => option.text));
                setScore(question.punktzahl);
                setQuestionType(question.typ_id); // Hinzugefügt: Setze den Frage-Typ
            } catch (error) {
                console.error('Fehler beim Abrufen der Frage:', error);
            }
        };

        fetchData();
    }, [questionId]);

    // Hinzugefügt: Funktion zum Rendern der Antwortoptionen basierend auf dem Frage-Typ
    const renderOptions = () => {
        if (questionType === "A" || questionType === "P") {
            return <QuestionOptions options={options} />;
        } else if (questionType === "K") {
            // Hier kannst du die Anzeige für den Fragetyp "K" anpassen
            return (
                <div>
                    {options.map((option, index) => (
                        <div key={index}>
                            <input type="checkbox" id={`option-${index}-true`} />
                            <label htmlFor={`option-${index}-true`}>Zutreffend</label>
                            <input type="checkbox" id={`option-${index}-false`} />
                            <label htmlFor={`option-${index}-false`}>Nicht Zutreffend</label>
                            <span>{option}</span>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="question-container">
            <QuestionHeader number={number} questionId={questionId} score={score} text={text} />
            {renderOptions()} {/* Hinzugefügt: Rendere die Antwortoptionen basierend auf dem Frage-Typ */}
        </div>
    );
};

export default Question;
