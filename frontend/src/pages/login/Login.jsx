import { useEffect, useState } from 'react'
import { Alert, Button, Form, Input } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/actions/authActions.js'

const Login = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')

    const { error, isAuthenticated } = useSelector((state) => state.adminLogin)

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const handleSubmit = (values) => {
        const { email, password } = values
        dispatch(login({ email, password }))
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect)
        }
        if (error) {
            setErrorMessage(error)
        } else {
            setErrorMessage('')
        }
    }, [isAuthenticated, error, navigate, redirect])

    return (
        <div className="login">
            {errorMessage ? (
                <div style={{ marginBottom: '24px' }}>
                    <Alert message={errorMessage} type="error" showIcon />
                </div>
            ) : null}
            <div className="container">
                <h1>Login</h1>
                <Form
                    name="normal_login"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 10 }}
                    initialValues={{
                        remember: true
                    }}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true
                            },
                            {
                                type: 'email',
                                message: 'Bitte Email eingeben'
                            }]}
                    >
                        <Input
                            placeholder="Email"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!'
                            }
                        ]}
                    >
                        <Input.Password
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                        >
                            Einloggen
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login
