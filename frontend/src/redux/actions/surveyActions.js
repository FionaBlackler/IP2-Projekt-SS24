import * as actionTypes from '../constants/surveyActionTypes'; // Assuming you have constants defined for survey action types
import axios from 'axios';

export const fetchSurveyData = (umfrageId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_SURVEY_REQUEST });

        try {
            const { data } = await axios.get(`http://localhost:3000/umfrage/${umfrageId}/fragen`);
            dispatch({
                type: actionTypes.FETCH_SURVEY_SUCCESS,
                payload: data
            });
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message;
            dispatch({
                type: actionTypes.FETCH_SURVEY_FAILURE,
                payload: errorMessage
            });
        }
    };
};
