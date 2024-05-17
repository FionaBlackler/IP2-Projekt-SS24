import * as actionTypes from '../constants/authActionTypes.js'
import axios from 'axios'

export const login = ({ email, password }) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.LOGIN_REQUEST })

        try {
            const { data } = await axios.post(
                'waiting_for_backend_url',
                { email, password }
            )

            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: { accessToken: data.accessToken }
            })
        } catch (error) {
            dispatch({
                type: actionTypes.LOGIN_FAILURE,
                payload: { error: 'An error occurred' }
            })
        }
    }
}

export const register = ({ fullName, email, password }) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.REGISTER_REQUEST })

        try {
            await axios.post(
                'waiting_for_backend_url',
                { fullName, email, password }
            )

            dispatch({ type: actionTypes.REGISTER_SUCCESS })
        } catch (error) {
            dispatch({
                type: actionTypes.REGISTER_FAILURE,
                payload: { error: 'An error occurred' }
            })
        }
    }
}

// export const logout = () => (dispatch) => {
//     console.log('Logged out and removed token from LocalStorage')

//     dispatch()
// }
