import * as actionTypes from '../constants/surveyActionTypes.js'

const initialSurveyState = {
    data: {},
    isLoading: false,
    error: null
}

export const surveyDetails = (state = initialSurveyState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_SURVEY_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case actionTypes.FETCH_SURVEY_SUCCESS:
            return {
                ...state,
                data: action.payload,
                isLoading: false
            }
        case actionTypes.FETCH_SURVEY_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const questionAnswersSave = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.SAVE_QUESTION_ANSWERS_REQUEST:
            return { ...state, isSaving: true, saveSuccess: false, saveError: null }
        case actionTypes.SAVE_QUESTION_ANSWERS_SUCCESS:
            return { ...state, isSaving: false, saveSuccess: true, saveError: null }
        case actionTypes.SAVE_QUESTION_ANSWERS_FAILURE:
            return { ...state, isSaving: false, saveSuccess: false, saveError: action.payload }
        default:
            return state
    }
}

export const surveyScoresSave = (state = { scores: 0, totalScore: 0 }, action) => {
    switch (action.type) {
        case actionTypes.SAVE_SURVEY_SCORES:
            return {
                ...state,
                scores: action.payload.scores,
                totalScore: action.payload.totalScore
            }
        default:
            return state
    }
}