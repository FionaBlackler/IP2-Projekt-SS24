import * as actionTypes from "../constants/surveyActionTypes.js";

const initialSurveyState = {
    data: {},
    isLoading: false,
    error: null
};

export const surveyDetails = (state = initialSurveyState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_SURVEY_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case actionTypes.FETCH_SURVEY_SUCCESS:
            return {
                ...state,
                data: action.payload,
                isLoading: false
            };
        case actionTypes.FETCH_SURVEY_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const surveyResponse = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.SUBMIT_SURVEY_REQUEST:
            return { ...state, isLoading: true, success: false, error: null };
        case actionTypes.SUBMIT_SURVEY_SUCCESS:
            return { ...state, isLoading: false, success: true, error: null };
        case actionTypes.SUBMIT_SURVEY_FAILURE:
            return { ...state, isLoading: false, success: false, error: action.payload };
        default:
            return state;
    }
};