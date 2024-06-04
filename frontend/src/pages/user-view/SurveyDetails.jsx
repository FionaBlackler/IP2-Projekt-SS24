// src/components/SurveyList.js
import {useEffect, useState} from 'react';
import api from '../api';

const SurveyList = ({onSelectSurvey}) => {
    const [surveys, setSurveys] = useState([]);

    useEffect(() => {
        api.get('/umfrage/getAll')
            .then(response => setSurveys(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Available Surveys</h1>
            <ul>
                {surveys.map(survey => (
                    <li key={survey.id}>
                        <button onClick={() => onSelectSurvey(survey.id)}>{survey.title}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SurveyList;
