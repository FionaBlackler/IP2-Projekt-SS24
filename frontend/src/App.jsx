import RootRoutes from './routes/root.routes.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import UmfragePopup from "./pages/admin/uploadUmfragePage/UmfragePopup.jsx";



 export default function App() {
   return <UmfragePopup></UmfragePopup>
 }
