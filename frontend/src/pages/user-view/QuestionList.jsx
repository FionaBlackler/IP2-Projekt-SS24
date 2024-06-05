
import PropTypes from 'prop-types';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const QuestionList = () => {
  const [fragen, setFragen] = useState([]);
  const [loading, setLoading] = useState(true);
  const { surveyId } = useParams();

  useEffect(() => {
    const fetchFragen = async () => {
      try {
        const response = await fetch(`http://localhost:3000/umfrage/${surveyId}/fragen`);
        const data = await response.json();
        console.log("data: " + JSON.stringify(data));
        setFragen(data.body.fragen);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Abrufen der Fragen:', error);
        setLoading(false);
      }
    };

    fetchFragen();
  }, [surveyId]);

  return (
      <div>
        <h2>Frage Liste</h2>
        {loading ? (
            <p>Lade Fragen...</p>
        ) : (
            <ul>
              {fragen.map((frage, index) => (
                  <li key={index}>
                    <p>{frage.frage_text}</p>
                    {/* Weitere Logik zum Anzeigen von Details der Frage */}
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
};

QuestionList.propTypes = {
  surveyId: PropTypes.string.isRequired,
};

export default QuestionList;
