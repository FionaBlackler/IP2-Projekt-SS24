import SideMenu from '../components/SideMenu.jsx'
import PropTypes from 'prop-types'
import './AdminLayout.scss'
import NavigationBar from '../components/NavigationBar.jsx'
import Footer from '../components/Footer.jsx'

const AdminLayout = ({ children }) => (
    <div className="admin-layout">
        <NavigationBar />
        <div className="admin-layout__content">
            <SideMenu />
            <div className="admin-layout__main-content">
                {children}
            </div>
        </div>
        <Footer />
    </div>
)

AdminLayout.propTypes = {
    children: PropTypes.node.isRequired
}

export default AdminLayout
