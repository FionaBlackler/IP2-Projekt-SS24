import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth)
    const location = useLocation()

    if (isAuthenticated) {
        return children
    }

    return <Navigate to="/public/login" state={{ from: location }} />
}

RequireAuth.propTypes = {
    children: PropTypes.node.isRequired
}

export default RequireAuth
