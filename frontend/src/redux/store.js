import { configureStore } from '@reduxjs/toolkit'
import { adminLogin, adminRegister } from './reducers/adminReducers.js'
import {surveyDetails} from "./reducers/surveyReducer.js";

const store = configureStore({
    reducer: {
        adminLogin: adminLogin,
        adminRegister: adminRegister,
        surveyDetails: surveyDetails,
    }
})

export default store
