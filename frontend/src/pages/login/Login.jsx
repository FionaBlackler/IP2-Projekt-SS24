import { useEffect, useState } from 'react'
import { Alert, Button, Form, Input } from 'antd'
import { useLocation, useNavigate, Link } from 'react-router-dom'
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
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            {errorMessage ? (
                <div className="mb-6 w-full max-w-md">
                    <Alert message={errorMessage} type="error" showIcon />
                </div>
            ) : null}
            <div className="container mx-auto p-8 bg-white shadow-md rounded-lg max-w-md w-full">
                <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
                <Form
                    name="normal_login"
                    initialValues={{
                        remember: true
                    }}
                    onFinish={handleSubmit}
                    className="space-y-6"
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Bitte geben sie eine E-Mail an!'
                            },
                            {
                                type: 'email',
                                message: 'Die Eingabe ist nicht eine gültige E-Mail!'
                            }
                        ]}
                        className="w-full"
                    >
                        <Input
                            type="email"
                            placeholder="Email"
                            size="large"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Passwort"
                        rules={[
                            {
                                required: true,
                                message: 'Bitte geben sie ein Passwort ein!'
                            }
                        ]}
                        className="w-full"
                    >
                        <Input.Password
                            placeholder="Passwort"
                            size="large"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </Form.Item>

                    <Form.Item className="w-full">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            size="large"
                        >
                            Einloggen
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center mt-4">
                    <span>Noch kein Account? </span>
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Hier registrieren
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
