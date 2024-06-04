import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const SurveyList = () => {
    const [loading, setLoading] = useState(true);
    const [closedSurveys, setClosedSurveys] = useState([]);
    const [openSurveys, setOpenSurveys] = useState([]);
    const [idleSurveys, setIdleSurveys] = useState([]);

    const fetchData = () => {
        axios
            .get("http://localhost:3000/umfrage/getAll")
            .then(response => {
                const data = response.data || [];

                console.
                setClosedSurveys(data.filter(s => s.status === "CLOSED"));
                setOpenSurveys(data.filter(s => s.status === "ACTIVE"));
                setIdleSurveys(data.filter(s => s.status === "IDLE"));
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(fetchData, []);

    const renderSurveys = (title, surveysList, emptyMessage) => (
        <div>
            <h2>{title}</h2>
            {!loading && !surveysList.length && <p>{emptyMessage}</p>}
            <div style={{display: "grid", gap: "20px"}}>
                {!loading && surveysList.map(survey => (
                    <div key={survey.id} style={{border: "1px solid #ccc", padding: "10px"}}>
                        <h3>{survey.title}</h3>
                        <p>Number of Questions: {survey.questions.length}</p>
                        <Link to={`/survey/${survey.id}`}>Go to Survey</Link>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{padding: "20px"}}>
            <header>
                <h1>Surveys</h1>
            </header>
            {renderSurveys("Active Surveys", openSurveys, "No Active Surveys Available")}
            {renderSurveys("Idle Surveys", idleSurveys, "No Idle Surveys Available")}
            {renderSurveys("Closed Surveys", closedSurveys, "No Closed Surveys Available")}
        </div>
    );
};

export default SurveyList;
