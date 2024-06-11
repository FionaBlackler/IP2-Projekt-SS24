import { useEffect, useState } from 'react'
import { Alert, Button, Form, Input } from 'antd'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/actions/authActions.js'
import './login.css'

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
            <div className="container mx-auto bg-primary-color shadow-md rounded-[20px] max-w-md w-full">
                <div className="bg-secondary-color rounded-t-[20px] w-full h-[86.89px] flex items-center justify-center outline-[6px] outline-offset-[-4px] outline overflow-auto outline-secondary-color mb-5">
                    <span className="align-middle text-[#FEF2DE] text-4xl font-normal font-['Inter']">
                        Login
                    </span>
                </div>
                <div className="mx-5">
                    <Form
                        name="normal_login"
                        initialValues={{
                            remember: true,
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
                                    message: 'Please input your email!',
                                },
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
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
                                    message: 'Please input your password!',
                                },
                            ]}
                            className="w-full"
                        >
                            <Input.Password
                                placeholder="Passwort"
                                size="large"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-color"
                            />
                        </Form.Item>

                        <Form.Item className="w-full">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full bg-secondary-color text-primary-color rounded-lg hover:bg-accent-color"
                                size="large"
                            >
                                Einloggen
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="flex flex-col items-start w-96 p-6">
                    <div className="flex">
                        <span className="mr-3">Noch kein Account? </span>
                        <Link
                            to="/register"
                            className="hover:text-accent-color hover:font-medium"
                        >
                            hier registrieren
                        </Link>
                    </div>
                    <div className="flex">
                        <span className="mr-3">Passwort vergessen? </span>
                        <Link
                            to="/forgotPassword"
                            className="hover:text-accent-color hover:font-medium"
                        >
                            hier ändern
                        </Link>
                    </div>
                    <div className="flex">
                        <span className="mr-3">Neues Passwort? </span>
                        <Link
                            to="/changePassword"
                            className="hover:text-accent-color hover:font-medium"
                        >
                            hier ändern
                        </Link>
                    </div>
                    <div className="flex">
                        <span className="mr-3">Konto löschen? </span>
                        <Link
                            to="/deleteAccount"
                            className="hover:text-accent-color hover:font-medium"
                        >
                            hier löschen
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
