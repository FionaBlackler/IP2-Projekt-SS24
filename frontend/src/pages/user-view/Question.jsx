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
    const [questionType, setQuestionType] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/umfrage/${questionId}/fragen`);
                const data = await response.json();
                const question = data.fragen[2];        //Hier kann man Frage wechseln
                setNumber(question.id);
                setText(question.text);
                setOptions(question.antwort_optionen.map(option => option.text));
                setScore(question.punktzahl);
                setQuestionType(question.typ_id);
            } catch (error) {
                console.error('Fehler beim Abrufen der Frage:', error);
            }
        };

        fetchData();
    }, [questionId]);


    const renderOptions = () => {
        if (questionType === "A" || questionType === "P") {
            return <QuestionOptions options={options} />;
        } else if (questionType === "K") {


            // In der JSX-Datei

// Wenn es sich um eine K-Frage handelt
            // In der JSX-Datei

// Wenn es sich um eine K-Frage handelt
            // In der JSX-Datei

// Wenn es sich um eine K-Frage handelt
            return (
                <div>
                    {options.map((option, index) => (
                        <div key={index} style={{ marginTop: '20px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#333', borderRadius: '5px' }}> {/* Inline-CSS für K-Fragen */}
                            <span style={{ marginRight: '10px', flex: '1', color: '#fff' }}>{option}</span> {/* Textfarbe auf Weiß setzen */}
                            <div style={{ display: 'flex', alignItems: 'center' }}> {/* Stil für das Container-Div hinzugefügt */}
                                <input type="checkbox" id={`option-${index}-true`} style={{ width: '20px', height: '20px', marginRight: '5px' }} /> {/* Breite und Höhe der Checkboxen auf 20px setzen */}
                                <label htmlFor={`option-${index}-true`} style={{ backgroundColor: '#5cb85c', color: '#fff', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Zutreffend</label>
                                <input type="checkbox" id={`option-${index}-false`} style={{ width: '20px', height: '20px', marginRight: '5px' }} /> {/* Breite und Höhe der Checkboxen auf 20px setzen */}
                                <label htmlFor={`option-${index}-false`} style={{ backgroundColor: '#d9534f', color: '#fff', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Nicht Zutreffend</label>
                            </div>
                        </div>
                    ))}
                </div>
            );


            ``



        }
    };

    return (
        <div className="question-container">
            <QuestionHeader number={number} questionId={questionId} score={score} text={text} />
            <div className="question-options-container"> {}
                {renderOptions()}
            </div>
        </div>
    );

};

export default Question;
