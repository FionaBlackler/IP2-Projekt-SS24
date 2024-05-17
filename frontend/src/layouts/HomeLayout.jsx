import { Outlet } from 'react-router-dom'
// todo: implement SideMenu
// import SideMenu from './SideMenu.jsx'

const HomeLayout = () => (
    <div className="SideMenuAndPageContent">
        {/* <SideMenu /> */}
        <div className="PageContent">
            <Outlet />
        </div>
    </div>
)

export default HomeLayout
