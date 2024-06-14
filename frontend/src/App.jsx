import RootRoutes from './routes/root.routes.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'



 export default function App() {
     return (
         <Provider store={store}>
             <RootRoutes />
         </Provider>
     )
 }
