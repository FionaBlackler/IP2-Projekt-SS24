import { Layout } from 'antd'
import ProtectedRoute from '../routes/protected.route.jsx'

const ProtectedLayout = () => {
    return (
        <Layout>
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1 }}>
                    <Layout.Content>
                        <ProtectedRoute />
                    </Layout.Content>
                </div>
            </div>
        </Layout>
    )
}

export default ProtectedLayout
