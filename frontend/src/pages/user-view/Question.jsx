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

    useEffect(() => {
        // Hier kannst du die Daten von deinem Endpoint holen
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/umfrage/${questionId}/fragen`);
                const data = await response.json();
                setNumber(data.fragen[0].id);
                setText(data.fragen[0].text);
                setOptions(data.fragen[0].antwort_optionen.map(option => option.text));
                setScore(data.fragen[0].punktzahl);
            } catch (error) {
                console.error('Fehler beim Abrufen der Frage:', error);
            }
        };

        fetchData();
    }, [questionId]);

    return (
        <div className="question-container">
            <QuestionHeader number={number} questionId={questionId} score={score} text={text} />
            <QuestionOptions options={options} />
        </div>
    );
};

export default Question;
