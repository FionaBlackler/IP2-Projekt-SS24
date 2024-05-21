import { configureStore } from '@reduxjs/toolkit'
import { adminLogin, adminRegister } from './reducers/adminReducers.js'

const store = configureStore({
    reducer: {
        adminLogin: adminLogin,
        adminRegister: adminRegister
    }
})

export default store
