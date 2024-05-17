import RootRoutes from './routes/root.routes.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'

function App() {
    return (
        <Provider store={store}>
            <RootRoutes />
        </Provider>
    )
}

export default App

// export default function App() {
//   return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
// }
