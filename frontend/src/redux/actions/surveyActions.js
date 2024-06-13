import * as actionTypes from '../constants/surveyActionTypes'; // Assuming you have constants defined for survey action types
import axios from 'axios';
import {toast} from "react-toastify";

export const fetchSurveyData = (umfrageId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_SURVEY_REQUEST });

        try {
            const { data } = await axios.get(`http://localhost:3000/umfrage/${umfrageId}/fragen`);

            console.log("data in thunk: ", data)
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

export const saveSurveyAnswers = (sitzungId, antworten) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.SAVE_SURVEY_REQUEST });

        try {
            const { data } = await axios.post(`http://localhost:3000/sitzung/${sitzungId}/teilnehmerAntwort`, { antworten });

            console.log("data in save thunk: ", data)
            dispatch({
                type: actionTypes.SAVE_SURVEY_SUCCESS,
                payload: data
            });

            toast.success("☑ Survey saved successfully!");

        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message;

            dispatch({
                type: actionTypes.SAVE_SURVEY_FAILURE,
                payload: errorMessage
            });

            toast.error("❌ Failed to save survey: " + errorMessage);
        }
    };
}

export const submitSurveyAnswers = (sitzungId, antworten) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.SUBMIT_SURVEY_REQUEST });

        try {
            const { data } = await axios.post(`http://localhost:3000/sitzung/${sitzungId}/teilnehmerAntwort`, { antworten });

            console.log("data in submit thunk: ", data)
            dispatch({
                type: actionTypes.SUBMIT_SURVEY_SUCCESS,
                payload: data
            });

            toast.success("☑ Survey submitted successfully!");

        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message;

            dispatch({
                type: actionTypes.SUBMIT_SURVEY_FAILURE,
                payload: errorMessage
            });

            toast.error("❌ Failed to submit survey: " + errorMessage);
        }
    };
};
