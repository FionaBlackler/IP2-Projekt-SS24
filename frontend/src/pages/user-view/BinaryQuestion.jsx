import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BinaryQuestionHeader from '../../components/questionHeader/QuestionHeader.jsx';
import './BinaryQuestionStyle.css';

const BinaryQuestion = () => {
    const { questionId } = useParams();
    const [number, setNumber] = useState(null);
    const [text, setText] = useState('');
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/umfrage/${questionId}/fragen`);
                const data = await response.json();
                const questionData = data.fragen.find(frage => frage.id === parseInt(questionId));
                if (questionData) {
                    setNumber(questionData.id);
                    setText(questionData.text);
                    setOptions(questionData.antwort_optionen.map(option => option.text));
                    setScore(questionData.punktzahl);
                } else {
                    console.error('Frage nicht gefunden');
                }
            } catch (error) {
                console.error('Fehler beim Abrufen der Frage:', error);
            }
        };

        fetchData();
    }, [questionId]);

    if (number === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="binary-question-container">
            <BinaryQuestionHeader number={number} questionId={questionId} score={score} text={text} />
            <div className="binary-options-container">
                {options.map((option, index) => (
                    <div key={index} className="binary-option-item">
                        <div className="binary-option-text">{option}</div>
                        <div className="binary-option-checkboxes">
                            <label>
                                <input type="checkbox" name={`option${index}_true`} /> Zutreffend
                            </label>
                            <label>
                                <input type="checkbox" name={`option${index}_false`} /> Nicht zutreffend
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BinaryQuestion;
