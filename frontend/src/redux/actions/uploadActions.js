import * as actionTypes from "../constants/authActionTypes.js";
import axios from "axios";

export const uploadElements = ({file}) => {
    return async (dispatch) =>
    {
        dispatch({type: actionTypes.LOGIN_REQUEST})
        const admin_id = localStorage.getItem('admin_id')
        if(admin_id === null) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: {accessToken: jwt_token}
            })
        }
        try {
            const {data} = await axios.post(
                'http://localhost:3000/umfrage/upload', {params: admin_id}
            )

            const {jwt_token} = data

            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: {accessToken: jwt_token}
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