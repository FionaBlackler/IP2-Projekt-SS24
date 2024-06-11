import { Alert, Button, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { forgotPassword } from '../../../redux/actions/authActions.js'

const ForgotPassword = () => {
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
        const { email } = values
        dispatch(forgotPassword({ email }))
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
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            {errorMessage ? (
                <div className="mb-6 w-full max-w-md">
                    <Alert message={errorMessage} type="error" showIcon />
                </div>
            ) : null}
            <div className="container mx-auto p-8 bg-white shadow-md rounded-lg max-w-md w-full">
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Forgot Password
                </h1>
                <Form
                    name="normal_change_password"
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
                            disabled={loading}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default ForgotPassword
