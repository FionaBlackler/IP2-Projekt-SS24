import * as actionTypes from '../constants/surveyActionTypes'
import axios from 'axios'

export const fetchSurveyData = (umfrageId) => {
    return async (dispatch, getState) => {
        dispatch({ type: actionTypes.FETCH_SURVEY_REQUEST })

        try {
            const { accessToken } = getState().adminLogin

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const { data } = await axios.get(`http://localhost:3000/umfrage/${umfrageId}/fragen`, config)

            console.log('data in thunk: ', data)
            dispatch({
                type: actionTypes.FETCH_SURVEY_SUCCESS,
                payload: data
            })
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message

            dispatch({
                type: actionTypes.FETCH_SURVEY_FAILURE,
                payload: errorMessage
            })
        }
    }
}

export const saveQuestionAnswers = (sitzungId, antworten) => {
    return async (dispatch, getState) => {
        dispatch({ type: actionTypes.SAVE_QUESTION_ANSWERS_REQUEST })

        try {
            const { accessToken } = getState().adminLogin

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const { data } = await axios.post(`http://localhost:3000/sitzung/${sitzungId}/teilnehmerAntwort`, antworten, config)

            dispatch({
                type: actionTypes.SAVE_QUESTION_ANSWERS_SUCCESS,
                payload: data
            })
        } catch (error) {
            console.log('error in save thunk: ', error)
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message

            dispatch({
                type: actionTypes.SAVE_QUESTION_ANSWERS_FAILURE,
                payload: errorMessage
            })
        }
    }
}

export const saveSurveyAnswers = (antworten) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.SAVE_SURVEY_ANSWERS,
            payload: antworten
        });
    };
};
