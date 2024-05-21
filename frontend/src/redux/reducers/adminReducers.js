import * as actionTypes from '../constants/authActionTypes.js'

const initialState = {
    accessToken: localStorage.getItem('accessToken') || null,
    isAuthenticated: localStorage.getItem('accessToken') ? true : false,
    error: null
}

export const adminRegister = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_REQUEST:
            return {
                loading: true
            }
        case actionTypes.REGISTER_SUCCESS:
            return {
                message: action.payload,
                success: true
            }
        case actionTypes.REGISTER_FAILURE:
            return {
                error: action.payload
            }
        default:
            return state
    }
}

export const adminLogin = (state = initialState, action) => {
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