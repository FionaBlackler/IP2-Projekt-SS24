import { configureStore } from '@reduxjs/toolkit'
import { adminLogin, adminRegister } from './reducers/adminReducers.js'
import { questionAnswersSave, surveyAnswersSave, surveyDetails } from './reducers/surveyReducer.js'

const store = configureStore({
    reducer: {
        adminLogin: adminLogin,
        adminRegister: adminRegister,
        surveyDetails: surveyDetails,
        questionAnswersSave: questionAnswersSave,
        surveyAnswersSave: surveyAnswersSave
    }
})

export default store
