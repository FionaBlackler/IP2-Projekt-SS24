import * as actionTypes from "../constants/authActionTypes.js";


const initialState = {
    uploadComponent: [],
    error: null
}

export const uploadComponent = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_REQUEST:
            return {
                ...state,
                error: null
            }
        case actionTypes.LOGIN_SUCCESS:
            localStorage.setItem('accessToken', action.payload.accessToken)
            return {
                ...state,
                accessToken: action.payload.accessToken,
                isAuthenticated: true,
                error: null
            }
        case actionTypes.LOGIN_FAILURE:
            return {
                ...state,
                error: action.payload.error
            }
        case actionTypes.LOGOUT:
            localStorage.removeItem('accessToken')
            return {
                ...state,
                accessToken: null,
                isAuthenticated: false,
                error: null
            }
        default:
            return state
    }
}