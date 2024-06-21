import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Alert, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../redux/actions/authActions.js'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './register.css'

const Register = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')

    const { error, loading, success } = useSelector(
        (state) => state.adminRegister
    )

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const handleSubmit = (values) => {
        console.log('values: ', values)
        const { name, email, password } = values
        dispatch(register({ name, email, password }))
    }

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                navigate({
                    pathname: '/login',
                    search: `?redirect=${redirect}`,
                })
            }, 3000)
        }
        if (error) {
            console.log('error: ', error)
            setErrorMessage(error)
        } else {
            setErrorMessage('')
        }
    }, [success, redirect, navigate, error])

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-100">
            {errorMessage ? (
                <div className="mb-6 w-full max-w-md">
                    <Alert message={errorMessage} type="error" showIcon />
                </div>
            ) : null}
            <div className="container mx-auto bg-primary-color shadow-md rounded-[20px] max-w-md w-full">
                <div className="bg-secondary-color rounded-t-[20px] w-full h-[86.89px] flex items-center justify-center outline-[6px] outline-offset-[-4px] outline overflow-auto outline-secondary-color mb-5">
                    <span className="align-middle text-[#FEF2DE] text-4xl font-normal font-['Inter']">
                        Register
                    </span>
                </div>
                <div className="mx-5">
                    <Form
                        name="normal_register"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={handleSubmit}
                        className="space-y-6"
                        layout="vertical"
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Bitte geben sie einen Namen ein!',
                                },
                            ]}
                            className="w-full"
                        >
                            <Input
                                size="large"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Bitte geben sie eine E-Mail an!',
                                },
                                {
                                    type: 'email',
                                    message:
                                        'Die Eingabe ist nicht eine gültige E-Mail!',
                                },
                            ]}
                            className="w-full"
                        >
                            <Input
                                type="email"
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
                                    message:
                                        'Bitte geben sie ein Passwort ein!',
                                },
                            ]}
                            className="w-full"
                        >
                            <Input.Password
                                size="large"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirm_password"
                            label="Passwort bestätigen"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Bitte bestätigen sie das Passwort!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue('password') === value
                                        ) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject(
                                            new Error(
                                                'Die beiden Passwörter stimmen nicht überein!'
                                            )
                                        )
                                    },
                                }),
                            ]}
                            hasFeedback
                            className="w-full"
                        >
                            <Input.Password
                                size="large"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </Form.Item>
                        <Form.Item className="w-full">
                            <Link
                                to="/login"
                                className="flex items-center text-secondary-color mb-4 hover:text-accent-color hover:font-medium"
                            >
                                <ArrowLeftOutlined className="mr-2" />
                                Zurück zum Login
                            </Link>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full mb-5 py-2 bg-seconray-color text-primary-color rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                size="large"
                                disabled={loading}
                            >
                                Registrieren
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Register
