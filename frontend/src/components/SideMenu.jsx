import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu } from 'antd'

const SideMenu = () => {
    const location = useLocation()
    const [selectedKeys, setSelectedKeys] = useState('/')

    useEffect(() => {
        const pathName = location.pathname
        setSelectedKeys(pathName)
    }, [location.pathname])

    const navigate = useNavigate()

    return (
        <div className="SideMenu">
            <Menu
                className="SideMenuVertical"
                mode="vertical"
                onClick={(item) => {
                    navigate(item.key)
                }}
                selectedKeys={[selectedKeys]}
                items={[
                    {
                        label: 'Startseite',
                        key: '/'
                    },
                    {
                        label: 'Ergebnisse Einsehen',
                        key: '/results-view'
                    },
                    {
                        label: 'Umfrage Erstellen',
                        key: '/create-survey'
                    },
                    {
                        label: 'Umfrage Hochladen',
                        key: '/upload-survey'
                    },
                    {
                        label: 'Meine Umfragen',
                        key: '/meineUmfragen'
                    }
                ]}
            ></Menu>
        </div>
    )
}

export default SideMenu
