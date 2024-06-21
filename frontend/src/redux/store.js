import { configureStore } from '@reduxjs/toolkit'
import { adminLogin, adminRegister } from './reducers/adminReducers.js'
import { questionAnswersSave, surveyScoresSave, surveyDetails } from './reducers/surveyReducer.js'

const store = configureStore({
    reducer: {
        adminLogin: adminLogin,
        adminRegister: adminRegister,
        surveyDetails: surveyDetails,
        questionAnswersSave: questionAnswersSave,
        surveyScoresSave: surveyScoresSave
    }
})

export default store
