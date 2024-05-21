import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

const ProtectedRoute = ({ component: Component }) => {
    const { isAuthenticated } = useSelector((state) => state.adminLogin)

    return isAuthenticated ? <Component /> : <Navigate to="/login" />
}

ProtectedRoute.propTypes = {
    component: PropTypes.elementType.isRequired
}

export default ProtectedRoute
