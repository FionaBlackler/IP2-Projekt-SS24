import * as actionTypes from '../constants/authActionTypes.js'
import axios from 'axios'

export const login = ({ email, password }) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.LOGIN_REQUEST })

        try {
            const { data } = await axios.post(
                'http://localhost:3000/dev/login',
                { email, password }
            )

            const { jwt_token } = data

            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: { accessToken: jwt_token }
            })
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message

            dispatch({
                type: actionTypes.LOGIN_FAILURE,
                payload: errorMessage
            })
        }
    }
}

export const register = ({ name, email, password }) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.REGISTER_REQUEST })

        try {
            await axios.post(
                'http://localhost:3000/dev/register',
                { name, email, password }
            )

            dispatch({ type: actionTypes.REGISTER_SUCCESS })
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message

            dispatch({
                type: actionTypes.REGISTER_FAILURE,
                payload: errorMessage
            })
        }
    }
}

// export const logout = () => (dispatch) => {
//     console.log('Logged out and removed token from LocalStorage')

//     dispatch()
// }
