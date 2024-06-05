import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";
import "./style.scss"
import {useDispatch, useSelector} from "react-redux";
import {fetchSurveyData} from "../../redux/actions/surveyActions.js";

const umfrageId = "1"; // For TESTING purposes

export default function Survey() {
    const [selections, setSelections] = useState({});
    // const [data, setData] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data, isLoading } = useSelector((state) => state.surveyDetails);

    console.log("data: ", data)

    const fragen = data.fragen;

    console.log("fragen: ", fragen)

    useEffect(() => {
        dispatch(fetchSurveyData(umfrageId));
        // setData({ questions: [{ id: "1", title: "Sample Question", options: ["Option 1", "Option 2"] }], taken: false });
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>Error: Failed to fetch survey data</div>;
    }

    /*const { questions, ...survey } = data;*/


    const goToNextPage = () => {
        // Implement logic to navigate to next question
    };

    const submitSurvey = () => {
        // Implement your submit survey logic here
        toast.success("☑ Survey submitted successfully!");
        // Use the navigate function to navigate to URL_ROOT
        navigate("/");
    };

    return (
        <div>
            {/* Replace Header component */}
            <div>
                <h1>Survey</h1>
            </div>
            <div>
                {/* Replace BackLink component */}
                <button onClick={() => navigate(-1)}>Back to surveys</button>
                <div className="survey-info">
                    <h2>Take a quick survey</h2>
                    <img src="bermuda_welcome.png" alt="Welcome" />
                    <div>
                        {fragen?.length} QUESTION{fragen?.length !== 1 ? "S" : ""}
                    </div>
                    <div>
                        {" "}
                        {0.25 * fragen?.length} MINUTE
                        {fragen?.length !== 4 ? "S" : ""}
                    </div>
                </div>
                <p className="center">
                    {!isLoading && data.taken && "You already completed this survey"}
                </p>
                {!isLoading && (
                    <div>
                        {data.taken ? (
                            <button onClick={() => navigate(-1)}>
                                Go back
                            </button>
                        ) : (
                            <button onClick={() => navigate(`/survey/1/questions/${fragen[0].id}`)}>
                                Start Now
                            </button>
                        )}
                    </div>
                )}
            </div>

            {fragen?.map((question, i) => {
                return (
                    <div key={question.id}>
                        <button onClick={() => navigate(-1)}>
                            {i > 0 ? "Previous Question" : "Go back"}
                        </button>
                        <h2>{question.title}</h2>
                        {question.options.map(text => (
                            <div key={text}>
                                <input
                                    type="radio"
                                    value={text}
                                    checked={selections[question.id] === text}
                                    onChange={(e) => setSelections({...selections, [question.id]: e.target.value})}
                                />
                                <label>{text}</label>
                            </div>
                        ))}
                        <div>
                            <button
                                disabled={!selections[question.id]}
                                onClick={goToNextPage}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
            })}

            <div>
                <button onClick={() => navigate(-1)}>Go back</button>

                <h2>Survey Completed</h2>
                <img src="done_vector.png" alt="Done" />
                <div>
                    <button onClick={() => navigate("/survey")}>
                        Cancel
                    </button>
                    <button
                        onClick={submitSurvey}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
