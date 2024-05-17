import { Layout } from 'antd'
import ProtectedRoutes from '../routes/protected.routes.jsx'

const ProtectedLayout = () => {
    return (
        <Layout>
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1 }}>
                    <Layout.Content>
                        <ProtectedRoutes />
                    </Layout.Content>
                </div>
            </div>
        </Layout>
    )
}

export default ProtectedLayout
